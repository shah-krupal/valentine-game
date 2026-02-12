import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

// Update these paths once you've added your photos to public/assets/images/
const IMAGES = {
  // Initial question image (you/her/both)
  stage0: '/valentine-game/assets/images/stage0.jpg',
  // After 1st No (goofy reaction)
  stage1: '/valentine-game/assets/images/stage1.jpg',
  // After 2nd No (more pleading)
  stage2: '/valentine-game/assets/images/stage2.jpg',
  // After 3rd No (dramatic)
  stage3: '/valentine-game/assets/images/stage3.jpg',
  // After 4th No (final attempt)
  stage4: '/valentine-game/assets/images/stage4.jpg',
  // Success screen (happy celebration)
  success: '/valentine-game/assets/images/success.jpg',
}

// Journey milestone images
const JOURNEY_IMAGES = {
  dayWeMet: '/valentine-game/assets/images/dayWeMet.jpeg',
  firstMeetup: '/valentine-game/assets/images/firstMeetup.jpeg',
  firstDate: '/valentine-game/assets/images/firstDate.jpeg',
  knewYouWereTheOne: '/valentine-game/assets/images/knewYouWereTheOne.jpeg',
  oneYear: '/valentine-game/assets/images/oneYear.jpeg',
  forever: '/valentine-game/assets/images/forever.jpeg',
}


// Personalized messages for Muskan
const STAGES = [
  {
    question: "Muskan, will you be my Valentine? 💕",
    subMessage: "More than one year of us... and this question still gives me butterflies 🦋",
    yesText: "Yes! 💖",
    noText: "No",
  },
  {
    question: "Really, Muskan?! After everything?! 😢",
    subMessage: "Remember our first date? You can't say no to that memory on Christmas Day!",
    yesText: "Okay, Thik hai! 💗",
    noText: "Still No",
  },
  {
    question: "Muskan ji pleaseee? 🥺👉👈",
    subMessage: "I'll start listening all 90s songs, your favourites!! 🎵",
    yesText: "Fine, YES! 💝",
    noText: "Nope",
  },
  {
    question: "Muskan, 1 year of loving you wasn't enough?!🥺",
    subMessage: "I promise more cuddles, more dates, more 'usss' moments! 💫",
    yesText: "YESSS! 💘",
    noText: "No way",
  },
  {
    question: "Muskan... this is your last chance! 😭💔",
    subMessage: "The 'No' button gave up... but I'll NEVER give up on us!",
    yesText: "YESSSSS FOREVER! 💞",
    noText: "Not allowed only"
  },
]

// Journey milestones for the success screen
const JOURNEY_MOMENTS = [
  {
    id: 'dayWeMet',
    emoji: "✨",
    text: "The day we met",
    caption: "Where it all began... ✨",
    date: "3 Nov" // Add your date here like "December 2024"
  },
  {
    id: 'firstMeetup',
    emoji: "💬",
    text: "Our first meeting aise proper proper",
    caption: "We hugged and sat in Gurudwara",
    date: "16 Jan"
  },
  {
    id: 'oneYear',
    emoji: "🎉",
    text: "Words matching actions",
    caption: "Finally my words started matching my actions 🎊",
    date: "14 July"
  },
  {
    id: 'knewYouWereTheOne',
    emoji: "💕",
    text: "When I knew you were the one",
    caption: "My heart just knew... 💖",
    date: "18 May"
  },
  {
    id: 'firstDate',
    emoji: "☕",
    text: "Our first date",
    caption: "Nervous but so worth it! 💕",
    date: "25 Dec"
  },
  {
    id: 'forever',
    emoji: "💍",
    text: "Forever to go...",
    caption: "This is just the beginning, Muskan 💞",
    date: "very soon!"
  },
]

// Modal Component for Journey Photos
function JourneyModal({ isOpen, onClose, moment }) {
  if (!isOpen || !moment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <span className="modal-emoji">{moment.emoji}</span>
          <h2 className="modal-title">{moment.text}</h2>
          {moment.date && <span className="modal-date">{moment.date}</span>}
        </div>

        <div className="modal-image-container">
          <img
            src={JOURNEY_IMAGES[moment.id]}
            alt={moment.text}
            className="modal-image"
          />
          <div className="modal-image-hearts">
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                className="modal-heart"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                💕
              </span>
            ))}
          </div>
        </div>

        <p className="modal-caption">{moment.caption}</p>

        <div className="modal-footer">
          <span className="modal-love">💕 Muskan & Krupal 💕</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [stage, setStage] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [noButtonStyle, setNoButtonStyle] = useState({})
  const [yesBtnScale, setYesBtnScale] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showJourney, setShowJourney] = useState(false)
  const [selectedMoment, setSelectedMoment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef(null)
  const noButtonRef = useRef(null)

  // Create floating hearts
  const createFloatingHearts = useCallback(() => {
    const hearts = []
    const heartEmojis = ['💕', '💗', '💖', '💝', '💘', '❤️', '💓', '💞', '🌹', '✨', '❤️']
    for (let i = 0; i < 30; i++) {
      hearts.push({
        id: i,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 4,
        size: 30 + Math.random() * 20,
      })
    }
    return hearts
  }, [])

  const [floatingHearts] = useState(createFloatingHearts)

  // Handle journey item click
  const handleJourneyClick = (moment) => {
    setSelectedMoment(moment)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMoment(null)
  }

  // Handle No button click
  const handleNoClick = () => {
    if (stage < 4) {
      setStage(prev => prev + 1)
      setYesBtnScale(prev => prev + 0.2) // Make the Yes button grow even bigger!
    } else {
      // In the very last stage, it just keeps running away forever
      moveNoButton()
    }
  }

  // Move the No button to a random position
  const moveNoButton = () => {
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const maxX = containerRect.width - 120
    const maxY = 60

    const randomX = (Math.random() - 0.5) * maxX
    const randomY = (Math.random() - 0.5) * maxY

    setNoButtonStyle(prev => ({
      ...prev,
      transform: `translate(${randomX}px, ${randomY}px)`,
      transition: 'transform 0.2s ease-out',
    }))
  }

  // Handle mouse approaching No button
  const handleNoMouseEnter = () => {
    // Only make it run away in the very last stage (stage 4)
    if (stage === 4) {
      moveNoButton()
    }
  }

  // Handle Yes button click
  const handleYesClick = () => {
    setShowConfetti(true)
    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => {
        setShowJourney(true)
      }, 1500)
    }, 500)
  }

  // Create confetti pieces
  const createConfetti = () => {
    const confetti = []
    const colors = ['#ff6b9d', '#ff4d6d', '#c77dff', '#ffd700', '#ff9a9e', '#fff']
    const shapes = ['💕', '💖', '💗', '❤️', '✨', '🌟', '💘', '❤️']

    for (let i = 0; i < 100; i++) {
      confetti.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: 10 + Math.random() * 20,
        rotation: Math.random() * 360,
      })
    }
    return confetti
  }

  if (showSuccess) {
    return (
      <div className="success-screen">
        <div className="hearts-bg">
          {floatingHearts.map(heart => (
            <span
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${heart.duration}s`,
                fontSize: `${heart.size}px`,
              }}
            >
              {heart.emoji}
            </span>
          ))}
        </div>

        {showConfetti && (
          <div className="confetti">
            {createConfetti().map(piece => (
              <span
                key={piece.id}
                className="confetti-piece"
                style={{
                  left: `${piece.left}%`,
                  animationDelay: `${piece.delay}s`,
                  fontSize: `${piece.size}px`,
                  transform: `rotate(${piece.rotation}deg)`,
                }}
              >
                {piece.shape}
              </span>
            ))}
          </div>
        )}

        {/* Journey Photo Modal */}
        <JourneyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          moment={selectedMoment}
        />

        <div className="success-content">
          <div className="success-emoji">💕💖💕</div>
          <h1 className="success-title">Yaaay, Muskan!! 🎉</h1>
          <div className="success-photo">
            <img src={IMAGES.success} alt="Us Together" />
          </div>
          <p className="success-message">
            I knew you'd say yes! 💕<br />
            <span className="highlight-text">You just made me the happiest person... AGAIN!</span><br />
          </p>

          {/* Journey Timeline */}
          {showJourney && (
            <div className="journey-container">
              <h2 className="journey-title">Our Journey 💫</h2>
              <p className="journey-subtitle">Click on each moment to see our memories! 📸</p>
              <div className="journey-timeline">
                {JOURNEY_MOMENTS.map((moment, index) => (
                  <div
                    key={index}
                    className="journey-item clickable"
                    style={{ animationDelay: `${index * 0.3}s` }}
                    onClick={() => handleJourneyClick(moment)}
                  >
                    <span className="journey-emoji">{moment.emoji}</span>
                    <span className="journey-text">{moment.text}</span>
                    <span className="journey-click-hint">📸</span>
                  </div>
                ))}
              </div>
              <div className="love-note">
                <p>
                  "Muskan, you light up my world like nobody else 💫<br />
                  Here's to our 1+ year journey and the forever ahead!<br />
                  <strong>Happy Valentine's Day, my love! 🌹</strong>"
                </p>
              </div>
            </div>
          )}

          <div className="success-emoji final-hearts">😘❤️😘</div>
        </div>
      </div>
    )
  }

  return (
    <div className="valentine-container" ref={containerRef}>
      {/* Floating Hearts Background */}
      <div className="hearts-bg">
        {floatingHearts.map(heart => (
          <span
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              fontSize: `${heart.size}px`,
            }}
          >
            {heart.emoji}
          </span>
        ))}
      </div>

      {showConfetti && (
        <div className="confetti">
          {createConfetti().map(piece => (
            <span
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                fontSize: `${piece.size}px`,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            >
              {piece.shape}
            </span>
          ))}
        </div>
      )}

      <div className="card">
        {/* Special header for Muskan */}
        <div className="special-header">
          <span>✨</span> For My Special Someone <span>✨</span>
        </div>

        {/* Photo */}
        <div className="photo-container">
          <img
            src={IMAGES[`stage${stage}`]}
            alt="Valentine"
            key={stage}
          />
          <div className="photo-hearts">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                className="photo-heart"
                style={{
                  animationDelay: `${i * 1.5}s`,
                  top: '50%',
                  left: '50%',
                }}
              >
                💕
              </span>
            ))}
          </div>
        </div>

        {/* Question */}
        <h1 className="question-text">{STAGES[stage].question}</h1>
        <p className="sub-message">{STAGES[stage].subMessage}</p>

        {/* Buttons */}
        <div className="buttons-container">
          <button
            className="btn-yes"
            onClick={handleYesClick}
            style={{
              transform: `scale(${yesBtnScale})`,
              transition: 'transform 0.3s ease'
            }}
          >
            {STAGES[stage].yesText}
          </button>

          {stage < 5 && (
            <button
              ref={noButtonRef}
              className={`btn-no ${stage >= 4 ? 'running' : ''}`}
              onClick={handleNoClick}
              onMouseEnter={handleNoMouseEnter}
              onTouchStart={(e) => {
                if (stage === 4) {
                  e.preventDefault();
                  moveNoButton();
                }
              }}
              style={{
                ...noButtonStyle,
                fontSize: `${Math.max(0.7, 1.1 - stage * 0.1)}rem`,
                padding: `${Math.max(8, 15 - stage * 2)}px ${Math.max(20, 35 - stage * 4)}px`,
              }}
            >
              {STAGES[stage].noText}
            </button>
          )}
        </div>

        {/* Stage indicator */}
        <div className="stage-indicator">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`stage-dot ${i <= stage ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
