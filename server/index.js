import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from server directory
dotenv.config({ path: join(__dirname, '.env') })
import express from 'express'
import Stripe from 'stripe'
import bodyParser from 'body-parser'
import OpenAI from 'openai'
import { Resend } from 'resend'

const app = express()
const port = process.env.PORT || 4242

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

// Email configuration
const resendApiKey = process.env.RESEND_API_KEY
const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev'

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe integration will not work until you configure it.')
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null
const resend = resendApiKey ? new Resend(resendApiKey) : null

if (!resend) {
  console.warn('Resend not configured. Set RESEND_API_KEY in .env to enable email sending.')
}

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// IMPORTANT: Stripe webhooks need raw body for signature verification
// This MUST be before bodyParser.json()
app.use(
  '/webhook',
  express.raw({ type: 'application/json' })
)

// JSON parser for all other routes
app.use(bodyParser.json())

// Simple in-memory store for demo purposes. Replace with a real DB in production.
const profiles = new Map()
const plans = new Map()

app.post('/api/profile', (req, res) => {
  const profile = req.body
  if (!profile) {
    return res.status(400).json({ error: 'Missing profile data' })
  }
  
  // Use consistent email key for webhook lookup
  const email = profile.email || 'likeikeab@gmail.com'
  const profileToSave = { ...profile, email }
  
  console.log('=== PROFILE SAVE ===')
  console.log('Email:', email)
  console.log('Profile keys:', Object.keys(profileToSave))
  console.log('Has quiz answers:', !!profileToSave['2'])
  console.log('Has weight:', !!profileToSave.weight)
  console.log('Has height:', !!profileToSave.height)
  
  profiles.set(email, profileToSave)
  console.log('✅ Profile saved. Total profiles:', profiles.size)
  
  res.json({ success: true, email })
})

app.post('/api/create-checkout-session', async (req, res) => {
  console.log('=== CREATE CHECKOUT SESSION ===')
  console.log('Request body:', req.body)
  
  try {
    if (!stripe) {
      console.error('❌ Stripe not configured')
      return res.status(500).json({ error: 'Stripe is not configured on the server.' })
    }
    const { planId, email } = req.body
    console.log('Plan ID:', planId)
    console.log('Email:', email)
    
    if (!planId || !email) {
      console.error('❌ Missing planId or email')
      return res.status(400).json({ error: 'Missing planId or email' })
    }

    const currency = req.body.currency || 'EUR' // Default to EUR

    // Plan pricing in EUR (cents) and GBP (pence)
    const planPricesEUR = {
      // TEST TIER - TA BORT EFTER TESTNING
      'test-tier': { amount: 99, name: 'Test Tier' }, // 0.99 EUR
      '1-week': { amount: 2999, name: '1-Week Trial' }, // 29.99 EUR
      '4-week': { amount: 3999, name: '4-Week Plan' }, // 39.99 EUR
      '12-week': { amount: 5999, name: '12-Week Plan' } // 59.99 EUR
    }

    const planPricesGBP = {
      // TEST TIER - TA BORT EFTER TESTNING
      'test-tier': { amount: 79, name: 'Test Tier' }, // 0.79 GBP
      '1-week': { amount: 2499, name: '1-Week Trial' }, // 24.99 GBP
      '4-week': { amount: 3499, name: '4-Week Plan' }, // 34.99 GBP
      '12-week': { amount: 4999, name: '12-Week Plan' } // 49.99 GBP
    }

    const planPrices = currency === 'GBP' ? planPricesGBP : planPricesEUR
    const plan = planPrices[planId]
    
    if (!plan) {
      console.error('❌ Invalid plan ID:', planId)
      return res.status(400).json({ error: 'Invalid plan ID' })
    }

    console.log('Creating Stripe checkout session...')
    console.log('Plan:', plan.name, 'Amount:', plan.amount, currency === 'GBP' ? 'pence' : 'cents', 'Currency:', currency.toLowerCase())
    
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // One-time payment instead of subscription
      payment_method_types: ['card'],
      customer_email: email, // Pre-fill email, but user can change it
      allow_promotion_codes: true, // Enable promotion code input in checkout
      customer_creation: 'always', // Allow customer to update email
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `DadBod Elimination Protocol - ${plan.name}`,
              description: 'Personalized home workout plan for busy dads',
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}?canceled=1`,
      metadata: { email, planId },
    })

    console.log('✅ Stripe session created:', session.id)
    console.log('Checkout URL:', session.url)
    
    res.json({ url: session.url })
  } catch (err) {
    console.error('❌ Error creating checkout session:', err.message)
    console.error('Error stack:', err.stack)
    console.error('Full error:', JSON.stringify(err, null, 2))
    res.status(500).json({ error: 'Unable to create checkout session', details: err.message })
  }
})

app.post('/webhook', (req, res) => {
  console.log('=== WEBHOOK RECEIVED ===')
  console.log('Method:', req.method)
  console.log('Content-Type:', req.headers['content-type'])
  console.log('Stripe-Signature present:', !!req.headers['stripe-signature'])
  console.log('Body type:', typeof req.body)
  console.log('Body is Buffer:', Buffer.isBuffer(req.body))
  console.log('Body length:', req.body?.length)
  
  if (!stripe) {
    console.error('❌ Stripe not configured')
    return res.status(400).send('Webhook not configured: Stripe not initialized')
  }
  
  if (!webhookSecret) {
    console.error('❌ Webhook secret not configured')
    console.error('Set STRIPE_WEBHOOK_SECRET in server/.env')
    return res.status(400).send('Webhook not configured: Missing webhook secret')
  }

  const sig = req.headers['stripe-signature']
  
  if (!sig) {
    console.error('❌ Missing stripe-signature header')
    console.error('This usually means Stripe CLI is not running or webhook is not from Stripe')
    console.error('Start Stripe CLI with: stripe listen --forward-to localhost:4242/webhook')
    return res.status(400).send('Missing stripe-signature header')
  }

  let event
  try {
    console.log('Verifying webhook signature...')
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    console.log('✅ Webhook signature verified')
    console.log('Event type:', event.type)
    console.log('Event ID:', event.id)
  } catch (err) {
    console.error('❌ Webhook signature verification failed')
    console.error('Error:', err.message)
    console.error('Error type:', err.type)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const planId = session.metadata?.planId
    // Get email from session (user may have changed it in checkout) or from metadata
    const sessionEmail = session.customer_email || session.customer_details?.email || session.metadata?.email

    console.log('=== WEBHOOK: checkout.session.completed ===')
    console.log('Session ID:', session.id)
    console.log('Session email:', sessionEmail)
    console.log('Plan ID:', planId)
    console.log('Total profiles stored:', profiles.size)
    console.log('All profile emails:', Array.from(profiles.keys()))

    if (planId) {
      // Try to find profile - use the most recent one
      let profile = null
      let profileEmail = null
      
      if (profiles.size > 0) {
        // Use the most recent profile (last one added)
        const profileEmails = Array.from(profiles.keys())
        profileEmail = profileEmails[profileEmails.length - 1]
        profile = profiles.get(profileEmail)
        console.log('✅ Using most recent profile from:', profileEmail)
        console.log('Profile has email:', profile?.email)
        console.log('Profile keys:', Object.keys(profile || {}))
      } else {
        console.error('❌ No profiles found in storage!')
        console.error('Make sure profile was saved before checkout')
      }
      
      // Use email from session (if user changed it) or from profile, fallback to likeikeab@gmail.com for testing
      const email = sessionEmail || profile?.email || 'likeikeab@gmail.com'
      console.log('Final email to send to:', email)
      
      console.log('Profile found:', !!profile)
      console.log('OpenAI configured:', !!openai)
      console.log('Resend configured:', !!resend)
      
      if (!profile) {
        console.error('❌ Cannot generate plan: No profile found')
        console.error('This usually means the profile was not saved before checkout')
        return
      }
      
      if (!openai) {
        console.error('❌ Cannot generate plan: OpenAI not configured')
        console.error('Check OPENAI_API_KEY in server/.env')
        return
      }
      
      if (!resend) {
        console.error('❌ Cannot send email: Resend not configured')
        console.error('Check RESEND_API_KEY in server/.env')
        // Continue anyway to generate the plan
      }
      
      console.log('✅ Starting plan generation for:', email)
      console.log('Using profile data from:', profileEmail)
      console.log('Profile sample data:', {
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        goalWeight: profile.goalWeight,
        email: profile.email,
        hasQuizAnswers: !!profile['2']
      })
      
      // Call async function without blocking webhook response
      generatePlanForUser(email, profile, planId)
        .then(() => {
          console.log('✅✅✅ Plan generation completed successfully')
        })
        .catch((e) => {
          console.error('❌❌❌ Error generating plan:', e.message)
          console.error('Error stack:', e.stack)
          console.error('Full error:', JSON.stringify(e, null, 2))
        })
    } else {
      console.error('❌ Missing planId in webhook')
      console.error('Full session metadata:', JSON.stringify(session.metadata, null, 2))
    }
  }

  res.json({ received: true })
})

async function generatePlanForUser(email, profile, planId) {
  console.log('=== generatePlanForUser START ===')
  console.log('Email:', email)
  console.log('Plan ID:', planId)
  console.log('Profile keys:', Object.keys(profile))
  console.log('Profile age:', profile.age)
  console.log('Profile weight:', profile.weight)
  console.log('Profile height:', profile.height)
  
  // Calculate calories and macros
  const age = profile.age || 35
  const weight = profile.weight || 80
  const height = profile.height || 175
  const goalWeight = profile.goalWeight || weight - 5
  
  // BMR calculation (Mifflin-St Jeor Equation)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5
  const activityMultiplier = profile['9'] === 'Still full of energy' ? 1.725 : 
                            profile['9'] === 'Okay' ? 1.55 :
                            profile['9'] === 'Low energy but push through' ? 1.375 : 1.2
  const tdee = Math.round(bmr * activityMultiplier)
  
  // Calorie target based on goal
  const goal = profile['5'] || 'Lose fat'
  let dailyCalories = tdee
  if (goal.includes('Lose fat')) {
    dailyCalories = Math.round(tdee - 500) // 500 cal deficit for ~0.5kg/week
  } else if (goal.includes('Build muscle')) {
    dailyCalories = Math.round(tdee + 300) // 300 cal surplus
  }
  
  // Macro split (40% protein, 30% carbs, 30% fat for fat loss)
  const protein = Math.round(dailyCalories * 0.4 / 4) // 4 cal per gram
  const carbs = Math.round(dailyCalories * 0.3 / 4)
  const fats = Math.round(dailyCalories * 0.3 / 9) // 9 cal per gram

  // Determine workout frequency based on age
  const workoutFrequency = age >= 45 ? 3 : age >= 35 ? 3 : 4
  
  // Determine budget constraint from quiz answer
  const budgetAnswer = String(profile['12'] || '')
  const budgetTight = budgetAnswer.includes('Tight budget') || budgetAnswer.includes('affordable')
  const budgetFlexible = budgetAnswer.includes('Flexible budget') || budgetAnswer.includes('premium')
  
  // Determine injuries/limitations
  const injuries = String(profile['13'] || 'No injuries')
  const hasBackKneeIssues = injuries.includes('Back') || injuries.includes('knee')
  const hasShoulderArmIssues = injuries.includes('Shoulder') || injuries.includes('arm')
  const hasOtherLimitations = injuries.includes('Other')
  
  // Determine workout timing
  const workoutTime = String(profile['14'] || 'After work')
  const isMorningWorkout = workoutTime.includes('Morning')
  const isLunchWorkout = workoutTime.includes('Lunch')
  const isEveningWorkout = workoutTime.includes('Evening')
  const workoutTimeVaries = workoutTime.includes('varies')
  
  // Determine daily steps goal based on goal, current activity, and workout timing
  const energyLevel = profile['9'] || 'Okay'
  let dailySteps = 8000
  if (goal.includes('Lose fat')) {
    // Adjust based on energy and workout timing
    if (energyLevel === 'Exhausted') {
      dailySteps = isMorningWorkout ? 8000 : 7000 // Morning workout helps with energy
    } else if (energyLevel === 'Still full of energy') {
      dailySteps = 10000
    } else {
      dailySteps = isEveningWorkout ? 7500 : 8000 // Evening workouts might reduce daily steps
    }
  } else {
    dailySteps = 6000
  }

  const prompt = `
You are a world-class fitness coach creating a "BetterDad Blueprint" - a sustainable, minimalist framework for busy dads.

CRITICAL LANGUAGE REQUIREMENT: 
- ALL content MUST be written in ENGLISH ONLY
- Do NOT use Swedish, Norwegian, Danish, or any other language
- All meal names, exercise names, descriptions, labels, and text must be in English
- Even if the user profile contains Swedish text, respond in English
- This is mandatory - any Swedish text will cause errors

User profile:
- Age: ${age} (${age >= 45 ? 'Prioritize joint health and recovery. Max 3 strength sessions per week.' : age >= 35 ? 'Focus on sustainable progress. 3-4 strength sessions per week.' : 'Can handle 4 strength sessions per week.'})
- Height: ${height} cm
- Current weight: ${weight} kg
- Goal weight: ${goalWeight} kg
- Body type now: ${profile['2'] || 'unknown'}
- Dream body: ${profile['3'] || 'unknown'}
- Main goal: ${profile['5'] || 'unknown'}
- Time per day: ${profile['6'] || 'unknown'}
- Equipment: ${profile['7'] || 'unknown'}
- Hardest part: ${profile['8'] || 'unknown'}
- Energy after work: ${profile['9'] || 'unknown'}
- Biggest frustration: ${profile['10'] || 'unknown'}
- Family goal: ${profile['11'] || 'unknown'}
- Food budget: ${profile['12'] || 'unknown'} ${budgetTight ? '(TIGHT - prioritize eggs, chicken, ground beef)' : budgetFlexible ? '(FLEXIBLE - can use premium protein sources)' : '(NORMAL - balanced options)'}
- Injuries/limitations: ${injuries} ${hasBackKneeIssues ? '- AVOID heavy squats, deadlifts, high-impact. Focus on low-impact alternatives.' : ''} ${hasShoulderArmIssues ? '- AVOID overhead presses, pull-ups. Use alternatives.' : ''} ${hasOtherLimitations ? '- Adapt exercises carefully.' : ''}
- Workout timing: ${workoutTime} ${isMorningWorkout ? '- Higher energy, can handle more intensity' : isEveningWorkout ? '- Lower energy, focus on moderate intensity' : isLunchWorkout ? '- Limited time, keep it short and efficient' : workoutTimeVaries ? '- Design flexible schedule' : ''}
- Fitness level: ${profile['15'] || 'unknown'}
- Days per week commitment: ${profile['16'] || 'unknown'}
- Nutrition challenge: ${profile['17'] || 'unknown'}
- Confidence level: ${profile.confidence || 'unknown'}

Nutrition targets:
- Daily calories: ${dailyCalories} kcal
- Protein: ${protein}g
- Carbs: ${carbs}g
- Fats: ${fats}g
- Budget: ${budgetTight ? 'TIGHT - prioritize affordable protein sources (eggs, chicken, ground beef). Avoid expensive cuts.' : budgetFlexible ? 'FLEXIBLE - can include premium protein sources (steak, salmon, organic options)' : 'NORMAL - balanced protein sources (chicken, eggs, some beef/fish)'}

Create a "BetterDad Blueprint" as JSON with this EXACT structure:
{
  "overview": "One short, personalized paragraph about their specific situation. Reference their quiz answers: goal (${profile['5'] || 'unknown'}), equipment (${profile['7'] || 'unknown'}), time available (${profile['6'] || 'unknown'}), fitness level (${profile['15'] || 'unknown'}), and biggest challenge (${profile['17'] || 'unknown'}). Explain how this plan addresses their unique needs. Make it personal and relevant. No fluff.",
  "daily_nutrition": {
    "calories": ${dailyCalories},
    "protein_grams": ${protein},
    "carbs_grams": ${carbs},
    "fats_grams": ${fats}
  },
  "weekly_training": {
    "frequency": ${workoutFrequency},
    "sessions": [
      {
        "day": "Monday",
        "focus": "Upper body strength",
        "duration": "Based on time available (${profile['6'] || '20-30 min'})",
        "intensity": "${isMorningWorkout ? 'Moderate to high - morning energy allows for more intensity' : isEveningWorkout ? 'Moderate - evening energy is lower, focus on form' : isLunchWorkout ? 'High efficiency - short and focused' : 'Moderate - adaptable'}",
        "exercises": [
          {"name": "Exercise name", "sets": 3, "reps": "8-12", "notes": "Progression tip. ${hasBackKneeIssues ? 'AVOID if back/knee issues. Use alternative.' : ''} ${hasShoulderArmIssues ? 'AVOID if shoulder/arm issues. Use alternative.' : ''}"}
        ]
      },
      {
        "day": "Wednesday", 
        "focus": "Lower body strength",
        "duration": "Based on time available",
        "exercises": [
          {"name": "Exercise name", "sets": 3, "reps": "8-12", "notes": "Progression tip"}
        ]
      },
      {
        "day": "Friday",
        "focus": "Full body",
        "duration": "Based on time available",
        "exercises": [
          {"name": "Exercise name", "sets": 3, "reps": "8-12", "notes": "Progression tip"}
        ]
      }
    ],
    "progression_principle": "Explain how to get stronger in these specific exercises over 4 weeks"
  },
  "daily_movement": {
    "steps_goal": ${dailySteps},
    "rationale": "Why this step count based on their goal and energy level"
  },
  "nutrition_philosophy": {
    "approach": "100% Whole Foods only: meat, eggs, potatoes, rice, fruit. No processed foods.",
    "protein_sources": ${budgetTight ? '["Eggs", "Chicken", "Ground beef"]' : budgetFlexible ? '["Beef", "Chicken", "Eggs", "Fish", "Salmon", "Steak"]' : '["Chicken", "Eggs", "Ground beef", "Some fish"]'},
    "carb_sources": '["Potatoes", "Rice", "Fruit"]',
    "fat_sources": '["Eggs", "Meat", "Natural sources"]'
  },
  "example_day": {
    "breakfast": {
      "meal": "Specific whole food meal example in English (e.g., 'Scrambled eggs with spinach and sweet potato', NOT 'Frukost: Scrambled eggs...')",
      "calories": ${Math.round(dailyCalories * 0.25)},
      "protein": ${Math.round(protein * 0.25)},
      "carbs": ${Math.round(carbs * 0.25)},
      "fats": ${Math.round(fats * 0.25)}
    },
    "lunch": {
      "meal": "Specific whole food meal example in English (e.g., 'Grilled chicken breast with brown rice', NOT 'Lunch: Grilled chicken...')",
      "calories": ${Math.round(dailyCalories * 0.35)},
      "protein": ${Math.round(protein * 0.35)},
      "carbs": ${Math.round(carbs * 0.35)},
      "fats": ${Math.round(fats * 0.35)}
    },
    "dinner": {
      "meal": "Specific whole food meal example in English (e.g., 'Baked salmon with quinoa', NOT 'Middag: Baked salmon...')",
      "calories": ${Math.round(dailyCalories * 0.30)},
      "protein": ${Math.round(protein * 0.30)},
      "carbs": ${Math.round(carbs * 0.30)},
      "fats": ${Math.round(fats * 0.30)}
    },
    "snacks": {
      "meal": "Whole food snack if needed in English (e.g., 'Greek yogurt with berries', NOT 'Mellanmål: Greek yogurt...')",
      "calories": ${Math.round(dailyCalories * 0.10)},
      "protein": ${Math.round(protein * 0.10)},
      "carbs": ${Math.round(carbs * 0.10)},
      "fats": ${Math.round(fats * 0.10)}
    }
  },
  "food_swaps": {
    "the_foundation": "Explain that they should eat 100% whole foods only. Nothing processed. This is the foundation of the nutrition plan.",
    "modular_matrix": {
      "protein_goal": "Aim for approximately ${Math.round(protein / 4)}g protein per meal (based on ${protein}g daily / 4 meals)",
      "protein_sources": "List all protein sources they can choose from (e.g., 'Ground beef, Chicken breast, Eggs, Salmon/White fish, Turkey') - whole foods only",
      "carb_goal": "Aim for approximately ${Math.round(carbs / 4)}g carbs per meal (based on ${carbs}g daily / 4 meals)",
      "carb_sources": "List all carb sources they can choose from (e.g., 'Potatoes, Sweet potatoes, Rice, Quinoa, Fruit') - whole foods only",
      "fat_goal": "Aim for approximately ${Math.round(fats / 4)}g fat per meal (based on ${fats}g daily / 4 meals)",
      "fat_sources": "List all fat sources they can add when needed (e.g., 'Olive oil, Butter, Nuts, Peanut butter, Avocado') - whole foods only"
    },
    "substitution_rule": "Clear explanation: 'You can freely swap between these options. If the lunch example says chicken, you can use ground beef instead. If breakfast lacks fat, you can add peanut butter to your eggs or snacks. Keep the same GRAMS per meal to maintain your macros. The example meals show you the right portions - swap foods, not amounts.'"
  },
  "key_principles": [
    "3-4 bullet points of core principles. Minimalist. Authoritative."
  ]
}

CRITICAL REQUIREMENTS:
1. LANGUAGE: ALL content must be in ENGLISH. All text, labels, descriptions, meal names, exercise names, and explanations must be written in English only. Do NOT use Swedish, Norwegian, or any other language. This is mandatory.
   - Use "sessions per week" NOT "pass per vecka"
   - Use "Duration" NOT "Varaktighet"
   - Use "Step Goal" NOT "Stegmål"
   - Use "Protein Sources" NOT "Proteinkällor"
   - Use "Carb Sources" NOT "Kolhydratkällor"
   - Use "Breakfast", "Lunch", "Dinner", "Snacks" NOT "Frukost", "Middag", "Mellanmål"
   - All field values must be in English, not just the structure
2. Training: Create a FIXED weekly schedule (${workoutFrequency} sessions) that repeats for 4 weeks. Focus on getting stronger in these specific exercises.
3. Age adaptation: ${age >= 45 ? 'Never more than 3 strength sessions. Prioritize joint health and recovery.' : age >= 35 ? '3-4 sessions max. Focus on sustainable progress.' : '4 sessions is fine.'}
4. Equipment: CRITICAL - Use ONLY what they actually have. Be REALISTIC:
   - If "Full gym access": Use gym equipment (barbells, machines, cable machines, etc.) - this is the BEST option
   - If "Dumbbells at home": Use dumbbells ONLY. No gym equipment, no barbells, no machines.
   - If "Kettlebells": Use kettlebells ONLY. No other equipment.
   - If "Resistance bands": Use resistance bands ONLY. Can combine with bodyweight.
   - If "Pull-up bar": Use pull-up bar + bodyweight exercises. No other equipment.
   - If "No equipment - just bodyweight": Use ONLY bodyweight exercises. NO rows with tables, NO makeshift equipment, NO furniture exercises. Use: push-ups, squats, lunges, planks, burpees, mountain climbers, jumping jacks, pike push-ups, etc. If they need back work, use superman holds, reverse planks, or similar bodyweight alternatives. NEVER suggest using furniture or makeshift equipment.
   NEVER suggest exercises that require equipment they don't have. Be realistic and practical.
5. Injuries: ${hasBackKneeIssues ? 'CRITICAL: AVOID heavy squats, deadlifts, high-impact exercises. Use low-impact alternatives like leg press alternatives, seated exercises, or bodyweight squats with limited range of motion.' : ''} ${hasShoulderArmIssues ? 'CRITICAL: AVOID overhead presses, pull-ups, heavy shoulder work. Use alternatives like push-ups variations, rows, or chest exercises.' : ''} ${hasOtherLimitations ? 'CRITICAL: Adapt all exercises to avoid aggravating limitations. Provide clear alternatives.' : 'No limitations - can use full exercise selection.'}
6. Workout timing: ${isMorningWorkout ? 'Morning workouts - user has higher energy. Can handle more intensity and volume.' : isEveningWorkout ? 'Evening workouts - user is tired. Keep intensity moderate, focus on form over intensity.' : isLunchWorkout ? 'Lunch workouts - limited time. Keep sessions short, high-efficiency exercises.' : workoutTimeVaries ? 'Variable timing - design flexible schedule that works any time of day.' : 'After work - moderate energy, balanced intensity.'}
7. Nutrition: 100% Whole Foods ONLY. ${budgetTight ? 'CRITICAL: Budget is TIGHT. Focus ONLY on affordable sources: eggs, chicken (whole or thighs), ground beef. NO expensive cuts, NO salmon, NO premium options. Make it work with budget-friendly whole foods.' : budgetFlexible ? 'Budget is FLEXIBLE. Can include premium sources: steak, salmon, organic options, varied protein sources.' : 'Budget is NORMAL. Balanced approach: chicken, eggs, some beef/fish, but keep it reasonable.'}
8. Tone: Minimalist, authoritative, easy to understand. NO FLUFF.
9. Food swaps section is CRITICAL - MUST use the EXACT structure provided:
   - "the_foundation": Explain 100% whole foods only, nothing processed
   - "modular_matrix": Object with "protein_sources", "carb_sources", "fat_sources" as comma-separated lists
   - "substitution_rule": Clear explanation of free swapping while keeping same grams
   DO NOT use old format (protein_swaps, fat_additions, carb_swaps). Use ONLY the new structure.

Be specific with exercise names, sets, reps, and progression. Make it actionable and simple.
`

  console.log('=== Calling OpenAI API ===')
  console.log('OpenAI configured:', !!openai)
  console.log('Model: gpt-4o-mini')
  console.log('Prompt length:', prompt.length)
  
  if (!openai) {
    console.error('❌ OpenAI is not configured! Check OPENAI_API_KEY in .env')
    return
  }
  
  let completion
  try {
    completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    })
    
    console.log('✅ OpenAI API call successful')
    console.log('Response received:', !!completion)
    console.log('Choices count:', completion.choices?.length)
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message)
    console.error('Error code:', error.code)
    console.error('Error type:', error.type)
    console.error('Full error:', JSON.stringify(error, null, 2))
    throw error
  }
  
  const message = completion.choices[0]?.message?.content
  if (!message) {
    console.error('❌ No message content in OpenAI response')
    console.error('Full completion:', JSON.stringify(completion, null, 2))
    return
  }
  
  console.log('Message length:', message.length)
  console.log('First 200 chars:', message.substring(0, 200))

  let plan
  try {
    plan = JSON.parse(message)
    
    // Clean up any Swedish text that might have slipped through
    // Helper function to remove Swedish labels from text
    const cleanSwedishLabels = (text) => {
      if (!text || typeof text !== 'string') return text
      return text
        .replace(/^(Dagliga Näringsmål|Daily Nutrition Goals):\s*/i, '')
        .replace(/^(Din Typiska Träningsvecka|Your Typical Training Week):\s*/i, '')
        .replace(/^(Frekvens|Frequency):\s*/i, '')
        .replace(/pass per vecka/gi, 'sessions per week')
        .replace(/repetera i 4 veckor/gi, 'repeat for 4 weeks')
        .replace(/^(Varaktighet|Duration):\s*/i, '')
        .replace(/^(Daglig Rörelse|Daily Movement):\s*/i, '')
        .replace(/^(Stegmål|Step Goal):\s*/i, '')
        .replace(/steg per dag/gi, 'steps per day')
        .replace(/^(Kostfilosofi|Nutrition Philosophy):\s*/i, '')
        .replace(/^(Proteinkällor|Protein Sources):\s*/i, '')
        .replace(/^(Kolhydratkällor|Carb Sources):\s*/i, '')
        .replace(/^(Fettkällor|Fat Sources):\s*/i, '')
        .replace(/^(Exempeldag|Example Day):\s*/i, '')
        .replace(/^(Frukost|Breakfast):\s*/i, '')
        .replace(/^(Lunch):\s*/i, '')
        .replace(/^(Middag|Dinner):\s*/i, '')
        .replace(/^(Mellanmål|Snacks):\s*/i, '')
        .replace(/^(Byt Ut Dina Råvaror|Swap Your Ingredients):\s*/i, '')
        .replace(/^(Protein|Fett|Kolhydrater):\s*/i, '')
        .replace(/^(Nyckelprinciper|Key Principles):\s*/i, '')
        // Replace Swedish macro labels in meal descriptions (K: = Carbs, F: = Fat)
        .replace(/\bK:\s*(\d+g)/gi, 'C: $1')
        .replace(/\bF:\s*(\d+g)/gi, 'F: $1')
        .replace(/\bP:\s*(\d+g)/gi, 'P: $1')
        .trim()
    }
    
    // Clean weekly_training
    if (plan.weekly_training) {
      if (plan.weekly_training.frequency) {
        plan.weekly_training.frequency = cleanSwedishLabels(String(plan.weekly_training.frequency))
      }
      if (plan.weekly_training.sessions && Array.isArray(plan.weekly_training.sessions)) {
        plan.weekly_training.sessions.forEach(session => {
          if (session.duration) {
            session.duration = cleanSwedishLabels(String(session.duration))
          }
          if (session.focus) {
            session.focus = cleanSwedishLabels(String(session.focus))
          }
        })
      }
      if (plan.weekly_training.progression_principle) {
        plan.weekly_training.progression_principle = cleanSwedishLabels(String(plan.weekly_training.progression_principle))
      }
    }
    
    // Clean daily_movement
    if (plan.daily_movement) {
      if (plan.daily_movement.steps_goal) {
        // Extract just the number if it contains "steg" or "steps"
        const stepsStr = String(plan.daily_movement.steps_goal)
        const match = stepsStr.match(/(\d+)/)
        if (match) {
          plan.daily_movement.steps_goal = parseInt(match[1])
        }
      }
      if (plan.daily_movement.rationale) {
        plan.daily_movement.rationale = cleanSwedishLabels(String(plan.daily_movement.rationale))
      }
    }
    
    // Clean nutrition_philosophy
    if (plan.nutrition_philosophy) {
      if (plan.nutrition_philosophy.approach) {
        plan.nutrition_philosophy.approach = cleanSwedishLabels(String(plan.nutrition_philosophy.approach))
      }
      // Clean protein/carb/fat sources arrays or strings
      ['protein_sources', 'carb_sources', 'fat_sources'].forEach(key => {
        if (plan.nutrition_philosophy[key]) {
          if (typeof plan.nutrition_philosophy[key] === 'string') {
            let cleaned = cleanSwedishLabels(plan.nutrition_philosophy[key])
            // Try to parse as JSON array if it looks like one
            try {
              plan.nutrition_philosophy[key] = JSON.parse(cleaned)
            } catch {
              plan.nutrition_philosophy[key] = cleaned
            }
          }
        }
      })
    }
    
    // Clean example_day meal descriptions
    if (plan.example_day) {
      Object.keys(plan.example_day).forEach(key => {
        if (plan.example_day[key] && plan.example_day[key].meal) {
          plan.example_day[key].meal = cleanSwedishLabels(String(plan.example_day[key].meal))
        }
      })
    }
    
    // Clean food_swaps
    if (plan.food_swaps) {
      // Clean the_foundation
      if (plan.food_swaps.the_foundation) {
        plan.food_swaps.the_foundation = cleanSwedishLabels(String(plan.food_swaps.the_foundation))
      }
      
      // Clean modular_matrix
      if (plan.food_swaps.modular_matrix) {
        ['protein_goal', 'protein_sources', 'carb_goal', 'carb_sources', 'fat_goal', 'fat_sources'].forEach(key => {
          if (plan.food_swaps.modular_matrix[key]) {
            plan.food_swaps.modular_matrix[key] = cleanSwedishLabels(String(plan.food_swaps.modular_matrix[key]))
          }
        })
      }
      
      // Clean substitution_rule
      if (plan.food_swaps.substitution_rule) {
        plan.food_swaps.substitution_rule = cleanSwedishLabels(String(plan.food_swaps.substitution_rule))
      }
      
      // Also clean old formats if they exist
      const oldKeys = ['breakfast_swaps', 'lunch_swaps', 'dinner_swaps', 'snacks_swaps', 'swap_instructions', 'protein_sources_list', 'carb_sources_list', 'fat_sources_list', 'protein_swaps', 'fat_additions', 'carb_swaps']
      oldKeys.forEach(key => {
        if (plan.food_swaps[key]) {
          if (typeof plan.food_swaps[key] === 'object') {
            Object.keys(plan.food_swaps[key]).forEach(subKey => {
              if (plan.food_swaps[key][subKey]) {
                plan.food_swaps[key][subKey] = cleanSwedishLabels(String(plan.food_swaps[key][subKey]))
              }
            })
          } else {
            plan.food_swaps[key] = cleanSwedishLabels(String(plan.food_swaps[key]))
          }
        }
      })
    }
    
    // Clean key_principles
    if (plan.key_principles && Array.isArray(plan.key_principles)) {
      plan.key_principles = plan.key_principles.map(p => cleanSwedishLabels(String(p)))
    }
    
    console.log('✅ Plan parsed and cleaned of Swedish text')
  } catch (e) {
    console.error('Failed to parse plan JSON', e)
    return
  }

  plans.set(email, { email, planId, plan, createdAt: new Date().toISOString() })
  console.log(`✅ Plan generated and saved for ${email}`)
  
  // Send email with plan
  try {
    await sendPlanEmail(email, plan, planId, profile)
    console.log(`✅ Email sending completed for ${email}`)
  } catch (emailError) {
    console.error('❌ Email sending failed:', emailError.message)
    console.error('Plan was generated but email failed. Plan saved in database.')
    // Don't throw - plan was generated successfully
  }
}

async function sendPlanEmail(email, plan, planId, profile = {}) {
  console.log('=== sendPlanEmail START ===')
  console.log('Email:', email)
  console.log('Resend configured:', !!resend)
  console.log('Resend instance:', resend ? 'exists' : 'null')
  console.log('Email from:', emailFrom)
  console.log('Plan exists:', !!plan)
  console.log('Plan keys:', plan ? Object.keys(plan) : 'no plan')
  
  if (!resend) {
    console.error('ERROR: Resend not configured!')
    console.log('Resend not configured, skipping email send. Plan saved for:', email)
    return
  }
  
  if (!emailFrom) {
    console.error('ERROR: EMAIL_FROM not set in .env!')
    return
  }

  try {
    // Format the plan as HTML
    console.log('=== FORMATTING PLAN AS HTML ===')
    console.log('Plan structure:', JSON.stringify(Object.keys(plan || {}), null, 2))
    
    let planHtml
    try {
      planHtml = formatPlanAsHTML(plan)
      console.log('✅ Plan formatted successfully')
      console.log('HTML length:', planHtml?.length || 0)
    } catch (formatError) {
      console.error('❌ Error formatting plan as HTML:', formatError.message)
      console.error('Error stack:', formatError.stack)
      planHtml = '<p>Error formatting plan. Plan data saved but email formatting failed.</p>'
    }
    
    console.log('=== SENDING EMAIL ===')
    console.log('To:', email)
    console.log('From:', emailFrom)
    console.log('Plan ID:', planId)
    console.log('Plan HTML length:', planHtml?.length || 0)
    
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Your DadBod Elimination Protocol is Ready! 🎯',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1B3022; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .plan-section { margin: 20px 0; padding: 20px; background: white; border-radius: 8px; }
            .plan-section h2 { color: #1B3022; margin-top: 0; }
            .workout-day { margin: 15px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #1B3022; }
            .exercise-list { list-style: none; padding-left: 0; }
            .exercise-list li { padding: 5px 0; }
            .exercise-list li:before { content: "✓ "; color: #52C41A; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .nutrition-box { background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .meal-plan { margin: 10px 0; padding: 10px; background: white; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your DadBod Elimination Protocol is Ready!</h1>
            </div>
            <div class="content">
              <p>Hey ${profile && profile.name ? profile.name.split(' ')[0] : 'there'},</p>
              <p>Congratulations on taking the first step! Your personalized BetterDad Blueprint has been created based on your quiz answers.</p>
              ${profile && profile['5'] ? `<p>Based on your goal to <strong>${profile['5']}</strong>, we've designed a plan that fits your lifestyle.` : ''}
              ${profile && profile['7'] ? `You mentioned you have <strong>${profile['7']}</strong> available, so we've tailored every exercise to work with what you actually have.` : ''}
              ${profile && profile['6'] ? `With <strong>${profile['6']}</strong> per day, we've created efficient workouts that deliver maximum results in minimal time.` : ''}
              ${profile && profile['9'] ? `We've also considered that you feel <strong>${String(profile['9']).toLowerCase()}</strong> after work, so the intensity and timing are matched to your energy levels.` : ''}
              </p>
              
              ${planHtml}
              
              <div class="plan-section">
                <h2>Let's Get Started</h2>
                <p>Start with Week 1, Day 1 today. Remember, consistency beats perfection. Even 10 minutes is better than nothing.</p>
                <p>You've got this! 💪</p>
              </div>
              
              <div class="footer">
                <p>Questions? Reply to this email and we'll help you out.</p>
                <p>BetterDad Team</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })
    
    if (error) {
      console.error('❌ RESEND ERROR:', error)
      console.error('Error status:', error.statusCode)
      console.error('Error message:', error.message)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      // If domain not verified, log helpful message
      if (error.statusCode === 403 && error.message?.includes('verify a domain')) {
        console.error('\n⚠️  IMPORTANT: Resend requires domain verification to send emails to customers.')
        console.error('   Options:')
        console.error('   1. Verify a domain in Resend dashboard (resend.com/domains)')
        console.error('   2. For testing, use onboarding@resend.dev as EMAIL_FROM')
        console.error('   3. Plan has been saved and can be retrieved via API\n')
      }
      throw error // Throw so caller knows it failed
    }
    
    console.log(`✅ EMAIL SENT SUCCESSFULLY to ${email}`)
    console.log('Resend response ID:', data?.id)
    console.log('Resend full response:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error sending email:', error)
    console.error('Error stack:', error.stack)
  }
}

function formatPlanAsHTML(plan) {
  if (!plan) {
    console.error('❌ formatPlanAsHTML: plan is null or undefined')
    return '<p>Plan data is missing.</p>'
  }
  
  let html = ''
  
  try {
    if (plan.overview) {
      html += `<div class="plan-section"><p><strong>${plan.overview}</strong></p></div>`
    }
  } catch (e) {
    console.error('Error formatting overview:', e.message)
  }
  
  // Daily nutrition targets
  if (plan.daily_nutrition) {
    html += '<div class="plan-section"><h2>Daily Nutrition Goals</h2>'
    html += '<div class="nutrition-box">'
    html += `<p><strong>Calories:</strong> ${plan.daily_nutrition.calories} kcal</p>`
    html += `<p><strong>Protein:</strong> ${plan.daily_nutrition.protein_grams}g | <strong>Carbs:</strong> ${plan.daily_nutrition.carbs_grams}g | <strong>Fat:</strong> ${plan.daily_nutrition.fats_grams}g</p>`
    html += '</div></div>'
  }
  
  // Weekly training schedule
  if (plan.weekly_training && plan.weekly_training.sessions) {
    try {
      html += '<div class="plan-section"><h2>Your Typical Training Week</h2>'
      html += `<p><strong>Frequency:</strong> ${plan.weekly_training.frequency || '3-4'} sessions per week (repeat for 4 weeks)</p>`
      
      if (Array.isArray(plan.weekly_training.sessions)) {
        plan.weekly_training.sessions.forEach(session => {
          if (!session) return
          html += `
            <div class="workout-day">
              <strong>${session.day || 'Day'}</strong> - ${session.focus || 'Training'}
              ${session.duration ? `<br><em>Duration: ${session.duration}</em>` : ''}
              <ul class="exercise-list">
                ${session.exercises && Array.isArray(session.exercises) ? session.exercises.map(ex => {
                  if (!ex) return ''
                  const exStr = typeof ex === 'string' ? ex : `${ex.name || 'Exercise'}: ${ex.sets || ''} x ${ex.reps || ''}${ex.notes ? ` (${ex.notes})` : ''}`
                  return `<li>${exStr}</li>`
                }).join('') : ''}
              </ul>
            </div>
          `
        })
      }
      
      if (plan.weekly_training.progression_principle) {
        html += `<p><strong>Progression Principle:</strong> ${plan.weekly_training.progression_principle}</p>`
      }
      html += '</div>'
    } catch (e) {
      console.error('Error formatting weekly training:', e.message)
      html += '<div class="plan-section"><h2>Your Typical Training Week</h2><p>Training schedule coming soon.</p></div>'
    }
  }
  
  // Daily movement
  if (plan.daily_movement) {
    html += '<div class="plan-section"><h2>Daily Movement</h2>'
    html += `<p><strong>Step Goal:</strong> ${plan.daily_movement.steps_goal} steps per day</p>`
    if (plan.daily_movement.rationale) {
      html += `<p>${plan.daily_movement.rationale}</p>`
    }
    html += '</div>'
  }
  
  // Nutrition philosophy - removed, now part of "The Foundation" in food_swaps
  
  // Example day
  if (plan.example_day) {
    html += '<div class="plan-section"><h2>Example Day (Reference)</h2>'
    html += '<p style="margin-bottom: 1rem; font-style: italic; color: #6a6a6a;">The meals below are suggestions to show you the right portions. You can swap any ingredient for another from the Modular Matrix below while keeping the same grams per meal.</p>'
    
    const meals = ['breakfast', 'lunch', 'dinner', 'snacks']
    meals.forEach(mealKey => {
      const meal = plan.example_day[mealKey]
      if (meal && meal.meal) {
        html += `
          <div class="meal-plan">
            <strong>${mealKey === 'breakfast' ? 'Breakfast' : mealKey === 'lunch' ? 'Lunch' : mealKey === 'dinner' ? 'Dinner' : 'Snacks'}:</strong> ${meal.meal}
            ${meal.calories ? `<br><small>${meal.calories} kcal | P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fats}g</small>` : ''}
          </div>
        `
      }
    })
    html += '</div>'
  }
  
  // Food swaps - ALWAYS show new structure
  if (plan.food_swaps) {
    html += '<div class="plan-section"><h2>Swap Your Ingredients</h2>'
    
    // ALWAYS show The Foundation
    html += `<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f0f7f4; border-radius: 12px; border-left: 4px solid #1B3022;">`
    html += `<h3 style="margin-top: 0; margin-bottom: 0.75rem; color: #1B3022; font-size: 1.125rem; font-weight: 700;">The Foundation</h3>`
    if (plan.food_swaps.the_foundation) {
      html += `<p style="margin: 0; color: #2B2B2B; line-height: 1.6;">${plan.food_swaps.the_foundation}</p>`
    } else {
      html += `<p style="margin: 0; color: #2B2B2B; line-height: 1.6;">Eat 100% whole foods only. Nothing processed. This is the foundation of your nutrition plan.</p>`
    }
    html += '</div>'
    
    // ALWAYS show The Modular Matrix
    html += `<div style="margin-bottom: 2rem;">`
    html += `<h3 style="margin-bottom: 1.25rem; color: #2B2B2B; font-size: 1.125rem; font-weight: 700;">The Modular Matrix</h3>`
    html += `<div style="background-color: #f9f7f3; border-radius: 12px; padding: 1.75rem; border: 1px solid #E5E1DA;">`
    
    // Protein section
    html += `<div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E5E1DA;">`
    if (plan.food_swaps.modular_matrix && plan.food_swaps.modular_matrix.protein_goal) {
      html += `<p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B3022; font-size: 0.9375rem;">${plan.food_swaps.modular_matrix.protein_goal}</p>`
    } else if (plan.daily_nutrition && plan.daily_nutrition.protein_grams) {
      const proteinPerMeal = Math.round(plan.daily_nutrition.protein_grams / 4)
      html += `<p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B3022; font-size: 0.9375rem;">Aim for approximately ${proteinPerMeal}g protein per meal</p>`
    }
    if (plan.food_swaps.modular_matrix && plan.food_swaps.modular_matrix.protein_sources) {
      html += `<p style="margin: 0; color: #4a4a4a; font-size: 0.9375rem;"><strong>Protein Sources:</strong> ${plan.food_swaps.modular_matrix.protein_sources}</p>`
    } else {
      html += `<p style="margin: 0; color: #4a4a4a; font-size: 0.9375rem;"><strong>Protein Sources:</strong> Ground beef, Chicken breast, Eggs, Salmon/White fish, Turkey</p>`
    }
    html += '</div>'
    
    // Carb section
    html += `<div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E5E1DA;">`
    if (plan.food_swaps.modular_matrix && plan.food_swaps.modular_matrix.carb_goal) {
      html += `<p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B3022; font-size: 0.9375rem;">${plan.food_swaps.modular_matrix.carb_goal}</p>`
    } else if (plan.daily_nutrition && plan.daily_nutrition.carbs_grams) {
      const carbsPerMeal = Math.round(plan.daily_nutrition.carbs_grams / 4)
      html += `<p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B3022; font-size: 0.9375rem;">Aim for approximately ${carbsPerMeal}g carbs per meal</p>`
    }
    if (plan.food_swaps.modular_matrix && plan.food_swaps.modular_matrix.carb_sources) {
      html += `<p style="margin: 0; color: #4a4a4a; font-size: 0.9375rem;"><strong>Carb Sources:</strong> ${plan.food_swaps.modular_matrix.carb_sources}</p>`
    } else {
      html += `<p style="margin: 0; color: #4a4a4a; font-size: 0.9375rem;"><strong>Carb Sources:</strong> Potatoes, Sweet potatoes, Rice, Quinoa, Fruit</p>`
    }
    html += '</div>'
    
    // Fat section
    html += `<div style="margin-bottom: 0;">`
    if (plan.food_swaps.modular_matrix && plan.food_swaps.modular_matrix.fat_goal) {
      html += `<p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B3022; font-size: 0.9375rem;">${plan.food_swaps.modular_matrix.fat_goal}</p>`
    } else if (plan.daily_nutrition && plan.daily_nutrition.fats_grams) {
      const fatsPerMeal = Math.round(plan.daily_nutrition.fats_grams / 4)
      html += `<p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1B3022; font-size: 0.9375rem;">Aim for approximately ${fatsPerMeal}g fat per meal</p>`
    }
    if (plan.food_swaps.modular_matrix && plan.food_swaps.modular_matrix.fat_sources) {
      html += `<p style="margin: 0; color: #4a4a4a; font-size: 0.9375rem;"><strong>Fat Sources:</strong> ${plan.food_swaps.modular_matrix.fat_sources}</p>`
    } else {
      html += `<p style="margin: 0; color: #4a4a4a; font-size: 0.9375rem;"><strong>Fat Sources:</strong> Olive oil, Butter, Nuts, Peanut butter, Avocado</p>`
    }
    html += '</div>'
    
    html += '</div></div>'
    
    // ALWAYS show The Substitution Rule
    html += `<div style="padding: 1.25rem; background-color: #e8f5e9; border-radius: 8px; border-left: 4px solid #52C41A;">`
    html += `<h3 style="margin-top: 0; margin-bottom: 0.75rem; color: #1B3022; font-size: 1.125rem;">The Substitution Rule</h3>`
    if (plan.food_swaps.substitution_rule) {
      html += `<p style="margin: 0;">${plan.food_swaps.substitution_rule}</p>`
    } else {
      html += `<p style="margin: 0;">You can freely swap between these options. If the lunch example says chicken, you can use ground beef instead. If breakfast lacks fat, you can add peanut butter to your eggs or snacks. Keep the same GRAMS per meal to maintain your macros. The example meals show you the right portions - swap foods, not amounts.</p>`
    }
    html += '</div>'
    
    html += '</div>'
  }
  
  // Key principles
  if (plan.key_principles && plan.key_principles.length > 0) {
    html += '<div class="plan-section"><h2>Key Principles</h2><ul class="exercise-list">'
    plan.key_principles.forEach(principle => {
      html += `<li>${principle}</li>`
    })
    html += '</ul></div>'
  }
  
  // Fallback for old format
  if (plan.weekly_schedule && plan.weekly_schedule.length > 0 && !plan.weekly_training) {
    html += '<div class="plan-section"><h2>Your 4-Week Workout Schedule</h2>'
    plan.weekly_schedule.forEach(week => {
      html += `<h3>Week ${week.week}: ${week.focus || 'Getting Started'}</h3>`
      if (week.workouts) {
        week.workouts.forEach(workout => {
          html += `
            <div class="workout-day">
              <strong>${workout.day}</strong> - ${workout.duration || '20 min'} - ${workout.focus || 'Full Body'}
              <ul class="exercise-list">
                ${workout.exercises ? workout.exercises.map(ex => `<li>${ex}</li>`).join('') : ''}
              </ul>
            </div>
          `
        })
      }
    })
    html += '</div>'
  }
  
  if (!html || html.trim().length === 0) {
    console.warn('⚠️ formatPlanAsHTML: No content generated, using fallback')
    html = '<div class="plan-section"><p>Your personalized plan has been generated. Please check your account for details.</p></div>'
  }
  
  return html
}

function formatPlanAsText(plan) {
  let text = 'BetterDad Blueprint\n\n'
  
  if (plan.overview) {
    text += `${plan.overview}\n\n`
  }
  
  // Daily nutrition
  if (plan.daily_nutrition) {
    text += 'DAILY NUTRITION GOALS\n\n'
    text += `Calories: ${plan.daily_nutrition.calories} kcal\n`
    text += `Protein: ${plan.daily_nutrition.protein_grams}g | Carbs: ${plan.daily_nutrition.carbs_grams}g | Fat: ${plan.daily_nutrition.fats_grams}g\n\n`
  }
  
  // Weekly training
  if (plan.weekly_training && plan.weekly_training.sessions) {
    text += 'YOUR TYPICAL TRAINING WEEK\n\n'
    text += `Frequency: ${plan.weekly_training.frequency} sessions per week (repeat for 4 weeks)\n\n`
    
    plan.weekly_training.sessions.forEach(session => {
      text += `${session.day} - ${session.focus || 'Training'}\n`
      if (session.duration) {
        text += `Duration: ${session.duration}\n`
      }
      if (session.exercises) {
        session.exercises.forEach(ex => {
          const exStr = typeof ex === 'string' ? ex : `${ex.name}: ${ex.sets} x ${ex.reps}${ex.notes ? ` (${ex.notes})` : ''}`
          text += `  • ${exStr}\n`
        })
      }
      text += '\n'
    })
    
    if (plan.weekly_training.progression_principle) {
      text += `Progression: ${plan.weekly_training.progression_principle}\n\n`
    }
  }
  
  // Daily movement
  if (plan.daily_movement) {
    text += 'DAILY MOVEMENT\n\n'
    text += `Step Goal: ${plan.daily_movement.steps_goal} steps per day\n`
    if (plan.daily_movement.rationale) {
      text += `${plan.daily_movement.rationale}\n\n`
    }
  }
  
  // Nutrition philosophy
  if (plan.nutrition_philosophy) {
    text += 'NUTRITION PHILOSOPHY\n\n'
    text += `${plan.nutrition_philosophy.approach}\n\n`
    
    if (plan.nutrition_philosophy.protein_sources) {
      const proteinSources = Array.isArray(plan.nutrition_philosophy.protein_sources) 
        ? plan.nutrition_philosophy.protein_sources 
        : JSON.parse(plan.nutrition_philosophy.protein_sources || '[]')
      text += `Protein Sources: ${proteinSources.join(', ')}\n`
    }
    
    if (plan.nutrition_philosophy.carb_sources) {
      const carbSources = Array.isArray(plan.nutrition_philosophy.carb_sources)
        ? plan.nutrition_philosophy.carb_sources
        : JSON.parse(plan.nutrition_philosophy.carb_sources || '[]')
      text += `Carb Sources: ${carbSources.join(', ')}\n\n`
    }
  }
  
  // Example day
  if (plan.example_day) {
    text += 'EXAMPLE DAY\n\n'
    const meals = [
      { key: 'breakfast', label: 'Breakfast' },
      { key: 'lunch', label: 'Lunch' },
      { key: 'dinner', label: 'Dinner' },
      { key: 'snacks', label: 'Snacks' }
    ]
    
    meals.forEach(({ key, label }) => {
      const meal = plan.example_day[key]
      if (meal && meal.meal) {
        text += `${label}: ${meal.meal}`
        if (meal.calories) {
          text += ` (${meal.calories} kcal | P: ${meal.protein}g | K: ${meal.carbs}g | F: ${meal.fats}g)`
        }
        text += '\n'
      }
    })
    text += '\n'
  }
  
  // Food swaps
  if (plan.food_swaps) {
    text += 'SWAP YOUR INGREDIENTS\n\n'
    if (plan.food_swaps.protein_swaps) {
      text += `Protein: ${plan.food_swaps.protein_swaps}\n`
    }
    if (plan.food_swaps.fat_additions) {
      text += `Fat: ${plan.food_swaps.fat_additions}\n`
    }
    if (plan.food_swaps.carb_swaps) {
      text += `Carbs: ${plan.food_swaps.carb_swaps}\n\n`
    }
  }
  
  // Key principles
  if (plan.key_principles && plan.key_principles.length > 0) {
    text += 'KEY PRINCIPLES\n\n'
    plan.key_principles.forEach(principle => {
      text += `  • ${principle}\n`
    })
  }
  
  return text
}

app.get('/api/plan', (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ error: 'Missing email query param' })
  const plan = plans.get(email)
  if (!plan) return res.status(404).json({ error: 'Plan not found yet' })
  res.json(plan)
})

// Test endpoint to check email configuration
app.get('/api/test-email', async (req, res) => {
  if (!resend) {
    return res.json({ error: 'Resend not configured', configured: false })
  }
  
  const testEmail = req.query.email || 'likeikeab@gmail.com'
  
  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: testEmail,
      subject: 'Test Email from BetterDad',
      html: '<h1>Test</h1><p>This is a test email from BetterDad.</p>',
    })
    
    if (error) {
      return res.json({ 
        error: error.message, 
        statusCode: error.statusCode,
        configured: true,
        testEmail,
        emailFrom
      })
    }
    
    res.json({ success: true, data, configured: true })
  } catch (err) {
    res.json({ error: err.message, configured: true })
  }
})

// Test endpoint to send full plan email
app.get('/api/test-full-plan-email', async (req, res) => {
  if (!resend) {
    return res.json({ error: 'Resend not configured', configured: false })
  }
  
  if (!openai) {
    return res.json({ error: 'OpenAI not configured', configured: false })
  }
  
  const testEmail = req.query.email || 'likeikeab@gmail.com'
  
  // Create a test profile
  const testProfile = {
    age: 35,
    weight: 85,
    height: 180,
    goalWeight: 75,
    '2': 'Medium body fat',
    '3': 'Lean and defined',
    '4': 'Yes, a few times',
    '5': 'Lose fat',
    '6': '20–30 minutes',
    '7': 'No equipment',
    '8': 'Motivation',
    '9': 'Exhausted',
    '10': 'My belly',
    '11': 'Have more energy for my kids',
    '12': 'Normal budget - can afford quality food',
    '13': 'No injuries',
    '14': 'After work',
    confidence: 'Confident'
  }
  
  try {
    console.log('Generating test plan for:', testEmail)
    
    // Generate plan
    await generatePlanForUser(testEmail, testProfile, '4-week')
    
    // Get the generated plan
    const planData = plans.get(testEmail)
    
    if (!planData || !planData.plan) {
      return res.json({ error: 'Plan generation failed or not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Plan generated and email sent!',
      planId: planData.planId,
      email: testEmail
    })
  } catch (err) {
    console.error('Error in test endpoint:', err)
    res.json({ error: err.message, stack: err.stack })
  }
})

app.get('/api/session/:sessionId', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' })
    }
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId)
    res.json({ 
      email: session.customer_email || session.metadata?.email,
      planId: session.metadata?.planId 
    })
  } catch (error) {
    console.error('Error retrieving session:', error)
    res.status(500).json({ error: 'Failed to retrieve session' })
  }
})

app.listen(port, () => {
  console.log(`BetterDad server listening on port ${port}`)
})


