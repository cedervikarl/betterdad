import { useState, useEffect } from 'react'
import './LiveActivity.css'

// Only male names
const names = ['Michael', 'David', 'James', 'Robert', 'John', 'Chris', 'Mark', 'Tom', 'Paul', 'Daniel', 'Matthew', 'Andrew', 'Steven', 'Kevin', 'Brian', 'Ryan', 'Jason', 'Eric', 'Adam', 'Justin']
const locations = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Glasgow', 'Edinburgh', 'Bristol', 'Cardiff', 'Dublin']

function LiveActivity() {
  const [purchase, setPurchase] = useState(() => {
    const name = names[Math.floor(Math.random() * names.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const minutes = Math.floor(Math.random() * 10) + 1
    return { name, location, minutes }
  })

  useEffect(() => {
    // Update purchase notification every 8 seconds
    const purchaseInterval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const minutes = Math.floor(Math.random() * 10) + 1
      setPurchase({ name, location, minutes })
    }, 8000)

    return () => {
      clearInterval(purchaseInterval)
    }
  }, [])

  return (
    <div className="live-activity-container">
      <div className="live-activity-item">
        <span className="live-activity-icon">✓</span>
        <span className="live-activity-text">
          <strong>{purchase.name} from {purchase.location}</strong> just purchased {purchase.minutes} minute{purchase.minutes > 1 ? 's' : ''} ago
        </span>
      </div>
    </div>
  )
}

export default LiveActivity

