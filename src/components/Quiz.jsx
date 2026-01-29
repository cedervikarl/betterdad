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
      
      // Check if an info slide should be added after this question
      const infoSlide = infoSlides.find(slide => slide.position === idx + 1)
      if (infoSlide) {
        allSteps.push({
          type: 'info',
          data: infoSlide
        })
      }
    })
    
    return allSteps
  }, [config, infoSlides])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedImageOption, setSelectedImageOption] = useState(null)
  const [multiSelectAnswers, setMultiSelectAnswers] = useState({}) // Store multi-select answers

  const totalSteps = steps.length

  // Auto-scroll to top when step changes (only if user scrolled down significantly)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only scroll if user is more than 200px from top (prevents URL bar popup)
      if (window.scrollY > 200) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (window.scrollY > 0) {
        // If already near top, just scroll a tiny bit to ensure we're at top
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [currentStepIndex])


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

  const handleInfoContinue = () => {
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


  const currentStep = steps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / totalSteps) * 100

  if (currentStep.type === 'info') {
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
            text={currentStep.data.text}
            image={currentStep.data.image}
            review={currentStep.data.review}
            onContinue={handleInfoContinue}
          />
        </div>
      </div>
    )
  }

  // Question step
  const question = currentStep.data
  const isImageQuestion = question.questionType === 'image'
  
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
          {isImageQuestion ? (
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
