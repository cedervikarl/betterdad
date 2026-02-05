import { useEffect, useState } from 'react'
import Header from './components/Header'
import Quiz from './components/Quiz'
import HeightInput from './components/HeightInput'
import WeightInput from './components/WeightInput'
import AgeInput from './components/AgeInput'
import EmailCapture from './components/EmailCapture'
import WellnessProfile from './components/WellnessProfile'
import ProjectionGraph from './components/ProjectionGraph'
import ConfidenceQuestion from './components/ConfidenceQuestion'
import LoadingScreen from './components/LoadingScreen'
import Pricing from './components/Pricing'
import Success from './components/Success'
import LegalDrawer from './components/LegalDrawer'
import { initFacebookPixel } from './utils/facebookPixel'
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
import infoImage5 from './assets/images/info-5-guarantee.jpg'

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
    id: 5,
    question: "What's your main goal right now?",
    options: ["Lose fat", "Build muscle", "Lose fat and build muscle", "Have more energy"],
    microcopy: "Every dad deserves to feel strong and confident again."
  },
  {
    id: 4,
    question: "What can you realistically commit to?",
    questionType: 'slider',
    microcopy: "Be honest with yourself. Small commitments lead to big results.",
    sliderA: {
      label: "Days per week",
      min: 1,
      max: 5,
      defaultValue: 3
    },
    sliderB: {
      label: "Minutes per session",
      min: 5,
      max: 45,
      defaultValue: 20
    }
  },
  {
    id: 7,
    question: "What equipment do you have access to?",
    questionType: 'multi-select',
    options: ["Full gym access", "Dumbbells at home", "Kettlebells", "Resistance bands", "Pull-up bar", "Just bodyweight"],
    microcopy: "Select all that apply. We'll create the perfect plan based on what you actually have available."
  },
  {
    id: 8,
    question: "What's the hardest part for you right now?",
    options: ["Motivation", "Time", "Consistency", "I don't know what to do"],
    microcopy: "We've got your back. This is designed for dads, by dads."
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
    options: ["Energy to actually play with my kids after work.", "Being a fit role model for my children.", "The confidence to take my shirt off at the beach.", "Living a long, healthy life for my family."],
    microcopy: "This is about more than just you. It's about being the dad they deserve."
  },
  {
    id: 13,
    question: "Do you have any injuries or limitations we should know about?",
    options: ["No injuries", "Back or knee issues", "Shoulder or arm problems", "Other limitations"],
    microcopy: "Your safety comes first. We'll adapt exercises to work around any issues."
  },
  {
    id: 15,
    question: "What's your current fitness level?",
    options: ["Complete beginner", "Some experience but out of shape", "Moderately fit", "Already quite fit"],
    microcopy: "We'll start where you are, not where you wish you were."
  },
]

const INFO_SLIDES = [
  {
    id: 'info-1',
    text: "Over 100,000 dads have already started The DadBod Elimination Protocol.",
    position: 3, // After question 3 (dream body) - index 2 in array
    image: infoImage1
  },
  {
    id: 'info-1.5',
    text: "Perfect. Most dads burn out because they try to train like they're 19 again. We'll make those {minutes} minutes count so you have more energy after the workout than before.",
    position: 4, // After question 4 (slider - time & days)
    image: null, // Add image: infoImageSlider (or your image name)
    // autoDismiss removed - now uses Continue button
  },
  {
    id: 'info-2',
    text: "Michael, 34, lost 6 kg in 4 weeks and finally has the energy to play with his kids after work.",
    position: 5, // After question 5 (main goal)
    image: infoImage2
  },
  {
    id: 'info-2.5',
    text: "Smart. Your own body weight is the most underrated gym on the planet. 65% of our top transformations started right in their living room with zero gear.",
    position: 5, // After question 7 (equipment) - if bodyweight only. Question 7 is at index 4, so position is 5
    image: null, // Add image: infoImageBodyweight (or your image name)
    condition: 'bodyweight-only'
  },
  {
    id: 'info-2.6',
    text: "Solid. We'll use that extra resistance to skyrocket your metabolism. Get ready to build that 'Dad Strength' your kids will look up to.",
    position: 5, // After question 7 (equipment) - if equipment selected. Question 7 is at index 4, so position is 5
    image: null, // Add image: infoImageEquipment (or your image name)
    condition: 'has-equipment'
  },
  {
    id: 'info-3',
    text: "Most dads fail because plans don't fit their real life. This quiz builds your plan around your time, your goals and your equipment.",
    position: 6, // After equipment pop-up (question 7 is at index 4, so after equipment popup would be position 6)
    image: infoImage3
  },
  {
    id: 'info-4',
    text: "You're almost done! Hang in there — we're building something that actually works for you.",
    position: 10, // After question 10 (middle of quiz)
    image: null, // No image for this one
    review: {
      name: "James, 38",
      text: "I was skeptical at first, but this plan actually fits my life. Lost 8 kg in 6 weeks and finally feel like myself again.",
      rating: 5
    }
  },
  {
    id: 'info-5',
    text: "Better dad offers a 100% Money-Back Guarantee If you don't reach the goals you set in this quiz!",
    position: 13, // After question 15 (last question)
    image: infoImage5
  }
]

function App() {
  // Load from localStorage on mount
  const loadFromStorage = () => {
    try {
      const storedStep = localStorage.getItem('betterdad_currentStep')
      const storedQuizAnswers = localStorage.getItem('betterdad_quizAnswers')
      const storedUserData = localStorage.getItem('betterdad_userData')
      const storedEmail = localStorage.getItem('betterdad_email')
      const storedConsent = localStorage.getItem('betterdad_consent')
      
      return {
        step: storedStep ? JSON.parse(storedStep) : 'quiz',
        quizAnswers: storedQuizAnswers ? JSON.parse(storedQuizAnswers) : {},
        userData: storedUserData ? JSON.parse(storedUserData) : {},
        email: storedEmail || '',
        consent: storedConsent === 'true'
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return {
        step: 'quiz',
        quizAnswers: {},
        userData: {},
        email: '',
        consent: false
      }
    }
  }

  const savedData = loadFromStorage()
  const [currentStep, setCurrentStepState] = useState(savedData.step)
  const [quizAnswers, setQuizAnswers] = useState(savedData.quizAnswers)
  const [userData, setUserData] = useState(savedData.userData)
  const [email, setEmail] = useState(savedData.email)
  const [consent, setConsent] = useState(savedData.consent)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [legalOpen, setLegalOpen] = useState(false)
  const [successEmail, setSuccessEmail] = useState('')
  const [successPlanPrice, setSuccessPlanPrice] = useState(null)
  const [successCurrency, setSuccessCurrency] = useState('EUR')

  // Wrapper for setCurrentStep that saves to localStorage
  const setCurrentStep = (step) => {
    setCurrentStepState(step)
    try {
      localStorage.setItem('betterdad_currentStep', JSON.stringify(step))
    } catch (error) {
      console.error('Error saving step to localStorage:', error)
    }
  }

  useEffect(() => {
    // Initialize Facebook Pixel (with error handling)
    try {
      initFacebookPixel()
    } catch (error) {
      console.error('Failed to initialize Facebook Pixel:', error)
    }
    
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
            // Get plan price from session for Facebook Pixel tracking
            if (data.amount && data.currency) {
              setSuccessPlanPrice(data.amount / 100) // Convert from cents
              setSuccessCurrency(data.currency.toUpperCase())
            }
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

  const handleAnswer = (questionId, answer) => {
    const newAnswers = {
      ...quizAnswers,
      [questionId]: answer
    }
    setQuizAnswers(newAnswers)
    // Save to localStorage immediately
    try {
      localStorage.setItem('betterdad_quizAnswers', JSON.stringify(newAnswers))
    } catch (error) {
      console.error('Error saving quiz answers to localStorage:', error)
    }
  }

  const handleEmailSubmit = (emailValue, consentValue) => {
    // Quiz complete, move to data collection
    setCurrentStep('height')
  }

  const handleHeightSubmit = (data) => {
    const newUserData = { ...userData, ...data }
    setUserData(newUserData)
    try {
      localStorage.setItem('betterdad_userData', JSON.stringify(newUserData))
    } catch (error) {
      console.error('Error saving userData to localStorage:', error)
    }
    setCurrentStep('weight')
  }

  const handleWeightSubmit = (data) => {
    const newUserData = { ...userData, ...data }
    setUserData(newUserData)
    try {
      localStorage.setItem('betterdad_userData', JSON.stringify(newUserData))
    } catch (error) {
      console.error('Error saving userData to localStorage:', error)
    }
    setCurrentStep('age')
  }

  const handleAgeSubmit = (data) => {
    const newUserData = { ...userData, ...data }
    setUserData(newUserData)
    try {
      localStorage.setItem('betterdad_userData', JSON.stringify(newUserData))
    } catch (error) {
      console.error('Error saving userData to localStorage:', error)
    }
    setCurrentStep('email-capture')
  }

  const handleEmailCaptureSubmit = (emailValue, consentValue) => {
    setEmail(emailValue)
    setConsent(consentValue)
    // Merge quiz answers into userData before showing wellness profile
    const newUserData = { 
      ...userData, 
      email: emailValue,
      ...quizAnswers // Include all quiz answers
    }
    setUserData(newUserData)
    try {
      localStorage.setItem('betterdad_email', emailValue)
      localStorage.setItem('betterdad_consent', String(consentValue))
      localStorage.setItem('betterdad_userData', JSON.stringify(newUserData))
    } catch (error) {
      console.error('Error saving email/consent to localStorage:', error)
    }
    setCurrentStep('wellness-profile')
  }

  const handleWellnessNext = () => {
    setCurrentStep('projection-graph')
  }

  const handleProjectionNext = async () => {
    const finalUserData = { ...userData, ...quizAnswers }
    setUserData(finalUserData)
    
    // Save to localStorage
    try {
      localStorage.setItem('betterdad_userData', JSON.stringify(finalUserData))
    } catch (error) {
      console.error('Error saving userData to localStorage:', error)
    }
    
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

  const handleConfidenceAnswer = async (answer) => {
    // Update userData with confidence answer
    const updatedUserData = { ...userData, confidence: answer }
    setUserData(updatedUserData)
    
    // Save to localStorage
    try {
      localStorage.setItem('betterdad_userData', JSON.stringify(updatedUserData))
    } catch (error) {
      console.error('Error saving userData to localStorage:', error)
    }
    
    // Update profile in backend with confidence answer
    try {
      const profileToUpdate = {
        ...updatedUserData,
        email: updatedUserData.email || 'likeikeab@gmail.com'
      }
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242'
      await fetch(`${backendUrl}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToUpdate)
      })
    } catch (e) {
      console.error('Failed to update profile with confidence:', e)
    }
    // Continue loading (this will be called from LoadingScreen)
  }

  const handleLoadingComplete = () => {
    setCurrentStep('pricing')
  }

  const handlePricingSelect = (plan) => {
    setSelectedPlan(plan)
    // Here you would typically redirect to Shopify checkout
    console.log('Selected plan:', plan)
  }

  const handleHomeClick = () => {
    setCurrentStep('quiz')
  }

  return (
    <div className="app">
      <Header onOpenDocs={() => setLegalOpen(true)} onHomeClick={handleHomeClick} />
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
        <WeightInput 
          onNext={handleWeightSubmit} 
          initialWeight={userData.weight} 
          initialGoalWeight={userData.goalWeight} 
        />
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
      {currentStep === 'loading' && (
        <LoadingScreen 
          onComplete={handleLoadingComplete} 
          onConfidenceAnswer={handleConfidenceAnswer}
          userData={userData}
        />
      )}
      {currentStep === 'pricing' && (
        <Pricing 
          onSelectPlan={handlePricingSelect} 
          userData={userData}
        />
      )}
      {currentStep === 'success' && (
        <Success email={successEmail} planPrice={successPlanPrice} currency={successCurrency} />
      )}

      <LegalDrawer open={legalOpen} onClose={() => setLegalOpen(false)} />
    </div>
  )
}

export default App

