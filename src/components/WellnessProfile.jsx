import { useEffect } from 'react'
import './WellnessProfile.css'
import bodyLowFat from '../assets/images/body-low-fat.jpg'
import bodyMediumFat from '../assets/images/body-medium-fat.jpg'
import bodyHigherFat from '../assets/images/body-higher-fat.jpg'
import bodyVeryHighFat from '../assets/images/body-very-high-fat.jpg'

function WellnessProfile({ userData, onNext }) {
  // Auto-scroll to top when component mounts
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])
  // Calculate BMI (simplified - assumes height in cm and weight in kg)
  const height = userData.height || 175
  const weight = userData.weight || 80
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  
  // BMI categories
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#4A90E2' }
    if (bmi < 25) return { label: 'Normal', color: '#52C41A' }
    if (bmi < 30) return { label: 'Overweight', color: '#FAAD14' }
    return { label: 'Obese', color: '#FF4D4F' }
  }
  
  const bmiCategory = getBMICategory(bmi)
  const bmiPosition = Math.min(Math.max((bmi - 15) / (40 - 15) * 100, 0), 100)

  // Map quiz answers to display values
  const getBodyType = () => {
    const answer = userData['2'] || userData.bodyType
    const map = {
      'Low body fat': 'Low body fat',
      'Medium body fat': 'Medium body fat',
      'Higher body fat': 'Higher body fat',
      'Very high body fat': 'Very high body fat'
    }
    return map[answer] || answer || 'Not specified'
  }

  const getLifestyle = () => {
    const answer = userData['9'] // How do you usually feel after work?
    const map = {
      'Exhausted': 'Low energy',
      'Low energy but push through': 'Moderate activity',
      'Okay': 'Active',
      'Still full of energy': 'Very active'
    }
    return map[answer] || 'Moderate activity'
  }

  const getFitnessLevel = () => {
    const answer = userData['4'] // Have you followed a structured home workout plan before?
    const map = {
      'Yes, many times': 'Advanced',
      'Yes, a few times': 'Intermediate',
      'No, never': 'Beginner'
    }
    return map[answer] || 'Beginner'
  }

  const getMetabolism = () => {
    const age = userData.age || 35
    if (age < 30) return 'Fast'
    if (age < 45) return 'Normal'
    return 'Slower'
  }
  
  const getBodyTypeImage = () => {
    const answer = userData['2'] || userData.bodyType || 'Medium body fat'
    if (answer.includes('Low')) return bodyLowFat
    if (answer.includes('Medium')) return bodyMediumFat
    if (answer.includes('Higher')) return bodyHigherFat
    if (answer.includes('Very high')) return bodyVeryHighFat
    return bodyMediumFat
  }

  // Get optimal workout window based on time and energy
  const getWorkoutWindow = () => {
    const timeAnswer = userData['6'] // How much time per day?
    const energyAnswer = userData['9'] // How do you usually feel after work?
    
    if (energyAnswer === 'Still full of energy' || energyAnswer === 'Okay') {
      return timeAnswer === '20 minutes' ? 'Morning (20 min)' : 
             timeAnswer === '30 minutes' ? 'Morning (30 min)' :
             timeAnswer === '45 minutes' ? 'Morning (45 min)' : 'Morning (1h+)'
    }
    if (energyAnswer === 'Low energy but push through') {
      return 'Afternoon (moderate energy)'
    }
    return 'Morning (best energy)'
  }

  return (
    <div className="wellness-profile-container">
      <div className="wellness-profile-content">
        <div className="wellness-grid">
          <div className="wellness-box">
            <h4 className="wellness-box-title">Current body composition</h4>
            <p className="wellness-box-value">{getBodyType()}</p>
            <div className="wellness-box-badge">BMI: {bmi.toFixed(1)}</div>
          </div>

          <div className="wellness-box">
            <h4 className="wellness-box-title">Stress profile</h4>
            <p className="wellness-box-value">{getLifestyle()}</p>
            <div className="wellness-box-subtext">Based on your energy levels</div>
          </div>

          <div className="wellness-box">
            <h4 className="wellness-box-title">Metabolic age</h4>
            <p className="wellness-box-value">{getMetabolism()}</p>
            <div className="wellness-box-subtext">Age {userData.age || 35} + lifestyle</div>
          </div>

          <div className="wellness-box">
            <h4 className="wellness-box-title">Optimal workout window</h4>
            <p className="wellness-box-value">{getWorkoutWindow()}</p>
            <div className="wellness-box-subtext">Based on time & energy</div>
          </div>
        </div>

        <button className="wellness-profile-button" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default WellnessProfile




