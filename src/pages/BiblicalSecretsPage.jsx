import React, { useState, useMemo } from 'react'

// ══════════════════════════════════════════════════════════════════
// DATA — 60 Biblical Secrets
// ══════════════════════════════════════════════════════════════════
const SECRETS = [
  // ── WORDS & LANGUAGE ──────────────────────────────────────────
  {
    id: 1, category: 'Words & Language', icon: '📜',
    question: 'How many times does the word "Christian" appear in the Bible?',
    secret: 'Only 3 times! The word "Christian" appears just three times in the entire Bible — Acts 11:26, Acts 26:28, and 1 Peter 4:16. Early believers were first called "followers of the Way."',
    reference: 'Acts 11:26',
  },
  {
    id: 2, category: 'Words & Language', icon: '📜',
    question: 'What is the shortest verse in the entire Bible?',
    secret: '"Jesus wept." — John 11:35. Just two words in English, making it the shortest verse. It shows the deep humanity and compassion of Jesus at the tomb of Lazarus.',
    reference: 'John 11:35',
  },
  {
    id: 3, category: 'Words & Language', icon: '📜',
    question: 'What is the longest verse in the Bible?',
    secret: 'Esther 8:9 is the longest verse in the Bible, containing 90 words in the English Standard Version. It describes a royal decree sent throughout the Persian empire.',
    reference: 'Esther 8:9',
  },
  {
    id: 4, category: 'Words & Language', icon: '📜',
    question: 'Does the word "Trinity" appear in the Bible?',
    secret: 'No! The word "Trinity" never appears anywhere in the Bible. The doctrine is drawn from multiple passages, but the word itself was coined by theologian Tertullian around 200 AD.',
    reference: 'Matthew 28:19',
  },
  {
    id: 5, category: 'Words & Language', icon: '📜',
    question: 'What word appears most often in the Bible?',
    secret: 'The word "LORD" (referring to God) appears over 7,000 times in the Old Testament alone, making it the most frequently used significant word in all of Scripture.',
    reference: 'Psalm 118:1',
  },
  {
    id: 6, category: 'Words & Language', icon: '📜',
    question: 'Does the word "Easter" belong in the Bible?',
    secret: 'In most translations, no. The King James Version uses "Easter" once in Acts 12:4, but modern scholars agree it is a mistranslation of "Pascha" — the Greek word for Passover.',
    reference: 'Acts 12:4',
  },
  {
    id: 7, category: 'Words & Language', icon: '📜',
    question: 'What is the middle chapter of the Bible?',
    secret: 'Psalm 117 is the middle chapter of the Bible. It is also the shortest chapter — just 2 verses. It sits at the very centre of Scripture, calling all nations to praise the Lord.',
    reference: 'Psalm 117',
  },
  {
    id: 8, category: 'Words & Language', icon: '📜',
    question: 'What is the middle verse of the Bible?',
    secret: 'Psalm 118:8 is considered the middle verse of the Bible: "It is better to take refuge in the Lord than to trust in humans." Many see this as the heart of Scripture\'s message.',
    reference: 'Psalm 118:8',
  },

  // ── NUMBERS & RECORDS ─────────────────────────────────────────
  {
    id: 9, category: 'Numbers & Records', icon: '🔢',
    question: 'How many books are in the Bible?',
    secret: '66 books — 39 in the Old Testament and 27 in the New Testament. Written by over 40 different authors across approximately 1,500 years, yet with one unified message of redemption.',
    reference: 'Genesis to Revelation',
  },
  {
    id: 10, category: 'Numbers & Records', icon: '🔢',
    question: 'How old was Methuselah, the oldest person in the Bible?',
    secret: 'Methuselah lived 969 years — the longest recorded lifespan in the Bible. He died in the same year as the Great Flood, according to biblical chronology.',
    reference: 'Genesis 5:27',
  },
  {
    id: 11, category: 'Numbers & Records', icon: '🔢',
    question: 'How many Psalms are in the Book of Psalms?',
    secret: '150 Psalms — making it the longest book in the Bible by chapter count. David wrote at least 73 of them. The Psalms cover every human emotion from despair to ecstatic praise.',
    reference: 'Psalm 150',
  },
  {
    id: 12, category: 'Numbers & Records', icon: '🔢',
    question: 'What number is considered sacred and appears throughout Scripture?',
    secret: 'The number 7 appears over 700 times in the Bible. It represents completeness and perfection — 7 days of creation, 7 churches in Revelation, 7 seals, 7 trumpets, and much more.',
    reference: 'Genesis 2:2',
  },
  {
    id: 13, category: 'Numbers & Records', icon: '🔢',
    question: 'How many people did Jesus feed with five loaves and two fish?',
    secret: '5,000 men — plus women and children, meaning the actual crowd could have been 15,000 to 20,000 people. Twelve baskets of fragments were collected afterward.',
    reference: 'Matthew 14:21',
  },
  {
    id: 14, category: 'Numbers & Records', icon: '🔢',
    question: 'How many languages has the Bible been translated into?',
    secret: 'The Bible has been translated into over 3,500 languages, making it the most translated book in human history. The full Bible exists in over 700 languages, with portions in thousands more.',
    reference: 'Revelation 7:9',
  },
  {
    id: 15, category: 'Numbers & Records', icon: '🔢',
    question: 'How many times is the number 666 mentioned in the Bible?',
    secret: 'The number 666 appears only once in the New Testament — in Revelation 13:18. Interestingly, Solomon also received 666 talents of gold per year, mentioned in 1 Kings 10:14.',
    reference: 'Revelation 13:18',
  },

  // ── PEOPLE & CHARACTERS ───────────────────────────────────────
  {
    id: 16, category: 'People & Characters', icon: '👤',
    question: 'Who is the only woman to have her age recorded at death in the Bible?',
    secret: 'Sarah, wife of Abraham. Genesis 23:1 records that she died at 127 years old — the only woman in the Bible whose exact age at death is given.',
    reference: 'Genesis 23:1',
  },
  {
    id: 17, category: 'People & Characters', icon: '👤',
    question: 'Who was the first murderer in the Bible?',
    secret: 'Cain, the son of Adam and Eve. He killed his brother Abel out of jealousy because God accepted Abel\'s offering but not his. This is recorded in Genesis 4.',
    reference: 'Genesis 4:8',
  },
  {
    id: 18, category: 'People & Characters', icon: '👤',
    question: 'Which person in the Bible never died?',
    secret: 'Two people never died — Enoch (Genesis 5:24, "God took him away") and Elijah (2 Kings 2:11, taken to heaven in a whirlwind and chariot of fire). Both were translated directly to God.',
    reference: 'Genesis 5:24',
  },
  {
    id: 19, category: 'People & Characters', icon: '👤',
    question: 'How many brothers did Joseph (of the coat of many colours) have?',
    secret: 'Joseph had 11 brothers — making 12 sons of Jacob in total. These 12 sons became the fathers of the 12 tribes of Israel. Joseph was the 11th son, born to Rachel.',
    reference: 'Genesis 35:22',
  },
  {
    id: 20, category: 'People & Characters', icon: '👤',
    question: 'Who was the shortest man in the Bible?',
    secret: 'Zacchaeus is often cited as the shortest man — Luke 19:3 says he "was short in stature" and had to climb a tree to see Jesus. Some also suggest Bildad the Shuhite (a "shoe-height" pun).',
    reference: 'Luke 19:3',
  },
  {
    id: 21, category: 'People & Characters', icon: '👤',
    question: 'How many wives did King Solomon have?',
    secret: '700 wives and 300 concubines — 1,000 women in total! 1 Kings 11:3 records this, noting that his foreign wives turned his heart away from God in his old age.',
    reference: '1 Kings 11:3',
  },
  {
    id: 22, category: 'People & Characters', icon: '👤',
    question: 'Who wrote most of the New Testament?',
    secret: 'The Apostle Paul wrote 13 of the 27 New Testament books — nearly half! If Hebrews is also attributed to him, that is 14. He wrote more Scripture than any other single author.',
    reference: 'Romans 1:1',
  },
  {
    id: 23, category: 'People & Characters', icon: '👤',
    question: 'What was the Apostle Peter\'s original name?',
    secret: 'Simon! His birth name was Simon, son of Jonah. Jesus renamed him Peter (Petros in Greek, Cephas in Aramaic), meaning "rock," when He called him to be a disciple.',
    reference: 'John 1:42',
  },
  {
    id: 24, category: 'People & Characters', icon: '👤',
    question: 'Who was the first person to be called a "Hebrew" in the Bible?',
    secret: 'Abraham! Genesis 14:13 calls him "Abram the Hebrew" — the first use of this term in Scripture. The word likely comes from "Eber," one of Abraham\'s ancestors.',
    reference: 'Genesis 14:13',
  },

  // ── CREATION & NATURE ─────────────────────────────────────────
  {
    id: 25, category: 'Creation & Nature', icon: '🌿',
    question: 'What was the first thing God created according to Genesis?',
    secret: 'Light! "And God said, Let there be light: and there was light" — Genesis 1:3. This happened on Day 1, three days before the sun, moon, and stars were created on Day 4.',
    reference: 'Genesis 1:3',
  },
  {
    id: 26, category: 'Creation & Nature', icon: '🌿',
    question: 'What animal spoke in the Bible besides the serpent in Eden?',
    secret: "Balaam's donkey! In Numbers 22, God opened the mouth of a donkey and it spoke to the prophet Balaam, rebuking him for his actions. The donkey saw the angel of the Lord before Balaam did.",
    reference: 'Numbers 22:28',
  },
  {
    id: 27, category: 'Creation & Nature', icon: '🌿',
    question: 'How long did it rain during Noah\'s flood?',
    secret: '40 days and 40 nights of rain — but Noah and his family were on the ark for over a year! The waters took months to recede. They entered the ark in the 600th year of Noah\'s life.',
    reference: 'Genesis 7:12',
  },
  {
    id: 28, category: 'Creation & Nature', icon: '🌿',
    question: 'What was the forbidden fruit in the Garden of Eden?',
    secret: 'The Bible never says it was an apple! Genesis 3 simply calls it "the fruit of the tree." The apple tradition came from a Latin translation. It could have been a fig, pomegranate, or another fruit.',
    reference: 'Genesis 3:6',
  },
  {
    id: 29, category: 'Creation & Nature', icon: '🌿',
    question: 'What bird did Noah first send out from the ark?',
    secret: 'A raven! Genesis 8:7 says Noah first sent out a raven, which flew back and forth. Then he sent a dove, which returned with an olive leaf — the famous symbol of peace and new life.',
    reference: 'Genesis 8:7',
  },
  {
    id: 30, category: 'Creation & Nature', icon: '🌿',
    question: 'How many clean animals of each kind did Noah take on the ark?',
    secret: 'Seven pairs (14) of each clean animal, and only one pair (2) of unclean animals! Most people think it was two of every animal, but Genesis 7:2 specifies seven pairs of clean animals.',
    reference: 'Genesis 7:2',
  },

  // ── JESUS & THE GOSPELS ───────────────────────────────────────
  {
    id: 31, category: 'Jesus & The Gospels', icon: '✝️',
    question: 'How many miracles of Jesus are recorded in the Gospels?',
    secret: '37 distinct miracles of Jesus are recorded across the four Gospels. John 21:25 says that if everything Jesus did were written down, "the whole world would not have room for the books."',
    reference: 'John 21:25',
  },
  {
    id: 32, category: 'Jesus & The Gospels', icon: '✝️',
    question: 'What language did Jesus primarily speak?',
    secret: 'Aramaic — the common language of first-century Judea. The New Testament was written in Greek, but Jesus and His disciples spoke Aramaic daily. Some Aramaic words are preserved in the Gospels.',
    reference: 'Mark 5:41',
  },
  {
    id: 33, category: 'Jesus & The Gospels', icon: '✝️',
    question: 'How old was Jesus when He began His public ministry?',
    secret: 'About 30 years old. Luke 3:23 says "Jesus himself was about thirty years old when he began his ministry." His ministry lasted approximately three years before the crucifixion.',
    reference: 'Luke 3:23',
  },
  {
    id: 34, category: 'Jesus & The Gospels', icon: '✝️',
    question: 'Which Gospel does not include the birth of Jesus?',
    secret: 'Both Mark and John! Mark begins with John the Baptist and Jesus\'s baptism. John begins with "In the beginning was the Word." Only Matthew and Luke include the nativity story.',
    reference: 'Mark 1:1',
  },
  {
    id: 35, category: 'Jesus & The Gospels', icon: '✝️',
    question: 'What did the wise men actually give Jesus?',
    secret: 'Gold, frankincense, and myrrh — but the Bible never says there were three wise men! Matthew 2 mentions three gifts, not three men. There could have been two, five, or twenty wise men.',
    reference: 'Matthew 2:11',
  },
  {
    id: 36, category: 'Jesus & The Gospels', icon: '✝️',
    question: 'What was Jesus\'s first recorded miracle?',
    secret: 'Turning water into wine at the wedding in Cana — John 2:1-11. Jesus turned approximately 120 to 180 gallons of water into wine. The master of the banquet said it was the best wine served.',
    reference: 'John 2:11',
  },
  {
    id: 37, category: 'Jesus & The Gospels', icon: '✝️',
    question: 'How many disciples did Jesus have in total?',
    secret: 'Jesus had 12 apostles, but Luke 10:1 records He also appointed 72 others and sent them out two by two. The wider circle of disciples was much larger than most people realise.',
    reference: 'Luke 10:1',
  },

  // ── PROPHECY & FULFILMENT ─────────────────────────────────────
  {
    id: 38, category: 'Prophecy & Fulfilment', icon: '🔮',
    question: 'How many Old Testament prophecies did Jesus fulfil?',
    secret: 'Scholars count between 300 and 456 Old Testament prophecies fulfilled by Jesus. The mathematical probability of one person fulfilling just 8 of them by chance is 1 in 10 to the power of 17.',
    reference: 'Isaiah 53',
  },
  {
    id: 39, category: 'Prophecy & Fulfilment', icon: '🔮',
    question: 'Which prophet predicted Jesus would be born in Bethlehem?',
    secret: 'Micah! Around 700 years before Jesus was born, Micah 5:2 predicted: "But you, Bethlehem Ephrathah... out of you will come for me one who will be ruler over Israel."',
    reference: 'Micah 5:2',
  },
  {
    id: 40, category: 'Prophecy & Fulfilment', icon: '🔮',
    question: 'Who predicted Jesus would enter Jerusalem on a donkey?',
    secret: 'Zechariah, about 500 years before it happened! Zechariah 9:9 says "See, your king comes to you... lowly and riding on a donkey." Jesus fulfilled this on Palm Sunday.',
    reference: 'Zechariah 9:9',
  },
  {
    id: 41, category: 'Prophecy & Fulfilment', icon: '🔮',
    question: 'Which chapter of Isaiah is so detailed about Jesus that it is called the "Fifth Gospel"?',
    secret: 'Isaiah 53 — written 700 years before Christ. It describes His suffering, rejection, being pierced for our sins, buried with the rich, and rising again. It is so precise that some thought it was written after the crucifixion.',
    reference: 'Isaiah 53',
  },
  {
    id: 42, category: 'Prophecy & Fulfilment', icon: '🔮',
    question: 'How much was Judas paid to betray Jesus?',
    secret: '30 pieces of silver — exactly as prophesied by Zechariah 11:12-13 about 500 years earlier. This was the price of a slave. Judas later threw the money into the temple and hanged himself.',
    reference: 'Matthew 26:15',
  },

  // ── STRANGE & SURPRISING ──────────────────────────────────────
  {
    id: 43, category: 'Strange & Surprising', icon: '😲',
    question: 'Did Jonah really survive inside a great fish?',
    secret: 'The Bible says yes — Jonah 1:17 says "the Lord provided a huge fish to swallow Jonah, and Jonah was in the belly of the fish three days and three nights." Jesus himself referenced this event in Matthew 12:40.',
    reference: 'Jonah 1:17',
  },
  {
    id: 44, category: 'Strange & Surprising', icon: '😲',
    question: 'What strange thing happened to the sun during Joshua\'s battle?',
    secret: 'The sun stood still! Joshua 10:13 records that "the sun stopped in the middle of the sky and delayed going down about a full day" so Israel could finish defeating their enemies.',
    reference: 'Joshua 10:13',
  },
  {
    id: 45, category: 'Strange & Surprising', icon: '😲',
    question: 'What happened to the soldiers who tried to arrest Elijah?',
    secret: 'Fire came down from heaven and consumed them! In 2 Kings 1, two groups of 50 soldiers were each destroyed by fire from heaven when they came to arrest Elijah. The third captain begged for mercy.',
    reference: '2 Kings 1:10',
  },
  {
    id: 46, category: 'Strange & Surprising', icon: '😲',
    question: 'Did anyone in the Bible raise the dead before Jesus?',
    secret: 'Yes! Both Elijah (1 Kings 17:22) and Elisha (2 Kings 4:35) raised dead children. Even after Elisha died, a dead man thrown into his tomb came back to life when he touched Elisha\'s bones (2 Kings 13:21).',
    reference: '1 Kings 17:22',
  },
  {
    id: 47, category: 'Strange & Surprising', icon: '😲',
    question: 'What happened to the Ark of the Covenant when the Philistines captured it?',
    secret: 'God struck the Philistines with tumours and their idol Dagon fell face-down before the Ark twice! The Philistines were so terrified they sent the Ark back to Israel on a cart pulled by cows.',
    reference: '1 Samuel 5:6',
  },
  {
    id: 48, category: 'Strange & Surprising', icon: '😲',
    question: 'What unusual weapon did Samson use to kill 1,000 men?',
    secret: 'The jawbone of a donkey! Judges 15:15-16 records that Samson picked up a fresh donkey\'s jawbone and struck down 1,000 Philistine men with it. He then composed a victory poem about it.',
    reference: 'Judges 15:15',
  },
  {
    id: 49, category: 'Strange & Surprising', icon: '😲',
    question: 'What happened to the young men who mocked the prophet Elisha?',
    secret: 'Two bears came out of the woods and mauled 42 of them! 2 Kings 2:24 records this after youths mocked Elisha saying "Go up, you baldhead!" It is one of the most startling judgements in Scripture.',
    reference: '2 Kings 2:24',
  },
  {
    id: 50, category: 'Strange & Surprising', icon: '😲',
    question: 'Did an axe head really float in the Bible?',
    secret: 'Yes! In 2 Kings 6:5-7, a borrowed iron axe head fell into the Jordan River. Elisha cut a stick, threw it into the water, and the iron axe head floated to the surface. Iron does not float naturally.',
    reference: '2 Kings 6:6',
  },

  // ── AFRICA & THE BIBLE ────────────────────────────────────────
  {
    id: 51, category: 'Africa & The Bible', icon: '🌍',
    question: 'How many times is Africa mentioned or referenced in the Bible?',
    secret: 'Africa is referenced hundreds of times! Egypt alone is mentioned over 700 times. Ethiopia (Cush) appears about 50 times. Africa played a central role in biblical history from Genesis to Revelation.',
    reference: 'Genesis 12:10',
  },
  {
    id: 52, category: 'Africa & The Bible', icon: '🌍',
    question: 'Who helped Jesus carry His cross?',
    secret: 'Simon of Cyrene — a man from North Africa! Cyrene was in modern-day Libya. Mark 15:21 identifies him as the father of Alexander and Rufus, suggesting his family became known Christians.',
    reference: 'Mark 15:21',
  },
  {
    id: 53, category: 'Africa & The Bible', icon: '🌍',
    question: 'Where did the Holy Family flee to protect baby Jesus?',
    secret: 'Egypt — Africa! Matthew 2:13-14 records that Joseph, Mary, and Jesus fled to Egypt to escape King Herod. This fulfilled Hosea 11:1: "Out of Egypt I called my son."',
    reference: 'Matthew 2:13',
  },
  {
    id: 54, category: 'Africa & The Bible', icon: '🌍',
    question: 'Who was the first Gentile convert recorded in Acts?',
    secret: 'An Ethiopian eunuch — an African! Acts 8:26-40 records Philip meeting an Ethiopian official reading Isaiah on his chariot. Philip explained the scripture, and the Ethiopian was baptised on the spot.',
    reference: 'Acts 8:27',
  },
  {
    id: 55, category: 'Africa & The Bible', icon: '🌍',
    question: 'Was Moses married to an African woman?',
    secret: 'Yes! Numbers 12:1 records that Moses married a Cushite (Ethiopian/African) woman. When Miriam and Aaron criticised this marriage, God struck Miriam with leprosy as a judgement.',
    reference: 'Numbers 12:1',
  },

  // ── WISDOM & PROVERBS ─────────────────────────────────────────
  {
    id: 56, category: 'Wisdom & Proverbs', icon: '💡',
    question: 'How many proverbs did King Solomon write?',
    secret: '1 Kings 4:32 says Solomon spoke 3,000 proverbs and 1,005 songs! The Book of Proverbs contains only a selection. He was considered the wisest man who ever lived.',
    reference: '1 Kings 4:32',
  },
  {
    id: 57, category: 'Wisdom & Proverbs', icon: '💡',
    question: 'What does the Bible say is the beginning of wisdom?',
    secret: '"The fear of the Lord is the beginning of wisdom" — this phrase appears in both Psalm 111:10 and Proverbs 9:10. True wisdom starts with reverence and awe of God.',
    reference: 'Proverbs 9:10',
  },
  {
    id: 58, category: 'Wisdom & Proverbs', icon: '💡',
    question: 'Which book of the Bible never mentions God by name?',
    secret: 'The Book of Esther! God is never explicitly named in Esther, yet His providence is evident throughout the entire story. The Song of Solomon is also notable for rarely mentioning God directly.',
    reference: 'Esther 4:14',
  },
  {
    id: 59, category: 'Wisdom & Proverbs', icon: '💡',
    question: 'What does the Bible say about laughter?',
    secret: '"A cheerful heart is good medicine, but a crushed spirit dries up the bones" — Proverbs 17:22. The Bible celebrates joy and laughter as gifts from God, not signs of spiritual weakness.',
    reference: 'Proverbs 17:22',
  },
  {
    id: 60, category: 'Wisdom & Proverbs', icon: '💡',
    question: 'How many times does the Bible say "Do not be afraid" or "Fear not"?',
    secret: '"Fear not" or "Do not be afraid" appears 365 times in the Bible — one for every day of the year! Many scholars see this as God\'s daily reminder that we need not live in fear.',
    reference: 'Isaiah 41:10',
  },
]

const CATEGORIES = ['All', 'Words & Language', 'Numbers & Records', 'People & Characters',
  'Creation & Nature', 'Jesus & The Gospels', 'Prophecy & Fulfilment',
  'Strange & Surprising', 'Africa & The Bible', 'Wisdom & Proverbs']

const CATEGORY_COLORS = {
  'Words & Language':      '#f0c040',
  'Numbers & Records':     '#2196f3',
  'People & Characters':   '#e91e63',
  'Creation & Nature':     '#4caf50',
  'Jesus & The Gospels':   '#ff9800',
  'Prophecy & Fulfilment': '#9c27b0',
  'Strange & Surprising':  '#ff5722',
  'Africa & The Bible':    '#00bcd4',
  'Wisdom & Proverbs':     '#8bc34a',
}

// ══════════════════════════════════════════════════════════════════
// FONT & ANIMATIONS
// ══════════════════════════════════════════════════════════════════
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`

const ANIM = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 12px rgba(240,192,64,0.15); }
    50%      { box-shadow: 0 0 30px rgba(240,192,64,0.4); }
  }
  @keyframes flipIn {
    from { transform: rotateY(90deg); opacity:0; }
    to   { transform: rotateY(0deg);  opacity:1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .secret-card {
    perspective: 1000px;
    cursor: pointer;
    animation: fadeUp 0.4s ease both;
  }
  .secret-card:hover .card-inner {
    transform: scale(1.02);
  }
  .card-inner {
    transition: transform 0.2s ease;
    border-radius: 16px;
    overflow: hidden;
  }
  .card-face {
    animation: flipIn 0.35s ease;
  }
  .copy-btn:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
  .cat-pill:hover {
    opacity: 0.85;
  }
`

// ══════════════════════════════════════════════════════════════════
// FLIP CARD COMPONENT
// ══════════════════════════════════════════════════════════════════
function SecretCard({ secret, index, revealed, onReveal, onCopy }) {
  const color = CATEGORY_COLORS[secret.category] || '#f0c040'

  return (
    <div
      className="secret-card"
      style={{ animationDelay: `${(index % 12) * 0.05}s` }}
      onClick={() => onReveal(secret.id)}
    >
      <div className="card-inner">
        {!revealed ? (
          // ── FRONT (question) ──────────────────────────────────
          <div className="card-face" style={{
            background:   'rgba(255,255,255,0.04)',
            border:       `1px solid ${color}33`,
            borderRadius: '16px',
            padding:      '1.6rem',
            minHeight:    '220px',
            display:      'flex',
            flexDirection:'column',
            justifyContent:'space-between',
            position:     'relative',
            overflow:     'hidden',
          }}>
            {/* Shimmer top bar */}
            <div style={{
              position:   'absolute',
              top:        0, left:0, right:0,
              height:     '3px',
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              backgroundSize: '200% 100%',
              animation:  'shimmer 2s linear infinite',
            }} />

            {/* Category + icon */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
              <span style={{
                background:   color + '20',
                color:        color,
                border:       `1px solid ${color}44`,
                borderRadius: '12px',
                padding:      '3px 10px',
                fontSize:     '0.72rem',
                fontWeight:   '700',
                textTransform:'uppercase',
                letterSpacing:'0.06em',
              }}>
                {secret.category}
              </span>
              <span style={{ fontSize:'1.6rem' }}>{secret.icon}</span>
            </div>

            {/* Question */}
            <p style={{
              color:       '#f0e6d2',
              fontSize:    '1.1rem',
              lineHeight:  '1.7',
              fontStyle:   'italic',
              flex:        1,
              margin:      '0 0 1.25rem',
            }}>
              🤔 {secret.question}
            </p>

            {/* Tap to reveal */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '8px',
              padding:        '10px',
              borderRadius:   '10px',
              background:     color + '15',
              border:         `1px dashed ${color}55`,
              color:          color,
              fontSize:       '0.85rem',
              fontWeight:     '700',
              letterSpacing:  '0.04em',
            }}>
              ✨ Tap to reveal the secret
            </div>
          </div>
        ) : (
          // ── BACK (secret revealed) ────────────────────────────
          <div className="card-face" style={{
            background:   `linear-gradient(135deg, ${color}12, rgba(255,255,255,0.04))`,
            border:       `1px solid ${color}66`,
            borderRadius: '16px',
            padding:      '1.6rem',
            minHeight:    '220px',
            display:      'flex',
            flexDirection:'column',
            justifyContent:'space-between',
            position:     'relative',
            overflow:     'hidden',
          }}>
            {/* Glow top bar */}
            <div style={{
              position:   'absolute',
              top:        0, left:0, right:0,
              height:     '3px',
              background: color,
              boxShadow:  `0 0 12px ${color}`,
            }} />

            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <span style={{
                background:   color + '25',
                color:        color,
                border:       `1px solid ${color}55`,
                borderRadius: '12px',
                padding:      '3px 10px',
                fontSize:     '0.72rem',
                fontWeight:   '700',
                textTransform:'uppercase',
                letterSpacing:'0.06em',
              }}>
                🔓 Revealed!
              </span>
              <span style={{ fontSize:'1.6rem' }}>{secret.icon}</span>
            </div>

            {/* Secret text */}
            <p style={{
              color:      '#f0e6d2',
              fontSize:   '1.05rem',
              lineHeight: '1.75',
              flex:       1,
              margin:     '0 0 1rem',
            }}>
              {secret.secret}
            </p>

            {/* Reference + copy */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px' }}>
              <span style={{
                color:       color,
                fontSize:    '0.82rem',
                fontWeight:  '700',
                fontStyle:   'italic',
              }}>
                📖 {secret.reference}
              </span>
              <div style={{ display:'flex', gap:'8px' }}>
                <button
                  className="copy-btn"
                  style={{
                    background:   'transparent',
                    border:       `1px solid ${color}55`,
                    borderRadius: '14px',
                    padding:      '4px 12px',
                    color:        color,
                    fontSize:     '0.78rem',
                    cursor:       'pointer',
                    fontFamily:   'inherit',
                    transition:   'all 0.15s',
                  }}
                  onClick={e => { e.stopPropagation(); onCopy(secret) }}
                >
                  📋 Copy
                </button>
                <button
                  className="copy-btn"
                  style={{
                    background:   'transparent',
                    border:       `1px solid rgba(255,255,255,0.2)`,
                    borderRadius: '14px',
                    padding:      '4px 12px',
                    color:        '#c8a96e',
                    fontSize:     '0.78rem',
                    cursor:       'pointer',
                    fontFamily:   'inherit',
                    transition:   'all 0.15s',
                  }}
                  onClick={e => { e.stopPropagation(); onReveal(secret.id) }}
                >
                  🔄 Hide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function BiblicalSecretsPage() {
  const [revealed,  setRevealed]  = useState(new Set())
  const [category,  setCategory]  = useState('All')
  const [search,    setSearch]    = useState('')
  const [toast,     setToast]     = useState(null)
  const [sortBy,    setSortBy]    = useState('default') // 'default' | 'revealed' | 'hidden'

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const toggleReveal = id => {
    setRevealed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleCopy = secret => {
    const text = `🔍 Biblical Secret\n\n❓ ${secret.question}\n\n✨ ${secret.secret}\n\n📖 ${secret.reference}\n\n— Discovered on ScriptureHub`
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copied to clipboard 📋'))
      .catch(() => showToast('Select text manually to copy'))
  }

  const revealAll = () => {
    setRevealed(new Set(filtered.map(s => s.id)))
    showToast(`All ${filtered.length} secrets revealed! ✨`)
  }

  const hideAll = () => {
    setRevealed(new Set())
    showToast('All cards reset 🔄')
  }

  const filtered = useMemo(() => {
    let list = SECRETS
    if (category !== 'All') list = list.filter(s => s.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.question.toLowerCase().includes(q) ||
        s.secret.toLowerCase().includes(q) ||
        s.reference.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'revealed') list = [...list].sort((a,b) => (revealed.has(b.id)?1:0) - (revealed.has(a.id)?1:0))
    if (sortBy === 'hidden')   list = [...list].sort((a,b) => (revealed.has(a.id)?1:0) - (revealed.has(b.id)?1:0))
    return list
  }, [category, search, sortBy, revealed])

  const revealedCount = filtered.filter(s => revealed.has(s.id)).length

  return (
    <div style={s.page}>
      <style>{FONT + ANIM}</style>

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}

      {/* ── Hero Banner ── */}
      <div style={s.hero}>
        <div style={s.heroIcon}>🔍</div>
        <h1 style={s.heroTitle}>Biblical Secrets</h1>
        <p style={s.heroSub}>
          Discover hidden treasures, surprising facts, and amazing truths
          buried within the pages of Scripture.
          <br />
          <em>Tap any card to reveal its secret.</em>
        </p>
        <div style={s.heroStats}>
          <div style={s.stat}>
            <span style={s.statNum}>{SECRETS.length}</span>
            <span style={s.statLabel}>Secrets</span>
          </div>
          <div style={s.statDiv} />
          <div style={s.stat}>
            <span style={s.statNum}>{CATEGORIES.length - 1}</span>
            <span style={s.statLabel}>Categories</span>
          </div>
          <div style={s.statDiv} />
          <div style={s.stat}>
            <span style={{ ...s.statNum, color:'#4caf50' }}>{revealed.size}</span>
            <span style={s.statLabel}>Discovered</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={s.progressWrap}>
          <div style={s.progressBar}>
            <div style={{
              ...s.progressFill,
              width: `${revealed.size === 0 ? 0 : Math.round((revealed.size / SECRETS.length) * 100)}%`,
            }} />
          </div>
          <span style={s.progressLabel}>
            {revealed.size === 0
              ? 'Start discovering!'
              : revealed.size === SECRETS.length
              ? '🎉 All secrets discovered!'
              : `${Math.round((revealed.size / SECRETS.length) * 100)}% discovered`}
          </span>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search secrets, references, or categories…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button style={s.searchClear} onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* ── Category pills ── */}
      <div style={s.catRow}>
        {CATEGORIES.map(c => {
          const color = CATEGORY_COLORS[c] || '#f0c040'
          const isOn  = category === c
          return (
            <button
              key={c}
              className="cat-pill"
              style={{
                padding:      '6px 14px',
                borderRadius: '20px',
                border:       `1px solid ${isOn ? color : 'rgba(240,192,64,0.25)'}`,
                background:   isOn ? color + '20' : 'transparent',
                color:        isOn ? color : '#c8a96e',
                cursor:       'pointer',
                fontFamily:   'inherit',
                fontSize:     '0.82rem',
                fontWeight:   isOn ? '700' : '500',
                transition:   'all 0.2s',
              }}
              onClick={() => setCategory(c)}
            >
              {c === 'All' ? '🌟 All' : c}
            </button>
          )
        })}
      </div>

      {/* ── Controls row ── */}
      <div style={s.ctrlRow}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
          <span style={s.resultCount}>
            {filtered.length} secret{filtered.length !== 1 ? 's' : ''}
            {revealedCount > 0 && ` · ${revealedCount} revealed`}
          </span>
        </div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ color:'#c8a96e', fontSize:'0.85rem' }}>Sort:</span>
          {[['default','Default'],['hidden','Hidden first'],['revealed','Revealed first']].map(([val,label]) => (
            <button key={val}
              style={{
                padding:      '4px 12px',
                borderRadius: '14px',
                border:       `1px solid ${sortBy===val ? '#f0c040' : 'rgba(240,192,64,0.25)'}`,
                background:   sortBy===val ? 'rgba(240,192,64,0.12)' : 'transparent',
                color:        sortBy===val ? '#f0c040' : '#c8a96e',
                cursor:       'pointer',
                fontFamily:   'inherit',
                fontSize:     '0.8rem',
              }}
              onClick={() => setSortBy(val)}>
              {label}
            </button>
          ))}
          <button style={s.actionBtn} onClick={revealAll}>✨ Reveal All</button>
          <button style={{ ...s.actionBtn, borderColor:'rgba(255,255,255,0.2)', color:'#c8a96e' }}
            onClick={hideAll}>🔄 Reset</button>
        </div>
      </div>

      {/* ── Card Grid ── */}
      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
          No secrets match your search.
          <br />
          <button style={s.clearBtn}
            onClick={() => { setSearch(''); setCategory('All') }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((secret, i) => (
            <SecretCard
              key={secret.id}
              secret={secret}
              index={i}
              revealed={revealed.has(secret.id)}
              onReveal={toggleReveal}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      {/* ── Bottom banner ── */}
      {revealed.size === SECRETS.length && (
        <div style={s.completeBanner}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏆</div>
          <h3 style={{ color:'#f0c040', fontSize:'1.6rem', margin:'0 0 0.75rem' }}>
            All Secrets Discovered!
          </h3>
          <p style={{ color:'#c8a96e', lineHeight:'1.8', margin:0 }}>
            You have uncovered all {SECRETS.length} Biblical Secrets.
            <br />
            <strong style={{ color:'#f0c040' }}>
              "The secret things belong to the Lord our God, but the things revealed
              belong to us and to our children forever." — Deuteronomy 29:29
            </strong>
          </p>
        </div>
      )}

      <div style={s.bottomNote}>
        <p style={{ color:'#7a6040', fontSize:'0.85rem', textAlign:'center', fontStyle:'italic', margin:0 }}>
          Share these secrets with friends and family to spark conversations about Scripture. 🙏
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════
const s = {
  page:         { background:'#0d0800', minHeight:'100vh', color:'#f0e6d2',
                  padding:'2rem 1rem', fontFamily:"'Crimson Text', serif" },

  // Hero
  hero:         { textAlign:'center', maxWidth:'700px', margin:'0 auto 2.5rem',
                  padding:'2.5rem 1.5rem', borderRadius:'20px',
                  background:'linear-gradient(135deg, rgba(240,192,64,0.07), rgba(156,39,176,0.05))',
                  border:'1px solid rgba(240,192,64,0.2)',
                  animation:'glow 4s ease-in-out infinite' },
  heroIcon:     { fontSize:'4rem', marginBottom:'0.75rem' },
  heroTitle:    { color:'#f0c040', fontSize:'2.8rem', fontWeight:'700',
                  margin:'0 0 1rem', lineHeight:'1.2' },
  heroSub:      { color:'#c8a96e', fontSize:'1.05rem', lineHeight:'1.8',
                  margin:'0 0 2rem', fontStyle:'italic' },
  heroStats:    { display:'flex', justifyContent:'center', alignItems:'center',
                  gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.5rem' },
  stat:         { display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' },
  statNum:      { color:'#f0c040', fontSize:'2rem', fontWeight:'700', lineHeight:'1' },
  statLabel:    { color:'#c8a96e', fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.08em' },
  statDiv:      { width:'1px', height:'40px', background:'rgba(240,192,64,0.25)' },

  // Progress
  progressWrap: { maxWidth:'400px', margin:'0 auto' },
  progressBar:  { height:'6px', background:'rgba(255,255,255,0.08)',
                  borderRadius:'3px', overflow:'hidden', marginBottom:'8px' },
  progressFill: { height:'100%', background:'linear-gradient(90deg, #f0c040, #4caf50)',
                  borderRadius:'3px', transition:'width 0.5s ease' },
  progressLabel:{ color:'#c8a96e', fontSize:'0.85rem', fontStyle:'italic' },

  // Search
  searchWrap:   { position:'relative', maxWidth:'560px', margin:'0 auto 1.5rem',
                  display:'flex', alignItems:'center' },
  searchIcon:   { position:'absolute', left:'14px', fontSize:'1rem', pointerEvents:'none' },
  searchInput:  { width:'100%', padding:'12px 40px 12px 42px', borderRadius:'30px',
                  border:'1px solid rgba(240,192,64,0.4)',
                  background:'rgba(255,255,255,0.05)', color:'#f0e6d2',
                  fontFamily:"'Crimson Text',serif", fontSize:'1.05rem',
                  outline:'none', boxSizing:'border-box' },
  searchClear:  { position:'absolute', right:'14px', background:'none', border:'none',
                  color:'#c8a96e', cursor:'pointer', fontSize:'1rem' },

  // Category
  catRow:       { display:'flex', flexWrap:'wrap', gap:'8px',
                  justifyContent:'center', marginBottom:'1.5rem' },

  // Controls
  ctrlRow:      { display:'flex', justifyContent:'space-between', alignItems:'center',
                  maxWidth:'1000px', margin:'0 auto 1.5rem',
                  flexWrap:'wrap', gap:'0.75rem', padding:'0 0.5rem' },
  resultCount:  { color:'#c8a96e', fontStyle:'italic', fontSize:'0.9rem' },
  actionBtn:    { padding:'5px 14px', borderRadius:'14px',
                  border:'1px solid rgba(240,192,64,0.4)',
                  background:'rgba(240,192,64,0.08)', color:'#f0c040',
                  cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem',
                  transition:'all 0.15s' },

  // Grid
  grid:         { display:'grid',
                  gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
                  gap:'18px', maxWidth:'1000px', margin:'0 auto 3rem' },

  // Empty
  empty:        { textAlign:'center', color:'#c8a96e', fontSize:'1.1rem',
                  marginTop:'4rem', fontStyle:'italic' },
  clearBtn:     { background:'transparent', border:'none', color:'#f0c040',
                  cursor:'pointer', fontSize:'1rem', fontFamily:'inherit',
                  marginTop:'1rem', textDecoration:'underline' },

  // Complete banner
  completeBanner:{ textAlign:'center', maxWidth:'640px', margin:'0 auto 2rem',
                   padding:'2.5rem 1.5rem', borderRadius:'16px',
                   background:'rgba(240,192,64,0.08)',
                   border:'1px solid rgba(240,192,64,0.3)',
                   animation:'glow 3s ease-in-out infinite' },

  // Bottom
  bottomNote:   { maxWidth:'600px', margin:'0 auto 2rem', padding:'0 1rem' },

  // Toast
  toast:        { position:'fixed', bottom:'28px', left:'50%',
                  transform:'translateX(-50%)', background:'#2a1a08',
                  border:'1px solid #f0c040', color:'#f0e6d2',
                  padding:'12px 26px', borderRadius:'25px', zIndex:999,
                  fontSize:'1rem', whiteSpace:'nowrap',
                  animation:'fadeUp 0.2s ease', boxShadow:'0 4px 20px rgba(0,0,0,0.5)' },
}