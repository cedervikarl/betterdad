import { useEffect } from 'react'
import './WellnessProfile.css'
import bodyLowFat from '../assets/images/body-low-fat.jpg'
import bodyMediumFat from '../assets/images/body-medium-fat.jpg'
import bodyHigherFat from '../assets/images/body-higher-fat.jpg'
import bodyVeryHighFat from '../assets/images/body-very-high-fat.jpg'

function WellnessProfile({ userData, onNext }) {
  // Auto-scroll to top when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timer)
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

  return (
    <div className="wellness-profile-container">
      <div className="wellness-profile-content">
        <h2 className="wellness-profile-title">Here's your profile</h2>
        
        <div className="bmi-section">
          <h3 className="bmi-title">BMI</h3>
          <div className="bmi-bar-container">
            <div className="bmi-bar">
              <div className="bmi-gradient"></div>
              <div 
                className="bmi-indicator"
                style={{ left: `${bmiPosition}%` }}
              >
                <div className="bmi-bubble">
                  {bmi.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="bmi-labels">
              <span>15</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
          <p className="bmi-category">{bmiCategory.label}</p>
        </div>

        <div className="wellness-profile-stats-row">
          <div className="wellness-box">
            <h4 className="wellness-box-title">Body type</h4>
            <p className="wellness-box-value">{getBodyType()}</p>
          </div>

          <div className="wellness-box">
            <h4 className="wellness-box-title">Lifestyle</h4>
            <p className="wellness-box-value">{getLifestyle()}</p>
          </div>

          <div className="wellness-box">
            <h4 className="wellness-box-title">Fitness level</h4>
            <p className="wellness-box-value">{getFitnessLevel()}</p>
          </div>

          <div className="wellness-box">
            <h4 className="wellness-box-title">Metabolism</h4>
            <p className="wellness-box-value">{getMetabolism()}</p>
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




