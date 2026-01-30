import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Quiz from './components/Quiz'
import HeightInput from './components/HeightInput'
import WeightInput from './components/WeightInput'
import GoalWeightInput from './components/GoalWeightInput'
import AgeInput from './components/AgeInput'
import EmailCapture from './components/EmailCapture'
import WellnessProfile from './components/WellnessProfile'
import ProjectionGraph from './components/ProjectionGraph'
import ConfidenceQuestion from './components/ConfidenceQuestion'
import LoadingScreen from './components/LoadingScreen'
import FinalPlan from './components/FinalPlan'
import Pricing from './components/Pricing'
import Success from './components/Success'
import LegalDrawer from './components/LegalDrawer'
import './App.css'

// Importera bilder för body type questions
import bodyLowFat from './assets/images/body-low-fat.jpg'
import bodyMediumFat from './assets/images/body-medium-fat.jpg'
import bodyHigherFat from './assets/images/body-higher-fat.jpg'
import bodyVeryHighFat from './assets/images/body-very-high-fat.jpg'

// Importera bilder för dream body questions
import dreamLean from './assets/images/dream-lean-defined.jpg'
import dreamAthletic from './assets/images/dream-athletic-muscular.jpg'
import dreamBigger from './assets/images/dream-bigger-strong.jpg'
import dreamSlimmer from './assets/images/dream-slimmer-healthy.jpg'

// Importera bilder för info slides
import infoImage1 from './assets/images/info-1-success.jpg'
import infoImage2 from './assets/images/info-2-michael.jpg'
import infoImage3 from './assets/images/info-3-lifestyle.jpg'

const QUIZ_CONFIG = [
  {
    id: 2,
    question: "How do you look right now?",
    questionType: 'image',
    options: ["Low body fat", "Medium body fat", "Higher body fat", "Very high body fat"],
    microcopy: "Be honest with yourself. This helps us build the right plan for you.",
    images: [
      bodyLowFat,
      bodyMediumFat,
      bodyHigherFat,
      bodyVeryHighFat
    ]
  },
  {
    id: 3,
    question: "What is your dream body?",
    questionType: 'image',
    options: ["Lean and defined", "Athletic and muscular", "Bigger and strong", "Just slimmer and healthier"],
    microcopy: "Visualize where you want to be. We'll help you get there.",
    images: [
      dreamLean,
      dreamAthletic,
      dreamBigger,
      dreamSlimmer
    ]
  },
  {
    id: 4,
    question: "Have you followed a structured home workout plan before?",
    options: ["Yes, many times", "Yes, a few times", "No, never"],
    microcopy: "This plan will be built around your real life, not a perfect fantasy."
  },
  {
    id: 5,
    question: "What's your main goal right now?",
    options: ["Lose fat", "Build muscle", "Lose fat and build muscle", "Have more energy"],
    microcopy: "Every dad deserves to feel strong and confident again."
  },
  {
    id: 6,
    question: "How much time do you realistically have per day?",
    options: ["20 minutes", "30 minutes", "45 minutes", "1 hour plus"],
    microcopy: "We respect your time. No fluff, just results."
  },
  {
    id: 7,
    question: "What equipment do you have access to?",
    questionType: 'multi-select',
    options: ["Full gym access", "Dumbbells at home", "Kettlebells", "Resistance bands", "Pull-up bar", "No equipment - just bodyweight"],
    microcopy: "Select all that apply. We'll create the perfect plan based on what you actually have available."
  },
  {
    id: 8,
    question: "What's the hardest part for you right now?",
    options: ["Motivation", "Time", "Consistency", "I don't know what to do"],
    microcopy: "We've got your back. This is designed for dads, by dads."
  },
  {
    id: 9,
    question: "How do you usually feel after work?",
    options: ["Exhausted", "Low energy but push through", "Okay", "Still full of energy"],
    microcopy: "Your energy matters. We'll work with what you have."
  },
  {
    id: 10,
    question: "What frustrates you the most about your body right now?",
    options: ["My belly", "Lack of muscle", "Low energy", "I don't feel confident with my shirt off"],
    microcopy: "You're not alone. Every dad has been there."
  },
  {
    id: 11,
    question: "What would you like to improve the most for your family?",
    options: ["Have more energy for my kids", "Be a better example", "Feel proud of how I look", "All of the above"],
    microcopy: "This is about more than just you. It's about being the dad they deserve."
  },
  {
    id: 12,
    question: "How does your food budget look?",
    options: ["Tight budget - need affordable options", "Normal budget - can afford quality food", "Flexible budget - can prioritize premium choices"],
    microcopy: "We'll tailor your meal plan to what works for your wallet."
  },
  {
    id: 13,
    question: "Do you have any injuries or limitations we should know about?",
    options: ["No injuries", "Back or knee issues", "Shoulder or arm problems", "Other limitations"],
    microcopy: "Your safety comes first. We'll adapt exercises to work around any issues."
  },
  {
    id: 14,
    question: "When do you usually work out?",
    options: ["Morning (before work)", "Lunch break", "After work", "Evening", "It varies"],
    microcopy: "Timing matters. We'll match your workouts to your energy levels."
  },
  {
    id: 15,
    question: "What's your current fitness level?",
    options: ["Complete beginner", "Some experience but out of shape", "Moderately fit", "Already quite fit"],
    microcopy: "We'll start where you are, not where you wish you were."
  },
  {
    id: 16,
    question: "How many days per week can you realistically commit to working out?",
    options: ["2-3 days", "3-4 days", "4-5 days", "5-6 days"],
    microcopy: "Consistency beats perfection. We'll build a schedule you can actually stick to."
  },
  {
    id: 17,
    question: "What's your biggest challenge with nutrition right now?",
    options: ["I don't know what to eat", "I don't have time to cook", "I eat too much junk food", "I skip meals"],
    microcopy: "We'll make nutrition simple and practical for your lifestyle."
  }
]

const INFO_SLIDES = [
  {
    id: 'info-1',
    text: "Over 100,000 dads have already started The DadBod Elimination Protocol.",
    position: 4, // After question 4 (was question 2)
    image: infoImage1
  },
  {
    id: 'info-2',
    text: "Michael, 34, lost 6 kg in 4 weeks and finally has the energy to play with his kids after work.",
    position: 7, // After question 7 (was question 5)
    image: infoImage2
  },
  {
    id: 'info-3',
    text: "Most dads fail because plans don't fit their real life. This quiz builds your plan around your time, your goals and your equipment.",
    position: 8, // After question 8 (was question 6)
    image: infoImage3
  },
  {
    id: 'info-4',
    text: "You're almost done! Hang in there — we're building something that actually works for you.",
    position: 9, // After question 9 (middle of quiz)
    image: null, // No image for this one
    review: {
      name: "James, 38",
      text: "I was skeptical at first, but this plan actually fits my life. Lost 8 kg in 6 weeks and finally feel like myself again.",
      rating: 5
    }
  }
]

function App() {
  const [currentStep, setCurrentStep] = useState('quiz')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [userData, setUserData] = useState({})
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [legalOpen, setLegalOpen] = useState(false)
  const [successEmail, setSuccessEmail] = useState('')
  const [successPlanPrice, setSuccessPlanPrice] = useState(null)
  const [successCurrency, setSuccessCurrency] = useState('EUR')

  useEffect(() => {
    // Initialize Facebook Pixel
    initFacebookPixel()
    
    const open = () => setLegalOpen(true)
    window.addEventListener('betterdad:open-docs', open)
    return () => window.removeEventListener('betterdad:open-docs', open)
  }, [])

  useEffect(() => {
    // Check if we're coming back from Stripe checkout
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    if (sessionId) {
      // Fetch session details to get email
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242'
      fetch(`${backendUrl}/api/session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.email) {
            setSuccessEmail(data.email)
            setCurrentStep('success')
          }
        })
        .catch(() => {
          // Fallback to email from localStorage
          const storedEmail = localStorage.getItem('betterdad_email')
          if (storedEmail) {
            setSuccessEmail(storedEmail)
            setCurrentStep('success')
          }
        })
    }
  }, [])

  const handleStartQuiz = () => {
    setCurrentStep('quiz')
  }

  const handleAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleEmailSubmit = (emailValue, consentValue) => {
    // Quiz complete, move to data collection
    setCurrentStep('height')
  }

  const handleHeightSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }))
    setCurrentStep('weight')
  }

  const handleWeightSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }))
    setCurrentStep('goal-weight')
  }

  const handleGoalWeightSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }))
    setCurrentStep('age')
  }

  const handleAgeSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }))
    setCurrentStep('email-capture')
  }

  const handleEmailCaptureSubmit = (emailValue, consentValue) => {
    setEmail(emailValue)
    setConsent(consentValue)
    // Merge quiz answers into userData before showing wellness profile
    setUserData(prev => ({ 
      ...prev, 
      email: emailValue,
      ...quizAnswers // Include all quiz answers
    }))
    setCurrentStep('wellness-profile')
  }

  const handleWellnessNext = () => {
    setCurrentStep('projection-graph')
  }

  const handleProjectionNext = () => {
    setCurrentStep('confidence')
  }

  const handleConfidenceAnswer = async (answer) => {
    const finalUserData = { ...userData, confidence: answer, ...quizAnswers }
    setUserData(finalUserData)
    
    // Save profile to backend before showing loading screen
    // Use a consistent key so webhook can find it
    const profileToSave = {
      ...finalUserData,
      email: finalUserData.email || 'likeikeab@gmail.com' // Fallback email
    }
    
    try {
      console.log('Saving profile to backend...')
      console.log('Profile email:', profileToSave.email)
      console.log('Profile keys:', Object.keys(profileToSave))
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242'
      const response = await fetch(`${backendUrl}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToSave)
      })
      
      const result = await response.json()
      console.log('Profile save response:', result)
    } catch (e) {
      console.error('Failed to save profile:', e)
    }
    
    setCurrentStep('loading')
  }

  const handleLoadingComplete = () => {
    setCurrentStep('final-plan')
  }

  const handleFinalPlanNext = () => {
    setCurrentStep('pricing')
  }

  const handlePricingSelect = (plan) => {
    setSelectedPlan(plan)
    // Here you would typically redirect to Shopify checkout
    console.log('Selected plan:', plan)
  }

  return (
    <div className="app">
      <Header onOpenDocs={() => setLegalOpen(true)} />
      {currentStep === 'quiz' && (
        <Quiz
          config={QUIZ_CONFIG}
          infoSlides={INFO_SLIDES}
          answers={quizAnswers}
          onAnswer={handleAnswer}
          onEmailSubmit={handleEmailSubmit}
        />
      )}
      {currentStep === 'height' && (
        <HeightInput onNext={handleHeightSubmit} initialValue={userData.height} />
      )}
      {currentStep === 'weight' && (
        <WeightInput onNext={handleWeightSubmit} initialValue={userData.weight} />
      )}
      {currentStep === 'goal-weight' && (
        <GoalWeightInput onNext={handleGoalWeightSubmit} initialValue={userData.goalWeight} />
      )}
      {currentStep === 'age' && (
        <AgeInput onNext={handleAgeSubmit} initialValue={userData.age} />
      )}
      {currentStep === 'email-capture' && (
        <EmailCapture onNext={handleEmailCaptureSubmit} />
      )}
      {currentStep === 'wellness-profile' && (
        <WellnessProfile userData={userData} onNext={handleWellnessNext} />
      )}
      {currentStep === 'projection-graph' && (
        <ProjectionGraph userData={userData} onNext={handleProjectionNext} />
      )}
      {currentStep === 'confidence' && (
        <ConfidenceQuestion onAnswer={handleConfidenceAnswer} />
      )}
      {currentStep === 'loading' && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      {currentStep === 'final-plan' && (
        <FinalPlan userData={userData} onNext={handleFinalPlanNext} />
      )}
      {currentStep === 'pricing' && (
        <Pricing onSelectPlan={handlePricingSelect} userData={userData} />
      )}
      {currentStep === 'success' && (
        <Success email={successEmail} planPrice={successPlanPrice} currency={successCurrency} />
      )}

      <LegalDrawer open={legalOpen} onClose={() => setLegalOpen(false)} />
    </div>
  )
}

export default App

