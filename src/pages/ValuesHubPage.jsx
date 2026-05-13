import React, { useState, useMemo } from 'react'

// ══════════════════════════════════════════════════════════════════
// DATA — Values, Scriptures & Practical Tips
// ══════════════════════════════════════════════════════════════════
const VALUES = [
  {
    id: 'diligence',
    icon: '⚒️',
    title: 'Diligence & Hard Work',
    color: '#f0c040',
    category: 'Character',
    intro: 'The Bible consistently honours those who work with their hands and minds. Diligence is not just a virtue — it is a pathway to dignity and provision.',
    scriptures: [
      { ref: 'Proverbs 10:4', text: 'Lazy hands make for poverty, but diligent hands bring wealth.' },
      { ref: 'Proverbs 22:29', text: 'Do you see someone skilled in their work? They will serve before kings; they will not serve before officials of low rank.' },
      { ref: 'Colossians 3:23', text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.' },
      { ref: 'Ecclesiastes 9:10', text: 'Whatever your hand finds to do, do it with all your might.' },
    ],
    tips: [
      { title: 'Start a Small Trade', body: 'Identify one skill you already have — tailoring, phone repair, cooking, farming. Start small. Sell to your immediate community before expanding.' },
      { title: 'The 1-Hour Rule', body: 'Spend at least one focused hour every day improving your skill or business. Consistency over months builds mastery.' },
      { title: 'Keep a Work Journal', body: 'Write down what you did each day, what worked, and what did not. This simple habit separates successful traders from struggling ones.' },
      { title: 'Avoid Time Thieves', body: 'Identify the habits that steal your productive hours — excessive social media, idle gatherings. Replace them with income-generating activities.' },
    ],
  },
  {
    id: 'integrity',
    icon: '🛡️',
    title: 'Integrity & Honesty',
    color: '#4caf50',
    category: 'Character',
    intro: 'In business and in life, your reputation is your greatest asset. Integrity means your word is your bond — and that builds lasting trust.',
    scriptures: [
      { ref: 'Proverbs 11:3', text: 'The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity.' },
      { ref: 'Luke 16:10', text: 'Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.' },
      { ref: 'Proverbs 12:17', text: 'An honest witness tells the truth, but a false witness tells lies.' },
      { ref: 'Psalm 15:4', text: '...who keeps an oath even when it hurts, and does not change their mind.' },
    ],
    tips: [
      { title: 'Never Falsify Weights or Prices', body: 'In markets across Ogbia and beyond, traders who cheat on measurements lose customers permanently. Honest dealing builds a loyal customer base that returns and refers others.' },
      { title: 'Honour Every Agreement', body: 'If you promise delivery on Tuesday, deliver on Tuesday. If you cannot, communicate early. Reliability is rare and therefore extremely valuable.' },
      { title: 'Separate Business Money', body: 'Keep your business funds separate from personal funds. This is a form of financial integrity that prevents collapse and builds trust with partners.' },
      { title: 'Admit Mistakes Quickly', body: 'When you make an error — wrong change, late delivery, poor quality — admit it immediately and correct it. This builds more trust than if the mistake never happened.' },
    ],
  },
  {
    id: 'wisdom',
    icon: '🧠',
    title: 'Wisdom & Good Decisions',
    color: '#9c27b0',
    category: 'Mind',
    intro: 'Wisdom is the ability to make good decisions with the knowledge you have. The Bible says it is more valuable than silver or gold — and it is available to anyone who asks.',
    scriptures: [
      { ref: 'Proverbs 4:7', text: 'The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.' },
      { ref: 'James 1:5', text: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.' },
      { ref: 'Proverbs 13:20', text: 'Walk with the wise and become wise, for a companion of fools suffers harm.' },
      { ref: 'Proverbs 15:22', text: 'Plans fail for lack of counsel, but with many advisers they succeed.' },
    ],
    tips: [
      { title: 'Find a Mentor', body: 'Identify one successful person in your field — a farmer, trader, teacher, or entrepreneur — and ask if you can learn from them. Most successful people are willing to share if you ask respectfully.' },
      { title: 'Read One Book Per Month', body: 'A single practical book on business, farming, or a trade skill per month will put you years ahead of your peers within five years.' },
      { title: 'The 10-10-10 Rule', body: 'Before any major decision, ask: How will I feel about this in 10 minutes? 10 months? 10 years? This simple test filters out impulsive choices.' },
      { title: 'Learn from Failure', body: 'Every failed attempt contains a lesson. Write down what went wrong and why. The youth who treats failure as a teacher will eventually succeed.' },
    ],
  },
  {
    id: 'entrepreneurship',
    icon: '🌱',
    title: 'Entrepreneurship & Initiative',
    color: '#ff9800',
    category: 'Business',
    intro: 'The Bible celebrates those who take initiative. The Proverbs 31 woman is one of history\'s first recorded entrepreneurs. God honours creative work that serves others.',
    scriptures: [
      { ref: 'Proverbs 31:16', text: 'She considers a field and buys it; out of her earnings she plants a vineyard.' },
      { ref: 'Matthew 25:14–15', text: 'A man going on a journey called his servants and entrusted his wealth to them — each according to his ability.' },
      { ref: 'Genesis 1:28', text: 'God blessed them and said to them, "Be fruitful and increase in number; fill the earth and subdue it."' },
      { ref: 'Proverbs 24:27', text: 'Put your outdoor work in order and get your fields ready; after that, build your house.' },
    ],
    tips: [
      { title: 'Start With What You Have', body: 'You do not need capital to start. Start with your skill, your time, or your knowledge. Many successful businesses in Nigeria started with zero naira and one idea.' },
      { title: 'Solve a Local Problem', body: 'Look around your community. What do people need that is hard to get? Clean water delivery, phone charging, food processing, tutoring — every gap is a business opportunity.' },
      { title: 'The Minimum Viable Product', body: 'Do not wait until everything is perfect. Start the smallest possible version of your idea, test it, get feedback, and improve. Action beats planning every time.' },
      { title: 'Agriculture Is Wealth', body: 'In Ogbia and the Niger Delta, the land and waterways are rich. Catfish farming, cassava processing, vegetable gardening, and palm oil production are proven income sources with low startup costs.' },
    ],
  },
  {
    id: 'stewardship',
    icon: '💰',
    title: 'Stewardship & Money Management',
    color: '#2196f3',
    category: 'Business',
    intro: 'God calls us to be faithful managers of what He gives us — not just spiritually, but financially. Good stewardship is the foundation of lasting wealth.',
    scriptures: [
      { ref: 'Luke 16:11', text: 'So if you have not been trustworthy in handling worldly wealth, who will trust you with true riches?' },
      { ref: 'Proverbs 21:20', text: 'The wise store up choice food and olive oil, but fools gulp theirs down.' },
      { ref: 'Proverbs 13:11', text: 'Dishonest money dwindles away, but whoever gathers money little by little makes it grow.' },
      { ref: 'Matthew 25:21', text: '"Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things."' },
    ],
    tips: [
      { title: 'The 70-20-10 Rule', body: 'Of every income: spend 70% on needs, save 20% for the future, and give 10% (tithe or charity). This simple formula, practised consistently, builds financial stability over time.' },
      { title: 'Save Before You Spend', body: 'The moment you receive any income, set aside your savings first — before buying anything. This reverses the habit of saving "what is left over" (which is usually nothing).' },
      { title: 'Join a Cooperative', body: 'Cooperatives and thrift groups (ajo/esusu) are powerful savings tools common in Nigerian communities. Pool resources with trusted people to access larger capital than you could alone.' },
      { title: 'Avoid Debt for Consumption', body: 'Only borrow money to invest in something that will generate more money than the loan costs. Never borrow to buy food, clothes, or phones. That is a trap.' },
    ],
  },
  {
    id: 'leadership',
    icon: '👑',
    title: 'Leadership & Service',
    color: '#e91e63',
    category: 'Community',
    intro: 'True leadership in the Kingdom of God is servant leadership. The greatest leaders in history — and in your community — are those who serve others well.',
    scriptures: [
      { ref: 'Mark 10:43–44', text: '"Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all."' },
      { ref: 'Proverbs 11:14', text: 'For lack of guidance a nation falls, but victory is won through many advisers.' },
      { ref: '1 Timothy 4:12', text: 'Don\'t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.' },
      { ref: 'Nehemiah 2:17', text: 'Then I said to them, "You see the trouble we are in... Come, let us rebuild the wall of Jerusalem, and we will no longer be in disgrace."' },
    ],
    tips: [
      { title: 'Lead Your Age Group First', body: 'You do not need a title to lead. Organise a clean-up, start a study group, coordinate a community project. Leadership is demonstrated, not declared.' },
      { title: 'Develop Communication Skills', body: 'The ability to speak clearly and write well is one of the highest-value skills in any economy. Practice public speaking. Write letters, proposals, and reports. These skills open doors.' },
      { title: 'Build Others Up', body: 'A true leader makes the people around them better. Share knowledge freely. Mentor younger people. Your influence multiplies when you invest in others.' },
      { title: 'Understand Local Government', body: 'Learn how your LGA, ward, and community development committees work. Young people who understand governance can access grants, contracts, and opportunities invisible to others.' },
    ],
  },
  {
    id: 'perseverance',
    icon: '🔥',
    title: 'Perseverance & Resilience',
    color: '#ff5722',
    category: 'Character',
    intro: 'In a challenging environment like the Niger Delta, resilience is not optional — it is essential. The Bible is full of people who succeeded not because life was easy, but because they refused to quit.',
    scriptures: [
      { ref: 'Romans 5:3–4', text: 'We also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.' },
      { ref: 'Galatians 6:9', text: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.' },
      { ref: 'James 1:2–4', text: 'Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.' },
      { ref: 'Isaiah 40:31', text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
    ],
    tips: [
      { title: 'Reframe Failure', body: 'Every successful entrepreneur, farmer, and leader failed multiple times before succeeding. Failure is not the opposite of success — it is part of the path. Ask: "What did this teach me?"' },
      { title: 'Build a Support Circle', body: 'Surround yourself with at least three people who believe in your potential and will speak truth to you. Isolation amplifies discouragement. Community amplifies resilience.' },
      { title: 'Celebrate Small Wins', body: 'When you complete a goal — however small — acknowledge it. This trains your brain to associate effort with reward and keeps motivation alive during long journeys.' },
      { title: 'Protect Your Mental Health', body: 'Resilience is not about suppressing pain. Pray, talk to trusted people, rest when needed, and seek help when overwhelmed. A healthy mind is your most important asset.' },
    ],
  },
  {
    id: 'education',
    icon: '📚',
    title: 'Education & Self-Development',
    color: '#00bcd4',
    category: 'Mind',
    intro: 'Education is not limited to classrooms. The Bible honours those who seek knowledge and grow continuously. In today\'s world, learning is a lifelong competitive advantage.',
    scriptures: [
      { ref: 'Hosea 4:6', text: '"My people are destroyed from lack of knowledge."' },
      { ref: 'Proverbs 1:5', text: 'Let the wise listen and add to their learning, and let the discerning get guidance.' },
      { ref: 'Daniel 1:17', text: 'To these four young men God gave knowledge and understanding of all kinds of literature and learning.' },
      { ref: '2 Timothy 2:15', text: 'Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.' },
    ],
    tips: [
      { title: 'Use Free Online Learning', body: 'YouTube, Khan Academy, Coursera, and Google Digital Skills for Africa offer world-class education for free. A smartphone and data connection is a university in your pocket.' },
      { title: 'Learn a Digital Skill', body: 'Graphic design, video editing, social media management, data entry, and copywriting can all be learned online and done remotely. These skills earn in naira and dollars.' },
      { title: 'Master English and Maths', body: 'These two subjects unlock every other opportunity — university admission, job applications, business proposals, and international work. Invest extra time in them.' },
      { title: 'Teach What You Learn', body: 'The fastest way to master any subject is to teach it to someone else. Start a small study group. Tutor younger students. Teaching deepens your own understanding.' },
    ],
  },
  {
    id: 'community',
    icon: '🤝',
    title: 'Community & Togetherness',
    color: '#8bc34a',
    category: 'Community',
    intro: 'African communal values and Biblical community values are deeply aligned. No one succeeds alone. The strength of Ogbia — and every community — lies in its people working together.',
    scriptures: [
      { ref: 'Ecclesiastes 4:9–10', text: 'Two are better than one, because they have a good return for their labour: If either of them falls down, one can help the other up.' },
      { ref: 'Acts 2:44–45', text: 'All the believers were together and had everything in common. They sold property and possessions to give to anyone who had need.' },
      { ref: 'Proverbs 27:17', text: 'As iron sharpens iron, so one person sharpens another.' },
      { ref: 'Romans 12:10', text: 'Be devoted to one another in love. Honour one another above yourselves.' },
    ],
    tips: [
      { title: 'Start or Join a Youth Group', body: 'Organised youth groups can access government grants, NGO funding, and community contracts that individuals cannot. Register your group formally with your LGA.' },
      { title: 'Pool Skills, Not Just Money', body: 'One person can design, another can sell, another can produce. Identify complementary skills in your circle and build something together that none of you could build alone.' },
      { title: 'Invest in Your Community', body: 'When your community thrives, you thrive. Volunteer, clean public spaces, support local businesses, and participate in community decisions. Your environment shapes your future.' },
      { title: 'Resolve Conflicts Quickly', body: 'Unresolved conflict destroys partnerships and communities. Address disagreements early, directly, and respectfully. A community that resolves conflict well is a community that grows.' },
    ],
  },
]

const CATEGORIES = ['All', 'Character', 'Business', 'Mind', 'Community']

// ══════════════════════════════════════════════════════════════════
// FONT & ANIMATIONS
// ══════════════════════════════════════════════════════════════════
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`
const ANIM = `
  @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow    { 0%,100% { box-shadow: 0 0 12px rgba(240,192,64,0.2); } 50% { box-shadow: 0 0 28px rgba(240,192,64,0.45); } }
  @keyframes pulse   { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
`

// ══════════════════════════════════════════════════════════════════
// VALUE DETAIL VIEW
// ══════════════════════════════════════════════════════════════════
function ValueDetail({ value, onBack }) {
  const [tab, setTab] = useState('scripture') // 'scripture' | 'tips'

  return (
    <div style={s.detailPage}>
      <button style={s.backBtn} onClick={onBack}>← Back to Values</button>

      {/* Hero */}
      <div style={{ ...s.detailHero, borderColor: value.color + '55' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{value.icon}</div>
        <div style={{ ...s.catTag, background: value.color + '22', color: value.color, borderColor: value.color + '55' }}>
          {value.category}
        </div>
        <h1 style={{ ...s.detailTitle, color: value.color }}>{value.title}</h1>
        <p style={s.detailIntro}>{value.intro}</p>
      </div>

      {/* Tab switcher */}
      <div style={s.tabRow}>
        <button
          style={{ ...s.tabBtn, ...(tab === 'scripture' ? { ...s.tabBtnOn, borderColor: value.color, color: value.color } : {}) }}
          onClick={() => setTab('scripture')}>
          📖 Scriptures ({value.scriptures.length})
        </button>
        <button
          style={{ ...s.tabBtn, ...(tab === 'tips' ? { ...s.tabBtnOn, borderColor: value.color, color: value.color } : {}) }}
          onClick={() => setTab('tips')}>
          💡 Practical Tips ({value.tips.length})
        </button>
      </div>

      {/* Scripture tab */}
      {tab === 'scripture' && (
        <div style={s.cardList}>
          {value.scriptures.map((sc, i) => (
            <div key={i} style={{ ...s.scriptureCard, borderLeftColor: value.color }}>
              <div style={{ ...s.scriptureRef, color: value.color }}>{sc.ref}</div>
              <p style={s.scriptureText}>"{sc.text}"</p>
              <button style={s.copyBtn}
                onClick={() => navigator.clipboard.writeText(`"${sc.text}" — ${sc.ref}`)}>
                📋 Copy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tips tab */}
      {tab === 'tips' && (
        <div style={s.cardList}>
          {value.tips.map((tip, i) => (
            <div key={i} style={{ ...s.tipCard, borderLeftColor: value.color }}>
              <div style={s.tipNum}>{i + 1}</div>
              <div style={s.tipContent}>
                <div style={{ ...s.tipTitle, color: value.color }}>{tip.title}</div>
                <p style={s.tipBody}>{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Combined view teaser */}
      <div style={{ ...s.combinedBox, borderColor: value.color + '44' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
        <p style={s.combinedText}>
          <strong style={{ color: value.color }}>Remember:</strong> These scriptures and tips work together.
          The Word of God gives you the <em>why</em> — the practical tips give you the <em>how</em>.
          Apply both and watch your life transform.
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function ValuesHubPage() {
  const [selected,  setSelected]  = useState(null)
  const [category,  setCategory]  = useState('All')
  const [search,    setSearch]    = useState('')
  const [toast,     setToast]     = useState(null)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2400) }

  const filtered = useMemo(() => {
    let list = VALUES
    if (category !== 'All') list = list.filter(v => v.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.scriptures.some(sc => sc.text.toLowerCase().includes(q) || sc.ref.toLowerCase().includes(q)) ||
        v.tips.some(t => t.title.toLowerCase().includes(q))
      )
    }
    return list
  }, [category, search])

  // ── Detail view ──────────────────────────────────────────────
  if (selected) {
    return (
      <div style={s.page}>
        <style>{FONT + ANIM}</style>
        <ValueDetail value={selected} onBack={() => setSelected(null)} />
      </div>
    )
  }

  // ── Main list view ───────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{FONT + ANIM}</style>

      {toast && <div style={s.toast}>{toast}</div>}

      {/* Hero banner */}
      <div style={s.heroBanner}>
        <div style={s.heroIcon}>🌟</div>
        <h1 style={s.heroTitle}>Values for Success</h1>
        <p style={s.heroSub}>
          Where the Word of God meets real life in Ogbia and beyond.
          <br />
          Discover Biblical principles paired with practical wisdom for your daily success.
        </p>
        <div style={s.heroStats}>
          <div style={s.heroStat}><span style={s.heroStatNum}>{VALUES.length}</span><span style={s.heroStatLabel}>Life Values</span></div>
          <div style={s.heroStatDiv} />
          <div style={s.heroStat}><span style={s.heroStatNum}>{VALUES.reduce((a,v)=>a+v.scriptures.length,0)}</span><span style={s.heroStatLabel}>Scriptures</span></div>
          <div style={s.heroStatDiv} />
          <div style={s.heroStat}><span style={s.heroStatNum}>{VALUES.reduce((a,v)=>a+v.tips.length,0)}</span><span style={s.heroStatLabel}>Practical Tips</span></div>
        </div>
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search values, scriptures, or tips…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button style={s.searchClear} onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Category filter */}
      <div style={s.catRow}>
        {CATEGORIES.map(c => (
          <button key={c}
            style={{ ...s.catPill, ...(category === c ? s.catPillOn : {}) }}
            onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div style={s.resultRow}>
        <span style={s.resultCount}>{filtered.length} value{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Value cards grid */}
      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          No values match your search.
          <br />
          <button style={{ ...s.backBtn, marginTop: '1rem' }}
            onClick={() => { setSearch(''); setCategory('All') }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((v, i) => (
            <button
              key={v.id}
              style={{
                ...s.card,
                borderColor: v.color + '44',
                animationDelay: `${i * 0.06}s`,
              }}
              onClick={() => setSelected(v)}
            >
              {/* Card top */}
              <div style={s.cardTop}>
                <div style={{ ...s.cardIcon, background: v.color + '18' }}>{v.icon}</div>
                <div style={{ ...s.catTag, background: v.color + '18', color: v.color, borderColor: v.color + '44' }}>
                  {v.category}
                </div>
              </div>

              {/* Title */}
              <h2 style={{ ...s.cardTitle, color: v.color }}>{v.title}</h2>

              {/* Intro snippet */}
              <p style={s.cardSnippet}>
                {v.intro.length > 100 ? v.intro.slice(0, 100) + '…' : v.intro}
              </p>

              {/* Featured scripture */}
              <div style={{ ...s.featuredVerse, borderLeftColor: v.color }}>
                <div style={{ ...s.featuredRef, color: v.color }}>{v.scriptures[0].ref}</div>
                <div style={s.featuredText}>
                  "{v.scriptures[0].text.length > 80
                    ? v.scriptures[0].text.slice(0, 80) + '…'
                    : v.scriptures[0].text}"
                </div>
              </div>

              {/* Footer */}
              <div style={s.cardFooter}>
                <span style={s.cardMeta}>📖 {v.scriptures.length} scriptures</span>
                <span style={s.cardMeta}>💡 {v.tips.length} tips</span>
                <span style={{ ...s.cardCta, color: v.color }}>Explore →</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Bottom encouragement */}
      <div style={s.bottomBanner}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🙏</div>
        <h3 style={s.bottomTitle}>Built for Youth Like You</h3>
        <p style={s.bottomText}>
          Whether you are in Ogbia, Port Harcourt, Lagos, or anywhere in the world —
          these principles work. The Bible has guided people from poverty to prosperity,
          from obscurity to influence, for thousands of years.
          <br /><br />
          <strong style={{ color: '#f0c040' }}>Your story is not finished. Start today.</strong>
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════
const s = {
  page:           { background:'#0d0800', minHeight:'100vh', color:'#f0e6d2',
                    padding:'2rem 1rem', fontFamily:"'Crimson Text', serif" },

  // ── Hero ──
  heroBanner:     { textAlign:'center', maxWidth:'720px', margin:'0 auto 2.5rem',
                    padding:'2.5rem 1.5rem', borderRadius:'20px',
                    background:'linear-gradient(135deg, rgba(240,192,64,0.08), rgba(255,87,34,0.05))',
                    border:'1px solid rgba(240,192,64,0.2)',
                    animation:'glow 4s ease-in-out infinite' },
  heroIcon:       { fontSize:'4rem', marginBottom:'1rem' },
  heroTitle:      { color:'#f0c040', fontSize:'2.8rem', fontWeight:'700',
                    margin:'0 0 1rem', lineHeight:'1.2' },
  heroSub:        { color:'#c8a96e', fontSize:'1.1rem', lineHeight:'1.8',
                    margin:'0 0 2rem', fontStyle:'italic' },
  heroStats:      { display:'flex', justifyContent:'center', alignItems:'center',
                    gap:'1.5rem', flexWrap:'wrap' },
  heroStat:       { display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' },
  heroStatNum:    { color:'#f0c040', fontSize:'2rem', fontWeight:'700', lineHeight:'1' },
  heroStatLabel:  { color:'#c8a96e', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.08em' },
  heroStatDiv:    { width:'1px', height:'40px', background:'rgba(240,192,64,0.3)' },

  // ── Search & Filter ──
  searchWrap:     { position:'relative', maxWidth:'560px', margin:'0 auto 1.5rem',
                    display:'flex', alignItems:'center' },
  searchIcon:     { position:'absolute', left:'14px', fontSize:'1rem', pointerEvents:'none' },
  searchInput:    { width:'100%', padding:'12px 40px 12px 42px', borderRadius:'30px',
                    border:'1px solid rgba(240,192,64,0.4)',
                    background:'rgba(255,255,255,0.05)', color:'#f0e6d2',
                    fontFamily:"'Crimson Text',serif", fontSize:'1.05rem',
                    outline:'none', boxSizing:'border-box' },
  searchClear:    { position:'absolute', right:'14px', background:'none', border:'none',
                    color:'#c8a96e', cursor:'pointer', fontSize:'1rem' },
  catRow:         { display:'flex', flexWrap:'wrap', gap:'8px',
                    justifyContent:'center', marginBottom:'1.5rem' },
  catPill:        { padding:'7px 18px', borderRadius:'20px',
                    border:'1px solid rgba(240,192,64,0.3)', background:'transparent',
                    color:'#c8a96e', cursor:'pointer', fontFamily:'inherit', fontSize:'0.9rem',
                    transition:'all 0.2s' },
  catPillOn:      { background:'rgba(240,192,64,0.15)', border:'1px solid #f0c040',
                    color:'#f0c040', fontWeight:'700' },
  resultRow:      { textAlign:'center', marginBottom:'1.5rem' },
  resultCount:    { color:'#c8a96e', fontStyle:'italic', fontSize:'0.95rem' },

  // ── Grid ──
  grid:           { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
                    gap:'18px', maxWidth:'1000px', margin:'0 auto 3rem' },
  card:           { padding:'1.6rem', background:'rgba(255,255,255,0.04)',
                    border:'1px solid', borderRadius:'16px', cursor:'pointer',
                    textAlign:'left', fontFamily:'inherit', color:'#f0e6d2',
                    transition:'transform 0.2s, box-shadow 0.2s',
                    animation:'fadeUp 0.4s ease both' },
  cardTop:        { display:'flex', justifyContent:'space-between',
                    alignItems:'flex-start', marginBottom:'1rem' },
  cardIcon:       { width:'52px', height:'52px', borderRadius:'14px',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.8rem', flexShrink:0 },
  catTag:         { padding:'3px 10px', borderRadius:'12px', border:'1px solid',
                    fontSize:'0.75rem', fontWeight:'700', textTransform:'uppercase',
                    letterSpacing:'0.06em' },
  cardTitle:      { fontSize:'1.25rem', fontWeight:'700', margin:'0 0 0.6rem',
                    lineHeight:'1.3' },
  cardSnippet:    { color:'#c8a96e', fontSize:'0.9rem', lineHeight:'1.6',
                    margin:'0 0 1rem', fontStyle:'italic' },
  featuredVerse:  { background:'rgba(255,255,255,0.04)', borderLeft:'3px solid',
                    borderRadius:'0 8px 8px 0', padding:'0.75rem 1rem', marginBottom:'1rem' },
  featuredRef:    { fontSize:'0.78rem', fontWeight:'700', marginBottom:'4px',
                    textTransform:'uppercase', letterSpacing:'0.06em' },
  featuredText:   { color:'#f0e6d2', fontSize:'0.92rem', lineHeight:'1.5', fontStyle:'italic' },
  cardFooter:     { display:'flex', justifyContent:'space-between', alignItems:'center',
                    flexWrap:'wrap', gap:'6px', paddingTop:'0.75rem',
                    borderTop:'1px solid rgba(255,255,255,0.08)' },
  cardMeta:       { color:'#7a6040', fontSize:'0.8rem' },
  cardCta:        { fontSize:'0.88rem', fontWeight:'700' },

  // ── Detail page ──
  detailPage:     { maxWidth:'760px', margin:'0 auto' },
  backBtn:        { background:'transparent', border:'none', color:'#c8a96e',
                    cursor:'pointer', fontSize:'1rem', fontFamily:'inherit',
                    padding:'6px 0', marginBottom:'1.5rem', display:'block' },
  detailHero:     { textAlign:'center', padding:'2rem 1.5rem', borderRadius:'16px',
                    border:'1px solid', background:'rgba(255,255,255,0.03)',
                    marginBottom:'2rem' },
  detailTitle:    { fontSize:'2.2rem', fontWeight:'700', margin:'0.75rem 0 1rem',
                    lineHeight:'1.2' },
  detailIntro:    { color:'#c8a96e', fontSize:'1.05rem', lineHeight:'1.8',
                    fontStyle:'italic', margin:0 },

  // ── Tabs ──
  tabRow:         { display:'flex', gap:'12px', marginBottom:'2rem',
                    justifyContent:'center', flexWrap:'wrap' },
  tabBtn:         { padding:'10px 24px', borderRadius:'25px',
                    border:'1px solid rgba(240,192,64,0.3)', background:'transparent',
                    color:'#c8a96e', cursor:'pointer', fontFamily:'inherit',
                    fontSize:'0.95rem', transition:'all 0.2s' },
  tabBtnOn:       { background:'rgba(240,192,64,0.1)', fontWeight:'700' },

  // ── Scripture cards ──
  cardList:       { display:'flex', flexDirection:'column', gap:'1.25rem', marginBottom:'2rem' },
  scriptureCard:  { padding:'1.4rem 1.6rem', background:'rgba(255,255,255,0.04)',
                    borderRadius:'12px', border:'1px solid rgba(255,255,255,0.08)',
                    borderLeft:'4px solid', position:'relative' },
  scriptureRef:   { fontSize:'0.85rem', fontWeight:'700', textTransform:'uppercase',
                    letterSpacing:'0.08em', marginBottom:'0.6rem' },
  scriptureText:  { color:'#f0e6d2', fontSize:'1.2rem', lineHeight:'1.8',
                    fontStyle:'italic', margin:'0 0 1rem' },
  copyBtn:        { background:'transparent', border:'1px solid rgba(240,192,64,0.3)',
                    color:'#c8a96e', borderRadius:'15px', padding:'4px 14px',
                    cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem' },

  // ── Tip cards ──
  tipCard:        { display:'flex', gap:'1.25rem', padding:'1.4rem 1.6rem',
                    background:'rgba(255,255,255,0.04)', borderRadius:'12px',
                    border:'1px solid rgba(255,255,255,0.08)', borderLeft:'4px solid' },
  tipNum:         { width:'36px', height:'36px', borderRadius:'50%',
                    background:'rgba(240,192,64,0.15)', color:'#f0c040',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:'700', fontSize:'1rem', flexShrink:0 },
  tipContent:     { flex:1 },
  tipTitle:       { fontWeight:'700', fontSize:'1.1rem', marginBottom:'0.5rem' },
  tipBody:        { color:'#c8a96e', fontSize:'1rem', lineHeight:'1.7', margin:0 },

  // ── Combined box ──
  combinedBox:    { textAlign:'center', padding:'1.5rem', borderRadius:'14px',
                    border:'1px solid', background:'rgba(255,255,255,0.03)',
                    marginBottom:'2rem' },
  combinedText:   { color:'#c8a96e', fontSize:'1rem', lineHeight:'1.8', margin:0 },

  // ── Bottom banner ──
  bottomBanner:   { textAlign:'center', maxWidth:'640px', margin:'0 auto 2rem',
                    padding:'2.5rem 1.5rem', borderRadius:'16px',
                    background:'rgba(240,192,64,0.06)',
                    border:'1px solid rgba(240,192,64,0.2)' },
  bottomTitle:    { color:'#f0c040', fontSize:'1.6rem', fontWeight:'700', margin:'0 0 1rem' },
  bottomText:     { color:'#c8a96e', fontSize:'1rem', lineHeight:'1.8', margin:0 },

  // ── Misc ──
  empty:          { textAlign:'center', color:'#c8a96e', fontSize:'1.1rem',
                    marginTop:'4rem', fontStyle:'italic' },
  toast:          { position:'fixed', bottom:'28px', left:'50%',
                    transform:'translateX(-50%)', background:'#2a1a08',
                    border:'1px solid #f0c040', color:'#f0e6d2',
                    padding:'12px 26px', borderRadius:'25px', zIndex:999,
                    fontSize:'1rem', whiteSpace:'nowrap',
                    animation:'fadeUp 0.2s ease' },
}