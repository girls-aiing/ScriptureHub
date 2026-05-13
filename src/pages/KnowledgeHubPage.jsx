import React, { useState, useCallback } from 'react'
import { TIERS } from '../data/tierConfig'
import { followerQuestions }   from '../data/questions/follower'
import { believerQuestions }   from '../data/questions/believer'
import { messengerQuestions }  from '../data/questions/messenger'
import { deaconQuestions }     from '../data/questions/deacon'
import { evangelistQuestions } from '../data/questions/evangelist'
import { visionaryQuestions }  from '../data/questions/visionary'
import { useProgress }         from '../hooks/useProgress'
import { useLanguage }         from '../context/LanguageContext.jsx'

const ALL_QUESTIONS = {
  follower:   followerQuestions,
  believer:   believerQuestions,
  messenger:  messengerQuestions,
  deacon:     deaconQuestions,
  evangelist: evangelistQuestions,
  visionary:  visionaryQuestions,
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getScoreMessage(score, total, t) {
  const pct = (score / total) * 100
  if (pct === 100) return { title: t('correct') + '!',  body: '"Your word is a lamp to my feet." — Psalm 119:105', emoji: '🏆' }
  if (pct >= 80)   return { title: t('correct') + '!',  body: 'You have a strong knowledge of Scripture. Keep studying!', emoji: '🌟' }
  if (pct >= 60)   return { title: 'Well Done!',         body: 'A solid performance! Keep going!', emoji: '📖' }
  if (pct >= 40)   return { title: 'Good Effort!',       body: '"Study to show yourself approved." — 2 Timothy 2:15', emoji: '💪' }
  return             { title: t('tryAgain') + '!',       body: 'Every great scholar started at the beginning. Keep going!', emoji: '🙏' }
}

export default function KnowledgeHubPage() {
  const { t } = useLanguage()
  const [screen, setScreen]             = useState('home')
  const [selectedTier, setSelectedTier] = useState(null)
  const [questions, setQuestions]       = useState([])
  const [current, setCurrent]           = useState(0)
  const [answers, setAnswers]           = useState([])
  const [selected, setSelected]         = useState(null)
  const [score, setScore]               = useState(0)

  const { logQuiz } = useProgress()

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

  function handleSelect(option) {
    setSelected(selected === option ? null : option)
  }

  function handleNext() {
    if (selected === null) return
    const currentQuestion = questions[current]
    const isCorrect       = selected === currentQuestion.answer
    logQuiz({ question: currentQuestion.question, answer: selected, correct: isCorrect, tier: selectedTier.id })
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

  function handleRestart() {
    setScreen('home')
    setSelectedTier(null)
    setSelected(null)
    setAnswers([])
    setCurrent(0)
    setScore(0)
  }

  // ── HOME ──────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className="kh-page">
        <div className="kh-home">
          <div className="kh-home__icon">📜</div>
          <h1 className="kh-home__title">{t('knowledgeHub')}</h1>
          <p className="kh-home__subtitle">
            {t('selectLanguage')} — {t('difficulty')} — {t('startQuiz')}
          </p>
          <div className="kh-home__meta">
            <span className="kh-meta-pill">📋 20 {t('nextQuestion').split(' ')[1] || 'Questions'} Per Tier</span>
            <span className="kh-meta-pill">🔀 Shuffled Every Time</span>
            <span className="kh-meta-pill">⭐ XP Rewards</span>
          </div>
          <div className="kh-tier-grid">
            {TIERS.map(tier => (
              <div
                key={tier.id}
                className="kh-tier-card"
                style={{ borderColor: tier.color, backgroundColor: tier.bgColor }}
                onClick={() => startQuiz(tier)}
              >
                <div className="kh-tier-card__icon">{tier.icon}</div>
                <div className="kh-tier-card__title" style={{ color: tier.color }}>{tier.title}</div>
                <div className="kh-tier-card__desc">{tier.description}</div>
                <div className="kh-tier-card__footer" style={{ color: tier.color }}>
                  {tier.questionCount} Questions · {tier.xpReward} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ ──────────────────────────────────────────────────────
  if (screen === 'quiz') {
    const q        = questions[current]
    const progress = (current / questions.length) * 100
    return (
      <div className="kh-page">
        <div className="kh-quiz">
          <div className="kh-quiz__header">
            <span className="kh-quiz__category" style={{ color: selectedTier.color }}>
              {selectedTier.icon} {selectedTier.title}
            </span>
            <span className="kh-quiz__counter">
              {t('nextQuestion').replace('Next', '')} {current + 1} / {questions.length}
            </span>
          </div>
          <div className="kh-progress-track">
            <div className="kh-progress-fill" style={{ width: `${progress}%`, backgroundColor: selectedTier.color }} />
          </div>
          <div className="kh-question-card">
            <p className="kh-question-text">{q.question}</p>
          </div>
          <div className="kh-options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`kh-option ${selected === opt ? 'kh-option--selected' : ''}`}
                onClick={() => handleSelect(opt)}
                style={selected === opt ? { borderColor: selectedTier.color, backgroundColor: selectedTier.bgColor } : {}}
              >
                <span className="kh-option__letter">{String.fromCharCode(65 + i)}</span>
                <span className="kh-option__text">{opt}</span>
              </button>
            ))}
          </div>
          <div className="kh-quiz__footer">
            <button
              className="kh-next-btn"
              onClick={handleNext}
              disabled={selected === null}
              style={{ backgroundColor: selectedTier.color }}
            >
              {current + 1 === questions.length ? t('submit') : t('nextQuestion')}
            </button>
            <p className="kh-no-feedback-note">🔒 {t('incorrect')} answers revealed at the end</p>
          </div>
        </div>
      </div>
    )
  }

  // ── RESULTS ───────────────────────────────────────────────────
  const msg      = getScoreMessage(score, questions.length, t)
  const pct      = Math.round((score / questions.length) * 100)
  const xpEarned = Math.round((score / questions.length) * selectedTier.xpReward)

  return (
    <div className="kh-page">
      <div className="kh-results">
        <div className="kh-score-circle" style={{ borderColor: selectedTier.color }}>
          <span className="kh-score-circle__emoji">{msg.emoji}</span>
          <span className="kh-score-circle__score">{score}/{questions.length}</span>
          <span className="kh-score-circle__pct">{pct}%</span>
        </div>
        <div className="kh-xp-badge" style={{ backgroundColor: selectedTier.color }}>
          +{xpEarned} XP · {selectedTier.icon} {selectedTier.title}
        </div>
        <h2 className="kh-results__title">{msg.title}</h2>
        <p className="kh-results__message">{msg.body}</p>

        <div className="kh-review">
          <h3 className="kh-review__heading">📖 {t('bible')} Review</h3>
          {questions.map((q, idx) => {
            const userAns = answers[idx]
            const correct = userAns === q.answer
            return (
              <div key={q.id} className={`kh-review-item ${correct ? 'kh-review-item--correct' : 'kh-review-item--wrong'}`}>
                <div className="kh-review-item__top">
                  <span className="kh-review-item__num">Q{idx + 1}</span>
                  <span className="kh-review-item__result">
                    {correct ? `✓ ${t('correct')}` : `✗ ${t('incorrect')}`}
                  </span>
                </div>
                <p className="kh-review-item__question">{q.question}</p>
                {!correct && (
                  <p className="kh-review-item__correct-ans">
                    {t('correct')}: <strong>{q.answer}</strong>
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

        <div className="kh-results__actions">
          <button
            className="kh-start-btn"
            style={{ backgroundColor: selectedTier.color }}
            onClick={() => startQuiz(selectedTier)}
          >
            🔄 {t('tryAgain')}
          </button>
          <button className="kh-ghost-btn" onClick={handleRestart}>
            🏠 {t('back')}
          </button>
        </div>
      </div>
    </div>
  )
}