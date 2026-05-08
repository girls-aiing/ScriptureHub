import React, { useState, useCallback } from 'react'
import { TIERS } from '../data/tierConfig'
import { followerQuestions } from '../data/questions/follower'
import { believerQuestions } from '../data/questions/believer'
import { messengerQuestions } from '../data/questions/messenger'
import { deaconQuestions } from '../data/questions/deacon'
import { evangelistQuestions } from '../data/questions/evangelist'
import { visionaryQuestions } from '../data/questions/visionary'
import { useProgress } from '../hooks/useProgress'

// ── All questions lookup ──
const ALL_QUESTIONS = {
  follower:   followerQuestions,
  believer:   believerQuestions,
  messenger:  messengerQuestions,
  deacon:     deaconQuestions,
  evangelist: evangelistQuestions,
  visionary:  visionaryQuestions,
}

// ── Shuffle helper ──
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Score message helper ──
function getScoreMessage(score, total) {
  const pct = (score / total) * 100
  if (pct === 100) return { title: 'Perfect Score!',  body: 'Outstanding! You have mastered the Word of God. "Your word is a lamp to my feet." — Psalm 119:105', emoji: '🏆' }
  if (pct >= 80)   return { title: 'Excellent Work!', body: 'You have a strong knowledge of Scripture. Keep studying and growing in the Word!', emoji: '🌟' }
  if (pct >= 60)   return { title: 'Well Done!',      body: 'A solid performance! The more you read, the more you will know. Keep going!', emoji: '📖' }
  if (pct >= 40)   return { title: 'Good Effort!',    body: '"Study to show yourself approved." — 2 Timothy 2:15. Every attempt makes you stronger!', emoji: '💪' }
  return             { title: 'Keep Studying!',        body: 'Do not be discouraged. Every great scholar started at the beginning. The Word rewards persistence!', emoji: '🙏' }
}

export default function KnowledgeHubPage() {
  const [screen, setScreen]             = useState('home')
  const [selectedTier, setSelectedTier] = useState(null)
  const [questions, setQuestions]       = useState([])
  const [current, setCurrent]           = useState(0)
  const [answers, setAnswers]           = useState([])
  const [selected, setSelected]         = useState(null)
  const [score, setScore]               = useState(0)

  // ✅ Progress tracking
  const { logQuiz } = useProgress()

  // ── Start Quiz ──
  const startQuiz = useCallback((tier) => {
    const pool     = ALL_QUESTIONS[tier.id]
    const prepared = shuffle(pool)
      .slice(0, tier.questionCount)
      .map(q => ({ ...q, options: shuffle(q.opts) }))
    setSelectedTier(tier)
    setQuestions(prepared)
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setScore(0)
    setScreen('quiz')
  }, [])

  // ── Select Answer ──
  function handleSelect(option) {
    if (selected !== null) return
    setSelected(option)
  }

  // ── Next Question ──
  function handleNext() {
    if (selected === null) return

    const currentQuestion = questions[current]
    const isCorrect       = selected === currentQuestion.answer

    // ✅ Record every answer to progress tracker
    logQuiz({
      question: currentQuestion.question,
      answer:   selected,
      correct:  isCorrect,
      tier:     selectedTier.id,
    })

    const updatedAnswers = [...answers, selected]
    setAnswers(updatedAnswers)

    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1)
      setSelected(null)
    } else {
      const finalScore = updatedAnswers.reduce(
        (acc, ans, idx) => acc + (ans === questions[idx].answer ? 1 : 0), 0
      )
      setScore(finalScore)
      setScreen('results')
    }
  }

  // ── Restart ──
  function handleRestart() {
    setScreen('home')
    setSelectedTier(null)
    setSelected(null)
    setAnswers([])
    setCurrent(0)
    setScore(0)
  }

  // ────────────────────────────────────────────
  // SCREEN 1 — Home / Tier Selection
  // ────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className="kh-page">
        <div className="kh-home">

          <div className="kh-home__icon">📜</div>
          <h1 className="kh-home__title">Bible Knowledge Exam</h1>
          <p className="kh-home__subtitle">
            Choose your rank and test your knowledge of the Holy Scriptures.
            Questions are shuffled every attempt.
          </p>

          <div className="kh-home__meta">
            <span className="kh-meta-pill">📋 20 Questions Per Tier</span>
            <span className="kh-meta-pill">🔀 Shuffled Every Time</span>
            <span className="kh-meta-pill">⭐ XP Rewards</span>
          </div>

          <div className="kh-tier-grid">
            {TIERS.map(tier => (
              <div
                key={tier.id}
                className="kh-tier-card"
                style={{
                  borderColor:     tier.color,
                  backgroundColor: tier.bgColor,
                }}
                onClick={() => startQuiz(tier)}
              >
                <div className="kh-tier-card__icon">{tier.icon}</div>
                <div
                  className="kh-tier-card__title"
                  style={{ color: tier.color }}
                >
                  {tier.title}
                </div>
                <div className="kh-tier-card__desc">{tier.description}</div>
                <div
                  className="kh-tier-card__footer"
                  style={{ color: tier.color }}
                >
                  {tier.questionCount} Questions · {tier.xpReward} XP
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────
  // SCREEN 2 — Quiz
  // ────────────────────────────────────────────
  if (screen === 'quiz') {
    const q        = questions[current]
    const progress = (current / questions.length) * 100

    return (
      <div className="kh-page">
        <div className="kh-quiz">

          {/* Header */}
          <div className="kh-quiz__header">
            <span
              className="kh-quiz__category"
              style={{ color: selectedTier.color }}
            >
              {selectedTier.icon} {selectedTier.title}
            </span>
            <span className="kh-quiz__counter">
              Question {current + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="kh-progress-track">
            <div
              className="kh-progress-fill"
              style={{
                width:           `${progress}%`,
                backgroundColor: selectedTier.color,
              }}
            />
          </div>

          {/* Question */}
          <div className="kh-question-card">
            <p className="kh-question-text">{q.question}</p>
          </div>

          {/* Options */}
          <div className="kh-options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`kh-option ${selected === opt ? 'kh-option--selected' : ''}`}
                onClick={() => handleSelect(opt)}
                disabled={selected !== null}
                style={
                  selected === opt
                    ? { borderColor: selectedTier.color, backgroundColor: selectedTier.bgColor }
                    : {}
                }
              >
                <span className="kh-option__letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="kh-option__text">{opt}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="kh-quiz__footer">
            <button
              className="kh-next-btn"
              onClick={handleNext}
              disabled={selected === null}
              style={{ backgroundColor: selectedTier.color }}
            >
              {current + 1 === questions.length ? 'Submit Exam' : 'Next Question'}
            </button>
            <p className="kh-no-feedback-note">🔒 Answers revealed at the end</p>
          </div>

        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────
  // SCREEN 3 — Results
  // ────────────────────────────────────────────
  const msg      = getScoreMessage(score, questions.length)
  const pct      = Math.round((score / questions.length) * 100)
  const xpEarned = Math.round((score / questions.length) * selectedTier.xpReward)

  return (
    <div className="kh-page">
      <div className="kh-results">

        {/* Score Circle */}
        <div
          className="kh-score-circle"
          style={{ borderColor: selectedTier.color }}
        >
          <span className="kh-score-circle__emoji">{msg.emoji}</span>
          <span className="kh-score-circle__score">{score}/{questions.length}</span>
          <span className="kh-score-circle__pct">{pct}%</span>
        </div>

        {/* XP Badge */}
        <div
          className="kh-xp-badge"
          style={{ backgroundColor: selectedTier.color }}
        >
          +{xpEarned} XP Earned · {selectedTier.icon} {selectedTier.title}
        </div>

        <h2 className="kh-results__title">{msg.title}</h2>
        <p className="kh-results__message">{msg.body}</p>

        {/* Answer Review */}
        <div className="kh-review">
          <h3 className="kh-review__heading">Answer Review</h3>
          {questions.map((q, idx) => {
            const userAns = answers[idx]
            const correct = userAns === q.answer
            return (
              <div
                key={q.id}
                className={`kh-review-item ${correct ? 'kh-review-item--correct' : 'kh-review-item--wrong'}`}
              >
                <div className="kh-review-item__top">
                  <span className="kh-review-item__num">Q{idx + 1}</span>
                  <span className="kh-review-item__result">
                    {correct ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <p className="kh-review-item__question">{q.question}</p>
                {!correct && (
                  <p className="kh-review-item__correct-ans">
                    Correct answer: <strong>{q.answer}</strong>
                  </p>
                )}
                {!correct && (
                  <p className="kh-review-item__your-ans">
                    Your answer: <strong>{userAns}</strong>
                  </p>
                )}
                <p className="kh-review-item__reference">📖 {q.reference}</p>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="kh-results__actions">
          <button
            className="kh-start-btn"
            style={{ backgroundColor: selectedTier.color }}
            onClick={() => startQuiz(selectedTier)}
          >
            🔄 Retake Exam
          </button>
          <button className="kh-ghost-btn" onClick={handleRestart}>
            🏠 Choose Another Tier
          </button>
        </div>

      </div>
    </div>
  )
}