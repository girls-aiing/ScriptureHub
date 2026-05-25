import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage({ onNavigateToLogin }) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2b6cb0' }}>Welcome to ScriptureHub</h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>Your personal digital companion for exploring, studying, and archiving sacred texts.</p>
      </header>

      <section style={{ background: '#f7fafc', padding: '30px', borderRadius: '8px', marginBottom: '40px', textAlign: 'left' }}>
        <h3 style={{ color: '#2d3748' }}>What you can do here:</h3>
        <ul style={{ lineHeight: '1.8', color: '#4a5568' }}>
          <li>📖 <strong>Explore Texts:</strong> Access cross-referenced study libraries easily.</li>
          <li>📝 <strong>Personal Journaling:</strong> Save your deep insights, historical context notes, and prayers.</li>
          <li>👥 <strong>Community Insights:</strong> Share highlights safely with your study circles.</li>
        </ul>
      </section>

      <div>
        <p style={{ color: '#718096', marginBottom: '20px' }}>Want to see what ScriptureHub is all about before signing up?</p>
        <Link
          to="/about"
          style={{ display: 'inline-block', textDecoration: 'none', background: 'transparent', color: '#2b6cb0', border: '1px solid #2b6cb0', padding: '10px 20px', borderRadius: '5px', marginRight: '10px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}
        >
          ℹ️ Read About Us
        </Link>
        
        <p style={{ color: '#718096', marginTop: '10px', marginBottom: '20px' }}>Ready to start your structured study journey?</p>
        <button 
          onClick={onNavigateToLogin}
          style={{ background: '#3182ce', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Get Started / Sign In
        </button>
      </div>
    </div>
  );
}