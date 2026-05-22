import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setDisplayName(user.user_metadata?.display_name || '')
      }
    }
    getProfile()
  }, [])

  async function handleUpdateProfile(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    })

    setLoading(false)
    if (error) {
      setMessage(`❌ Update failed: ${error.message}`)
    } else {
      setUser(data.user)
      setMessage('✅ Profile update saved successfully!')
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error.message)
  }

  if (!user) return <p style={{ textAlign: 'center', marginTop: '4rem', fontFamily: 'Georgia, serif' }}>Loading account details...</p>

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e0d8c8', fontFamily: 'Georgia, serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e0d8c8', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1a1a2e', margin: 0, fontWeight: '800' }}>👤 Account Profile</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Manage your account settings</p>
        </div>
        <button onClick={handleSignOut} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#e74c3c', border: '2px solid #e74c3c', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          Sign Out
        </button>
      </div>

      <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '#0.5rem' }}>Account UUID</label>
          <input type="text" value={user.id} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0d8c8', background: '#f5f0e8', color: '#666', cursor: 'not-allowed', fontFamily: 'monospace', fontSize: '0.85rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '#0.5rem' }}>Email Address</label>
          <input type="email" value={user.email} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0d8c8', background: '#f5f0e8', color: '#666', cursor: 'not-allowed' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '#0.5rem' }}>Display Name / Handle</label>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Enter your display name" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #c9a84c', outline: 'none' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '0.85rem 1.5rem', background: 'linear-gradient(135deg, #c9a84c, #a07830)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', alignSelf: 'flex-start' }}>
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', background: message.startsWith('❌') ? '#fce8e6' : '#e6f4ea', color: message.startsWith('❌') ? '#c5221f' : '#137333', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center' }}>
          {message}
        </div>
      )}
    </div>
  )
}