import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  async function handleAuth(e) {
    e.preventDefault()
    setMessage('')

    if (isSignUp) {
      // ── SUPABASE SIGN UP ENGINE ──
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(`❌ Error: ${error.message}`)
      else setMessage('🙏 Registration successful! Check your email for a confirmation link.')
    } else {
      // ── SUPABASE SIGN IN ENGINE ──
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(`❌ Error: ${error.message}`)
      else setMessage('✅ Welcome back to ScriptureHub!')
    }
  }

  return (
    <div style={{ maxWidth: '420px', margin: '6rem auto', padding: '2.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e0d8c8', fontFamily: 'Georgia, serif', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '2.5rem' }}>🕊️</span>
        <h2 style={{ color: '#1a1a2e', marginTop: '0.5rem', fontWeight: '800' }}>
          {isSignUp ? 'Create an Altar Account' : 'Enter ScriptureHub'}
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
          {isSignUp ? 'Join our global community of scripture study' : 'Sign in to access your prayers and dream logs'}
        </p>
      </div>

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.4rem' }}>Email Address</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #c9a84c', outline: 'none', fontFamily: 'Georgia, serif' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.4rem' }}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #c9a84c', outline: 'none', fontFamily: 'Georgia, serif' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #c9a84c, #a07830)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '8px', background: message.startsWith('❌') ? '#fce8e6' : '#e6f4ea', color: message.startsWith('❌') ? '#c5221f' : '#137333', fontSize: '0.88rem', textAlign: 'center', fontWeight: '600' }}>
          {message}
        </div>
      )}

      <div style={{ borderTop: '1px solid #e0d8c8', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center' }}>
        <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMessage('') }} style={{ background: 'none', border: 'none', color: '#c9a84c', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Georgia, serif' }}>
          {isSignUp ? 'Already have an account? Log In' : "Don't have an account yet? Sign Up"}
        </button>
      </div>
    </div>
  )
}