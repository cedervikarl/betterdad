import { useState, useEffect, useMemo } from 'react'
import InfoSlide from './InfoSlide'
import './Quiz.css'

function Quiz({ config, infoSlides, answers, onAnswer, onEmailSubmit }) {
  // Build unified steps array with questions and info slides
  const steps = useMemo(() => {
    const allSteps = []
    let questionIndex = 0
    
    config.forEach((question, idx) => {
      // Add question
      allSteps.push({
        type: 'question',
        data: question,
        questionIndex: questionIndex++
      })
      
      // Check if info slides should be added after this question
      const matchingSlides = infoSlides.filter(slide => slide.position === idx + 1)
      
      matchingSlides.forEach(slide => {
        // For conditional slides, always add them - we'll filter when displaying
        // Regular info slides, always add
        allSteps.push({
          type: 'info',
          data: slide
        })
      })
    })
    
    return allSteps
  }, [config, infoSlides])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedImageOption, setSelectedImageOption] = useState(null)
  const [multiSelectAnswers, setMultiSelectAnswers] = useState({}) // Store multi-select answers
  const [sliderAnswers, setSliderAnswers] = useState({}) // Store slider answers

  const totalSteps = steps.length

  // Auto-scroll to top when step changes (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [currentStepIndex])

  // Initialize slider values when slider question appears
  useEffect(() => {
    const currentStep = steps[currentStepIndex]
    if (currentStep?.type === 'question' && currentStep.data.questionType === 'slider') {
      const question = currentStep.data
      if (!sliderAnswers[question.id]) {
        setSliderAnswers(prev => ({
          ...prev,
          [question.id]: {
            days: question.sliderA?.defaultValue || 3,
            minutes: question.sliderB?.defaultValue || 20
          }
        }))
      }
    }
  }, [currentStepIndex, steps, sliderAnswers])


  const handleOptionClick = (option) => {
    const currentStep = steps[currentStepIndex]
    if (currentStep.type === 'question') {
      const question = currentStep.data
      
      // Handle multi-select questions
      if (question.questionType === 'multi-select') {
        const questionId = question.id
        const currentSelections = multiSelectAnswers[questionId] || []
        const isSelected = currentSelections.includes(option)
        
        // Toggle selection
        const newSelections = isSelected
          ? currentSelections.filter(item => item !== option)
          : [...currentSelections, option]
        
        setMultiSelectAnswers(prev => ({
          ...prev,
          [questionId]: newSelections
        }))
        
        // Save as comma-separated string for backend
        onAnswer(questionId, newSelections.join(', '))
        return // Don't advance step yet
      }
      
      // Handle single-select questions
      onAnswer(question.id, option)
      
      // If it's an image question, set selected state briefly
      if (question.questionType === 'image') {
        setSelectedImageOption(option)
      }
      
      // Advance to next step for single-select
      if (currentStepIndex < steps.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1)
          setSelectedImageOption(null) // Reset selection
        }, 300)
      } else {
        setTimeout(() => {
          onEmailSubmit('', false) // Quiz complete, move to data collection
          setSelectedImageOption(null) // Reset selection
        }, 300)
      }
    }
  }
  
  const handleMultiSelectNext = () => {
    const currentStep = steps[currentStepIndex]
    if (currentStep.type === 'question' && currentStep.data.questionType === 'multi-select') {
      const questionId = currentStep.data.id
      const selections = multiSelectAnswers[questionId] || []
      if (selections.length === 0) {
        return // Don't advance if nothing selected
      }
    }
    
    if (currentStepIndex < steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1)
      }, 300)
    } else {
      setTimeout(() => {
        onEmailSubmit('', false) // Quiz complete, move to data collection
      }, 300)
    }
  }

  const handleSliderChange = (questionId, sliderType, value) => {
    setSliderAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [sliderType]: value
      }
    }))
  }

  const handleSliderNext = () => {
    const currentStep = steps[currentStepIndex]
    if (currentStep.type === 'question' && currentStep.data.questionType === 'slider') {
      const question = currentStep.data
      const questionId = question.id
      const sliderValues = sliderAnswers[questionId] || {}
      
      // Save both values - days per week and minutes per session
      if (sliderValues.days !== undefined && sliderValues.minutes !== undefined) {
        // Save as formatted string for backend compatibility
        const daysValue = `${sliderValues.days} days per week`
        const minutesValue = `${sliderValues.minutes} minutes`
        
        // Save days per week (old question 16 format)
        onAnswer(16, daysValue)
        // Save time per day (old question 6 format)
        onAnswer(6, minutesValue)
      }
    }
    
    if (currentStepIndex < steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1)
      }, 300)
    } else {
      setTimeout(() => {
        onEmailSubmit('', false) // Quiz complete, move to data collection
      }, 300)
    }
  }

  const handleInfoContinue = () => {
    // Skip conditional info slides that shouldn't be shown
    let nextIndex = currentStepIndex + 1
    while (nextIndex < steps.length) {
      const nextStep = steps[nextIndex]
      if (nextStep.type === 'info' && nextStep.data.condition) {
        // Check if this conditional slide should be shown
        const shouldShow = checkConditionalSlide(nextStep.data, nextStep.data.position - 1)
        if (!shouldShow) {
          nextIndex++
          continue
        }
      }
      break
    }
    
    if (nextIndex < steps.length) {
      setTimeout(() => {
        setCurrentStepIndex(nextIndex)
      }, 300)
    } else {
      setTimeout(() => {
        onEmailSubmit('', false) // Quiz complete, move to data collection
      }, 300)
    }
  }

  const checkConditionalSlide = (slide, questionIndex) => {
    if (!slide.condition) return true
    
    // Find the question that this slide is positioned after
    // questionIndex is 0-based, so position 7 means index 6
    const question = config[questionIndex]
    if (!question || question.id !== 7) return true // Only equipment question has conditions
    
    const equipmentAnswer = answers[question.id] || ''
    if (!equipmentAnswer) return false // No answer yet, don't show
    
    // Multi-select answers are stored as comma-separated strings
    const selectedOptions = equipmentAnswer.split(',').map(s => s.trim())
    const isBodyweightOnly = selectedOptions.length === 1 && selectedOptions[0] === 'Just bodyweight'
    
    if (slide.condition === 'bodyweight-only') {
      return isBodyweightOnly
    } else if (slide.condition === 'has-equipment') {
      return !isBodyweightOnly
    }
    
    return true
  }

  // Auto-dismiss removed - all info slides now use Continue button


  const currentStep = steps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / totalSteps) * 100

  if (currentStep.type === 'info') {
    // Check if this conditional slide should be shown
    if (currentStep.data.condition) {
      const shouldShow = checkConditionalSlide(currentStep.data, currentStep.data.position - 1)
      if (!shouldShow) {
        // Skip this slide and go to next
        handleInfoContinue()
        return null
      }
    }
    
    // Get slider values for dynamic text replacement
    let displayText = currentStep.data.text
    if (displayText.includes('{minutes}')) {
      // Find the slider question (id 4) and get the minutes value
      const sliderQuestion = config.find(q => q.id === 4)
      if (sliderQuestion) {
        const sliderValues = sliderAnswers[4] || {
          minutes: sliderQuestion.sliderB?.defaultValue || 20
        }
        const minutes = sliderValues.minutes
        
        // Customize message based on minutes
        if (minutes <= 10) {
          displayText = `Perfect. Most dads burn out because they try to train like they're 19 again. We'll make those ${minutes} minutes count so you have more energy after the workout than before. Even 10 minutes can transform your day.`
        } else if (minutes <= 20) {
          displayText = `Perfect. Most dads burn out because they try to train like they're 19 again. We'll make those ${minutes} minutes count so you have more energy after the workout than before.`
        } else if (minutes <= 30) {
          displayText = `Perfect. Most dads burn out because they try to train like they're 19 again. We'll make those ${minutes} minutes count so you have more energy after the workout than before. You're committing to real change.`
        } else {
          displayText = `Perfect. Most dads burn out because they try to train like they're 19 again. We'll make those ${minutes} minutes count so you have more energy after the workout than before. That's serious dedication.`
        }
      }
    }
    
    return (
      <div className="quiz-container">
        <div className="quiz-content">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="step-indicator">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>
          <InfoSlide 
            text={displayText}
            image={currentStep.data.image}
            review={currentStep.data.review}
            onContinue={handleInfoContinue}
            autoDismiss={null} // Always show Continue button
          />
        </div>
      </div>
    )
  }

  // Question step
  const question = currentStep.data
  const isImageQuestion = question.questionType === 'image'
  const isSliderQuestion = question.questionType === 'slider'
  const sliderValues = isSliderQuestion ? (sliderAnswers[question.id] || {
    days: question.sliderA?.defaultValue || 3,
    minutes: question.sliderB?.defaultValue || 20
  }) : null
  
  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="step-indicator">
          Step {currentStepIndex + 1} of {totalSteps}
        </div>
        <div className="question-card">
          {question.microcopy && (
            <p className="microcopy">{question.microcopy}</p>
          )}
          <h2 className="question-text">{question.question}</h2>
          {isSliderQuestion ? (
            <div className="slider-container">
              <div className="slider-group">
                <label className="slider-label">
                  {question.sliderA.label}: <strong>{sliderValues.days}</strong>
                </label>
                <input
                  type="range"
                  min={question.sliderA.min}
                  max={question.sliderA.max}
                  value={sliderValues.days}
                  onChange={(e) => handleSliderChange(question.id, 'days', parseInt(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-labels">
                  <span>{question.sliderA.min}</span>
                  <span>{question.sliderA.max}</span>
                </div>
              </div>
              <div className="slider-group">
                <label className="slider-label">
                  {question.sliderB.label}: <strong>{sliderValues.minutes}</strong>
                </label>
                <input
                  type="range"
                  min={question.sliderB.min}
                  max={question.sliderB.max}
                  value={sliderValues.minutes}
                  onChange={(e) => handleSliderChange(question.id, 'minutes', parseInt(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-labels">
                  <span>{question.sliderB.min}</span>
                  <span>{question.sliderB.max}</span>
                </div>
              </div>
              <button
                className="submit-button"
                onClick={handleSliderNext}
                style={{ marginTop: '2rem' }}
              >
                Next Step
              </button>
            </div>
          ) : isImageQuestion ? (
            <div className="image-options-grid">
              {question.options.map((option, index) => {
                const optionImage = question.images && question.images[index] ? question.images[index] : null
                return (
                  <button
                    key={index}
                    className={`image-option-card ${selectedImageOption === option ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {optionImage ? (
                      <div className="image-option-img-wrapper">
                        <img 
                          src={optionImage} 
                          alt={option}
                          className="image-option-img"
                        />
                      </div>
                    ) : (
                      <div className="image-option-placeholder">
                        <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="150" fill="#9a9a9a" rx="8"/>
                        </svg>
                      </div>
                    )}
                    <span className="image-option-label">{option}</span>
                  </button>
                )
              })}
            </div>
          ) : question.questionType === 'multi-select' ? (
            <>
              <div className="options-container">
                {question.options.map((option, index) => {
                  const questionId = question.id
                  const currentSelections = multiSelectAnswers[questionId] || []
                  const isSelected = currentSelections.includes(option)
                  return (
                    <button
                      key={index}
                      className={`option-button ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleOptionClick(option)}
                    >
                      <span className="checkbox-indicator">{isSelected ? '✓' : ''}</span>
                      {option}
                    </button>
                  )
                })}
              </div>
              <button
                className="submit-button"
                onClick={handleMultiSelectNext}
                disabled={(multiSelectAnswers[question.id] || []).length === 0}
                style={{ marginTop: '1.5rem' }}
              >
                Next Step
              </button>
            </>
          ) : (
            <div className="options-container">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz
