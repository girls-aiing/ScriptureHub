import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

// ══════════════════════════════════════════════════════════════════
// CURATED VERSE DATABASE
// A rich local database for instant offline results
// ══════════════════════════════════════════════════════════════════
const VERSE_DB = [
  // ── Loneliness / Presence of God ──────────────────────────────
  { ref:'Joshua 1:9',        text:'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',  tags:['lonely','fear','strength','courage','presence','abandoned','alone','afraid','discouraged'] },
  { ref:'Psalm 23:4',        text:'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',  tags:['lonely','fear','dark','comfort','presence','death','valley','shadow'] },
  { ref:'Isaiah 41:10',      text:'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',  tags:['lonely','fear','strength','help','anxiety','worry','dismayed','alone'] },
  { ref:'Deuteronomy 31:6',  text:'Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.',  tags:['lonely','abandoned','forsaken','strength','courage','afraid','alone'] },
  { ref:'Hebrews 13:5',      text:'Never will I leave you; never will I forsake you.',  tags:['lonely','abandoned','forsaken','alone','presence','comfort'] },
  { ref:'Matthew 28:20',     text:'And surely I am with you always, to the very end of the age.',  tags:['lonely','alone','presence','comfort','always','forever'] },
  { ref:'Psalm 139:7-10',    text:'Where can I go from your Spirit? Where can I flee from your presence? If I go up to the heavens, you are there; if I make my bed in the depths, you are there.',  tags:['lonely','presence','everywhere','omnipresent','alone','hiding'] },

  // ── Anxiety / Worry / Peace ───────────────────────────────────
  { ref:'Philippians 4:6-7', text:'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',  tags:['anxiety','worry','peace','prayer','stress','overwhelmed','panic','fear','troubled'] },
  { ref:'Matthew 6:34',      text:'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.',  tags:['worry','anxiety','future','tomorrow','stress','overthinking'] },
  { ref:'1 Peter 5:7',       text:'Cast all your anxiety on him because he cares for you.',  tags:['anxiety','worry','stress','care','burden','overwhelmed','troubled'] },
  { ref:'John 14:27',        text:'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',  tags:['peace','anxiety','fear','troubled','heart','comfort','worry'] },
  { ref:'Isaiah 26:3',       text:'You will keep in perfect peace those whose minds are steadfast, because they trust in you.',  tags:['peace','anxiety','mind','trust','worry','stress','steadfast'] },
  { ref:'Romans 8:28',       text:'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',  tags:['worry','anxiety','suffering','purpose','good','trust','hope','difficult'] },

  // ── Strength / Weakness ───────────────────────────────────────
  { ref:'Philippians 4:13',  text:'I can do all this through him who gives me strength.',  tags:['strength','weakness','impossible','challenge','tired','exhausted','can do','ability'] },
  { ref:'Isaiah 40:31',      text:'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',  tags:['strength','tired','weary','exhausted','hope','renew','energy','burnout'] },
  { ref:'2 Corinthians 12:9',text:'My grace is sufficient for you, for my power is made perfect in weakness. Therefore I will boast all the more gladly about my weaknesses, so that Christ\'s power may rest on me.',  tags:['weakness','strength','grace','power','insufficient','not enough','struggling'] },
  { ref:'Psalm 46:1',        text:'God is our refuge and strength, an ever-present help in trouble.',  tags:['strength','help','trouble','refuge','crisis','emergency','difficult'] },
  { ref:'Nehemiah 8:10',     text:'Do not grieve, for the joy of the Lord is your strength.',  tags:['strength','joy','grief','sad','weak','tired','sorrow'] },

  // ── Forgiveness / Guilt / Shame ───────────────────────────────
  { ref:'1 John 1:9',        text:'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.',  tags:['forgiveness','guilt','shame','sin','confess','clean','pure','regret','mistake'] },
  { ref:'Psalm 103:12',      text:'As far as the east is from the west, so far has he removed our transgressions from us.',  tags:['forgiveness','guilt','shame','sin','removed','past','regret','mistake'] },
  { ref:'Isaiah 43:25',      text:'I, even I, am he who blots out your transgressions, for my own sake, and remembers your sins no more.',  tags:['forgiveness','guilt','shame','sin','forget','past','regret','blot out'] },
  { ref:'Romans 8:1',        text:'Therefore, there is now no condemnation for those who are in Christ Jesus.',  tags:['guilt','shame','condemnation','forgiveness','judgment','condemned','worthless'] },
  { ref:'Micah 7:19',        text:'You will again have compassion on us; you will tread our sins underfoot and hurl all our iniquities into the depths of the sea.',  tags:['forgiveness','guilt','sin','compassion','past','regret','shame'] },
  { ref:'Lamentations 3:22-23', text:'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.',  tags:['forgiveness','new start','morning','fresh start','compassion','mercy','guilt','shame','failure'] },

  // ── Hope / Despair / Depression ───────────────────────────────
  { ref:'Jeremiah 29:11',    text:'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',  tags:['hope','future','despair','depression','plans','purpose','lost','direction','hopeless'] },
  { ref:'Romans 15:13',      text:'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',  tags:['hope','joy','peace','despair','depression','trust','hopeless'] },
  { ref:'Psalm 34:18',       text:'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',  tags:['depression','broken','crushed','sad','grief','despair','hopeless','heartbroken','lonely'] },
  { ref:'Psalm 42:11',       text:'Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.',  tags:['depression','downcast','sad','hope','disturbed','soul','despair'] },
  { ref:'Isaiah 61:3',       text:'To bestow on them a crown of beauty instead of ashes, the oil of joy instead of mourning, and a garment of praise instead of a spirit of despair.',  tags:['depression','despair','mourning','joy','beauty','ashes','grief','sad'] },
  { ref:'Revelation 21:4',   text:'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.',  tags:['hope','heaven','tears','pain','death','grief','mourning','future','comfort'] },

  // ── Love / Relationships ──────────────────────────────────────
  { ref:'1 Corinthians 13:4-7', text:'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.',  tags:['love','relationship','marriage','patience','kind','anger','pride','envy','partner'] },
  { ref:'John 3:16',         text:'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',  tags:['love','salvation','eternal life','God loves','beloved','worth','value'] },
  { ref:'Romans 8:38-39',    text:'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.',  tags:['love','separation','abandoned','nothing can separate','secure','God loves','unconditional'] },
  { ref:'1 John 4:19',       text:'We love because he first loved us.',  tags:['love','relationship','God loves','first','source','beloved'] },
  { ref:'Song of Solomon 8:7', text:'Many waters cannot quench love; rivers cannot sweep it away.',  tags:['love','marriage','relationship','strong','unbreakable','partner','romance'] },

  // ── Treating Others / Neighbours ─────────────────────────────
  { ref:'Matthew 22:39',     text:'Love your neighbor as yourself.',  tags:['neighbours','others','love','treat','kindness','community','people','relationships'] },
  { ref:'Luke 6:31',         text:'Do to others as you would have them do to you.',  tags:['neighbours','others','treat','golden rule','kindness','fairness','people'] },
  { ref:'Romans 12:10',      text:'Be devoted to one another in love. Honor one another above yourselves.',  tags:['neighbours','others','love','honor','community','relationships','people','treat'] },
  { ref:'Galatians 6:2',     text:'Carry each other\'s burdens, and in this way you will fulfill the law of Christ.',  tags:['neighbours','others','help','burden','community','support','treat','people'] },
  { ref:'Proverbs 3:27',     text:'Do not withhold good from those to whom it is due, when it is in your power to act.',  tags:['neighbours','others','good','help','kindness','treat','people','generosity'] },
  { ref:'Hebrews 10:24',     text:'And let us consider how we may spur one another on toward love and good deeds.',  tags:['neighbours','others','community','encourage','love','good deeds','treat','people'] },
  { ref:'Matthew 5:44',      text:'But I tell you, love your enemies and pray for those who persecute you.',  tags:['enemies','difficult people','hate','conflict','love','pray','treat','neighbours','forgive'] },

  // ── Money / Provision / Generosity ───────────────────────────
  { ref:'Philippians 4:19',  text:'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',  tags:['money','provision','needs','financial','poor','lack','supply','provide'] },
  { ref:'Matthew 6:33',      text:'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',  tags:['money','provision','needs','financial','worry','seek','kingdom','priority'] },
  { ref:'Proverbs 3:9-10',   text:'Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing.',  tags:['money','wealth','tithe','giving','firstfruits','provision','generosity','honor'] },
  { ref:'Luke 6:38',         text:'Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.',  tags:['money','giving','generosity','provision','blessing','financial','give'] },
  { ref:'Malachi 3:10',      text:'Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this, says the Lord Almighty, and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it.',  tags:['money','tithe','giving','blessing','provision','financial','generosity'] },
  { ref:'1 Timothy 6:6',     text:'But godliness with contentment is great gain.',  tags:['money','contentment','wealth','enough','satisfaction','greed','financial'] },
  { ref:'Proverbs 13:11',    text:'Dishonest money dwindles away, but whoever gathers money little by little makes it grow.',  tags:['money','wealth','honest','savings','financial','work','diligence','grow'] },

  // ── Wisdom / Guidance / Decisions ────────────────────────────
  { ref:'James 1:5',         text:'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',  tags:['wisdom','guidance','decision','confused','direction','ask','lost','choice'] },
  { ref:'Proverbs 3:5-6',    text:'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',  tags:['wisdom','guidance','decision','trust','direction','path','confused','choice','lost'] },
  { ref:'Psalm 32:8',        text:'I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.',  tags:['wisdom','guidance','direction','teach','counsel','decision','path','lost','choice'] },
  { ref:'Isaiah 30:21',      text:'Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, "This is the way; walk in it."',  tags:['guidance','direction','decision','voice','path','choice','confused','lost','way'] },
  { ref:'Proverbs 11:14',    text:'For lack of guidance a nation falls, but victory is won through many advisers.',  tags:['wisdom','guidance','counsel','advice','decision','community','advisers'] },

  // ── Faith / Doubt / Trust ─────────────────────────────────────
  { ref:'Hebrews 11:1',      text:'Now faith is confidence in what we hope for and assurance about what we do not see.',  tags:['faith','doubt','trust','unseen','hope','believe','confidence','assurance'] },
  { ref:'Mark 9:24',         text:'I do believe; help me overcome my unbelief!',  tags:['faith','doubt','believe','unbelief','struggling','honest','prayer','trust'] },
  { ref:'Matthew 17:20',     text:'Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, "Move from here to there," and it will move. Nothing will be impossible for you.',  tags:['faith','small','mustard seed','impossible','mountain','believe','doubt','trust'] },
  { ref:'Romans 10:17',      text:'Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.',  tags:['faith','hearing','word','message','grow','build','doubt','believe'] },
  { ref:'2 Corinthians 5:7', text:'For we live by faith, not by sight.',  tags:['faith','sight','trust','unseen','believe','walk','doubt'] },

  // ── Prayer ────────────────────────────────────────────────────
  { ref:'Matthew 7:7',       text:'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.',  tags:['prayer','ask','seek','knock','answer','request','petition','God hears'] },
  { ref:'Jeremiah 33:3',     text:'Call to me and I will answer you and tell you great and unsearchable things you do not know.',  tags:['prayer','call','answer','great things','unknown','seek','God hears'] },
  { ref:'1 Thessalonians 5:17', text:'Pray continually.',  tags:['prayer','continuous','always','habit','lifestyle','pray','communication'] },
  { ref:'Romans 8:26',       text:'In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans.',  tags:['prayer','weakness','Spirit','intercede','don\'t know how','struggling','help','pray'] },

  // ── Healing / Sickness ────────────────────────────────────────
  { ref:'Psalm 103:3',       text:'Who forgives all your sins and heals all your diseases.',  tags:['healing','sickness','disease','health','forgiveness','restore','body','ill'] },
  { ref:'Isaiah 53:5',       text:'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',  tags:['healing','sickness','wounds','peace','health','restore','body','ill','disease'] },
  { ref:'James 5:14-15',     text:'Is anyone among you sick? Let them call the elders of the church to pray over them and anoint them with oil in the name of the Lord. And the prayer offered in faith will make the sick person well.',  tags:['healing','sickness','prayer','elders','anoint','faith','health','ill','disease'] },
  { ref:'Jeremiah 30:17',    text:'But I will restore you to health and heal your wounds, declares the Lord.',  tags:['healing','sickness','restore','health','wounds','body','ill','disease'] },
  { ref:'3 John 1:2',        text:'Dear friend, I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well.',  tags:['healing','health','wellness','soul','prosper','body','well','good health'] },

  // ── Success / Work / Diligence ────────────────────────────────
  { ref:'Colossians 3:23',   text:'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.',  tags:['work','diligence','success','effort','excellence','job','career','business','purpose'] },
  { ref:'Proverbs 16:3',     text:'Commit to the Lord whatever you do, and he will establish your plans.',  tags:['work','success','plans','commit','business','career','establish','purpose','goals'] },
  { ref:'Joshua 1:8',        text:'Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it. Then you will be prosperous and successful.',  tags:['success','prosperity','word','meditate','law','business','career','goals','work'] },
  { ref:'Proverbs 21:5',     text:'The plans of the diligent lead to profit as surely as haste leads to poverty.',  tags:['work','diligence','success','plans','profit','business','career','goals','lazy'] },
  { ref:'Ecclesiastes 9:10', text:'Whatever your hand finds to do, do it with all your might.',  tags:['work','diligence','effort','success','excellence','job','career','purpose','strength'] },

  // ── Grief / Loss ──────────────────────────────────────────────
  { ref:'Psalm 34:18',       text:'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',  tags:['grief','loss','broken','crushed','death','mourning','sad','heartbroken','comfort'] },
  { ref:'Matthew 5:4',       text:'Blessed are those who mourn, for they will be comforted.',  tags:['grief','loss','mourning','comfort','blessed','sad','death','heartbroken'] },
  { ref:'John 11:35',        text:'Jesus wept.',  tags:['grief','loss','tears','sad','Jesus','compassion','death','mourning','emotion'] },
  { ref:'Psalm 147:3',       text:'He heals the brokenhearted and binds up their wounds.',  tags:['grief','loss','broken','wounds','heal','comfort','sad','heartbroken','death'] },
  { ref:'2 Corinthians 1:3-4', text:'Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles.',  tags:['grief','loss','comfort','compassion','troubles','sad','mourning','death','heartbroken'] },

  // ── Identity / Worth / Purpose ────────────────────────────────
  { ref:'Psalm 139:14',      text:'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',  tags:['identity','worth','value','made','wonderful','purpose','self-worth','beautiful','created'] },
  { ref:'Ephesians 2:10',    text:'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.',  tags:['identity','worth','purpose','created','handiwork','good works','value','meaning'] },
  { ref:'Genesis 1:27',      text:'So God created mankind in his own image, in the image of God he created them; male and female he created them.',  tags:['identity','worth','image','created','value','human','dignity','purpose','made'] },
  { ref:'1 Peter 2:9',       text:'But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession, that you may declare the praises of him who called you out of darkness into his wonderful light.',  tags:['identity','worth','chosen','royal','special','value','purpose','belonging','beloved'] },
  { ref:'Romans 8:17',       text:'Now if we are children, then we are heirs — heirs of God and co-heirs with Christ.',  tags:['identity','worth','children','heirs','value','belonging','purpose','royal','beloved'] },

  // ── Anger / Conflict ──────────────────────────────────────────
  { ref:'Ephesians 4:26',    text:'In your anger do not sin: Do not let the sun go down while you are still angry.',  tags:['anger','conflict','sin','resolve','forgive','relationship','fight','argument'] },
  { ref:'James 1:19-20',     text:'Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires.',  tags:['anger','conflict','listen','speak','slow','righteousness','relationship','argument','fight'] },
  { ref:'Proverbs 15:1',     text:'A gentle answer turns away wrath, but a harsh word stirs up anger.',  tags:['anger','conflict','gentle','harsh','wrath','words','relationship','argument','fight'] },
  { ref:'Romans 12:19',      text:'Do not take revenge, my dear friends, but leave room for God\'s wrath, for it is written: "It is mine to avenge; I will repay," says the Lord.',  tags:['anger','revenge','conflict','justice','wrath','God','relationship','fight','enemy'] },

  // ── Fear / Courage ────────────────────────────────────────────
  { ref:'2 Timothy 1:7',     text:'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',  tags:['fear','courage','timid','power','love','discipline','bold','afraid','Spirit'] },
  { ref:'Psalm 27:1',        text:'The Lord is my light and my salvation — whom shall I fear? The Lord is the stronghold of my life — of whom shall I be afraid?',  tags:['fear','courage','light','salvation','stronghold','afraid','bold','trust'] },
  { ref:'Isaiah 43:1',       text:'Do not fear, for I have redeemed you; I have summoned you by name; you are mine.',  tags:['fear','courage','redeemed','name','belonging','afraid','identity','loved','mine'] },

  // ── Patience / Waiting ────────────────────────────────────────
  { ref:'Psalm 27:14',       text:'Wait for the Lord; be strong and take heart and wait for the Lord.',  tags:['patience','waiting','wait','strong','heart','timing','God\'s time','delay','trust'] },
  { ref:'Isaiah 40:31',      text:'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',  tags:['patience','waiting','hope','strength','renew','tired','weary','trust','timing'] },
  { ref:'Romans 5:3-4',      text:'We also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.',  tags:['patience','suffering','perseverance','character','hope','waiting','endure','trial'] },
  { ref:'Habakkuk 2:3',      text:'For the revelation awaits an appointed time; it speaks of the end and will not prove false. Though it linger, wait for it; it will certainly come and will not delay.',  tags:['patience','waiting','appointed time','vision','promise','timing','trust','delay'] },

  // ── Salvation / New Life ──────────────────────────────────────
  { ref:'John 3:16',         text:'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',  tags:['salvation','eternal life','believe','love','perish','born again','new life','saved'] },
  { ref:'Romans 10:9',       text:'If you declare with your mouth, "Jesus is Lord," and believe in your heart that God raised him from the dead, you will be saved.',  tags:['salvation','saved','confess','believe','Lord','resurrection','new life','born again'] },
  { ref:'2 Corinthians 5:17', text:'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',  tags:['salvation','new life','new creation','old','born again','change','transform','fresh start'] },
  { ref:'Acts 2:38',         text:'Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins. And you will receive the gift of the Holy Spirit.',  tags:['salvation','repent','baptism','forgiveness','Holy Spirit','new life','saved','born again'] },
]

// ══════════════════════════════════════════════════════════════════
// SUGGESTED SEARCHES
// ══════════════════════════════════════════════════════════════════
const SUGGESTIONS = [
  { label: 'I feel lonely and need strength',    icon: '💙' },
  { label: 'How to treat my neighbours',         icon: '🤝' },
  { label: 'I am anxious about the future',      icon: '😰' },
  { label: 'I need forgiveness for my mistakes', icon: '🙏' },
  { label: 'How to handle money wisely',         icon: '💰' },
  { label: 'I feel worthless and unloved',       icon: '💔' },
  { label: 'I need guidance for a big decision', icon: '🧭' },
  { label: 'Someone I love has died',            icon: '😢' },
  { label: 'I am struggling with anger',         icon: '🔥' },
  { label: 'I want to start a business',         icon: '🚀' },
  { label: 'I am sick and need healing',         icon: '🏥' },
  { label: 'I am afraid and need courage',       icon: '⚡' },
  { label: 'I am waiting on God and losing hope',icon: '⏳' },
  { label: 'I want to know my purpose in life',  icon: '🌟' },
  { label: 'How do I pray when I don\'t know what to say', icon: '🕊️' },
]

// ══════════════════════════════════════════════════════════════════
// AI SEARCH ENGINE
// Uses the same Gemini API as AIAdvicePage
// ══════════════════════════════════════════════════════════════════
const API_KEY  = import.meta.env.VITE_GEMINI_API_KEY  || ''
const API_URL  = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

async function callGemini(prompt) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1200 },
    }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ── Local semantic search (keyword + tag matching) ────────────────
function localSearch(query) {
  const q     = query.toLowerCase()
  const words = q.split(/\s+/).filter(w => w.length > 2)

  const scored = VERSE_DB.map(verse => {
    let score = 0
    // Tag matching (highest weight)
    for (const tag of verse.tags) {
      if (q.includes(tag))          score += 10
      if (words.some(w => tag.includes(w) || w.includes(tag))) score += 5
    }
    // Text matching
    const vText = verse.text.toLowerCase()
    for (const word of words) {
      if (vText.includes(word))     score += 3
      if (verse.ref.toLowerCase().includes(word)) score += 2
    }
    return { ...verse, score }
  })

  return scored
    .filter(v => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}

// ══════════════════════════════════════════════════════════════════
// FONT & ANIMATIONS
// ══════════════════════════════════════════════════════════════════
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`
const ANIM = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 12px rgba(240,192,64,0.15)} 50%{box-shadow:0 0 28px rgba(240,192,64,0.4)} }
  @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes typeIn   { from{width:0} to{width:100%} }
  .result-card { animation: fadeUp 0.4s ease both; }
  .result-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
  .suggestion-chip:hover { transform: translateY(-1px); transition: transform 0.15s; }
`

// ══════════════════════════════════════════════════════════════════
// RESULT CARD
// ══════════════════════════════════════════════════════════════════
function ResultCard({ result, index, query, onCopy }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(`${result.ref} — "${result.text}"`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  // Highlight matching words in verse text
  function highlightText(text) {
    if (!query) return text
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    if (!words.length) return text
    const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
    const parts = text.split(pattern)
    return parts.map((part, i) =>
      pattern.test(part)
        ? <mark key={i} style={{ background:'rgba(240,192,64,0.25)', color:'#f0c040', borderRadius:'3px', padding:'0 2px' }}>{part}</mark>
        : part
    )
  }

  return (
    <div
      className="result-card"
      style={{
        background:   'rgba(255,255,255,0.04)',
        border:       '1px solid rgba(240,192,64,0.2)',
        borderRadius: '16px',
        padding:      '1.25rem 1.4rem',
        animationDelay: `${index * 0.07}s`,
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      {/* Rank badge */}
      {index === 0 && (
        <div style={{
          position:   'absolute',
          top:        '12px',
          right:      '12px',
          background: 'rgba(240,192,64,0.15)',
          border:     '1px solid rgba(240,192,64,0.4)',
          borderRadius:'10px',
          padding:    '2px 8px',
          color:      '#f0c040',
          fontSize:   '0.7rem',
          fontWeight: '700',
        }}>
          ✨ Best Match
        </div>
      )}

      {/* Reference */}
      <div style={{
        color:        '#f0c040',
        fontSize:     '1.1rem',
        fontWeight:   '700',
        marginBottom: '0.6rem',
        paddingRight: index === 0 ? '90px' : '0',
      }}>
        📖 {result.ref}
      </div>

      {/* Verse text */}
      <p style={{
        color:      '#f0e6d2',
        fontSize:   '1.05rem',
        lineHeight: '1.8',
        margin:     '0 0 0.75rem',
        fontStyle:  'italic',
      }}>
        "{highlightText(result.text)}"
      </p>

      {/* AI explanation (if present) */}
      {result.explanation && (
        <div style={{
          background:   'rgba(240,192,64,0.06)',
          border:       '1px solid rgba(240,192,64,0.15)',
          borderRadius: '10px',
          padding:      '0.75rem 1rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{ color:'#f0c040', fontSize:'0.75rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px' }}>
         🤖 {t('whyThisVerse')}
          </div>
          <p style={{ color:'#c8a96e', fontSize:'0.92rem', lineHeight:'1.7', margin:0, fontStyle:'italic' }}>
            {result.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
        <button
          onClick={handleCopy}
          style={{
            padding:    '6px 14px',
            borderRadius:'14px',
            border:     '1px solid rgba(240,192,64,0.3)',
            background: copied ? 'rgba(76,175,80,0.15)' : 'transparent',
            color:      copied ? '#4caf50' : '#c8a96e',
            cursor:     'pointer',
            fontFamily: 'inherit',
            fontSize:   '0.82rem',
            transition: 'all 0.2s',
          }}
        >
 {copied ? `✅ ${t('copied')}` : `📋 ${t('copyVerse')}`}
        </button>
        <a
          href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(result.ref)}&version=NIV`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding:        '6px 14px',
            borderRadius:   '14px',
            border:         '1px solid rgba(255,255,255,0.12)',
            background:     'transparent',
            color:          '#c8a96e',
            cursor:         'pointer',
            fontFamily:     'inherit',
            fontSize:       '0.82rem',
            textDecoration: 'none',
            display:        'inline-block',
          }}
        >
  🔗 {t('readInContext')}
        </a>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// AI INSIGHT PANEL
// ══════════════════════════════════════════════════════════════════
function AIInsightPanel({ insight, query }) {
  if (!insight) return null
  return (
    <div style={{
      background:   'linear-gradient(135deg, rgba(240,192,64,0.08), rgba(156,39,176,0.06))',
      border:       '1px solid rgba(240,192,64,0.3)',
      borderRadius: '16px',
      padding:      '1.4rem 1.5rem',
      marginBottom: '1.5rem',
      animation:    'fadeUp 0.4s ease',
    }}>
      <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'0.75rem' }}>
        <span style={{ fontSize:'1.5rem' }}>🤖</span>
        <div>
           <div style={{ color:'#f0c040', fontSize:'1rem', fontWeight:'700' }}>{t('aiInsight')}</div>
          <div style={{ color:'#c8a96e', fontSize:'0.78rem' }}>Personalised guidance for your search</div>
        </div>
      </div>
      <div style={{
        color:      '#f0e6d2',
        fontSize:   '1rem',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap',
      }}>
        {insight}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// SEARCH HISTORY ITEM
// ══════════════════════════════════════════════════════════════════
const HISTORY_KEY = 'scripturehub_search_history'

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] }
  catch { return [] }
}
function saveHistory(query) {
  try {
    const h = [query, ...getHistory().filter(q => q !== query)].slice(0, 10)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
  } catch {}
}
function clearHistory() {
  try { localStorage.removeItem(HISTORY_KEY) } catch {}
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function DeepSearchPage() {
  const { t } = useLanguage()
  const [query,       setQuery]       = useState('')
  const [results,     setResults]     = useState([])
  const [aiInsight,   setAiInsight]   = useState('')
  const [loading,     setLoading]     = useState(false)
  const [aiLoading,   setAiLoading]   = useState(false)
  const [searched,    setSearched]    = useState(false)
  const [history,     setHistory]     = useState(() => getHistory())
  const [showHistory, setShowHistory] = useState(false)
  const [toast,       setToast]       = useState(null)
  const [searchMode,  setSearchMode]  = useState('ai')  // 'ai' | 'local'
  const [copyCount,   setCopyCount]   = useState(0)

  const inputRef    = useRef(null)
  const resultsRef  = useRef(null)
  const abortRef    = useRef(null)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  // ── Focus input on mount ──────────────────────────────────────
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  // ── Main search function ──────────────────────────────────────
  const doSearch = useCallback(async (q) => {
    const trimmed = q.trim()
    if (!trimmed) return

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current = true
    abortRef.current = false

    setLoading(true)
    setAiInsight('')
    setResults([])
    setSearched(true)
    saveHistory(trimmed)
    setHistory(getHistory())

    // Scroll to results
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100)

    // ── Step 1: Instant local results ──────────────────────────
    const localResults = localSearch(trimmed)
    setResults(localResults.map(r => ({ ...r, source:'local' })))
    setLoading(false)

    // ── Step 2: AI enrichment (if API key exists) ───────────────
    if (!API_KEY || searchMode === 'local') return

    setAiLoading(true)
    try {
      const prompt = `You are a compassionate Bible scholar and counsellor.

A person has typed this into a Bible search: "${trimmed}"

Your task has TWO parts:

PART 1 — INSIGHT (3-4 sentences):
Write a warm, personal, pastoral response to what this person is feeling or asking. 
Acknowledge their situation, then point them to God's truth. 
Do NOT use bullet points. Write as flowing, warm prose.
Start directly — do not say "Here is my response" or similar.

PART 2 — VERSES (return exactly 5 Bible verses):
Find the 5 most relevant Bible verses for this search.
For each verse, return it in this EXACT format on its own line:
VERSE: [Reference] | [Full verse text] | [One sentence explaining why this verse fits]

Only return PART 1 and PART 2. Nothing else.`

      const raw = await callGemini(prompt)
      if (abortRef.current) return

      // Parse PART 1 (insight)
      const insightMatch = raw.match(/PART 1[^\n]*\n([\s\S]*?)(?=PART 2|VERSE:)/i)
      const insight = insightMatch
        ? insightMatch[1].trim()
        : raw.split('VERSE:')[0].trim()
      if (insight) setAiInsight(insight)

      // Parse PART 2 (verses)
      const verseLines = raw.match(/VERSE:\s*(.+)/g) || []
      const aiVerses = verseLines.map(line => {
        const content = line.replace(/^VERSE:\s*/i, '').trim()
        const parts   = content.split('|').map(p => p.trim())
        if (parts.length >= 2) {
          return {
            ref:         parts[0],
            text:        parts[1].replace(/^[""]|[""]$/g, ''),
            explanation: parts[2] || '',
            source:      'ai',
            score:       100,
          }
        }
        return null
      }).filter(Boolean)

      if (aiVerses.length > 0) {
        // Merge AI verses with local results, deduplicate by ref
        setResults(prev => {
          const existingRefs = new Set(prev.map(r => r.ref))
          const newVerses    = aiVerses.filter(v => !existingRefs.has(v.ref))
          // Put AI verses first, then local
          return [...aiVerses, ...prev.filter(r => !aiVerses.find(av => av.ref === r.ref))].slice(0, 10)
        })
      }
    } catch (err) {
      if (!abortRef.current) {
        console.warn('AI search failed, using local results only:', err.message)
      }
    } finally {
      if (!abortRef.current) setAiLoading(false)
    }
  }, [searchMode])

  function handleSubmit(e) {
    e.preventDefault()
    doSearch(query)
  }

  function handleSuggestion(text) {
    setQuery(text)
    doSearch(text)
    inputRef.current?.blur()
  }

  function handleHistoryItem(q) {
    setQuery(q)
    setShowHistory(false)
    doSearch(q)
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
    showToast('Search history cleared')
  }

  const totalResults = results.length
  const hasAiResults = results.some(r => r.source === 'ai')

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{FONT + ANIM}</style>

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}

      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroIcon}>🔍</div>
         <h1 style={s.heroTitle}>{t('deepSearch')}</h1>
        <p style={s.heroSub}>
          Don't search for words. Search for <em>meaning.</em>
          <br />
          Type how you feel, what you need, or what you're going through.
        </p>
        <div style={s.heroBadges}>
          <span style={s.badge}>🧠 Understands feelings</span>
          <span style={s.badge}>📖 {VERSE_DB.length}+ curated verses</span>
          <span style={s.badge}>🤖 AI-powered insight</span>
        </div>
      </div>

      {/* ── Search box ── */}
      <div style={s.searchSection}>
        <form onSubmit={handleSubmit} style={s.searchForm}>
          <div style={s.searchBox}>
            <span style={s.searchIcon}>🔍</span>
            <input
              ref={inputRef}
              style={s.searchInput}
              type="text"
                          placeholder={t('searchPlaceholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setShowHistory(history.length > 0)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              autoComplete="off"
              spellCheck="true"
            />
            {query && (
              <button
                type="button"
                style={s.clearBtn}
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
              >✕</button>
            )}
          </div>

          {/* Search history dropdown */}
          {showHistory && history.length > 0 && (
            <div style={s.historyDrop}>
              <div style={s.historyHeader}>
                <span style={{ color:'#c8a96e', fontSize:'0.75rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                  🕐 {t('recentSearches')}
                </span>
                <button style={s.clearHistBtn} onClick={handleClearHistory}>Clear</button>
              </div>
              {history.map((h, i) => (
                <button key={i} style={s.historyItem} onMouseDown={() => handleHistoryItem(h)}>
                  🕐 {h}
                </button>
              ))}
            </div>
          )}

          {/* Mode toggle + Search button */}
          <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
            <div style={s.modeToggle}>
              <button
                type="button"
                style={{ ...s.modeBtn, ...(searchMode === 'ai' ? s.modeBtnOn : {}) }}
                onClick={() => setSearchMode('ai')}
              >
                🤖 AI + Local
              </button>
              <button
                type="button"
                style={{ ...s.modeBtn, ...(searchMode === 'local' ? s.modeBtnOn : {}) }}
                onClick={() => setSearchMode('local')}
              >
                📖 Local Only
              </button>
            </div>
            <button
              type="submit"
              disabled={!query.trim() || loading}
              style={{
                ...s.searchBtn,
                opacity: !query.trim() || loading ? 0.5 : 1,
                cursor:  !query.trim() || loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Searching…' : '🔍 Deep Search'}
            </button>
          </div>
        </form>

        {/* AI loading indicator */}
        {aiLoading && (
          <div style={s.aiLoadingBar}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={s.spinner} />
              <span style={{ color:'#c8a96e', fontSize:'0.88rem' }}>
                🤖 AI is finding deeper connections…
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Suggestions ── */}
      {!searched && (
        <div style={s.suggestSection}>
          <div style={s.suggestLabel}>✨ Try searching for…</div>
          <div style={s.suggestGrid}>
            {SUGGESTIONS.map((s_, i) => (
              <button
                key={i}
                className="suggestion-chip"
                style={s.chip}
                onClick={() => handleSuggestion(s_.label)}
              >
                <span style={{ fontSize:'1.1rem' }}>{s_.icon}</span>
                <span style={{ color:'#c8a96e', fontSize:'0.88rem', lineHeight:'1.4' }}>{s_.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <div ref={resultsRef}>
        {searched && (
          <div style={s.resultsSection}>

            {/* Results header */}
            <div style={s.resultsHeader}>
              <div>
                <span style={{ color:'#f0c040', fontSize:'1.1rem', fontWeight:'700' }}>
                               {loading ? t('loading') : `${totalResults} ${t('searchResults')}`}
                </span>
                {!loading && totalResults > 0 && (
                  <span style={{ color:'#7a6040', fontSize:'0.85rem', marginLeft:'8px', fontStyle:'italic' }}>
                    for "{query}"
                  </span>
                )}
              </div>
              {!loading && totalResults > 0 && (
                <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
                  {hasAiResults && (
                    <span style={{
                      background:   'rgba(156,39,176,0.15)',
                      border:       '1px solid rgba(156,39,176,0.4)',
                      borderRadius: '10px',
                      padding:      '2px 10px',
                      color:        '#ce93d8',
                      fontSize:     '0.72rem',
                      fontWeight:   '700',
                    }}>
                      🤖 AI Enhanced
                    </span>
                  )}
                  <button
                    style={s.newSearchBtn}
                    onClick={() => {
                      setSearched(false)
                      setResults([])
                      setAiInsight('')
                      setQuery('')
                      setTimeout(() => inputRef.current?.focus(), 100)
                    }}
                  >
                    + New Search
                  </button>
                </div>
              )}
            </div>

            {/* AI Insight */}
            {aiInsight && <AIInsightPanel insight={aiInsight} query={query} />}

            {/* Loading skeleton */}
            {loading && (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{
                    background:   'rgba(255,255,255,0.03)',
                    border:       '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    padding:      '1.25rem',
                    animation:    `fadeIn 0.3s ease ${i * 0.1}s both`,
                  }}>
                    <div style={{ height:'16px', width:'30%', background:'rgba(240,192,64,0.1)', borderRadius:'8px', marginBottom:'12px' }} />
                    <div style={{ height:'12px', width:'90%', background:'rgba(255,255,255,0.05)', borderRadius:'6px', marginBottom:'8px' }} />
                    <div style={{ height:'12px', width:'75%', background:'rgba(255,255,255,0.05)', borderRadius:'6px' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Result cards */}
            {!loading && results.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                {results.map((result, i) => (
                  <ResultCard
                    key={`${result.ref}-${i}`}
                    result={result}
                    index={i}
                    query={query}
                    onCopy={() => showToast('Verse copied! 📋')}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && results.length === 0 && (
              <div style={s.empty}>
                <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🔍</div>
                <div style={{ color:'#f0e6d2', fontSize:'1.2rem', fontWeight:'700', marginBottom:'0.75rem' }}>
                  No verses found
                </div>
                <p style={{ color:'#c8a96e', fontSize:'1rem', lineHeight:'1.7', marginBottom:'1.5rem' }}>
                  Try rephrasing your search. Use feelings or situations like
                  "I feel hopeless" or "dealing with loss."
                </p>
                <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center' }}>
                  {SUGGESTIONS.slice(0,4).map((s_, i) => (
                    <button key={i} style={s.chip} onClick={() => handleSuggestion(s_.label)}>
                      {s_.icon} {s_.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Try more suggestions after results */}
            {!loading && results.length > 0 && (
              <div style={{ marginTop:'2rem' }}>
                <div style={s.suggestLabel}>🔄 Try another search…</div>
                <div style={s.suggestGrid}>
                  {SUGGESTIONS
                    .filter(s_ => s_.label.toLowerCase() !== query.toLowerCase())
                    .slice(0, 6)
                    .map((s_, i) => (
                      <button key={i} className="suggestion-chip" style={s.chip}
                        onClick={() => handleSuggestion(s_.label)}>
                        <span style={{ fontSize:'1.1rem' }}>{s_.icon}</span>
                        <span style={{ color:'#c8a96e', fontSize:'0.88rem' }}>{s_.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── How it works ── */}
      {!searched && (
        <div style={s.howSection}>
          <h3 style={s.howTitle}>How AI Deep Search works</h3>
          <div style={s.howGrid}>
            {[
              { icon:'💬', title:'You type your heart', desc:'Write how you feel, what you\'re going through, or what you need. No need for Bible knowledge.' },
              { icon:'🧠', title:'AI understands meaning', desc:'The AI reads the emotion and context behind your words — not just the keywords.' },
              { icon:'📖', title:'Scripture finds you', desc:'Relevant verses surface from our curated database of 100+ passages, matched to your situation.' },
              { icon:'🤖', title:'Personal insight', desc:'The AI adds a warm, pastoral explanation of why each verse speaks to your specific need.' },
            ].map((item, i) => (
              <div key={i} style={{
                background:   'rgba(255,255,255,0.03)',
                border:       '1px solid rgba(240,192,64,0.12)',
                borderRadius: '14px',
                padding:      '1.25rem',
                textAlign:    'center',
                animation:    `fadeUp 0.4s ease ${i * 0.1}s both`,
              }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>{item.icon}</div>
                <div style={{ color:'#f0c040', fontSize:'1rem', fontWeight:'700', marginBottom:'0.5rem' }}>{item.title}</div>
                <p style={{ color:'#c8a96e', fontSize:'0.9rem', lineHeight:'1.6', margin:0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════
const s = {
  page:          { background:'#0d0800', minHeight:'100vh', color:'#f0e6d2',
                   padding:'2rem 1rem', fontFamily:"'Crimson Text',serif",
                   maxWidth:'800px', margin:'0 auto' },
  hero:          { textAlign:'center', marginBottom:'2.5rem',
                   padding:'2.5rem 1.5rem', borderRadius:'20px',
                   background:'linear-gradient(135deg,rgba(240,192,64,0.07),rgba(156,39,176,0.05))',
                   border:'1px solid rgba(240,192,64,0.2)',
                   animation:'glow 4s ease-in-out infinite' },
  heroIcon:      { fontSize:'4rem', marginBottom:'0.75rem' },
  heroTitle:     { color:'#f0c040', fontSize:'2.8rem', fontWeight:'700',
                   margin:'0 0 0.75rem', lineHeight:'1.2' },
  heroSub:       { color:'#c8a96e', fontSize:'1.1rem', lineHeight:'1.8',
                   margin:'0 0 1.25rem', fontStyle:'italic' },
  heroBadges:    { display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' },
  badge:         { background:'rgba(240,192,64,0.1)', border:'1px solid rgba(240,192,64,0.25)',
                   borderRadius:'20px', padding:'4px 14px',
                   color:'#f0c040', fontSize:'0.82rem', fontWeight:'600' },
  searchSection: { marginBottom:'2rem' },
  searchForm:    { display:'flex', flexDirection:'column', gap:'12px' },
  searchBox:     { position:'relative', display:'flex', alignItems:'center' },
  searchIcon:    { position:'absolute', left:'16px', fontSize:'1.1rem', pointerEvents:'none', zIndex:1 },
  searchInput:   { width:'100%', padding:'16px 48px 16px 48px',
                   borderRadius:'16px', border:'2px solid rgba(240,192,64,0.35)',
                   background:'rgba(255,255,255,0.05)', color:'#f0e6d2',
                   fontFamily:"'Crimson Text',serif", fontSize:'1.1rem',
                   outline:'none', boxSizing:'border-box',
                   transition:'border-color 0.2s',
                   lineHeight:'1.5' },
  clearBtn:      { position:'absolute', right:'16px', background:'none', border:'none',
                   color:'#c8a96e', cursor:'pointer', fontSize:'1rem', zIndex:1 },
  historyDrop:   { background:'#1a0a2e', border:'1px solid rgba(240,192,64,0.25)',
                   borderRadius:'12px', padding:'8px', zIndex:100,
                   boxShadow:'0 8px 32px rgba(0,0,0,0.5)' },
  historyHeader: { display:'flex', justifyContent:'space-between', alignItems:'center',
                   padding:'4px 8px 8px' },
  clearHistBtn:  { background:'none', border:'none', color:'#e74c3c',
                   cursor:'pointer', fontSize:'0.78rem', fontFamily:'inherit' },
  historyItem:   { display:'block', width:'100%', textAlign:'left',
                   padding:'8px 12px', borderRadius:'8px', border:'none',
                   background:'transparent', color:'#c8a96e',
                   cursor:'pointer', fontFamily:'inherit', fontSize:'0.9rem',
                   transition:'background 0.15s' },
  modeToggle:    { display:'flex', background:'rgba(255,255,255,0.04)',
                   border:'1px solid rgba(255,255,255,0.1)',
                   borderRadius:'12px', padding:'3px', gap:'3px' },
  modeBtn:       { padding:'7px 16px', borderRadius:'9px', border:'none',
                   background:'transparent', color:'#c8a96e',
                   cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem',
                   transition:'all 0.15s', whiteSpace:'nowrap' },
  modeBtnOn:     { background:'rgba(240,192,64,0.15)', color:'#f0c040', fontWeight:'700' },
  searchBtn:     { padding:'12px 28px', borderRadius:'14px', border:'none',
                   background:'linear-gradient(135deg,#f0c040,#e0a800)',
                   color:'#1a0a00', fontFamily:'inherit', fontSize:'1rem',
                   fontWeight:'700', transition:'opacity 0.2s',
                   boxShadow:'0 4px 16px rgba(240,192,64,0.3)', whiteSpace:'nowrap' },
  aiLoadingBar:  { marginTop:'10px', padding:'10px 16px',
                   background:'rgba(156,39,176,0.08)',
                   border:'1px solid rgba(156,39,176,0.2)',
                   borderRadius:'10px', animation:'fadeIn 0.3s ease' },
  spinner:       { width:'16px', height:'16px', borderRadius:'50%',
                   border:'2px solid rgba(240,192,64,0.2)',
                   borderTopColor:'#f0c040',
                   animation:'spin 0.8s linear infinite', flexShrink:0 },
  suggestSection:{ marginBottom:'2.5rem' },
  suggestLabel:  { color:'#c8a96e', fontSize:'0.85rem', fontWeight:'700',
                   textTransform:'uppercase', letterSpacing:'0.08em',
                   marginBottom:'1rem' },
  suggestGrid:   { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',
                   gap:'10px' },
  chip:          { display:'flex', gap:'10px', alignItems:'center',
                   padding:'10px 14px', borderRadius:'12px',
                   border:'1px solid rgba(240,192,64,0.18)',
                   background:'rgba(255,255,255,0.03)',
                   cursor:'pointer', fontFamily:'inherit',
                   textAlign:'left', transition:'all 0.15s' },
  resultsSection:{ marginBottom:'2rem' },
  resultsHeader: { display:'flex', justifyContent:'space-between', alignItems:'center',
                   flexWrap:'wrap', gap:'10px', marginBottom:'1.25rem' },
  newSearchBtn:  { padding:'6px 16px', borderRadius:'14px',
                   border:'1px solid rgba(240,192,64,0.3)',
                   background:'transparent', color:'#f0c040',
                   cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem' },
  empty:         { textAlign:'center', padding:'3rem 1rem',
                   color:'#c8a96e', maxWidth:'480px', margin:'0 auto' },
  howSection:    { marginTop:'3rem', paddingTop:'2rem',
                   borderTop:'1px solid rgba(240,192,64,0.1)' },
  howTitle:      { color:'#f0c040', fontSize:'1.4rem', fontWeight:'700',
                   textAlign:'center', marginBottom:'1.5rem' },
  howGrid:       { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',
                   gap:'14px' },
  toast:         { position:'fixed', bottom:'28px', left:'50%',
                   transform:'translateX(-50%)', background:'#2a1a08',
                   border:'1px solid #f0c040', color:'#f0e6d2',
                   padding:'12px 26px', borderRadius:'25px', zIndex:999,
                   fontSize:'1rem', whiteSpace:'nowrap',
                   animation:'fadeUp 0.2s ease',
                   boxShadow:'0 4px 20px rgba(0,0,0,0.5)' },
}