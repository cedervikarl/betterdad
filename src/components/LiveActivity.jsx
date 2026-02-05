import { useState, useEffect } from 'react'
import './LiveActivity.css'

const names = ['Sarah', 'Michael', 'David', 'James', 'Robert', 'John', 'Chris', 'Mark', 'Tom', 'Paul']
const locations = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Glasgow', 'Edinburgh', 'Bristol', 'Cardiff', 'Dublin']

function LiveActivity() {
  const [viewingCount, setViewingCount] = useState(Math.floor(Math.random() * 5) + 2)
  const [todayCount, setTodayCount] = useState(Math.floor(Math.random() * 20) + 30)
  const [purchase, setPurchase] = useState(() => {
    const name = names[Math.floor(Math.random() * names.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const minutes = Math.floor(Math.random() * 10) + 1
    return { name, location, minutes }
  })

  useEffect(() => {
    // Update viewing count every 15 seconds
    const viewingInterval = setInterval(() => {
      setViewingCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(1, Math.min(8, prev + change))
      })
    }, 15000)

    // Update purchase notification every 8 seconds
    const purchaseInterval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const minutes = Math.floor(Math.random() * 10) + 1
      setPurchase({ name, location, minutes })
    }, 8000)

    // Update today's count occasionally
    const todayInterval = setInterval(() => {
      setTodayCount(prev => prev + Math.floor(Math.random() * 3))
    }, 30000)

    return () => {
      clearInterval(viewingInterval)
      clearInterval(purchaseInterval)
      clearInterval(todayInterval)
    }
  }, [])

  return (
    <div className="live-activity-container">
      <div className="live-activity-item">
        <span className="live-activity-dot"></span>
        <span className="live-activity-text">
          <strong>{viewingCount} people</strong> viewing this page right now
        </span>
      </div>
      
      <div className="live-activity-item">
        <span className="live-activity-icon">✓</span>
        <span className="live-activity-text">
          <strong>{purchase.name} from {purchase.location}</strong> just purchased {purchase.minutes} minute{purchase.minutes > 1 ? 's' : ''} ago
        </span>
      </div>
      
      <div className="live-activity-item">
        <span className="live-activity-icon">🎯</span>
        <span className="live-activity-text">
          <strong>{todayCount}+ dads</strong> joined today
        </span>
      </div>
    </div>
  )
}

export default LiveActivity

