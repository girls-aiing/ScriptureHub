import React, { useState, useEffect } from 'react'
import TopicSearchPage from './TopicSearchPage.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const ALL_SECRETS = [
  { id: 1,  category: 'Archaeology',         emoji: '🏺', title: 'The Dead Sea Scrolls',               fact: 'The Dead Sea Scrolls, discovered in 1947, contain every Old Testament book except Esther — and are over 1,000 years older than any previously known manuscript.',                                                                                                    verse: 'Isaiah 40:8',        verseText: 'The grass withers and the flowers fall, but the word of our God endures forever.',                                                                                    deepDive: 'The Isaiah Scroll found at Qumran is virtually identical to modern translations, proving the Bible was copied with extraordinary accuracy over millennia.' },
  { id: 2,  category: 'Archaeology',         emoji: '🏺', title: 'Pontius Pilate Confirmed',            fact: 'In 1961, archaeologists discovered a stone inscription in Caesarea Maritima bearing the name "Pontius Pilatus, Prefect of Judea" — the first physical evidence of his existence outside the Bible.',                                                                   verse: 'John 19:1',          verseText: 'Then Pilate took Jesus and had him flogged.',                                                                                                                          deepDive: 'This discovery silenced critics who doubted Pilate\'s historicity and confirmed the Gospel accounts with remarkable precision.' },
  { id: 3,  category: 'Archaeology',         emoji: '🏺', title: 'The Pool of Siloam',                  fact: 'The Pool of Siloam, where Jesus healed a blind man in John 9, was discovered by archaeologists in 2004 during a sewer repair project in Jerusalem.',                                                                                                                verse: 'John 9:7',           verseText: '"Go," he told him, "wash in the Pool of Siloam." So the man went and washed, and came home seeing.',                                                                    deepDive: 'The pool dates to the Second Temple period, perfectly matching the Gospel timeline and confirming the geographical accuracy of John\'s account.' },
  { id: 4,  category: 'Archaeology',         emoji: '🏺', title: 'King David\'s Palace',                fact: 'In 2005, archaeologist Eilat Mazar uncovered a large stone structure in Jerusalem she identified as King David\'s palace, dating to the 10th century BC.',                                                                                                           verse: '2 Samuel 5:11',      verseText: 'Now Hiram king of Tyre sent envoys to David, along with cedar logs and carpenters and stonemasons, and they built a palace for David.',                                deepDive: 'The discovery included a large stone structure and pottery consistent with the biblical timeline of David\'s reign, providing powerful archaeological support.' },
  { id: 5,  category: 'Archaeology',         emoji: '🏺', title: 'The Tel Dan Stele',                   fact: 'The Tel Dan Stele, discovered in 1993, contains the phrase "House of David" — the first mention of King David found outside the Bible, dating to the 9th century BC.',                                                                                               verse: '1 Kings 2:45',       verseText: 'But King Solomon will be blessed, and David\'s throne will remain secure before the Lord forever.',                                                                    deepDive: 'This Aramaic inscription was written by an enemy king boasting of victory over Israel, yet inadvertently confirmed the biblical dynasty of David.' },
  { id: 6,  category: 'Hebrew Origins',      emoji: '📜', title: 'The Aleph-Bet Hidden Meaning',        fact: 'The first two letters of the Hebrew alphabet — Aleph (א) and Bet (ב) — spell "Av" (אב), meaning "Father." The entire alphabet begins with the concept of God as Father.',                                                                                           verse: 'Isaiah 64:8',        verseText: 'Yet you, Lord, are our Father. We are the clay, you are the potter; we are all the work of your hand.',                                                                  deepDive: 'Hebrew scholars believe the alphabet itself was designed to encode theological truth, with each letter carrying pictographic meaning from ancient Proto-Sinaitic script.' },
  { id: 7,  category: 'Hebrew Origins',      emoji: '📜', title: 'The Name of God in Every Generation', fact: 'The Hebrew word for "generations" (toledot) appears exactly 10 times in Genesis, structuring the entire book into 10 family histories — a deliberate literary architecture.',                                                                                        verse: 'Genesis 2:4',        verseText: 'This is the account of the heavens and the earth when they were created.',                                                                                            deepDive: 'The number 10 in Hebrew thought represents completeness and divine order, suggesting Genesis was carefully structured as a theological masterpiece, not just history.' },
  { id: 8,  category: 'Hebrew Origins',      emoji: '📜', title: 'Jesus Written in the Old Testament',  fact: 'The name "Jesus" (Yeshua/ישוע) means "God saves" in Hebrew. This name appears over 30 times in the Old Testament — centuries before Jesus was born.',                                                                                                               verse: 'Matthew 1:21',       verseText: 'She will give birth to a son, and you are to give him the name Jesus, because he will save his people from their sins.',                                                deepDive: 'Joshua, the military leader who brought Israel into the Promised Land, bears the same Hebrew name as Jesus — a profound typological connection recognized by early church fathers.' },
  { id: 9,  category: 'Hebrew Origins',      emoji: '📜', title: 'The Hidden Gospel in Genesis 5',      fact: 'The Hebrew meanings of the 10 names in Adam\'s genealogy (Genesis 5) form a complete sentence: "Man appointed mortal sorrow; the Blessed God shall come down teaching that His death shall bring the despairing rest."',                                              verse: 'Genesis 5:1',        verseText: 'This is the written account of Adam\'s family line.',                                                                                                                  deepDive: 'This discovery by Chuck Missler revealed that the Gospel message was encoded in the very first genealogy of the Bible, suggesting divine authorship across thousands of years.' },
  { id: 10, category: 'Hebrew Origins',      emoji: '📜', title: 'Shalom — More Than Peace',            fact: 'The Hebrew word "Shalom" (שָׁלוֹם) doesn\'t just mean "peace" — it means completeness, wholeness, welfare, and harmony. It describes a state of nothing missing, nothing broken.',                                                                                  verse: 'Numbers 6:26',       verseText: 'The Lord turn his face toward you and give you peace (shalom).',                                                                                                        deepDive: 'When Jesus said "Peace I leave with you" in John 14:27, He was offering Shalom — total restoration of everything sin had broken. It\'s the most comprehensive blessing in Scripture.' },
  { id: 11, category: 'Prophecy',            emoji: '🔮', title: 'The Probability of Fulfilled Prophecy',fact: 'Mathematician Peter Stoner calculated that the probability of just 8 Messianic prophecies being fulfilled by one person is 1 in 10 to the 17th power — that\'s 1 in 100,000,000,000,000,000.',                                                                    verse: 'Isaiah 53:5',        verseText: 'But he was pierced for our transgressions, he was crushed for our iniquities.',                                                                                          deepDive: 'There are over 300 Messianic prophecies in the Old Testament, all fulfilled by Jesus. The statistical impossibility of coincidence is one of the most powerful arguments for divine inspiration.' },
  { id: 12, category: 'Prophecy',            emoji: '🔮', title: 'Tyre — A City Prophecy',              fact: 'Ezekiel predicted in 586 BC that the city of Tyre would be destroyed, its stones thrown into the sea, and it would become a bare rock. Alexander the Great fulfilled this 250 years later.',                                                                          verse: 'Ezekiel 26:12',      verseText: 'They will plunder your wealth and loot your merchandise; they will break down your walls and throw your stones, timber and rubble into the sea.',                       deepDive: 'The ancient mainland city of Tyre has never been rebuilt to this day, and the site remains a place where fishermen spread their nets — exactly as Ezekiel predicted.' },
  { id: 13, category: 'Prophecy',            emoji: '🔮', title: 'Israel Reborn in One Day',            fact: 'Isaiah 66:8 asks "Can a country be born in a day?" On May 14, 1948, Israel declared independence — becoming a nation in a single day for the first time in history, 2,500 years after the prophecy.',                                                              verse: 'Isaiah 66:8',        verseText: 'Who has ever heard of such things? Can a country be born in a day or a nation be brought forth in a moment?',                                                             deepDive: 'The rebirth of Israel is considered by many theologians to be the most significant prophetic fulfillment of the 20th century, setting the stage for end-times events described in Revelation.' },
  { id: 14, category: 'Prophecy',            emoji: '🔮', title: 'Cyrus Named 150 Years Early',         fact: 'Isaiah 44:28 names "Cyrus" as the king who would rebuild Jerusalem — written 150 years before Cyrus the Great was even born. When Cyrus read this prophecy, he immediately issued the decree to rebuild the temple.',                                                verse: 'Isaiah 44:28',       verseText: 'Who says of Cyrus, "He is my shepherd and will accomplish all that I please; he will say of Jerusalem, Let it be rebuilt."',                                               deepDive: 'Josephus records that when Cyrus was shown this prophecy with his name in it, he was so moved that he immediately issued the famous decree recorded in Ezra 1, releasing the Jewish captives.' },
  { id: 15, category: 'Prophecy',            emoji: '🔮', title: 'The 70 Weeks of Daniel',              fact: 'Daniel 9 predicted the exact number of years between the decree to rebuild Jerusalem and the arrival of the Messiah — 483 years. This calculation lands precisely on the year Jesus entered Jerusalem on Palm Sunday.',                                                verse: 'Daniel 9:25',        verseText: 'From the time the word goes out to restore and rebuild Jerusalem until the Anointed One, the ruler, comes, there will be seven "sevens," and sixty-two "sevens."',        deepDive: 'Sir Robert Anderson\'s landmark book "The Coming Prince" (1894) demonstrated mathematically that Daniel\'s 69 weeks of years ended on April 6, 32 AD — the exact date of the Triumphal Entry.' },
  { id: 16, category: 'Science & Bible',     emoji: '🔬', title: 'The Earth Hangs on Nothing',          fact: 'Job 26:7 states that God "hangs the earth on nothing" — written around 2,000 BC, thousands of years before science discovered that Earth floats in space without any physical support.',                                                                              verse: 'Job 26:7',           verseText: 'He spreads out the northern skies over empty space; he suspends the earth over nothing.',                                                                                deepDive: 'Ancient cultures believed the earth rested on elephants, turtles, or Atlas. The Bible\'s scientific accuracy here is remarkable, predating Newton\'s law of gravity by over 3,500 years.' },
  { id: 17, category: 'Science & Bible',     emoji: '🔬', title: 'The Water Cycle — 3,000 Years Early', fact: 'Ecclesiastes 1:7 and Amos 9:6 describe the complete water cycle — evaporation, cloud formation, and rainfall — thousands of years before scientists formally described it in the 16th century.',                                                                    verse: 'Ecclesiastes 1:7',   verseText: 'All streams flow into the sea, yet the sea is never full. To the place the streams come from, there they return again.',                                                  deepDive: 'The complete scientific understanding of the hydrological cycle wasn\'t established until Pierre Perrault\'s work in 1674. The Bible described it accurately in 935 BC.' },
  { id: 18, category: 'Science & Bible',     emoji: '🔬', title: 'Circumcision on the 8th Day',         fact: 'God commanded circumcision on the 8th day after birth (Genesis 17:12). Modern medicine discovered that Vitamin K — essential for blood clotting — peaks in newborns on exactly the 8th day of life.',                                                                verse: 'Genesis 17:12',      verseText: 'For the generations to come every male among you who is eight days old must be circumcised.',                                                                              deepDive: 'Prothrombin levels, which control blood clotting, are at their highest on day 8 of a newborn\'s life. This medical fact wasn\'t discovered until the 20th century, yet God specified day 8 thousands of years earlier.' },
  { id: 19, category: 'Science & Bible',     emoji: '🔬', title: 'The Stars Are Innumerable',           fact: 'Jeremiah 33:22 says the stars cannot be counted. For centuries, people thought there were only about 1,100 visible stars. Today we know there are an estimated 10 sextillion stars — 10,000,000,000,000,000,000,000.',                                               verse: 'Jeremiah 33:22',     verseText: 'I will make the descendants of David my servant as countless as the stars in the sky and as measureless as the sand on the seashore.',                                    deepDive: 'Hipparchus catalogued 1,080 stars in 129 BC. Ptolemy counted 1,022. The Bible\'s claim of uncountable stars was considered an exaggeration until modern telescopes revealed the true scale of the universe.' },
  { id: 20, category: 'Science & Bible',     emoji: '🔬', title: 'Quarantine — A Biblical Invention',   fact: 'Leviticus 13 describes a detailed quarantine protocol for infectious disease — isolation, inspection, and re-inspection — 3,500 years before germ theory was discovered by Louis Pasteur in 1857.',                                                                    verse: 'Leviticus 13:46',    verseText: 'As long as they have the disease they remain unclean. They must live alone; they must live outside the camp.',                                                             deepDive: 'During the Black Death in medieval Europe, the church applied Levitical quarantine laws and saved countless lives. The word "quarantine" itself comes from the Italian for "40 days" — echoing biblical separation periods.' },
  { id: 21, category: 'Numbers & Patterns',  emoji: '🔢', title: 'The Number 7 — God\'s Signature',     fact: 'The word "created" appears 7 times in Genesis 1. The first verse of Genesis has 7 Hebrew words. The number 7 appears 735 times in the Bible and is universally recognized as God\'s number of completion.',                                                           verse: 'Genesis 2:2',        verseText: 'By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.',                                                       deepDive: 'Ivan Panin, a Harvard mathematician, spent 50 years documenting mathematical patterns of 7 throughout the Bible\'s original languages, producing over 40,000 pages of analysis that he claimed proved divine authorship.' },
  { id: 22, category: 'Numbers & Patterns',  emoji: '🔢', title: 'The Middle Verse of the Bible',       fact: 'The exact middle verse of the Bible is Psalm 118:8 — "It is better to take refuge in the Lord than to trust in humans." The central message of the entire Bible is literally at its center.',                                                                         verse: 'Psalm 118:8',        verseText: 'It is better to take refuge in the Lord than to trust in humans.',                                                                                                      deepDive: 'The Bible has 1,189 chapters. The middle chapter is Psalm 117 — the shortest chapter. The chapter before the middle (Psalm 117) and after (Psalm 119) are the shortest and longest chapters respectively.' },
  { id: 23, category: 'Numbers & Patterns',  emoji: '🔢', title: 'John 11:35 — The Shortest Verse',     fact: '"Jesus wept" (John 11:35) is the shortest verse in the English Bible — just two words. Yet it contains one of the most profound theological truths: God Himself weeps with us in our grief.',                                                                          verse: 'John 11:35',         verseText: 'Jesus wept.',                                                                                                                                                          deepDive: 'The Greek word used here is "edakrysen" — a quiet, personal weeping — different from the loud wailing of the mourners around him. Jesus wept privately, intimately, sharing in human sorrow.' },
  { id: 24, category: 'Numbers & Patterns',  emoji: '🔢', title: 'The 40-Day Pattern',                  fact: 'The number 40 appears 146 times in the Bible, always associated with testing and transformation: 40 days of rain (Noah), 40 years in the wilderness (Israel), 40 days of fasting (Moses and Jesus).',                                                                 verse: 'Matthew 4:2',        verseText: 'After fasting forty days and forty nights, he was hungry.',                                                                                                            deepDive: 'In Hebrew thought, 40 represents a period of probation or trial that leads to transformation. The pattern is so consistent across 1,500 years of writing that scholars consider it a deliberate theological motif.' },
  { id: 25, category: 'Numbers & Patterns',  emoji: '🔢', title: 'The 153 Fish',                        fact: 'In John 21:11, the disciples catch exactly 153 fish. Early church father Jerome noted that Greek zoologists of the time catalogued exactly 153 species of fish — suggesting the catch represented a harvest of all nations.',                                          verse: 'John 21:11',         verseText: 'Simon Peter climbed aboard and dragged the net ashore. It was full of large fish, 153, but even with so many the net was not torn.',                                        deepDive: 'The number 153 is also a triangular number (1+2+3...+17=153). Some scholars see it as a mathematical symbol of completeness, encoded in a miracle.' },
  { id: 26, category: 'Jesus & Gospels',     emoji: '✝️', title: 'Jesus Spoke Aramaic',                 fact: 'Jesus primarily spoke Aramaic, not Hebrew or Greek. The Gospels preserve several of his actual Aramaic words: "Talitha koum" (Mark 5:41), "Ephphatha" (Mark 7:34), and "Eloi, Eloi, lema sabachthani" (Mark 15:34).',                                                verse: 'Mark 15:34',         verseText: '"Eloi, Eloi, lema sabachthani?" (which means "My God, my God, why have you forsaken me?").',                                                                               deepDive: 'These preserved Aramaic phrases are considered by scholars to be the most direct recordings of Jesus\'s actual voice in Scripture — raw, unfiltered words from the lips of Christ himself.' },
  { id: 27, category: 'Jesus & Gospels',     emoji: '✝️', title: 'The Star of Bethlehem',               fact: 'Astronomers have identified a rare triple conjunction of Jupiter and Saturn in 7-6 BC that would have created an extraordinarily bright "star" visible to astronomers in the East — perfectly matching the Magi\'s account.',                                           verse: 'Matthew 2:2',        verseText: '"Where is the one who has been born king of the Jews? We saw his star when it rose and have come to worship him."',                                                          deepDive: 'Johannes Kepler first proposed the Jupiter-Saturn conjunction theory in 1614. Modern computer simulations of ancient skies confirm a triple conjunction occurred in Pisces (the sign associated with Israel) in 7 BC.' },
  { id: 28, category: 'Jesus & Gospels',     emoji: '✝️', title: 'Jesus Had Brothers',                  fact: 'The Bible names four brothers of Jesus: James, Joseph, Simon, and Judas (Matthew 13:55). James became the leader of the Jerusalem church and wrote the Epistle of James. His brother Judas wrote the Epistle of Jude.',                                               verse: 'Matthew 13:55',      verseText: '"Isn\'t this the carpenter\'s son? Isn\'t his mother\'s name Mary, and aren\'t his brothers James, Joseph, Simon and Judas?"',                                             deepDive: 'James initially did not believe Jesus was the Messiah (John 7:5), but after witnessing the resurrection, he became so devoted that he was martyred in 62 AD for refusing to deny Christ.' },
  { id: 29, category: 'Jesus & Gospels',     emoji: '✝️', title: 'The Shroud of Turin',                 fact: 'The Shroud of Turin contains a 3D encoded image that no medieval forger could have created. The image shows a man with wounds consistent with crucifixion, including nail wounds through the wrists — not the palms as traditionally depicted.',                       verse: 'John 20:6-7',        verseText: 'He saw the strips of linen lying there, as well as the cloth that had been wrapped around Jesus\' head.',                                                                  deepDive: 'NASA image enhancement technology revealed that the Shroud image contains three-dimensional information — impossible to achieve with any known medieval painting technique, making its origin one of history\'s greatest mysteries.' },
  { id: 30, category: 'Jesus & Gospels',     emoji: '✝️', title: 'The Triumphal Entry Date',            fact: 'Jesus entered Jerusalem on what we call Palm Sunday, exactly 483 years (69 "weeks" of years) after the decree of Artaxerxes to rebuild Jerusalem in 444 BC — fulfilling Daniel\'s prophecy to the exact day.',                                                       verse: 'Zechariah 9:9',      verseText: 'Rejoice greatly, Daughter Zion! See, your king comes to you, righteous and victorious, lowly and riding on a donkey.',                                                    deepDive: 'Using the Jewish 360-day prophetic calendar, 69 weeks of years = 173,880 days. From March 5, 444 BC to April 6, 32 AD is exactly 173,880 days. The precision is breathtaking.' },
  { id: 31, category: 'Church History',      emoji: '⛪', title: 'The Bible\'s First Printed Book',     fact: 'The Gutenberg Bible (1455) was the first major book printed with movable type in Europe. Johannes Gutenberg chose the Bible as his first project, and it changed the world by making Scripture accessible to ordinary people.',                                         verse: 'Psalm 119:105',      verseText: 'Your word is a lamp for my feet, a light on my path.',                                                                                                                deepDive: 'Before Gutenberg, a single handwritten Bible cost the equivalent of a house. After printing, the price dropped by 80% within 50 years, sparking the Reformation and democratizing biblical knowledge.' },
  { id: 32, category: 'Church History',      emoji: '⛪', title: 'The Canon Was Recognized, Not Created',fact: 'The Council of Nicaea (325 AD) did NOT choose which books belong in the Bible — that\'s a myth. The canon was already widely recognized. Nicaea primarily addressed the deity of Christ, not the biblical canon.',                                                    verse: '2 Timothy 3:16',     verseText: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.',                                                            deepDive: 'The 27 books of the New Testament were recognized by the early church based on apostolic authorship, consistency with Old Testament, and universal acceptance — not political decree.' },
  { id: 33, category: 'Church History',      emoji: '⛪', title: 'William Tyndale\'s Last Words',       fact: 'William Tyndale was burned at the stake in 1536 for translating the Bible into English. His last words were: "Lord, open the King of England\'s eyes." Within one year, King Henry VIII authorized an English Bible.',                                                 verse: 'Acts 4:20',          verseText: '"As for us, we cannot help speaking about what we have seen and heard."',                                                                                                  deepDive: 'Approximately 90% of the King James Bible (1611) is directly taken from Tyndale\'s translation. He died for the work, but his words became the foundation of the most influential English Bible in history.' },
  { id: 34, category: 'Church History',      emoji: '⛪', title: 'The Oldest Christian Church',         fact: 'The oldest known Christian church building was discovered in Megiddo, Israel in 2005, dating to the 3rd century AD. It contains a mosaic floor with the earliest known depiction of Jesus as a fish symbol.',                                                         verse: 'Matthew 16:18',      verseText: '"And I tell you that you are Peter, and on this rock I will build my church, and the gates of Hades will not overcome it."',                                               deepDive: 'The Megiddo church was found inside a prison — suggesting early Christians worshipped secretly even within Roman detention facilities, demonstrating extraordinary faith under persecution.' },
  { id: 35, category: 'Church History',      emoji: '⛪', title: 'The Apostles\' Fates',                fact: 'Of the 12 apostles, 11 died as martyrs for their belief in the resurrection. Only John died of natural causes. People die for beliefs they think are true — but rarely for beliefs they know are false.',                                                              verse: 'Revelation 2:10',    verseText: 'Be faithful, even to the point of death, and I will give you life as your victor\'s crown.',                                                                              deepDive: 'The apostles were eyewitnesses to the resurrection. Their willingness to die rather than recant is one of the strongest historical arguments for the resurrection\'s reality — they had nothing to gain by lying.' },
  { id: 36, category: 'Creation & Cosmos',   emoji: '🌌', title: 'The Expanding Universe',              fact: 'Isaiah 40:22 says God "stretches out the heavens like a canopy." Modern cosmology confirms the universe has been expanding since the Big Bang — a fact unknown to science until Edwin Hubble\'s discovery in 1929.',                                                   verse: 'Isaiah 40:22',       verseText: 'He stretches out the heavens like a canopy, and spreads them out like a tent to live in.',                                                                                  deepDive: 'The Hebrew word "natah" (stretches) is in the present continuous tense — meaning the stretching is ongoing. This matches the scientific discovery that the universe is still expanding, and even accelerating.' },
  { id: 37, category: 'Creation & Cosmos',   emoji: '🌌', title: 'Light Before the Sun',                fact: 'Genesis 1 describes light being created on Day 1, but the sun not until Day 4. Scientists now know that light (photons) existed before stars formed — the Cosmic Microwave Background radiation filled the universe before any star shone.',                           verse: 'Genesis 1:3',        verseText: 'And God said, "Let there be light," and there was light.',                                                                                                              deepDive: 'For centuries, critics mocked this sequence as scientifically impossible. Modern cosmology now confirms that the early universe was filled with light energy approximately 380,000 years before the first stars ignited.' },
  { id: 38, category: 'Creation & Cosmos',   emoji: '🌌', title: 'The Pleiades and Orion',              fact: 'Job 38:31 asks if man can "bind the Pleiades or loose the belt of Orion." Modern astronomy has discovered that the Pleiades stars are gravitationally bound together, while Orion\'s belt stars are moving apart — exactly as the Bible implies.',                  verse: 'Job 38:31',          verseText: 'Can you bind the chains of the Pleiades? Can you loosen Orion\'s belt?',                                                                                                  deepDive: 'The Pleiades cluster is gravitationally bound and moves through space together. Orion\'s three belt stars are at vastly different distances and are slowly drifting apart. This astronomical distinction was unknown in Job\'s time.' },
  { id: 39, category: 'Creation & Cosmos',   emoji: '🌌', title: 'The Number of Stars',                 fact: 'Genesis 22:17 compares the stars to grains of sand. For millennia this seemed like poetic exaggeration. Scientists now estimate there are 10 sextillion stars — roughly equal to the number of grains of sand on all Earth\'s beaches.',                              verse: 'Genesis 22:17',      verseText: 'I will surely bless you and make your descendants as numerous as the stars in the sky and as the sand on the seashore.',                                                   deepDive: 'Current estimates put the number of stars at 10^22 to 10^24. The number of grains of sand on Earth is estimated at 7.5 × 10^18. The comparison is remarkably accurate for a 4,000-year-old text.' },
  { id: 40, category: 'Creation & Cosmos',   emoji: '🌌', title: 'Springs in the Ocean',                fact: 'Job 38:16 references "springs of the sea." Until the 1970s, scientists believed the ocean floor was barren. Then hydrothermal vents — underwater springs — were discovered, teeming with life, exactly as the Bible implied.',                                        verse: 'Job 38:16',          verseText: 'Have you journeyed to the springs of the sea or walked in the recesses of the deep?',                                                                                    deepDive: 'Hydrothermal vents were discovered in 1977 by the submersible Alvin near the Galapagos Islands. These underwater springs support entire ecosystems and may hold clues to the origin of life — and Job knew they existed 3,500 years ago.' },
  { id: 41, category: 'Prayer & Spirituality',emoji: '🙏', title: 'The Lord\'s Prayer — Hidden Structure',fact: 'The Lord\'s Prayer (Matthew 6:9-13) follows a perfect chiastic structure — a Hebrew literary device where ideas mirror each other. The exact center of the prayer is "Give us today our daily bread" — physical need at the heart of communion with God.',          verse: 'Matthew 6:9',        verseText: '"This, then, is how you should pray: Our Father in heaven, hallowed be your name."',                                                                                        deepDive: 'Chiasm (A-B-C-B\'-A\' structure) was the highest form of Hebrew literary art. Finding it in the Lord\'s Prayer reveals that Jesus was not giving a casual prayer but a carefully crafted theological masterpiece.' },
  { id: 42, category: 'Prayer & Spirituality',emoji: '🙏', title: 'Selah — The Mystery Word',           fact: 'The word "Selah" appears 74 times in Psalms and 3 times in Habakkuk, but its meaning is unknown. Most scholars believe it means "pause and reflect" — a divine instruction to stop, breathe, and let the truth sink in.',                                             verse: 'Psalm 46:1',         verseText: 'God is our refuge and strength, an ever-present help in trouble. Selah.',                                                                                                deepDive: 'Some scholars derive "Selah" from the Hebrew root "salal" meaning "to lift up" — suggesting it was a musical instruction to raise the volume or pitch. Others see it as a call to prostrate oneself before God.' },
  { id: 43, category: 'Prayer & Spirituality',emoji: '🙏', title: 'The Priestly Blessing\'s Power',     fact: 'The Priestly Blessing of Numbers 6:24-26 has 3 verses with 3, 5, and 7 words respectively — a perfect mathematical progression. It was found inscribed on silver scrolls in Jerusalem dating to 600 BC, making it the oldest biblical text ever discovered.',        verse: 'Numbers 6:24',       verseText: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.',                                                                              deepDive: 'The Ketef Hinnom scrolls (discovered 1979) predate the Dead Sea Scrolls by 400 years and contain this blessing. They were worn as amulets, showing how deeply this blessing was treasured in ancient Israel.' },
  { id: 44, category: 'Prayer & Spirituality',emoji: '🙏', title: 'Psalm 119 — The Acrostic Masterpiece',fact: 'Psalm 119 is the longest chapter in the Bible (176 verses) and is a perfect acrostic poem — each of its 22 sections begins with a successive letter of the Hebrew alphabet, with 8 verses per letter.',                                                             verse: 'Psalm 119:11',       verseText: 'I have hidden your word in my heart that I might not sin against you.',                                                                                                  deepDive: 'The acrostic structure was a memory device ensuring the entire psalm could be memorized systematically. It also symbolized that praise of God\'s Word encompasses everything from A to Z — the complete alphabet of devotion.' },
  { id: 45, category: 'Prayer & Spirituality',emoji: '🙏', title: 'The Power of Blessing',              fact: 'The Hebrew word "barak" (bless/ברך) shares its root with "berek" (knee/ברך). To bless someone in Hebrew culture meant to kneel before them in honor. Every biblical blessing carries the posture of humility.',                                                       verse: 'Psalm 103:1',        verseText: 'Praise the Lord, my soul; all my inmost being, praise his holy name.',                                                                                                  deepDive: 'When God "blesses" humanity in Genesis 1:28, He is essentially kneeling toward His creation in generous provision. This reframes blessing not as God dispensing gifts from above, but as God stooping down in intimate care.' },
  { id: 46, category: 'Biblical Characters',  emoji: '👑', title: 'Moses Was 80 Years Old',             fact: 'Moses was 80 years old when he confronted Pharaoh and led the Exodus. He then led Israel for 40 more years, dying at 120. His greatest work began at an age when most people consider their life\'s work finished.',                                                   verse: 'Exodus 7:7',         verseText: 'Moses was eighty years old and Aaron eighty-three when they spoke to Pharaoh.',                                                                                          deepDive: 'Moses\'s life divides perfectly into three 40-year periods: 40 years as Egyptian royalty, 40 years as a shepherd in Midian, and 40 years as Israel\'s leader. God\'s greatest preparation often happens in obscurity.' },
  { id: 47, category: 'Biblical Characters',  emoji: '👑', title: 'Paul\'s Thorn in the Flesh',         fact: 'Paul\'s "thorn in the flesh" (2 Corinthians 12:7) has been debated for 2,000 years. Leading theories include severe eye disease (Galatians 4:15), epilepsy, or a speech impediment — yet God used him to write 13 books of the New Testament.',                    verse: '2 Corinthians 12:9', verseText: '"My grace is sufficient for you, for my power is made perfect in weakness."',                                                                                          deepDive: 'Whatever Paul\'s affliction, it kept him humble despite receiving direct revelations from God. His weakness became the platform for one of Scripture\'s greatest truths: divine power is perfected in human frailty.' },
  { id: 48, category: 'Biblical Characters',  emoji: '👑', title: 'Methuselah\'s Name Prophecy',        fact: 'Methuselah\'s name in Hebrew means "his death shall bring." He died at 969 years old — the oldest person in the Bible. The year he died was the year of Noah\'s flood, fulfilling his name as a prophecy.',                                                           verse: 'Genesis 5:27',       verseText: 'Altogether, Methuselah lived a total of 969 years, and then he died.',                                                                                                  deepDive: 'If Methuselah\'s birth year and the flood year are calculated from the Genesis genealogies, they align perfectly. His grandfather Enoch named him prophetically — God\'s patience waited 969 years before judgment came.' },
  { id: 49, category: 'Biblical Characters',  emoji: '👑', title: 'Mary Magdalene — First Witness',     fact: 'Mary Magdalene was the first person to see the risen Jesus (John 20:14-16). In 1st century Jewish culture, women\'s testimony was not accepted in court. The fact that the Gospels record a woman as the first witness argues for authenticity.',                     verse: 'John 20:16',         verseText: 'Jesus said to her, "Mary." She turned toward him and cried out in Aramaic, "Rabboni!" (which means "Teacher").',                                                          deepDive: 'Scholars call this the "criterion of embarrassment" — details too culturally awkward to invent are likely historically true. Choosing Mary as the first witness would have been embarrassing in that culture, making it almost certainly authentic.' },
  { id: 50, category: 'Biblical Characters',  emoji: '👑', title: 'Solomon\'s Wealth in Today\'s Money',fact: 'Solomon received 666 talents of gold per year (1 Kings 10:14). At today\'s gold prices, that\'s approximately $1.1 billion annually — making him one of the wealthiest individuals in all of human history.',                                                        verse: '1 Kings 10:23',      verseText: 'King Solomon was greater in riches and wisdom than all the other kings of the earth.',                                                                                    deepDive: 'Solomon\'s total wealth, including his fleet, trade routes, and tribute from vassal nations, would make him wealthier than most modern billionaires. Yet Ecclesiastes — written by Solomon — concludes that all this wealth is "vanity."' },
]

const CATEGORIES = ['All', ...new Set(ALL_SECRETS.map(s => s.category))]

const CATEGORY_COLORS = {
  'Archaeology':          '#f0c040',
  'Hebrew Origins':       '#90c0f0',
  'Prophecy':             '#c090f0',
  'Science & Bible':      '#a0d8a0',
  'Numbers & Patterns':   '#f09090',
  'Jesus & Gospels':      '#f0c040',
  'Church History':       '#c8860a',
  'Creation & Cosmos':    '#90c0f0',
  'Prayer & Spirituality':'#a0d8a0',
  'Biblical Characters':  '#f09090',
}

export default function DidYouKnowPage() {
  const { t } = useLanguage()

  const [viewed, setViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('scriptureHub_viewed')) || [] }
    catch { return [] }
  })
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('scriptureHub_bookmarks')) || [] }
    catch { return [] }
  })
  const [currentSecret,  setCurrentSecret]  = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [showDeepDive,   setShowDeepDive]   = useState(false)
  const [copied,         setCopied]         = useState(false)
  const [tab,            setTab]            = useState('discover')

  const filtered = activeCategory === 'All'
    ? ALL_SECRETS
    : ALL_SECRETS.filter(s => s.category === activeCategory)

  const getNextSecret = () => {
    const unseen = filtered.filter(s => !viewed.includes(s.id))
    if (unseen.length === 0) {
      const reset = viewed.filter(id => !filtered.map(s => s.id).includes(id))
      localStorage.setItem('scriptureHub_viewed', JSON.stringify(reset))
      setViewed(reset)
      return filtered[Math.floor(Math.random() * filtered.length)]
    }
    return unseen[Math.floor(Math.random() * unseen.length)]
  }

  useEffect(() => {
    setCurrentSecret(getNextSecret())
    setShowDeepDive(false)
  }, [activeCategory])

  const handleNext = () => {
    if (!currentSecret) return
    const newViewed = [...new Set([...viewed, currentSecret.id])]
    setViewed(newViewed)
    localStorage.setItem('scriptureHub_viewed', JSON.stringify(newViewed))
    setCurrentSecret(getNextSecret())
    setShowDeepDive(false)
    setCopied(false)
  }

  const toggleBookmark = () => {
    if (!currentSecret) return
    const isBookmarked = bookmarks.some(b => b.id === currentSecret.id)
    const newBookmarks = isBookmarked
      ? bookmarks.filter(b => b.id !== currentSecret.id)
      : [...bookmarks, currentSecret]
    setBookmarks(newBookmarks)
    localStorage.setItem('scriptureHub_bookmarks', JSON.stringify(newBookmarks))
  }

  const handleShare = () => {
    if (!currentSecret) return
    const text = `📖 ${t('didYouKnow')}\n\n"${currentSecret.title}"\n\n${currentSecret.fact}\n\n📜 ${currentSecret.verse}: "${currentSecret.verseText}"\n\n— Discovered on ScriptureHub`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const totalViewed   = viewed.length
  const totalSecrets  = ALL_SECRETS.length
  const progressPct   = Math.round((totalViewed / totalSecrets) * 100)
  const isBookmarked  = currentSecret && bookmarks.some(b => b.id === currentSecret.id)
  const categoryColor = currentSecret
    ? (CATEGORY_COLORS[currentSecret.category] || '#f0c040')
    : '#f0c040'

  return (
    <div style={{
      minHeight:  '100vh',
      background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)',
      padding:    '2rem 1rem',
      fontFamily: "'Georgia', serif",
      color:      '#f0e6d0',
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💡</div>
        <h1 style={{
          color:      '#f0c040',
          fontSize:   '2rem',
          fontWeight: 'bold',
          margin:     '0 0 0.25rem 0',
          textShadow: '0 2px 8px rgba(240,192,64,0.4)',
        }}>
          {t('didYouKnow')}
        </h1>
        <p style={{ color: '#c8a96e', fontSize: '0.95rem', margin: 0 }}>
          {t('biblicalSecrets')} — {t('tapToReveal')} ✝️
        </p>
      </div>

      {/* ── Progress banner ── */}
      <div style={{
        maxWidth:       '780px',
        margin:         '0 auto 1.5rem auto',
        background:     'linear-gradient(135deg, rgba(240,192,64,0.1), rgba(200,134,10,0.1))',
        border:         '1px solid rgba(240,192,64,0.25)',
        borderRadius:   '14px',
        padding:        '1rem 1.5rem',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '1rem',
      }}>
        <div>
          <div style={{ color: '#f0c040', fontWeight: 'bold', fontSize: '1.1rem' }}>
            🔓 {totalViewed} / {totalSecrets} {t('discovered')}
          </div>
          <div style={{ color: '#c8a96e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {totalSecrets - totalViewed} {t('biblicalSecrets').toLowerCase()} {t('learnMore').toLowerCase()}…
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '160px' }}>
          <div style={{
            height:       '8px',
            borderRadius: '4px',
            background:   'rgba(255,255,255,0.1)',
            overflow:     'hidden',
          }}>
            <div style={{
              height:     '100%',
              borderRadius:'4px',
              width:      `${progressPct}%`,
              background: 'linear-gradient(90deg, #f0c040, #c8860a)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ color: '#c8a96e', fontSize: '0.75rem', textAlign: 'right' }}>
            {progressPct}% {t('discovered')}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        maxWidth:       '780px',
        margin:         '0 auto 1.5rem auto',
        display:        'flex',
        gap:            '0.5rem',
        justifyContent: 'center',
      }}>
        {[
          { key: 'discover',  label: `💡 ${t('discover')}` },
          { key: 'bookmarks',    label: `🔖 ${t('save')} (${bookmarks.length})` },
          { key: 'topicSearch',  label: `📖 Topic Search` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding:      '0.5rem 1.2rem',
            borderRadius: '20px',
            border:       tab === key ? 'none' : '1px solid rgba(240,192,64,0.3)',
            background:   tab === key
              ? 'linear-gradient(135deg, #f0c040, #c8860a)'
              : 'transparent',
            color:        tab === key ? '#1a0a00' : '#c8a96e',
            fontWeight:   tab === key ? 'bold' : 'normal',
            cursor:       'pointer',
            fontSize:     '0.85rem',
            fontFamily:   "'Georgia', serif",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* ── DISCOVER TAB ── */}
        {tab === 'discover' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding:      '0.35rem 0.85rem',
                  borderRadius: '16px',
                  fontSize:     '0.78rem',
                  border:       activeCategory === cat
                    ? 'none'
                    : '1px solid rgba(240,192,64,0.2)',
                  background:   activeCategory === cat
                    ? (CATEGORY_COLORS[cat] || '#f0c040')
                    : 'rgba(255,255,255,0.04)',
                  color:        activeCategory === cat ? '#1a0a00' : '#c8a96e',
                  fontWeight:   activeCategory === cat ? 'bold' : 'normal',
                  cursor:       'pointer',
                  fontFamily:   "'Georgia', serif",
                }}>
                  {cat === 'All' ? `🌟 ${t('viewAll')}` : cat}
                </button>
              ))}
            </div>

            {/* Secret card */}
            {currentSecret && (
              <div style={{
                background:   'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                border:       `1px solid ${categoryColor}40`,
                overflow:     'hidden',
                boxShadow:    `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${categoryColor}20`,
              }}>

                {/* Card header */}
                <div style={{
                  background:     `linear-gradient(135deg, ${categoryColor}20, ${categoryColor}10)`,
                  padding:        '1.25rem 1.5rem',
                  borderBottom:   `1px solid ${categoryColor}25`,
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'flex-start',
                }}>
                  <div>
                    <div style={{
                      display:      'inline-block',
                      background:   `${categoryColor}25`,
                      border:       `1px solid ${categoryColor}50`,
                      borderRadius: '20px',
                      padding:      '0.2rem 0.75rem',
                      fontSize:     '0.75rem',
                      color:        categoryColor,
                      fontWeight:   'bold',
                      marginBottom: '0.5rem',
                    }}>
                      {currentSecret.emoji} {currentSecret.category}
                    </div>
                    <h2 style={{
                      color:      '#f0e6d0',
                      fontSize:   '1.25rem',
                      fontWeight: 'bold',
                      margin:     0,
                      lineHeight: '1.3',
                    }}>
                      {currentSecret.title}
                    </h2>
                  </div>
                  <div style={{
                    background:     `${categoryColor}20`,
                    borderRadius:   '50%',
                    width:          '48px',
                    height:         '48px',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '1.5rem',
                    flexShrink:     0,
                    marginLeft:     '1rem',
                  }}>
                    {currentSecret.emoji}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '1.5rem' }}>

                  {/* Fact */}
                  <p style={{
                    color:      '#f0e6d0',
                    fontSize:   '1rem',
                    lineHeight: '1.8',
                    margin:     '0 0 1.25rem 0',
                  }}>
                    {currentSecret.fact}
                  </p>

                  {/* Scripture */}
                  <div style={{
                    background:   'rgba(240,192,64,0.08)',
                    border:       '1px solid rgba(240,192,64,0.2)',
                    borderLeft:   `3px solid ${categoryColor}`,
                    borderRadius: '0 10px 10px 0',
                    padding:      '1rem 1.25rem',
                    marginBottom: '1.25rem',
                  }}>
                    <div style={{
                      color:        categoryColor,
                      fontSize:     '0.8rem',
                      fontWeight:   'bold',
                      marginBottom: '0.4rem',
                    }}>
                      📜 {currentSecret.verse}
                    </div>
                    <div style={{
                      color:      '#f0e6d0',
                      fontSize:   '0.9rem',
                      fontStyle:  'italic',
                      lineHeight: '1.6',
                    }}>
                      "{currentSecret.verseText}"
                    </div>
                  </div>

                  {/* Deep dive */}
                  {showDeepDive && (
                    <div style={{
                      background:   'rgba(255,255,255,0.04)',
                      border:       '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding:      '1rem 1.25rem',
                      marginBottom: '1.25rem',
                    }}>
                      <div style={{
                        color:        '#c8a96e',
                        fontSize:     '0.8rem',
                        fontWeight:   'bold',
                        marginBottom: '0.5rem',
                      }}>
                        🔍 {t('learnMore')}
                      </div>
                      <p style={{
                        color:      '#f0e6d0',
                        fontSize:   '0.9rem',
                        lineHeight: '1.7',
                        margin:     0,
                      }}>
                        {currentSecret.deepDive}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>

                    <button onClick={() => setShowDeepDive(!showDeepDive)} style={{
                      background:   showDeepDive
                        ? `${categoryColor}30`
                        : 'rgba(255,255,255,0.06)',
                      border:       `1px solid ${categoryColor}40`,
                      borderRadius: '10px',
                      padding:      '0.6rem 1rem',
                      color:        categoryColor,
                      fontSize:     '0.85rem',
                      cursor:       'pointer',
                      fontFamily:   "'Georgia', serif",
                      fontWeight:   showDeepDive ? 'bold' : 'normal',
                    }}>
                      🔍 {showDeepDive ? t('close') : t('learnMore')}
                    </button>

                    <button onClick={toggleBookmark} style={{
                      background:   isBookmarked
                        ? 'rgba(240,192,64,0.2)'
                        : 'rgba(255,255,255,0.06)',
                      border:       `1px solid ${isBookmarked ? '#f0c040' : 'rgba(240,192,64,0.3)'}`,
                      borderRadius: '10px',
                      padding:      '0.6rem 1rem',
                      color:        isBookmarked ? '#f0c040' : '#c8a96e',
                      fontSize:     '0.85rem',
                      cursor:       'pointer',
                      fontFamily:   "'Georgia', serif",
                      fontWeight:   isBookmarked ? 'bold' : 'normal',
                    }}>
                      {isBookmarked ? `🔖 ${t('saved')}!` : `🔖 ${t('save')}`}
                    </button>

                    <button onClick={handleShare} style={{
                      background:   copied
                        ? 'rgba(160,216,160,0.2)'
                        : 'rgba(255,255,255,0.06)',
                      border:       `1px solid ${copied ? '#a0d8a0' : 'rgba(240,192,64,0.3)'}`,
                      borderRadius: '10px',
                      padding:      '0.6rem 1rem',
                      color:        copied ? '#a0d8a0' : '#c8a96e',
                      fontSize:     '0.85rem',
                      cursor:       'pointer',
                      fontFamily:   "'Georgia', serif",
                    }}>
                      {copied ? `✅ ${t('copied')}` : `📤 ${t('share')}`}
                    </button>

                    <button onClick={handleNext} style={{
                      background:   'linear-gradient(135deg, #f0c040, #c8860a)',
                      border:       'none',
                      borderRadius: '10px',
                      padding:      '0.6rem 1.2rem',
                      color:        '#1a0a00',
                      fontSize:     '0.85rem',
                      fontWeight:   'bold',
                      cursor:       'pointer',
                      fontFamily:   "'Georgia', serif",
                      marginLeft:   'auto',
                    }}>
                      {t('next')} →
                    </button>
                  </div>
                </div>

                {/* Card footer */}
                <div style={{
                  padding:        '0.6rem 1.5rem',
                  borderTop:      '1px solid rgba(255,255,255,0.06)',
                  background:     'rgba(0,0,0,0.15)',
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                }}>
                  <span style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.75rem' }}>
                    #{currentSecret.id} {t('of')} {totalSecrets}
                  </span>
                  <span style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.75rem' }}>
                    {viewed.includes(currentSecret.id)
                      ? `👁 ${t('discovered')}`
                      : `✨ ${t('learnMore')}!`}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TOPIC SEARCH TAB ── */}
        {tab === 'topicSearch' && <TopicSearchPage />}
        {/* ── BOOKMARKS TAB ── */}
        {tab === 'bookmarks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookmarks.length === 0 ? (
              <div style={{
                textAlign:    'center',
                padding:      '3rem',
                background:   'rgba(255,255,255,0.04)',
                borderRadius: '16px',
                border:       '1px solid rgba(240,192,64,0.15)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔖</div>
                <div style={{ color: '#c8a96e', fontSize: '1rem' }}>
                  {t('noResults')}
                </div>
                <div style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {t('tapToReveal')} → {t('save')}
                </div>
              </div>
            ) : (
              bookmarks.map(secret => {
                const color = CATEGORY_COLORS[secret.category] || '#f0c040'
                return (
                  <div key={secret.id} style={{
                    background:   'rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    border:       `1px solid ${color}30`,
                    padding:      '1.25rem',
                    borderLeft:   `3px solid ${color}`,
                  }}>
                    <div style={{
                      display:        'flex',
                      justifyContent: 'space-between',
                      alignItems:     'flex-start',
                      marginBottom:   '0.75rem',
                    }}>
                      <div>
                        <div style={{
                          color,
                          fontSize:     '0.75rem',
                          fontWeight:   'bold',
                          marginBottom: '0.3rem',
                        }}>
                          {secret.emoji} {secret.category}
                        </div>
                        <div style={{ color: '#f0e6d0', fontWeight: 'bold', fontSize: '1rem' }}>
                          {secret.title}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const nb = bookmarks.filter(b => b.id !== secret.id)
                          setBookmarks(nb)
                          localStorage.setItem('scriptureHub_bookmarks', JSON.stringify(nb))
                        }}
                        style={{
                          background: 'transparent',
                          border:     'none',
                          color:      '#c8a96e',
                          cursor:     'pointer',
                          fontSize:   '1rem',
                          padding:    '0.25rem',
                        }}
                      >✕</button>
                    </div>
                    <p style={{
                      color:      '#c8a96e',
                      fontSize:   '0.88rem',
                      lineHeight: '1.6',
                      margin:     '0 0 0.75rem 0',
                    }}>
                      {secret.fact}
                    </p>
                    <div style={{ color, fontSize: '0.8rem', fontStyle: 'italic' }}>
                      📜 {secret.verse}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* ── Footer quote ── */}
      <p style={{
        color:     'rgba(200,169,110,0.4)',
        fontSize:  '0.75rem',
        marginTop: '2rem',
        textAlign: 'center',
      }}>
        "The secret things belong to the Lord our God" — Deuteronomy 29:29 ✝️
      </p>
    </div>
  )
}