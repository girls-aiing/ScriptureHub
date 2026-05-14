import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { speakText } from '../components/VoiceGuide.jsx'

// ════════════════════════════════════════════════════════════════
// RANKS
// ════════════════════════════════════════════════════════════════
const RANKS = [
  {
    id: 'Follower',
    icon: '🌱',
    color: '#4CAF50',
    bgColor: 'rgba(76,175,80,0.12)',
    difficulty: [1],
    label: 'Foundation Level',
    description: 'Focuses on the call to faith and the early steps of walking with God, covering the basic life of the Patriarchs like Abraham and Isaac.',
  },
  {
    id: 'Believer',
    icon: '📖',
    color: '#2196F3',
    bgColor: 'rgba(33,150,243,0.12)',
    difficulty: [1, 2],
    label: 'Growing Level',
    description: 'Moves beyond stories into the core promises of God and the fundamental laws found in the Torah.',
  },
  {
    id: 'Messenger',
    icon: '📣',
    color: '#FF9800',
    bgColor: 'rgba(255,152,0,0.12)',
    difficulty: [2],
    label: 'Intermediate Level',
    description: 'Focuses on the lives and warnings of the Major Prophets, testing your understanding of God\'s messages to His people.',
  },
  {
    id: 'Deacon',
    icon: '🕊️',
    color: '#9C27B0',
    bgColor: 'rgba(156,39,176,0.12)',
    difficulty: [2, 3],
    label: 'Advanced Level',
    description: 'Designed for those who understand the inner workings of the early church and the practical service found in the Epistles.',
  },
  {
    id: 'Evangelist',
    icon: '🌍',
    color: '#F44336',
    bgColor: 'rgba(244,67,54,0.12)',
    difficulty: [3],
    label: 'Expert Level',
    description: 'A high-level rank focused on the Great Commission, the theology of salvation, and the ability to explain the Word to others.',
  },
  {
    id: 'Visionary',
    icon: '👁️',
    color: '#3F51B5',
    bgColor: 'rgba(63,81,181,0.12)',
    difficulty: [1, 2, 3],
    label: 'Master Level',
    description: 'The most advanced rank, focusing on the complex apocalyptic literature of Daniel and Revelation and the final victory of Christ.',
  },
]
const GAME_SCRIPTS = {
  speedtyper:  `Welcome to Speed Typer! A Bible verse will appear on screen. Type it out as fast and accurately as you can. Your words per minute and accuracy will be tracked. Take a deep breath and begin when you are ready!`,
  swipe:       `Welcome to Swipe True or False! I will show you a Bible statement. Press TRUE if it is correct or FALSE if it is wrong. You have ten questions. Trust what you know from the Word!`,
  fillblank:   `Welcome to Fill the Blank! Each question shows a Bible verse with a missing word. Choose the correct word from the four options given. The reference is shown to help you. May the Word be in your heart!`,
  whoami:      `Welcome to Who Am I! I will give you clues one at a time about a Bible character. Try to guess with as few clues as possible for maximum points. You can reveal more clues if you need help. Who could it be?`,
  lightning:   `Welcome to Lightning Round! You have sixty seconds to answer as many Bible trivia questions as possible. Tap your answer quickly and move on. Questions get harder as your rank increases. Ready? Go!`,
  scramble:    `Welcome to Scripture Scramble! The words of a Bible verse have been shuffled. Click the words in the correct order to rebuild the verse. Take your time and think carefully!`,
  wordle:      `Welcome to Verse Wordle! Guess the five letter Bible word in six tries. After each guess I will show you which letters are correct, which are in the wrong position, and which are not in the word at all. Use the hint to help you!`,
  hangman:     `Welcome to Bible Hangman! Guess the hidden biblical word one letter at a time. You have six wrong guesses before the game ends. Use the category and hint to guide your thinking. Choose wisely!`,
  prophecy:    `Welcome to Prophetic Connections! On the left are Old Testament prophecies. On the right are their New Testament fulfilments. Click a prophecy then click its matching fulfilment. Discover how God's Word connects across centuries!`,
  chronology:  `Welcome to Chronology Challenge! The Bible events on screen are out of order. Drag and drop them into the correct historical sequence. Think through the flow of Scripture from creation to Pentecost!`,
  emoji:       `Welcome to Emoji Bible! I will show you a sequence of emojis representing a Bible story. Choose which story matches the emojis. Have fun and think creatively about the Word!`,
  nameBook:    `Welcome to Name That Book! I will show you a Bible verse. Your job is to identify which book of the Bible it comes from. Choose from the four options. How well do you know your Scripture?`,
  wisdom:      `Welcome to Wisdom Grid! These are logic puzzles drawn from Scripture. Read each question carefully and think through the biblical context before choosing your answer. Wisdom comes from the Lord!`,
  connections: `Welcome to Daily Connections! Sixteen biblical words are hidden on screen. Find four groups of four words that share a hidden connection. Select four words and submit your group. Think carefully — some connections are tricky!`,
  map:         `Welcome to Biblical Map Quest! I will name a sacred location from the Bible. Click where you think it is on the ancient map. Learn the geography of the Holy Land as you play!`,
  swordDrill:  `Welcome to Sword Drill! I will show you a Bible verse. Type the correct book chapter and verse reference as fast as you can before the timer runs out. The Word of God is your sword — draw it quickly!`,
}

const KEY_XP     = 'sh_xp'
const KEY_HALL   = 'sh_hall'
const KEY_STREAK = 'sh_streak'
const KEY_SEEN   = 'sh_seen_questions'

const load = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f } catch { return f } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

function getSession(bank, n, seenIds) {
  const unseen = bank.filter(q => !seenIds.includes(q.id))
  const seen   = bank.filter(q =>  seenIds.includes(q.id))
  const pool   = [...shuffle(unseen), ...shuffle(seen)]
  return pool.slice(0, n).map(q => ({ ...q, sessionOpts: shuffle(q.opts) }))
}

function markSeen(ids) {
  const seen = load(KEY_SEEN, [])
  const next = [...new Set([...seen, ...ids])].slice(-200)
  save(KEY_SEEN, next)
}

const getRank = (xp) => {
  if (xp >= 10000) return { title:'Scripture Master', icon:'🏆', color:'#f0c040', next:null  }
  if (xp >= 5000)  return { title:'Apostle',          icon:'⚡', color:'#9b59b6', next:10000 }
  if (xp >= 2500)  return { title:'Prophet',          icon:'🔥', color:'#e67e22', next:5000  }
  if (xp >= 1000)  return { title:'Scribe',           icon:'✍️', color:'#3498db', next:2500  }
  if (xp >= 300)   return { title:'Disciple',         icon:'📖', color:'#27ae60', next:1000  }
  return                   { title:'Seeker',           icon:'🌱', color:'#95a5a6', next:300   }
}

function getDifficultyPool(bank, xp) {
  if (xp >= 2500) return bank
  if (xp >= 500)  return bank.filter(q => q.d <= 2)
  return                bank.filter(q => q.d === 1)
}

function getRankPool(bank, selectedRank) {
  if (!selectedRank) return bank
  return bank.filter(q => selectedRank.difficulty.includes(q.d))
}
// ════════════════════════════════════════════════════════════════
// QUESTION BANKS
// ════════════════════════════════════════════════════════════════
const TRIVIA_BANK = [
  { id:'t001', d:1, q:'How many books are in the Bible?',                        answer:'66',               opts:['66','72','39','80']                                              },
  { id:'t002', d:1, q:'Who built the ark?',                                      answer:'Noah',             opts:['Noah','Abraham','Moses','David']                                 },
  { id:'t003', d:1, q:'What is the shortest verse in the Bible?',                answer:'Jesus wept',       opts:['Jesus wept','Amen','Fear not','So be it']                        },
  { id:'t004', d:1, q:'How many disciples did Jesus have?',                      answer:'12',               opts:['12','7','10','14']                                               },
  { id:'t005', d:1, q:'Who denied Jesus three times?',                           answer:'Peter',            opts:['Peter','Judas','Thomas','John']                                  },
  { id:'t006', d:1, q:'In which city was Jesus born?',                           answer:'Bethlehem',        opts:['Bethlehem','Nazareth','Jerusalem','Jericho']                     },
  { id:'t007', d:1, q:'Who was the first king of Israel?',                       answer:'Saul',             opts:['Saul','David','Solomon','Gideon']                                },
  { id:'t008', d:1, q:'What river was Jesus baptized in?',                       answer:'Jordan',           opts:['Jordan','Nile','Euphrates','Galilee']                            },
  { id:'t009', d:1, q:'Who wrote most of the Psalms?',                           answer:'David',            opts:['David','Solomon','Moses','Asaph']                                },
  { id:'t010', d:1, q:'What is the last book of the Bible?',                     answer:'Revelation',       opts:['Revelation','Malachi','Jude','Acts']                             },
  { id:'t011', d:1, q:'Who was swallowed by a great fish?',                      answer:'Jonah',            opts:['Jonah','Elijah','Paul','Moses']                                  },
  { id:'t012', d:1, q:'How many plagues hit Egypt?',                             answer:'10',               opts:['10','7','12','9']                                                },
  { id:'t013', d:1, q:'Who was the mother of Jesus?',                            answer:'Mary',             opts:['Mary','Martha','Elizabeth','Miriam']                             },
  { id:'t014', d:1, q:'What was the first miracle of Jesus?',                    answer:'Water to wine',    opts:['Water to wine','Healing blind man','Feeding 5000','Walking on water'] },
  { id:'t015', d:1, q:'How many days did it rain during the flood?',             answer:'40',               opts:['40','7','30','100']                                              },
  { id:'t016', d:1, q:'Who killed Goliath?',                                     answer:'David',            opts:['David','Saul','Jonathan','Gideon']                               },
  { id:'t017', d:1, q:'What is the first book of the Bible?',                    answer:'Genesis',          opts:['Genesis','Exodus','Leviticus','Numbers']                         },
  { id:'t018', d:1, q:'How many days was Lazarus in the tomb?',                  answer:'4',                opts:['4','3','7','2']                                                  },
  { id:'t019', d:1, q:'Who was thrown into the lion\'s den?',                    answer:'Daniel',           opts:['Daniel','Shadrach','Paul','Elijah']                              },
  { id:'t020', d:1, q:'What did God create on the first day?',                   answer:'Light',            opts:['Light','Sky','Land','Stars']                                     },
  { id:'t021', d:1, q:'How many sons did Jacob have?',                           answer:'12',               opts:['12','10','7','14']                                               },
  { id:'t022', d:1, q:'Who was the first man?',                                  answer:'Adam',             opts:['Adam','Abel','Cain','Seth']                                      },
  { id:'t023', d:1, q:'What did Jesus feed 5000 people with?',                   answer:'5 loaves and 2 fish', opts:['5 loaves and 2 fish','7 loaves','Manna','Bread alone']        },
  { id:'t024', d:1, q:'Who was Jesus\'s earthly father?',                        answer:'Joseph',           opts:['Joseph','Zechariah','Simeon','Joachim']                          },
  { id:'t025', d:1, q:'On which day did God rest?',                              answer:'Seventh',          opts:['Seventh','Sixth','Fifth','Eighth']                               },
  { id:'t026', d:2, q:'Which tribe was King Saul from?',                         answer:'Benjamin',         opts:['Benjamin','Judah','Levi','Ephraim']                              },
  { id:'t027', d:2, q:'Who was the first judge of Israel?',                      answer:'Othniel',          opts:['Othniel','Gideon','Deborah','Samson']                            },
  { id:'t028', d:2, q:'How many years did the Israelites wander in the desert?', answer:'40',               opts:['40','20','30','50']                                              },
  { id:'t029', d:2, q:'Who baptized Jesus?',                                     answer:'John the Baptist', opts:['John the Baptist','Peter','Andrew','Philip']                     },
  { id:'t030', d:2, q:'What was Paul\'s name before conversion?',                answer:'Saul',             opts:['Saul','Simon','Silas','Barnabas']                                },
  { id:'t031', d:2, q:'Which disciple walked on water with Jesus?',              answer:'Peter',            opts:['Peter','John','James','Andrew']                                  },
  { id:'t032', d:2, q:'Who was the oldest man in the Bible?',                    answer:'Methuselah',       opts:['Methuselah','Noah','Adam','Enoch']                               },
  { id:'t033', d:2, q:'How many books did Paul write in the NT?',                answer:'13',               opts:['13','7','10','9']                                                },
  { id:'t034', d:2, q:'Who was Esau\'s twin brother?',                           answer:'Jacob',            opts:['Jacob','Joseph','Levi','Judah']                                  },
  { id:'t035', d:2, q:'What city\'s walls fell after Israel marched around it?', answer:'Jericho',          opts:['Jericho','Ai','Gibeon','Hazor']                                  },
  { id:'t036', d:2, q:'Who was the prophetess who judged Israel?',               answer:'Deborah',          opts:['Deborah','Miriam','Huldah','Anna']                               },
  { id:'t037', d:2, q:'Which book comes after Matthew?',                         answer:'Mark',             opts:['Mark','Luke','John','Acts']                                      },
  { id:'t038', d:2, q:'Who climbed a tree to see Jesus?',                        answer:'Zacchaeus',        opts:['Zacchaeus','Matthew','Levi','Bartimaeus']                        },
  { id:'t039', d:2, q:'What was the name of Abraham\'s wife?',                   answer:'Sarah',            opts:['Sarah','Hagar','Rebekah','Rachel']                               },
  { id:'t040', d:2, q:'How many days was Jesus tempted in the desert?',          answer:'40',               opts:['40','7','3','30']                                                },
  { id:'t041', d:2, q:'Who wrote the book of Revelation?',                       answer:'John',             opts:['John','Paul','Peter','James']                                    },
  { id:'t042', d:2, q:'What was the name of Moses\'s sister?',                   answer:'Miriam',           opts:['Miriam','Deborah','Ruth','Esther']                               },
  { id:'t043', d:2, q:'Which apostle was a tax collector?',                      answer:'Matthew',          opts:['Matthew','Luke','Mark','Barnabas']                               },
  { id:'t044', d:2, q:'What language was most of the OT written in?',            answer:'Hebrew',           opts:['Hebrew','Greek','Aramaic','Latin']                               },
  { id:'t045', d:2, q:'Who was the high priest who condemned Jesus?',            answer:'Caiaphas',         opts:['Caiaphas','Annas','Pilate','Herod']                              },
  { id:'t046', d:2, q:'How many Psalms are in the Bible?',                       answer:'150',              opts:['150','100','120','180']                                          },
  { id:'t047', d:2, q:'Who was Ruth\'s mother-in-law?',                          answer:'Naomi',            opts:['Naomi','Orpah','Hannah','Abigail']                               },
  { id:'t048', d:2, q:'What was the name of Samson\'s betrayer?',                answer:'Delilah',          opts:['Delilah','Jezebel','Bathsheba','Tamar']                          },
  { id:'t049', d:2, q:'Which book contains the Ten Commandments?',               answer:'Exodus',           opts:['Exodus','Leviticus','Deuteronomy','Numbers']                     },
  { id:'t050', d:2, q:'Who replaced Judas as an apostle?',                       answer:'Matthias',         opts:['Matthias','Barnabas','Silas','Timothy']                          },
  { id:'t051', d:3, q:'What is the name of the angel who appeared to Mary?',     answer:'Gabriel',          opts:['Gabriel','Michael','Raphael','Uriel']                            },
  { id:'t052', d:3, q:'In which book is the armour of God described?',           answer:'Ephesians',        opts:['Ephesians','Colossians','Romans','Galatians']                    },
  { id:'t053', d:3, q:'How many chapters are in the book of Psalms?',            answer:'150',              opts:['150','100','120','175']                                          },
  { id:'t054', d:3, q:'Who was the father of John the Baptist?',                 answer:'Zechariah',        opts:['Zechariah','Joseph','Simeon','Eli']                              },
  { id:'t055', d:3, q:'What was the name of the pool where Jesus healed a man?', answer:'Bethesda',         opts:['Bethesda','Siloam','Gibeon','Kidron']                            },
  { id:'t056', d:3, q:'Which prophet was taken to heaven in a whirlwind?',       answer:'Elijah',           opts:['Elijah','Enoch','Moses','Elisha']                                },
  { id:'t057', d:3, q:'How many chapters are in the book of Isaiah?',            answer:'66',               opts:['66','52','40','72']                                              },
  { id:'t058', d:3, q:'What was the name of Abraham\'s nephew?',                 answer:'Lot',              opts:['Lot','Ishmael','Eliezer','Terah']                                },
  { id:'t059', d:3, q:'Which king had 700 wives and 300 concubines?',            answer:'Solomon',          opts:['Solomon','David','Rehoboam','Ahab']                              },
  { id:'t060', d:3, q:'What is the Hebrew word for peace?',                      answer:'Shalom',           opts:['Shalom','Hesed','Emet','Ruach']                                  },
  { id:'t061', d:3, q:'Who wrote the book of Hebrews?',                          answer:'Unknown',          opts:['Unknown','Paul','Barnabas','Apollos']                            },
  { id:'t062', d:3, q:'What was the name of the garden where Jesus prayed?',     answer:'Gethsemane',       opts:['Gethsemane','Eden','Olivet','Kidron']                            },
  { id:'t063', d:3, q:'How many letters did Paul write to Timothy?',             answer:'2',                opts:['2','1','3','4']                                                  },
  { id:'t064', d:3, q:'Which tribe was the priestly tribe of Israel?',           answer:'Levi',             opts:['Levi','Judah','Benjamin','Ephraim']                              },
  { id:'t065', d:3, q:'What passage was the Ethiopian eunuch reading?',          answer:'Isaiah 53',        opts:['Isaiah 53','Psalm 22','Jeremiah 31','Daniel 9']                  },
  { id:'t066', d:3, q:'How many seals are in the book of Revelation?',           answer:'7',                opts:['7','6','12','10']                                                },
  { id:'t067', d:3, q:'Who was the Roman governor who sentenced Jesus?',         answer:'Pilate',           opts:['Pilate','Herod','Felix','Festus']                                },
  { id:'t068', d:3, q:'What is the meaning of Immanuel?',                        answer:'God with us',      opts:['God with us','God saves','God is great','God is light']          },
  { id:'t069', d:3, q:'Which book records the early church\'s history?',         answer:'Acts',             opts:['Acts','Romans','Galatians','Ephesians']                          },
  { id:'t070', d:3, q:'How many fruits of the Spirit are listed in Galatians?',  answer:'9',                opts:['9','7','12','10']                                                },
  { id:'t071', d:3, q:'What was the name of the first martyr of the church?',    answer:'Stephen',          opts:['Stephen','James','Peter','Philip']                               },
  { id:'t072', d:3, q:'Which prophet predicted the virgin birth?',               answer:'Isaiah',           opts:['Isaiah','Micah','Jeremiah','Zechariah']                          },
  { id:'t073', d:3, q:'What was the name of the sea Jesus calmed?',              answer:'Sea of Galilee',   opts:['Sea of Galilee','Dead Sea','Red Sea','Mediterranean']            },
  { id:'t074', d:3, q:'How many days between resurrection and ascension?',       answer:'40',               opts:['40','7','3','50']                                                },
  { id:'t075', d:3, q:'Who was the first Gentile convert in Acts?',              answer:'Cornelius',        opts:['Cornelius','Lydia','Sergius Paulus','Ethiopian eunuch']           },
]

const FILL_BANK = [
  { id:'f001', d:1, verse:'For God so ___ the world.',                           answer:'loved',      ref:'John 3:16',      opts:['loved','saved','blessed','created']       },
  { id:'f002', d:1, verse:'The Lord is my ___.',                                 answer:'shepherd',   ref:'Psalm 23:1',     opts:['shepherd','father','king','guide']         },
  { id:'f003', d:1, verse:'I can do all this through him who gives me ___.',     answer:'strength',   ref:'Phil 4:13',      opts:['strength','power','grace','hope']          },
  { id:'f004', d:1, verse:'Trust in the Lord with all your ___.',                answer:'heart',      ref:'Prov 3:5',       opts:['heart','mind','soul','strength']           },
  { id:'f005', d:1, verse:'Be strong and ___ courageous.',                       answer:'courageous', ref:'Josh 1:9',       opts:['courageous','bold','brave','faithful']     },
  { id:'f006', d:1, verse:'In the beginning God created the ___ and the earth.', answer:'heavens',    ref:'Gen 1:1',        opts:['heavens','skies','stars','light']          },
  { id:'f007', d:1, verse:'Jesus ___.',                                          answer:'wept',       ref:'John 11:35',     opts:['wept','prayed','spoke','rose']             },
  { id:'f008', d:1, verse:'For I know the ___ I have for you.',                  answer:'plans',      ref:'Jer 29:11',      opts:['plans','thoughts','words','ways']          },
  { id:'f009', d:1, verse:'The wages of sin is ___.',                            answer:'death',      ref:'Romans 6:23',    opts:['death','pain','loss','shame']              },
  { id:'f010', d:1, verse:'God is our refuge and ___.',                          answer:'strength',   ref:'Psalm 46:1',     opts:['strength','shield','tower','fortress']     },
  { id:'f011', d:1, verse:'Your word is a ___ to my feet.',                      answer:'lamp',       ref:'Psalm 119:105',  opts:['lamp','light','guide','path']              },
  { id:'f012', d:1, verse:'I am the way the truth and the ___.',                 answer:'life',       ref:'John 14:6',      opts:['life','door','vine','bread']               },
  { id:'f013', d:2, verse:'Love is patient, love is ___.',                       answer:'kind',       ref:'1 Cor 13:4',     opts:['kind','good','pure','true']                },
  { id:'f014', d:2, verse:'The Lord is my ___ and my salvation.',                answer:'light',      ref:'Psalm 27:1',     opts:['light','rock','shield','tower']            },
  { id:'f015', d:2, verse:'Faith without ___ is dead.',                          answer:'works',      ref:'James 2:26',     opts:['works','love','hope','prayer']             },
  { id:'f016', d:2, verse:'Do not be ___ to the pattern of this world.',         answer:'conformed',  ref:'Romans 12:2',    opts:['conformed','attached','bound','joined']    },
  { id:'f017', d:2, verse:'The ___ of the Lord is the beginning of wisdom.',     answer:'fear',       ref:'Prov 9:10',      opts:['fear','love','word','grace']               },
  { id:'f018', d:2, verse:'I am the ___ of life.',                               answer:'bread',      ref:'John 6:35',      opts:['bread','light','door','vine']              },
  { id:'f019', d:2, verse:'Blessed are the ___ in spirit.',                      answer:'poor',       ref:'Matt 5:3',       opts:['poor','pure','meek','humble']              },
  { id:'f020', d:2, verse:'The ___ shall inherit the earth.',                    answer:'meek',       ref:'Matt 5:5',       opts:['meek','poor','pure','wise']                },
  { id:'f021', d:3, verse:'For the ___ of God is foolishness to men.',           answer:'wisdom',     ref:'1 Cor 1:18',     opts:['wisdom','word','cross','grace']            },
  { id:'f022', d:3, verse:'I have been ___ with Christ.',                        answer:'crucified',  ref:'Gal 2:20',       opts:['crucified','buried','raised','united']      },
  { id:'f023', d:3, verse:'Now faith is the ___ of things hoped for.',           answer:'substance',  ref:'Heb 11:1',       opts:['substance','evidence','assurance','proof'] },
  { id:'f024', d:3, verse:'The ___ is near, even at the door.',                  answer:'kingdom',    ref:'Mark 13:29',     opts:['kingdom','end','harvest','hour']           },
  { id:'f025', d:3, verse:'He who began a good ___ in you will carry it on.',    answer:'work',       ref:'Phil 1:6',       opts:['work','plan','purpose','thing']            },
]

const WHO_BANK = [
  { id:'w001', d:1, clues:['Swallowed by a great fish','Preached to Nineveh','Ran from God'],                          answer:'Jonah',    opts:['Jonah','Elijah','Ezekiel','Amos']        },
  { id:'w002', d:1, clues:['Wisest man ever','Built the Temple','Had 700 wives'],                                      answer:'Solomon',  opts:['Solomon','David','Moses','Abraham']       },
  { id:'w003', d:1, clues:['Parted the Red Sea','Received Ten Commandments','Led the Exodus'],                         answer:'Moses',    opts:['Moses','Joshua','Aaron','Caleb']          },
  { id:'w004', d:1, clues:['Killed a giant','Was a shepherd boy','Became Israel\'s greatest king'],                    answer:'David',    opts:['David','Saul','Gideon','Samson']          },
  { id:'w005', d:1, clues:['Thrown in a lion\'s den','Interpreted dreams','Served Babylonian kings'],                  answer:'Daniel',   opts:['Daniel','Ezekiel','Jeremiah','Isaiah']    },
  { id:'w006', d:1, clues:['Built an ark','Had three sons','Walked with God before the flood'],                        answer:'Noah',     opts:['Noah','Abraham','Lot','Enoch']            },
  { id:'w007', d:1, clues:['First woman','Lived in the Garden of Eden','Tempted by a serpent'],                        answer:'Eve',      opts:['Eve','Sarah','Rebekah','Rachel']          },
  { id:'w008', d:2, clues:['Sold into slavery by brothers','Interpreted Pharaoh\'s dream','Saved Egypt from famine'], answer:'Joseph',   opts:['Joseph','Benjamin','Reuben','Daniel']     },
  { id:'w009', d:2, clues:['Prophetess and judge','Led Barak into battle','Judged under a palm tree'],                 answer:'Deborah',  opts:['Deborah','Miriam','Huldah','Anna']        },
  { id:'w010', d:2, clues:['Had supernatural strength','Hair was source of power','Killed by pulling down pillars'],   answer:'Samson',   opts:['Samson','Gideon','Saul','David']          },
  { id:'w011', d:2, clues:['Moabite woman','Said where you go I will go','Ancestor of Jesus'],                         answer:'Ruth',     opts:['Ruth','Esther','Naomi','Rahab']           },
  { id:'w012', d:2, clues:['Tax collector','Climbed a sycamore tree','Gave half his goods to the poor'],               answer:'Zacchaeus',opts:['Zacchaeus','Matthew','Levi','Bartimaeus'] },
  { id:'w013', d:2, clues:['Fisherman','Walked on water','First pope of the church'],                                  answer:'Peter',    opts:['Peter','John','James','Andrew']           },
  { id:'w014', d:2, clues:['Queen who saved her people','Was chosen in a beauty contest','Cousin of Mordecai'],        answer:'Esther',   opts:['Esther','Ruth','Deborah','Miriam']        },
  { id:'w015', d:3, clues:['Wrote letters from prison','Was shipwrecked three times','Was formerly a Pharisee'],       answer:'Paul',     opts:['Paul','Peter','James','Silas']            },
  { id:'w016', d:3, clues:['Youngest of Jesse\'s sons','Anointed by Samuel','Played the harp for King Saul'],          answer:'David',    opts:['David','Solomon','Absalom','Adonijah']    },
  { id:'w017', d:3, clues:['Ran faster than a chariot','Called down fire from heaven','Was fed by ravens'],            answer:'Elijah',   opts:['Elijah','Elisha','Isaiah','Jeremiah']     },
  { id:'w018', d:3, clues:['Healed ten lepers','Was a Samaritan','Only one returned to thank Jesus'],                  answer:'One leper',opts:['One leper','Blind Bartimaeus','Lazarus','Jairus'] },
]

const SCRAMBLE_BANK = [
  { id:'s001', d:1, ref:'John 11:35',   words:['Jesus','wept.']                                                                         },
  { id:'s002', d:1, ref:'Psalm 23:1',   words:['The','Lord','is','my','shepherd;','I','shall','not','want.']                            },
  { id:'s003', d:1, ref:'John 3:16',    words:['For','God','so','loved','the','world','that','he','gave','his','only','Son.']           },
  { id:'s004', d:1, ref:'Prov 3:5',     words:['Trust','in','the','Lord','with','all','your','heart.']                                  },
  { id:'s005', d:2, ref:'Phil 4:13',    words:['I','can','do','all','this','through','him','who','gives','me','strength.']              },
  { id:'s006', d:2, ref:'Josh 1:9',     words:['Be','strong','and','courageous.','Do','not','be','afraid.']                             },
  { id:'s007', d:2, ref:'Gen 1:1',      words:['In','the','beginning','God','created','the','heavens','and','the','earth.']             },
  { id:'s008', d:2, ref:'Romans 8:28',  words:['In','all','things','God','works','for','the','good','of','those','who','love','him.']   },
  { id:'s009', d:3, ref:'Isaiah 40:31', words:['Those','who','hope','in','the','Lord','will','renew','their','strength.']               },
  { id:'s010', d:3, ref:'Jer 29:11',    words:['For','I','know','the','plans','I','have','for','you','declares','the','Lord.']          },
  { id:'s011', d:3, ref:'John 14:6',    words:['I','am','the','way','and','the','truth','and','the','life.']                            },
  { id:'s012', d:3, ref:'Matt 5:16',    words:['Let','your','light','shine','before','others','that','they','may','see','your','good','deeds.'] },
]

const BOOK_BANK = [
  { id:'b001', d:1, verse:'"In the beginning God created the heavens and the earth."',   answer:'Genesis',       opts:['Genesis','Exodus','John','Psalms']               },
  { id:'b002', d:1, verse:'"The Lord is my shepherd; I shall not want."',                answer:'Psalms',        opts:['Psalms','Proverbs','Isaiah','Job']                },
  { id:'b003', d:1, verse:'"For I know the plans I have for you."',                      answer:'Jeremiah',      opts:['Jeremiah','Isaiah','Ezekiel','Daniel']            },
  { id:'b004', d:1, verse:'"I can do all this through him who gives me strength."',      answer:'Philippians',   opts:['Philippians','Romans','Galatians','Ephesians']    },
  { id:'b005', d:1, verse:'"In the beginning was the Word."',                            answer:'John',          opts:['John','Mark','Luke','Matthew']                    },
  { id:'b006', d:1, verse:'"Vanity of vanities, all is vanity."',                        answer:'Ecclesiastes',  opts:['Ecclesiastes','Proverbs','Job','Song of Solomon'] },
  { id:'b007', d:1, verse:'"The wages of sin is death."',                                answer:'Romans',        opts:['Romans','Hebrews','James','Revelation']           },
  { id:'b008', d:1, verse:'"Be strong and courageous. Do not be afraid."',               answer:'Joshua',        opts:['Joshua','Deuteronomy','Numbers','Judges']         },
  { id:'b009', d:2, verse:'"Love is patient, love is kind."',                            answer:'1 Corinthians', opts:['1 Corinthians','Ephesians','Colossians','Romans']  },
  { id:'b010', d:2, verse:'"The Lord is my light and my salvation."',                    answer:'Psalms',        opts:['Psalms','Isaiah','Proverbs','Lamentations']       },
  { id:'b011', d:2, verse:'"I am the resurrection and the life."',                       answer:'John',          opts:['John','Luke','Acts','Revelation']                 },
  { id:'b012', d:2, verse:'"Faith without works is dead."',                              answer:'James',         opts:['James','Hebrews','Galatians','Romans']            },
  { id:'b013', d:2, verse:'"Do not be anxious about anything."',                         answer:'Philippians',   opts:['Philippians','Colossians','Romans','James']       },
  { id:'b014', d:2, verse:'"Your word is a lamp to my feet."',                           answer:'Psalms',        opts:['Psalms','Proverbs','Isaiah','Jeremiah']           },
  { id:'b015', d:3, verse:'"Now faith is the substance of things hoped for."',           answer:'Hebrews',       opts:['Hebrews','Romans','James','Galatians']            },
  { id:'b016', d:3, verse:'"I have been crucified with Christ."',                        answer:'Galatians',     opts:['Galatians','Romans','Colossians','Ephesians']     },
  { id:'b017', d:3, verse:'"Put on the full armour of God."',                            answer:'Ephesians',     opts:['Ephesians','Colossians','Romans','Philippians']   },
  { id:'b018', d:3, verse:'"The fear of the Lord is the beginning of wisdom."',          answer:'Proverbs',      opts:['Proverbs','Psalms','Ecclesiastes','Job']          },
]

const EMOJI_BANK = [
  { id:'e001', d:1, emojis:'🐋😰🙏',      answer:'Jonah and the Whale',       opts:['Jonah and the Whale','Noah\'s Ark','Elijah and Ravens','Daniel in Lions Den']  },
  { id:'e002', d:1, emojis:'🍞🐟✖️5000', answer:'Feeding of the 5000',        opts:['Feeding of the 5000','Last Supper','Wedding at Cana','Manna from Heaven']      },
  { id:'e003', d:1, emojis:'🌊🚶💧',      answer:'Jesus Walks on Water',       opts:['Jesus Walks on Water','Parting Red Sea','Baptism of Jesus','Flood of Noah']    },
  { id:'e004', d:1, emojis:'🦁😤🙏✅',    answer:'Daniel in the Lions Den',    opts:['Daniel in the Lions Den','Samson and Lion','David and Bear','Elijah']          },
  { id:'e005', d:1, emojis:'🍎🐍👩😔',    answer:'The Fall of Man',            opts:['The Fall of Man','Cain and Abel','Tower of Babel','Lot\'s Wife']               },
  { id:'e006', d:1, emojis:'⭐👶🎁🐪',    answer:'Birth of Jesus',             opts:['Birth of Jesus','Moses in Basket','Samuel\'s Birth','Isaac\'s Birth']         },
  { id:'e007', d:2, emojis:'🌈☁️🕊️🌍',  answer:'Noah\'s Covenant',           opts:['Noah\'s Covenant','Creation','Baptism','Transfiguration']                      },
  { id:'e008', d:2, emojis:'🔥🌿👟📜',    answer:'Moses and the Burning Bush', opts:['Moses and the Burning Bush','Elijah at Horeb','Pentecost','Pillar of Fire']    },
  { id:'e009', d:2, emojis:'🏹👦🗿💀',    answer:'David and Goliath',          opts:['David and Goliath','Samson and Philistines','Joshua at Jericho','Gideon\'s Army'] },
  { id:'e010', d:2, emojis:'🚢🌊🐦🕊️',  answer:'Noah\'s Ark',                opts:['Noah\'s Ark','Jonah and the Whale','Crossing Red Sea','Jesus Calms Storm']     },
  { id:'e011', d:3, emojis:'🔥💨🗣️👥',   answer:'Pentecost',                  opts:['Pentecost','Elijah at Carmel','Burning Bush','Tower of Babel']                 },
  { id:'e012', d:3, emojis:'👑🪓🤴😢',    answer:'Saul and David',             opts:['Saul and David','Absalom\'s Rebellion','Solomon\'s Judgment','Jeroboam']       },
]

const SWIPE_BANK = [
  { id:'sw001', d:1, q:'Jesus had 12 disciples.',                             a:true  },
  { id:'sw002', d:1, q:'Moses wrote the book of Revelation.',                 a:false },
  { id:'sw003', d:1, q:'David killed Goliath with a sling and stone.',        a:true  },
  { id:'sw004', d:1, q:'The Bible has 66 books.',                             a:true  },
  { id:'sw005', d:1, q:'Jonah was in the fish for 40 days.',                  a:false },
  { id:'sw006', d:1, q:'Jesus was born in Nazareth.',                         a:false },
  { id:'sw007', d:1, q:'Noah had three sons.',                                a:true  },
  { id:'sw008', d:1, q:'Paul wrote the book of Romans.',                      a:true  },
  { id:'sw009', d:2, q:'Samson\'s strength was in his beard.',                a:false },
  { id:'sw010', d:2, q:'Abraham was 100 years old when Isaac was born.',      a:true  },
  { id:'sw011', d:2, q:'Elijah was taken to heaven in a chariot of fire.',    a:true  },
  { id:'sw012', d:2, q:'The first miracle of Jesus was healing a blind man.', a:false },
  { id:'sw013', d:2, q:'Ruth was from the land of Moab.',                     a:true  },
  { id:'sw014', d:2, q:'Solomon built the first Temple in Jerusalem.',        a:true  },
  { id:'sw015', d:3, q:'The book of Job has 42 chapters.',                    a:true  },
  { id:'sw016', d:3, q:'Paul was shipwrecked on the island of Malta.',        a:true  },
  { id:'sw017', d:3, q:'Methuselah lived to be 999 years old.',               a:false },
  { id:'sw018', d:3, q:'The New Testament was originally written in Greek.',  a:true  },
]

const WORDLE_BANK = [
  { word:'GRACE', hint:'Unmerited favour from God'             },
  { word:'FAITH', hint:'Confidence in what we hope for'        },
  { word:'PEACE', hint:'Shalom — wholeness and harmony'        },
  { word:'LIGHT', hint:'Jesus said I am the ___'               },
  { word:'CROSS', hint:'Symbol of salvation'                   },
  { word:'GLORY', hint:'The splendour of God'                  },
  { word:'MERCY', hint:'Compassion to the undeserving'         },
  { word:'TRUTH', hint:'I am the way the ___ and the life'     },
  { word:'BREAD', hint:'I am the ___ of life — Jesus'          },
  { word:'PSALM', hint:'A sacred song or poem'                 },
  { word:'ANGEL', hint:'A heavenly messenger'                  },
  { word:'ALTAR', hint:'A place of sacrifice and worship'      },
  { word:'SHEEP', hint:'Jesus is the Good Shepherd of ___'     },
  { word:'STONE', hint:'David used this to defeat Goliath'     },
  { word:'FLOOD', hint:'Noah survived this great event'        },
  { word:'CROWN', hint:'Symbol of royalty and victory'         },
  { word:'SWORD', hint:'The Word of God is sharper than a ___' },
  { word:'BLOOD', hint:'Shed for the remission of sins'        },
  { word:'FLESH', hint:'The Word became ___'                   },
  { word:'TRIAL', hint:'Testing of your faith'                 },
]

const HANGMAN_BANK = [
  { word:'BETHLEHEM',    hint:'City of David\'s birth',                  cat:'Places'   },
  { word:'COVENANT',     hint:'A sacred agreement with God',             cat:'Theology' },
  { word:'DISCIPLES',    hint:'Followers of Jesus',                      cat:'People'   },
  { word:'SALVATION',    hint:'Being saved from sin',                    cat:'Theology' },
  { word:'PENTECOST',    hint:'The coming of the Holy Spirit',           cat:'Events'   },
  { word:'RESURRECTION', hint:'Rising from the dead',                    cat:'Theology' },
  { word:'JERUSALEM',    hint:'The Holy City',                           cat:'Places'   },
  { word:'TABERNACLE',   hint:'The portable sanctuary of God',           cat:'Objects'  },
  { word:'PROVERBS',     hint:'Book of wisdom in the OT',                cat:'Books'    },
  { word:'NAZARETH',     hint:'Where Jesus grew up',                     cat:'Places'   },
  { word:'APOSTLE',      hint:'One sent out by Jesus',                   cat:'People'   },
  { word:'PROPHET',      hint:'One who speaks for God',                  cat:'People'   },
  { word:'BAPTISM',      hint:'Immersion in water as a symbol',          cat:'Events'   },
  { word:'SCRIPTURE',    hint:'The holy writings of God',                cat:'Theology' },
  { word:'ATONEMENT',    hint:'Making amends for sin',                   cat:'Theology' },
  { word:'SANCTIFIED',   hint:'Set apart and made holy',                 cat:'Theology' },
  { word:'EPHESIANS',    hint:'Paul\'s letter to a church in Asia Minor',cat:'Books'    },
  { word:'GALILEE',      hint:'Region where Jesus ministered',           cat:'Places'   },
]

const SWORD_BANK = [
  { id:'sd001', ref:'John 3:16',        text:'For God so loved the world that he gave his one and only Son.'         },
  { id:'sd002', ref:'Psalm 23:1',       text:'The Lord is my shepherd; I shall not want.'                           },
  { id:'sd003', ref:'Proverbs 3:5',     text:'Trust in the Lord with all your heart.'                               },
  { id:'sd004', ref:'Romans 8:28',      text:'In all things God works for the good of those who love him.'          },
  { id:'sd005', ref:'Philippians 4:13', text:'I can do all this through him who gives me strength.'                 },
  { id:'sd006', ref:'Genesis 1:1',      text:'In the beginning God created the heavens and the earth.'              },
  { id:'sd007', ref:'Joshua 1:9',       text:'Be strong and courageous. Do not be afraid.'                          },
  { id:'sd008', ref:'Jeremiah 29:11',   text:'For I know the plans I have for you declares the Lord.'               },
  { id:'sd009', ref:'Isaiah 40:31',     text:'Those who hope in the Lord will renew their strength.'                },
  { id:'sd010', ref:'John 14:6',        text:'I am the way and the truth and the life.'                             },
  { id:'sd011', ref:'Matthew 5:16',     text:'Let your light shine before others that they may see your good deeds.'},
  { id:'sd012', ref:'Hebrews 11:1',     text:'Now faith is the substance of things hoped for.'                      },
  { id:'sd013', ref:'Romans 12:2',      text:'Do not conform to the pattern of this world.'                         },
  { id:'sd014', ref:'Ephesians 6:11',   text:'Put on the full armour of God.'                                       },
  { id:'sd015', ref:'Psalm 119:105',    text:'Your word is a lamp to my feet and a light to my path.'               },
]

const PROPHECY_BANK = [
  { ot:'Born of a virgin (Isaiah 7:14)',         nt:'Mary conceives by Holy Spirit (Matt 1:23)'       },
  { ot:'Born in Bethlehem (Micah 5:2)',          nt:'Jesus born in Bethlehem (Luke 2:4-7)'            },
  { ot:'Entry on a donkey (Zech 9:9)',           nt:'Triumphal entry (Matthew 21:5)'                  },
  { ot:'Betrayed for 30 silver (Zech 11:12)',    nt:'Judas paid 30 pieces (Matthew 26:15)'            },
  { ot:'Lots cast for clothing (Psalm 22:18)',   nt:'Soldiers gamble for robe (John 19:24)'           },
  { ot:'Called out of Egypt (Hosea 11:1)',       nt:'Flight to Egypt (Matthew 2:15)'                  },
  { ot:'Preceded by a messenger (Isaiah 40:3)', nt:'John the Baptist prepares the way (Mark 1:3)'    },
]

const CHRONOLOGY = [
  { event:'Creation of the World', order:1  },
  { event:'The Great Flood',       order:2  },
  { event:'Tower of Babel',        order:3  },
  { event:'Abraham\'s Covenant',   order:4  },
  { event:'Exodus from Egypt',     order:5  },
  { event:'David becomes King',    order:6  },
  { event:'Babylonian Exile',      order:7  },
  { event:'Birth of Jesus',        order:8  },
  { event:'Crucifixion',           order:9  },
  { event:'Pentecost',             order:10 },
]

const CONNECTIONS_G = [
  { title:'Things Jesus called himself', color:'#27ae60', words:['The Vine','The Door','The Light','The Bread'] },
  { title:'Books of Moses (Torah)',      color:'#3498db', words:['Genesis','Exodus','Leviticus','Numbers']      },
  { title:'Fruits of the Spirit',        color:'#9b59b6', words:['Love','Joy','Peace','Patience']               },
  { title:'Archangels in the Bible',     color:'#e67e22', words:['Michael','Gabriel','Raphael','Uriel']         },
]

const MAP_LOCS = [
  { id:'jerusalem', name:'Jerusalem',      cx:310, cy:230, fact:'Where Jesus was crucified and rose again.'  },
  { id:'bethlehem', name:'Bethlehem',      cx:308, cy:248, fact:'Birthplace of Jesus and King David.'        },
  { id:'nazareth',  name:'Nazareth',       cx:300, cy:175, fact:'Where Jesus grew up.'                       },
  { id:'galilee',   name:'Sea of Galilee', cx:318, cy:168, fact:'Where Jesus walked on water.'               },
  { id:'jordan',    name:'Jordan River',   cx:328, cy:200, fact:'Where Jesus was baptized.'                  },
  { id:'sinai',     name:'Mount Sinai',    cx:248, cy:295, fact:'Where Moses received the Ten Commandments.' },
]

const VERSES_BANK = [
  { ref:'John 3:16',        text:'For God so loved the world that he gave his one and only Son.' },
  { ref:'Psalm 23:1',       text:'The Lord is my shepherd; I shall not want.'                    },
  { ref:'Philippians 4:13', text:'I can do all this through him who gives me strength.'          },
  { ref:'Proverbs 3:5',     text:'Trust in the Lord with all your heart.'                        },
  { ref:'Joshua 1:9',       text:'Be strong and courageous. Do not be afraid.'                   },
  { ref:'Romans 8:28',      text:'In all things God works for the good of those who love him.'   },
  { ref:'Isaiah 40:31',     text:'Those who hope in the Lord will renew their strength.'         },
  { ref:'Jeremiah 29:11',   text:'For I know the plans I have for you declares the Lord.'        },
  { ref:'John 14:6',        text:'I am the way and the truth and the life.'                      },
  { ref:'Matthew 5:16',     text:'Let your light shine before others.'                           },
]

const WISDOM_Q = [
  { id:'wg01', d:1, q:'Gideon defeated the Midianites with only 300 men. Which tribe was he from?',       answer:'Manasseh',   opts:['Manasseh','Judah','Levi','Dan'],          explain:'Gideon was from the tribe of Manasseh (Judges 6:15).'                 },
  { id:'wg02', d:1, q:'I was a prophetess who judged Israel under a palm tree. Who am I?',                answer:'Deborah',    opts:['Deborah','Miriam','Huldah','Anna'],        explain:'Deborah judged Israel from under the Palm of Deborah (Judges 4:4-5).' },
  { id:'wg03', d:1, q:'I was the first king of Israel. Which tribe was I from?',                          answer:'Benjamin',   opts:['Benjamin','Judah','Ephraim','Reuben'],     explain:'King Saul was from the tribe of Benjamin (1 Samuel 9:1-2).'          },
  { id:'wg04', d:2, q:'Noah\'s grandfather was the oldest man in the Bible. What was his name?',          answer:'Methuselah', opts:['Methuselah','Enoch','Lamech','Jared'],     explain:'Methuselah lived 969 years (Genesis 5:25-29).'                       },
  { id:'wg05', d:2, q:'I wrote letters to churches while in prison. I was also called Saul. Who am I?',   answer:'Paul',       opts:['Paul','Peter','James','John'],             explain:'Paul wrote many epistles from prison including Philippians.'          },
  { id:'wg06', d:2, q:'I was the high priest who condemned Jesus. Who am I?',                             answer:'Caiaphas',   opts:['Caiaphas','Annas','Pilate','Herod'],       explain:'Caiaphas was the high priest who condemned Jesus (Matthew 26:65).'   },
  { id:'wg07', d:2, q:'Which disciple walked on water toward Jesus before sinking?',                      answer:'Peter',      opts:['Peter','John','James','Andrew'],           explain:'Peter stepped out of the boat and walked on water (Matthew 14:29).'  },
  { id:'wg08', d:3, q:'I was a tax collector who climbed a tree to see Jesus. Who am I?',                 answer:'Zacchaeus',  opts:['Zacchaeus','Matthew','Levi','Bartimaeus'], explain:'Zacchaeus climbed a sycamore tree in Jericho (Luke 19:1-4).'         },
]

// ════════════════════════════════════════════════════════════════
// GAMES CATALOGUE
// ════════════════════════════════════════════════════════════════
const GAMES = [
  { id:'speedtyper',  icon:'⌨️',  title:'Speed Typer',          desc:'Type Bible verses as fast as you can.',           xp:50, cat:'competitive' },
  { id:'swipe',       icon:'👆',  title:'Swipe True/False',      desc:'Swipe right for True, left for False.',           xp:20, cat:'competitive' },
  { id:'fillblank',   icon:'📝',  title:'Fill the Blank',        desc:'Complete the missing word in Bible verses.',      xp:25, cat:'daily'       },
  { id:'whoami',      icon:'🕵️', title:'Who Am I?',             desc:'Guess the Bible character from clues.',           xp:35, cat:'strategy'    },
  { id:'lightning',   icon:'⚡',  title:'Lightning Round',       desc:'Answer Bible trivia in 60 seconds.',              xp:30, cat:'daily'       },
  { id:'scramble',    icon:'🔀',  title:'Scripture Scramble',    desc:'Rearrange shuffled Bible verse words.',           xp:40, cat:'strategy'    },
  { id:'wordle',      icon:'🟩',  title:'Verse Wordle',          desc:'Guess the 5-letter Bible word in 6 tries.',       xp:70, cat:'daily'       },
  { id:'hangman',     icon:'🪢',  title:'Bible Hangman',         desc:'Guess the biblical word letter by letter.',       xp:30, cat:'strategy'    },
  { id:'prophecy',    icon:'🔮',  title:'Prophetic Connections', desc:'Match OT prophecies to NT fulfilments.',          xp:60, cat:'discovery'   },
  { id:'chronology',  icon:'📅',  title:'Chronology Challenge',  desc:'Drag Bible events into the correct order.',       xp:45, cat:'discovery'   },
  { id:'emoji',       icon:'😂',  title:'Emoji Bible',           desc:'Guess the Bible story from emojis.',              xp:40, cat:'discovery'   },
  { id:'nameBook',    icon:'📚',  title:'Name That Book',        desc:'Which book of the Bible is this verse from?',     xp:45, cat:'competitive' },
  { id:'wisdom',      icon:'🧩',  title:'Wisdom Grid',           desc:'Logic puzzles from Scripture.',                   xp:55, cat:'strategy'    },
  { id:'connections', icon:'🔗',  title:'Daily Connections',     desc:'Group four biblical words by hidden connection.', xp:65, cat:'daily'       },
  { id:'map',         icon:'🗺️', title:'Biblical Map Quest',    desc:'Find sacred locations on an ancient map.',        xp:40, cat:'discovery'   },
  { id:'swordDrill',  icon:'⚔️', title:'Sword Drill',           desc:'Type the Bible reference as fast as possible.',   xp:50, cat:'competitive' },
]

const CATS = [
  { id:'all',         labelKey:'allGames',    icon:'🎮' },
  { id:'daily',       labelKey:'daily',       icon:'📅' },
  { id:'competitive', labelKey:'competitive', icon:'🏆' },
  { id:'discovery',   labelKey:'discovery',   icon:'🔍' },
  { id:'strategy',    labelKey:'strategy',    icon:'🧠' },
]

// ════════════════════════════════════════════════════════════════
// RANK PICKER SCREEN
// ════════════════════════════════════════════════════════════════
function RankPicker({ game, C, onSelect, onBack }) {
  return (
    <div style={{ maxWidth:'680px', margin:'0 auto' }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{ background:'none', border:'none', color:C.purple, fontWeight:'700', cursor:'pointer', fontFamily:'Georgia,serif', marginBottom:'1.5rem', fontSize:'0.95rem' }}
      >
        ← {t('backToArcade')}
      </button>

      {/* Game title */}
      <div style={{ textAlign:'center', marginBottom:'2rem' }}>
        <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>{game.icon}</div>
        <h2 style={{ color:C.text, fontFamily:'Georgia,serif', fontSize:'1.8rem', fontWeight:'800', margin:'0 0 0.5rem' }}>
          {game.title}
        </h2>
        <p style={{ color:C.muted, fontFamily:'Georgia,serif', fontSize:'0.95rem', margin:0 }}>
        {t('chooseRank')}
        </p>
      </div>

      {/* Rank cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {RANKS.map(rank => (
          <div
            key={rank.id}
            onClick={() => onSelect(rank)}
            style={{
              background: rank.bgColor,
              border: `2px solid ${rank.color}`,
              borderRadius: '16px',
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 6px 20px ${rank.color}44`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Icon */}
            <div style={{ fontSize:'2rem', flexShrink:0 }}>{rank.icon}</div>

            {/* Text */}
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                <div style={{ color:rank.color, fontWeight:'800', fontSize:'1rem', fontFamily:'Georgia,serif' }}>
                  {rank.id}
                </div>
                <span style={{ background:rank.color+'22', border:`1px solid ${rank.color}`, borderRadius:'999px', padding:'2px 10px', color:rank.color, fontSize:'0.72rem', fontWeight:'700', fontFamily:'Georgia,serif' }}>
                  {rank.label}
                </span>
              </div>
              <div style={{ color:C.muted, fontSize:'0.85rem', fontFamily:'Georgia,serif', lineHeight:'1.5' }}>
                {rank.description}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ color:rank.color, fontWeight:'800', fontSize:'1.2rem', flexShrink:0 }}>→</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════
export default function GamesPage() {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const [activeGame, setActiveGame]       = useState(null)
  const [selectedRank, setSelectedRank]   = useState(null)
  const [pendingGame, setPendingGame]     = useState(null)
  const [cat, setCat]                     = useState('all')
  const [xp, setXp]                       = useState(() => load(KEY_XP, 0))
  const [streak]                          = useState(() => load(KEY_STREAK, 1))
  const [hall, setHall]                   = useState(() => load(KEY_HALL, []))
  const [xpFlash, setXpFlash]             = useState(null)

  const C = darkMode ? {
    bg:'#0a0514', card:'#12082a', border:'rgba(123,79,207,0.3)',
    text:'#f0eaff', muted:'#9080b0', purple:'#7b4fcf', gold:'#f0c040',
    input:'#1a0f35', inputBorder:'rgba(123,79,207,0.5)',
    btn:'linear-gradient(135deg,#7b4fcf,#5a2fa0)', btnText:'#fff',
  } : {
    bg:'#f5f0ff', card:'#ffffff', border:'#d0c0f0',
    text:'#1a0a2e', muted:'#776688', purple:'#6030b0', gold:'#8a6000',
    input:'#ffffff', inputBorder:'#7b4fcf',
    btn:'linear-gradient(135deg,#7b4fcf,#5a2fa0)', btnText:'#fff',
  }

  function handleWin(gameId, points, detail) {
    const newXp = xp + points
    setXp(newXp); save(KEY_XP, newXp)
    const newHall = [{ game:gameId, score:points+' XP', detail, date:new Date().toLocaleDateString() }, ...hall].slice(0, 10)
    setHall(newHall); save(KEY_HALL, newHall)
    setXpFlash(points)
    setTimeout(() => setXpFlash(null), 3000)
    setActiveGame(null)
    setSelectedRank(null)
    setPendingGame(null)
  }

  // Step 1 — user clicks a game card → show rank picker
  function handleGameClick(game) {
    setPendingGame(game)
    setSelectedRank(null)
  }

  // Step 2 — user picks a rank → launch the game
  function handleRankSelect(rank) {
    setSelectedRank(rank)
    setActiveGame(pendingGame.id)
    setPendingGame(null)
    setTimeout(() => {
      if (GAME_SCRIPTS[pendingGame.id]) speakText(GAME_SCRIPTS[pendingGame.id])
    }, 800)
  }

  // Back from rank picker
  function handleBackFromRank() {
    setPendingGame(null)
    setSelectedRank(null)
  }

  // Back from game
  function handleBackFromGame() {
    setActiveGame(null)
    setSelectedRank(null)
    setPendingGame(null)
  }

  const rank  = getRank(xp)
  const shown = cat === 'all' ? GAMES : GAMES.filter(g => g.cat === cat)
  const gp    = { C, darkMode, xp, onBack: handleBackFromGame, onWin: handleWin, selectedRank }

  // ── RANK PICKER SCREEN ──────────────────────────────────────
  if (pendingGame) return (
    <div style={{ background:C.bg, minHeight:'100vh', padding:'2rem 1.5rem', fontFamily:'Georgia,serif' }}>
      <RankPicker
        game={pendingGame}
        C={C}
        onSelect={handleRankSelect}
        onBack={handleBackFromRank}
        t={t}
      />
    </div>
  )

  // ── ACTIVE GAME SCREEN ──────────────────────────────────────
  if (activeGame) return (
    <div style={{ background:C.bg, minHeight:'100vh', padding:'2rem 1.5rem', fontFamily:'Georgia,serif' }}>
      {/* Rank badge shown during game */}
      {selectedRank && (
        <div style={{ maxWidth:'780px', margin:'0 auto 1rem', display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ background:selectedRank.bgColor, border:`1px solid ${selectedRank.color}`, borderRadius:'999px', padding:'4px 14px', color:selectedRank.color, fontWeight:'800', fontSize:'0.82rem', fontFamily:'Georgia,serif' }}>
            {selectedRank.icon} {selectedRank.id} {t('rank')}
          </span>
        </div>
      )}
      {activeGame === 'speedtyper'  && <SpeedTyper   {...gp} />}
      {activeGame === 'swipe'       && <SwipeGame    {...gp} />}
      {activeGame === 'fillblank'   && <FillBlank    {...gp} />}
      {activeGame === 'whoami'      && <WhoAmI       {...gp} />}
      {activeGame === 'lightning'   && <Lightning    {...gp} />}
      {activeGame === 'scramble'    && <Scramble     {...gp} />}
      {activeGame === 'wordle'      && <Wordle       {...gp} />}
      {activeGame === 'hangman'     && <Hangman      {...gp} />}
      {activeGame === 'prophecy'    && <Prophecy     {...gp} />}
      {activeGame === 'chronology'  && <Chronology   {...gp} />}
      {activeGame === 'emoji'       && <EmojiGame    {...gp} />}
      {activeGame === 'nameBook'    && <NameBook     {...gp} />}
      {activeGame === 'wisdom'      && <Wisdom       {...gp} />}
      {activeGame === 'connections' && <Connections  {...gp} />}
      {activeGame === 'map'         && <MapQuest     {...gp} />}
      {activeGame === 'swordDrill'  && <SwordDrill   {...gp} />}
    </div>
  )

  // ── MAIN ARCADE SCREEN ──────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:'100vh', padding:'2rem 1.5rem', fontFamily:'Georgia,serif' }}>
      <div style={{ maxWidth:'1040px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:'800', color:C.text, margin:'0 0 0.5rem' }}>⚔️ {t('games')}</h1>
          <p style={{ color:C.muted, marginBottom:'1.5rem' }}>{t('gamesSubtitle')}</p>
          <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap', marginBottom:'1rem' }}>
            <Pill label={'🔥 '+streak+' '+t('dayStreak')} color="#e67e22" />
            <Pill label={rank.icon+' '+rank.title}   color={rank.color} />
            <Pill label={'⭐ '+xp+' XP'}             color="#f0c040" />
          </div>
          {rank.next && (
            <div style={{ maxWidth:'360px', margin:'0 auto' }}>
              <div style={{ height:'8px', background:C.border, borderRadius:'999px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:(xp/rank.next*100)+'%', background:rank.color, borderRadius:'999px', transition:'width 0.6s ease' }} />
              </div>
              <p style={{ color:C.muted, fontSize:'0.75rem', marginTop:'0.3rem', fontFamily:'Georgia,serif' }}>{rank.next-xp} {t('xpToNextRank')}</p>
            </div>
          )}
        </div>

        {xpFlash && (
          <div style={{ position:'fixed', top:'5rem', right:'1.5rem', zIndex:9999, background:'linear-gradient(135deg,#7b4fcf,#5a2fa0)', color:'#fff', borderRadius:'12px', padding:'0.75rem 1.25rem', fontWeight:'800', fontFamily:'Georgia,serif', boxShadow:'0 8px 32px rgba(123,79,207,0.5)' }}>
            ⭐ +{xpFlash} {t('xpEarned')}
          </div>
        )}

        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.75rem', justifyContent:'center' }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ background:cat===c.id?'linear-gradient(135deg,#7b4fcf,#5a2fa0)':'transparent', color:cat===c.id?'#fff':C.muted, border:'1px solid '+C.border, borderRadius:'999px', padding:'0.45rem 1.1rem', fontWeight:'700', fontSize:'0.85rem', cursor:'pointer', fontFamily:'Georgia,serif' }}>
              {c.icon} {t(c.labelKey)}
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem', marginBottom:'3rem' }}>
          {shown.map(g => (
            <div key={g.id} onClick={() => handleGameClick(g)} style={{ background:C.card, border:'2px solid '+C.border, borderRadius:'16px', padding:'1.5rem', cursor:'pointer', fontFamily:'Georgia,serif', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{g.icon}</div>
              <h3 style={{ color:C.text, margin:'0 0 0.4rem', fontSize:'1rem', fontWeight:'800' }}>{g.title}</h3>
              <p style={{ color:C.muted, fontSize:'0.85rem', margin:'0 0 0.75rem', lineHeight:'1.6' }}>{g.desc}</p>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:C.purple, fontWeight:'700', fontSize:'0.85rem' }}>{t('playNow')} →</span>
                <span style={{ color:C.gold, fontWeight:'700', fontSize:'0.8rem' }}>+{g.xp} XP</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:C.card, border:'1px solid '+C.border, borderRadius:'20px', padding:'1.75rem' }}>
          <h2 style={{ color:C.gold, fontFamily:'Georgia,serif', margin:'0 0 1rem' }}>🏆 {t('hallOfFame')}</h2>
          {hall.length === 0
            ? <p style={{ color:C.muted, fontStyle:'italic' }}>{t('completeGame')}</p>
            : hall.map((h, i) => (
                <div key={i} style={{ display:'flex', gap:'1rem', padding:'0.5rem 0', borderBottom:'1px solid '+C.border, fontFamily:'Georgia,serif' }}>
                  <span>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'▪️'}</span>
                  <span style={{ flex:1, color:C.text, fontWeight:'600' }}>{h.game}</span>
                  <span style={{ color:C.gold, fontWeight:'800' }}>{h.score}</span>
                  <span style={{ color:C.muted, fontSize:'0.78rem' }}>{h.date}</span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

// ── Shared UI ──────────────────────────────────────────────────
function Pill({ label, color }) {
  return <span style={{ background:color+'22', border:'1px solid '+color+'55', borderRadius:'999px', padding:'0.4rem 1rem', color, fontWeight:'800', fontSize:'0.88rem', fontFamily:'Georgia,serif' }}>{label}</span>
}
function Shell({ title, icon, C, onBack, children, t }) {
  return (
    <div style={{ maxWidth:'780px', margin:'0 auto' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:C.purple, fontWeight:'700', cursor:'pointer', fontFamily:'Georgia,serif', marginBottom:'1.5rem', fontSize:'0.95rem' }}>← {t ? t('backToArcade') : 'Back to Arcade'}</button>
      <h2 style={{ color:C.text, fontFamily:'Georgia,serif', margin:'0 0 1.5rem', fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:'800' }}>{icon} {title}</h2>
      {children}
    </div>
  )
}
function Btn({ onClick, children, disabled, C }) {
  return <button onClick={onClick} disabled={disabled} style={{ background:disabled?'#555':C.btn, color:disabled?'#999':C.btnText, border:'none', borderRadius:'10px', padding:'0.75rem 1.75rem', fontWeight:'800', fontSize:'1rem', cursor:disabled?'not-allowed':'pointer', fontFamily:'Georgia,serif' }}>{children}</button>
}
function Card({ C, children, style }) {
  return <div style={{ background:C.card, border:'1px solid '+C.border, borderRadius:'14px', padding:'1.5rem', ...style }}>{children}</div>
}
function ScoreBox({ label, value, C }) {
  return (
    <div style={{ textAlign:'center', background:C.purple+'18', border:'1px solid '+C.purple+'44', borderRadius:'12px', padding:'0.75rem 1.25rem', fontFamily:'Georgia,serif' }}>
      <p style={{ color:C.muted, fontSize:'0.75rem', textTransform:'uppercase', margin:'0 0 0.2rem', fontWeight:'700' }}>{label}</p>
      <p style={{ color:C.purple, fontSize:'1.8rem', fontWeight:'800', margin:0 }}>{value}</p>
    </div>
  )
}
function DiffBadge({ d }) {
  const map = { 1:['Easy','#27ae60'], 2:['Medium','#e67e22'], 3:['Hard','#e74c3c'] }
  const [label, color] = map[d] || ['Easy','#27ae60']
  return <span style={{ background:color+'22', border:'1px solid '+color, borderRadius:'999px', padding:'0.15rem 0.6rem', color, fontSize:'0.7rem', fontWeight:'700', fontFamily:'Georgia,serif', marginLeft:'0.5rem' }}>{label}</span>
}

// ════════════════════════════════════════════════════════════════
// AI VOICE GUIDE ENGINE
// ════════════════════════════════════════════════════════════════
function speak(text, onEnd) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate   = 0.92
  utter.pitch  = 1.05
  utter.volume = 1
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    v.name.includes('Samantha') ||
    v.name.includes('Karen')    ||
    v.name.includes('Moira')    ||
    v.name.includes('Google UK English Female') ||
    v.name.includes('Microsoft Zira')
  )
  if (preferred) utter.voice = preferred
  if (onEnd) utter.onend = onEnd
  window.speechSynthesis.speak(utter)
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

const GUIDE_SCRIPTS = {
  speedtyper:  `Welcome to Speed Typer! A Bible verse will appear on screen. Type it out as fast and accurately as you can. Your words per minute and accuracy will be tracked. Ready? Take a deep breath and begin!`,
  swipe:       `Welcome to Swipe True or False! I will show you a Bible statement. Press TRUE if it is correct or FALSE if it is wrong. You have ten questions. Trust what you know from the Word!`,
  fillblank:   `Welcome to Fill the Blank! Each question shows a Bible verse with a missing word. Choose the correct word from the four options given. The reference is shown to help you. May the Word be in your heart!`,
  whoami:      `Welcome to Who Am I! I will give you clues one at a time about a Bible character. Try to guess with as few clues as possible for maximum points. You can reveal more clues if you need help. Who could it be?`,
  lightning:   `Welcome to Lightning Round! You have sixty seconds to answer as many Bible trivia questions as possible. Tap your answer quickly and move on. Questions get harder as your rank increases. Ready? Go!`,
  scramble:    `Welcome to Scripture Scramble! The words of a Bible verse have been shuffled. Click the words in the correct order to rebuild the verse. Take your time and think carefully about each word!`,
  wordle:      `Welcome to Verse Wordle! Guess the five letter Bible word in six tries. After each guess I will show you which letters are correct, which are in the wrong position, and which are not in the word at all. Use the hint to help you!`,
  hangman:     `Welcome to Bible Hangman! Guess the hidden biblical word one letter at a time. You have six wrong guesses before the game ends. Use the category and hint to guide your thinking. Choose wisely!`,
  prophecy:    `Welcome to Prophetic Connections! On the left are Old Testament prophecies. On the right are their New Testament fulfilments. Click a prophecy then click its matching fulfilment. Discover how God's Word connects across centuries!`,
  chronology:  `Welcome to Chronology Challenge! The Bible events on screen are out of order. Drag and drop them into the correct historical sequence. Think through the flow of Scripture from creation to Pentecost!`,
  emoji:       `Welcome to Emoji Bible! I will show you a sequence of emojis representing a Bible story. Choose which story matches the emojis. Have fun and think creatively about the Word!`,
  nameBook:    `Welcome to Name That Book! I will show you a Bible verse. Your job is to identify which book of the Bible it comes from. Choose from the four options. How well do you know your Scripture?`,
  wisdom:      `Welcome to Wisdom Grid! These are logic puzzles drawn from Scripture. Read each question carefully and think through the biblical context before choosing your answer. Wisdom comes from the Lord!`,
  connections: `Welcome to Daily Connections! Sixteen biblical words are hidden on screen. Find four groups of four words that share a hidden connection. Select four words and submit your group. Think carefully — some connections are tricky!`,
  map:         `Welcome to Biblical Map Quest! I will name a sacred location from the Bible. Click where you think it is on the ancient map. Learn the geography of the Holy Land as you play!`,
  swordDrill:  `Welcome to Sword Drill! I will show you a Bible verse. Type the correct book chapter and verse reference as fast as you can before the timer runs out. The Word of God is your sword — draw it quickly!`,
}

function VoiceGuide({ gameId, C }) {
  const [speaking, setSpeaking] = useState(false)
  const [visible, setVisible]   = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeaking(true)
      speak(GUIDE_SCRIPTS[gameId], () => setSpeaking(false))
    }, 600)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [gameId])

  if (!visible) return null

  return (
    <div style={{ background:'linear-gradient(135deg,rgba(123,79,207,0.15),rgba(90,47,160,0.1))', border:'2px solid rgba(123,79,207,0.4)', borderRadius:'16px', padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'flex-start', gap:'0.85rem', fontFamily:'Georgia,serif' }}>
      <div style={{ flexShrink:0, width:'44px', height:'44px', borderRadius:'50%', background:'linear-gradient(135deg,#7b4fcf,#5a2fa0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', boxShadow:'0 4px 16px rgba(123,79,207,0.4)', animation:speaking?'pulse 1s infinite':'none' }}>
        {speaking ? '🔊' : '🕊️'}
      </div>
      <div style={{ flex:1 }}>
        <p style={{ color:'#c9a0ff', fontWeight:'800', fontSize:'0.75rem', textTransform:'uppercase', margin:'0 0 0.3rem', letterSpacing:'0.05em' }}>
          {speaking ? '🎙️ Guide is speaking...' : '🕊️ Your Bible Guide'}
        </p>
        <p style={{ color:'#e0d0ff', fontSize:'0.88rem', lineHeight:'1.6', margin:0 }}>
          {speaking ? 'Listen carefully for instructions...' : GUIDE_SCRIPTS[gameId].slice(0, 120) + '...'}
        </p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', flexShrink:0 }}>
        <button
          onClick={() => { setSpeaking(true); speak(GUIDE_SCRIPTS[gameId], () => setSpeaking(false)) }}
          style={{ background:'rgba(123,79,207,0.3)', border:'1px solid rgba(123,79,207,0.5)', borderRadius:'8px', padding:'0.35rem 0.7rem', color:'#c9a0ff', fontSize:'0.75rem', fontWeight:'700', cursor:'pointer', fontFamily:'Georgia,serif', whiteSpace:'nowrap' }}>
          {speaking ? '🔊 Playing' : '▶ Replay'}
        </button>
        <button
          onClick={() => { stopSpeaking(); setSpeaking(false); setVisible(false) }}
          style={{ background:'transparent', border:'1px solid rgba(123,79,207,0.3)', borderRadius:'8px', padding:'0.35rem 0.7rem', color:'rgba(200,160,255,0.6)', fontSize:'0.75rem', fontWeight:'700', cursor:'pointer', fontFamily:'Georgia,serif' }}>
          ✕ Dismiss
        </button>
      </div>
      <style>{`@keyframes pulse { 0%,100%{box-shadow:0 4px 16px rgba(123,79,207,0.4)} 50%{box-shadow:0 4px 32px rgba(123,79,207,0.9)} }`}</style>
    </div>
  )
}

function OptBtn({ opt, chosen, answer, C, onClick }) {
  const isCorrect = opt === answer
  const isChosen  = opt === chosen
  const bg    = !chosen ? C.card : isCorrect ? 'rgba(39,174,96,0.15)' : isChosen ? 'rgba(231,76,60,0.12)' : C.card
  const bdr   = !chosen ? C.border : isCorrect ? '#27ae60' : isChosen ? '#e74c3c' : C.border
  const color = !chosen ? C.text  : isCorrect ? '#27ae60' : isChosen ? '#e74c3c' : C.muted
  return (
    <button onClick={onClick} style={{ background:bg, border:'2px solid '+bdr, borderRadius:'10px', padding:'0.85rem', color, fontFamily:'Georgia,serif', fontSize:'1rem', fontWeight:'700', cursor:chosen?'default':'pointer', textAlign:'left', width:'100%' }}>
      {opt}
    </button>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 1 — SPEED TYPER
// ════════════════════════════════════════════════════════════════
function SpeedTyper({ C, onBack, onWin }) {
  const [verses]  = useState(() => shuffle(VERSES_BANK))
  const [idx, setIdx]         = useState(0)
  const [typed, setTyped]     = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone]       = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [wpm, setWpm]         = useState(0)
  const timerRef = useRef(null)
  const verse = verses[idx]

  useEffect(() => {
    if (started && !done) timerRef.current = setInterval(() => setElapsed(e => e+1), 1000)
    return () => clearInterval(timerRef.current)
  }, [started, done])

  useEffect(() => {
    if (typed === verse.text) {
      clearInterval(timerRef.current); setDone(true)
      setWpm(Math.round(verse.text.split(' ').length / ((elapsed||1)/60)))
    }
  }, [typed])

  const accuracy = typed.length === 0 ? 100 : Math.round(typed.split('').filter((c,i) => c===verse.text[i]).length / typed.length * 100)

  return (
    <Shell title="Speed Typer" icon="⌨️" C={C} onBack={onBack} t={t}>
      <VoiceGuide gameId="speedtyper" C={C} />
      <Card C={C}>
        <p style={{ color:C.purple, fontSize:'0.78rem', fontWeight:'700', textTransform:'uppercase', margin:'0 0 0.5rem', fontFamily:'Georgia,serif' }}>{verse.ref}</p>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'1.1rem', lineHeight:'1.9', margin:'0 0 1rem' }}>
          {verse.text.split('').map((ch,i) => <span key={i} style={{ color:i<typed.length?(typed[i]===ch?'#27ae60':'#e74c3c'):C.muted }}>{ch}</span>)}
        </p>
        <textarea value={typed} onChange={e => { if(!started) setStarted(true); if(e.target.value.length<=verse.text.length) setTyped(e.target.value) }} rows={3}
          style={{ width:'100%', boxSizing:'border-box', background:C.input, border:'2px solid '+C.inputBorder, borderRadius:'10px', padding:'0.85rem', color:C.text, fontSize:'1rem', fontFamily:'Georgia,serif', resize:'none', outline:'none' }} />
        <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', flexWrap:'wrap' }}>
          <ScoreBox label="Time" value={elapsed+'s'} C={C} />
          <ScoreBox label="Accuracy" value={accuracy+'%'} C={C} />
          {done && <ScoreBox label="WPM" value={wpm} C={C} />}
        </div>
        {done && (
          <div style={{ textAlign:'center', marginTop:'1rem' }}>
            <p style={{ color:'#27ae60', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>✅ {wpm} WPM — {accuracy}% Accuracy!</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              {idx+1 < verses.length && (
                <button onClick={() => { setIdx(i=>i+1); setTyped(''); setStarted(false); setDone(false); setElapsed(0); setWpm(0) }}
                  style={{ background:'transparent', border:'2px solid '+C.purple, borderRadius:'10px', padding:'0.75rem 1.5rem', color:C.purple, fontWeight:'800', cursor:'pointer', fontFamily:'Georgia,serif' }}>
                  Next Verse →
                </button>
              )}
              <Btn onClick={() => onWin('speedtyper', 50, verse.ref+' — '+wpm+' WPM')} C={C}>{t('claim')} +50 XP</Btn>
            </div>
          </div>
        )}
      </Card>
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 2 — SWIPE TRUE/FALSE
// ════════════════════════════════════════════════════════════════
function SwipeGame({ C, onBack, onWin, xp }) {
  const [questions] = useState(() => {
    const pool   = getDifficultyPool(SWIPE_BANK, xp)
    const seen   = load(KEY_SEEN, [])
    const unseen = pool.filter(q => !seen.includes(q.id))
    const seenQ  = pool.filter(q =>  seen.includes(q.id))
    return [...shuffle(unseen), ...shuffle(seenQ)].slice(0, 10)
  })
  const [idx, setIdx]       = useState(0)
  const [score, setScore]   = useState(0)
  const [result, setResult] = useState(null)
  const [done, setDone]     = useState(false)

  useEffect(() => { if (done) markSeen(questions.map(q => q.id)) }, [done])

  function answer(val) {
    const correct = val === questions[idx].a
    setResult(correct); setScore(s => correct?s+1:s)
    setTimeout(() => {
      setResult(null)
      if (idx+1 >= questions.length) setDone(true)
      else setIdx(i => i+1)
    }, 700)
  }

  if (done) return (
    <Shell title="Swipe True/False" icon="👆" C={C} onBack={onBack} t={t}>
      <Card C={C} style={{ textAlign:'center' }}>
        <p style={{ fontSize:'3rem', margin:'0 0 1rem' }}>🎉</p>
        <p style={{ color:C.text, fontFamily:'Georgia,serif', fontSize:'1.3rem', fontWeight:'800', marginBottom:'1rem' }}>{score}/{questions.length} Correct!</p>
        <Btn onClick={() => onWin('swipe', score*5, score+'/'+questions.length)} C={C}>Claim +{score*5} XP</Btn>
      </Card>
    </Shell>
  )

  const q = questions[idx]
  return (
    <Shell title="Swipe True/False" icon="👆" C={C} onBack={onBack}>
      <VoiceGuide gameId="swipe" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{idx+1}/{questions.length} <DiffBadge d={q.d} /></span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>{t('score')}: {score}</span>
      </div>
      <Card C={C} style={{ textAlign:'center', marginBottom:'1.5rem', background:result===true?'rgba(39,174,96,0.15)':result===false?'rgba(231,76,60,0.12)':C.card, border:'2px solid '+(result===true?'#27ae60':result===false?'#e74c3c':C.border) }}>
        <p style={{ color:C.text, fontSize:'1.2rem', fontWeight:'700', fontFamily:'Georgia,serif', margin:0 }}>{q.q}</p>
        {result !== null && <p style={{ color:result?'#27ae60':'#e74c3c', fontWeight:'800', marginTop:'1rem', fontFamily:'Georgia,serif' }}>{result?'✅ Correct!':'❌ Wrong!'}</p>}
      </Card>
      <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
        <button onClick={() => answer(false)} style={{ flex:1, maxWidth:'160px', padding:'1rem', background:'rgba(231,76,60,0.15)', border:'2px solid #e74c3c', borderRadius:'14px', color:'#e74c3c', fontFamily:'Georgia,serif', fontSize:'1.1rem', fontWeight:'800', cursor:'pointer' }}>← FALSE</button>
        <button onClick={() => answer(true)}  style={{ flex:1, maxWidth:'160px', padding:'1rem', background:'rgba(39,174,96,0.15)',  border:'2px solid #27ae60', borderRadius:'14px', color:'#27ae60', fontFamily:'Georgia,serif', fontSize:'1.1rem', fontWeight:'800', cursor:'pointer' }}>TRUE →</button>
      </div>
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 3 — FILL THE BLANK
// ════════════════════════════════════════════════════════════════
function FillBlank({ C, onBack, onWin, xp, selectedRank }) {
  const [questions] = useState(() => getSession(getRankPool(FILL_BANK, selectedRank), 8, load(KEY_SEEN,[])))
  const [idx, setIdx]       = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore]   = useState(0)
  const q = questions[idx]

  function choose(opt) {
    if (chosen) return
    setChosen(opt); setScore(s => opt===q.answer?s+1:s)
  }
  function next() {
    if (idx+1 >= questions.length) { markSeen(questions.map(q=>q.id)); onWin('fillblank', score*5, score+'/'+questions.length); return }
    setIdx(i=>i+1); setChosen(null)
  }

  return (
    <Shell title="Fill the Blank" icon="📝" C={C} onBack={onBack}>
      <VoiceGuide gameId="fillblank" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{idx+1}/{questions.length} <DiffBadge d={q.d} /></span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>{t('score')}: {score}</span>
      </div>
      <Card C={C} style={{ marginBottom:'1.25rem' }}>
        <p style={{ color:C.purple, fontSize:'0.78rem', fontWeight:'700', textTransform:'uppercase', margin:'0 0 0.5rem', fontFamily:'Georgia,serif' }}>{q.ref}</p>
        <p style={{ color:C.text, fontSize:'1.15rem', lineHeight:'1.85', fontFamily:'Georgia,serif', margin:0 }}>
          {q.verse.split('___')[0]}
          <span style={{ borderBottom:'3px solid '+(chosen?'#c9a84c':C.purple), padding:'0 0.5rem', color:chosen?'#c9a84c':C.purple, fontWeight:'800' }}>
            {chosen ? q.answer : '______'}
          </span>
          {q.verse.split('___')[1]}
        </p>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem', marginBottom:'1rem' }}>
        {q.sessionOpts.map(opt => <OptBtn key={opt} opt={opt} chosen={chosen} answer={q.answer} C={C} onClick={() => choose(opt)} />)}
      </div>
      {chosen && (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:chosen===q.answer?'#27ae60':'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>{chosen===q.answer?'✅ Correct!':'❌ Not quite — it was '+q.answer}</p>
          <Btn onClick={next} C={C}>{idx+1>=questions.length?t('finishClaim'):'Next →'}</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 4 — WHO AM I?
// ════════════════════════════════════════════════════════════════
function WhoAmI({ C, onBack, onWin, xp, selectedRank }) {
  const [questions] = useState(() => getSession(getRankPool(WHO_BANK, selectedRank), 6, load(KEY_SEEN,[])))
  const [idx, setIdx]       = useState(0)
  const [clues, setClues]   = useState(1)
  const [chosen, setChosen] = useState(null)
  const [score, setScore]   = useState(0)
  const q = questions[idx]

  function choose(opt) {
    if (chosen) return
    setChosen(opt); setScore(s => opt===q.answer?s+1:s)
  }
  function next() {
    if (idx+1 >= questions.length) { markSeen(questions.map(q=>q.id)); onWin('whoami', score*10, score+'/'+questions.length); return }
    setIdx(i=>i+1); setClues(1); setChosen(null)
  }

  return (
    <Shell title="Who Am I?" icon="🕵️" C={C} onBack={onBack}>
      <VoiceGuide gameId="whoami" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{idx+1}/{questions.length} <DiffBadge d={q.d} /></span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>Score: {score}</span>
      </div>
      <Card C={C} style={{ marginBottom:'1.25rem' }}>
        <p style={{ color:C.purple, fontWeight:'700', fontSize:'0.82rem', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 0.75rem' }}>Clues: {clues}/3</p>
        {q.clues.slice(0, clues).map((clue,i) => (
          <p key={i} style={{ color:C.text, fontFamily:'Georgia,serif', margin:'0 0 0.5rem' }}>{i+1}. {clue}</p>
        ))}
        {clues < 3 && !chosen && (
          <button onClick={() => setClues(c=>c+1)} style={{ background:'transparent', border:'1px solid '+C.border, borderRadius:'8px', padding:'0.4rem 1rem', color:C.muted, fontFamily:'Georgia,serif', cursor:'pointer', marginTop:'0.5rem' }}>+ Reveal Next Clue</button>
        )}
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem', marginBottom:'1rem' }}>
        {q.sessionOpts.map(opt => <OptBtn key={opt} opt={opt} chosen={chosen} answer={q.answer} C={C} onClick={() => choose(opt)} />)}
      </div>
      {chosen && (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:chosen===q.answer?'#27ae60':'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>{chosen===q.answer?'✅ Correct! I am '+q.answer+'!':'❌ The answer was '+q.answer}</p>
          <Btn onClick={next} C={C}>{idx+1>=questions.length?t('finishClaim'):'Next →'}</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 5 — LIGHTNING ROUND
// ════════════════════════════════════════════════════════════════
function Lightning({ C, onBack, onWin, xp, selectedRank }) {
  const [phase, setPhase]   = useState('intro')
  const [idx, setIdx]       = useState(0)
  const [score, setScore]   = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [chosen, setChosen] = useState(null)
  const timerRef  = useRef(null)
  const [questions] = useState(() => getSession(getRankPool(TRIVIA_BANK, selectedRank), 20, load(KEY_SEEN,[])))

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => setTimeLeft(t => {
        if (t<=1) { clearInterval(timerRef.current); setPhase('done'); return 0 }
        return t-1
      }), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  useEffect(() => {
    if (phase === 'done') { markSeen(questions.map(q=>q.id)); onWin('lightning', score*3, score+' correct in 60s') }
  }, [phase])

  function answer(opt) {
    if (chosen) return
    const q = questions[idx % questions.length]
    setChosen(opt)
    if (opt === q.answer) setScore(s=>s+1)
    setTimeout(() => { setChosen(null); setIdx(i=>i+1) }, 600)
  }

  if (phase === 'intro') return (
    <Shell title="Lightning Round" icon="⚡" C={C} onBack={onBack}>
      <VoiceGuide gameId="lightning" C={C} />
      <Card C={C} style={{ textAlign:'center', padding:'3rem' }}>
        <p style={{ fontSize:'4rem', margin:'0 0 1rem' }}>⚡</p>
        <h3 style={{ color:C.text, fontFamily:'Georgia,serif', marginBottom:'1rem' }}>60 Second Bible Blitz!</h3>
        <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'0.5rem' }}>Answer as many questions as you can in 60 seconds.</p>
        <p style={{ color:C.purple, fontFamily:'Georgia,serif', fontSize:'0.85rem', marginBottom:'2rem' }}>Questions get harder as your rank increases!</p>
        <Btn onClick={() => setPhase('playing')} C={C}>Start! ⚡</Btn>
      </Card>
    </Shell>
  )

  if (phase === 'done') return (
    <Shell title="Lightning Round" icon="⚡" C={C} onBack={onBack}>
      <Card C={C} style={{ textAlign:'center', padding:'3rem' }}>
        <p style={{ fontSize:'3rem', margin:'0 0 1rem' }}>🏁</p>
        <h3 style={{ color:C.text, fontFamily:'Georgia,serif', marginBottom:'1rem' }}>Time is Up!</h3>
        <p style={{ color:C.purple, fontSize:'2rem', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>{score} pts</p>
        <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'1.5rem' }}>{score>=15?'🔥 Incredible!':score>=10?'⭐ Great work!':score>=5?'📖 Keep studying!':'🌱 Keep going!'}</p>
        <Btn onClick={() => { setPhase('intro'); setScore(0); setTimeLeft(60); setIdx(0) }} C={C}>{t('playAgain')}</Btn>
      </Card>
    </Shell>
  )

  const q = questions[idx % questions.length]
  return (
    <Shell title="Lightning Round" icon="⚡" C={C} onBack={onBack}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
        <span style={{ color:timeLeft<=10?'#e74c3c':C.purple, fontWeight:'800', fontFamily:'Georgia,serif', fontSize:'1.2rem' }}>⏱ {t('timeLeft')}: {timeLeft}s</span>
        <span style={{ color:C.gold, fontWeight:'800', fontFamily:'Georgia,serif' }}>Score: {score}</span>
      </div>
      <div style={{ height:'8px', background:C.border, borderRadius:'999px', overflow:'hidden', marginBottom:'1.25rem' }}>
        <div style={{ height:'100%', width:(timeLeft/60*100)+'%', background:timeLeft<=10?'#e74c3c':C.purple, borderRadius:'999px', transition:'width 1s linear' }} />
      </div>
      <Card C={C} style={{ marginBottom:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
          <span style={{ color:C.muted, fontSize:'0.78rem', fontWeight:'700', textTransform:'uppercase', fontFamily:'Georgia,serif' }}>Question {(idx%questions.length)+1}</span>
          <DiffBadge d={q.d} />
        </div>
        <p style={{ color:C.text, fontSize:'1.1rem', fontWeight:'700', fontFamily:'Georgia,serif', margin:0 }}>{q.q}</p>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem' }}>
        {q.sessionOpts.map(opt => <OptBtn key={opt} opt={opt} chosen={chosen} answer={q.answer} C={C} onClick={() => answer(opt)} />)}
      </div>
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 6 — SCRIPTURE SCRAMBLE
// ════════════════════════════════════════════════════════════════
function Scramble({ C, onBack, onWin, xp, selectedRank }) {
  const [verses] = useState(() => {
    const pool   = getRankPool(SCRAMBLE_BANK, selectedRank)
    const seen   = load(KEY_SEEN, [])
    const unseen = pool.filter(q => !seen.includes(q.id))
    const seenQ  = pool.filter(q =>  seen.includes(q.id))
    return shuffle([...shuffle(unseen), ...shuffle(seenQ)]).slice(0, 5)
  })
  const [idx, setIdx]             = useState(0)
  const [selected, setSelected]   = useState([])
  const [remaining, setRemaining] = useState([])
  const [done, setDone]           = useState(false)
  const [score, setScore]         = useState(0)
  const verse = verses[idx]

  useEffect(() => { setRemaining(shuffle(verse.words)); setSelected([]); setDone(false) }, [idx])

  function pick(word, i) {
    const ns = [...selected, word]
    const nr = remaining.filter((_,ri) => ri!==i)
    setSelected(ns); setRemaining(nr)
    if (ns.join(' ')===verse.words.join(' ') && nr.length===0) { setDone(true); setScore(s=>s+1) }
  }
  function remove(word, i) {
    if (done) return
    setRemaining(r => [...r, word])
    setSelected(s => s.filter((_,si) => si!==i))
  }
  function next() {
    if (idx+1 >= verses.length) { markSeen(verses.map(v=>v.id)); onWin('scramble', score*10, score+'/'+verses.length); return }
    setIdx(i=>i+1)
  }

  return (
    <Shell title="Scripture Scramble" icon="🔀" C={C} onBack={onBack}>
      <VoiceGuide gameId="scramble" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{verse.ref} <DiffBadge d={verse.d} /></span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>Score: {score}</span>
      </div>
      <div style={{ minHeight:'70px', background:C.card, border:'2px solid '+(done?'#27ae60':C.border), borderRadius:'12px', padding:'1rem', marginBottom:'1rem', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
        {selected.length===0
          ? <span style={{ color:C.muted, fontStyle:'italic', fontFamily:'Georgia,serif' }}>Click words below to build the verse...</span>
          : selected.map((w,i) => <button key={i} onClick={() => remove(w,i)} style={{ background:done?'#27ae60':C.purple+'22', border:'1px solid '+C.purple, borderRadius:'6px', padding:'0.3rem 0.65rem', color:done?'#fff':C.text, fontFamily:'Georgia,serif', cursor:done?'default':'pointer', fontWeight:'600' }}>{w}</button>)
        }
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.5rem' }}>
        {remaining.map((w,i) => <button key={i} onClick={() => pick(w,i)} style={{ background:C.card, border:'2px solid '+C.border, borderRadius:'6px', padding:'0.35rem 0.7rem', color:C.text, fontFamily:'Georgia,serif', cursor:'pointer', fontWeight:'600' }}>{w}</button>)}
      </div>
      {done && (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:'#27ae60', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>✅ Perfect!</p>
          <Btn onClick={next} C={C}>{idx+1>=verses.length?'Finish & Claim XP':'Next Verse →'}</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 7 — VERSE WORDLE
// ════════════════════════════════════════════════════════════════
function Wordle({ C, onBack, onWin }) {
  const [target]  = useState(() => WORDLE_BANK[Math.floor(Math.random()*WORDLE_BANK.length)])
  const ROWS = 6, COLS = 5
  const [guesses, setGuesses] = useState(Array(ROWS).fill(''))
  const [cur, setCur]     = useState(0)
  const [input, setInput] = useState('')
  const [over, setOver]   = useState(false)
  const [won, setWon]     = useState(false)
  const [msg, setMsg]     = useState('')

  function submit() {
    if (input.length!==COLS) { setMsg('Word must be 5 letters!'); return }
    const g = input.toUpperCase()
    const ng = [...guesses]; ng[cur] = g
    setGuesses(ng); const row=cur+1; setCur(row); setInput(''); setMsg('')
    if (g===target.word) { setWon(true); setOver(true) }
    else if (row>=ROWS)  { setOver(true); setMsg('The word was '+target.word) }
  }

  function color(guess, col) {
    if (!guess||!guess[col]) return 'transparent'
    if (guess[col]===target.word[col]) return '#27ae60'
    if (target.word.includes(guess[col])) return '#e8a020'
    return C.border
  }

  return (
    <Shell title="Verse Wordle" icon="🟩" C={C} onBack={onBack}>
      <VoiceGuide gameId="wordle" C={C} />
      <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'0.5rem' }}>Hint: <em style={{ color:C.purple }}>{target.hint}</em></p>
      <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'1.25rem', fontSize:'0.82rem' }}>🟩 Correct  🟨 Wrong position  ⬛ Not in word</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'1.5rem', alignItems:'center' }}>
        {Array(ROWS).fill(null).map((_,row) => (
          <div key={row} style={{ display:'flex', gap:'0.4rem' }}>
            {Array(COLS).fill(null).map((_,col) => {
              const g = guesses[row]
              const letter = g?.[col] ?? (row===cur ? input[col] : '')
              const bg = g&&g[col] ? color(g,col) : row===cur&&input[col] ? C.purple+'22' : 'transparent'
              return (
                <div key={col} style={{ width:'52px', height:'52px', border:'2px solid '+(g&&g[col]?color(g,col):row===cur?C.purple:C.border), borderRadius:'8px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:'800', color:g?'#fff':C.text, fontFamily:'Georgia,serif' }}>
                  {letter}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {!over && (
        <div style={{ display:'flex', gap:'0.65rem', justifyContent:'center' }}>
          <input value={input} onChange={e => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,5))} onKeyDown={e => e.key==='Enter'&&submit()} placeholder="Type 5 letters..." maxLength={5}
            style={{ background:C.input, border:'2px solid '+C.inputBorder, borderRadius:'10px', padding:'0.75rem 1rem', color:C.text, fontSize:'1.1rem', fontFamily:'Georgia,serif', fontWeight:'700', textTransform:'uppercase', outline:'none', width:'180px', textAlign:'center', letterSpacing:'0.15em' }} />
          <Btn onClick={submit} C={C}>Guess</Btn>
        </div>
      )}
      {msg && <p style={{ color:over&&!won?'#e74c3c':'#27ae60', fontFamily:'Georgia,serif', fontWeight:'700', textAlign:'center', marginTop:'1rem' }}>{msg}</p>}
      {over && <div style={{ textAlign:'center', marginTop:'1rem' }}><Btn onClick={() => onWin('wordle', won?70:20, target.word)} C={C}>{t('claimXP')}</Btn></div>}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 8 — BIBLE HANGMAN
// ════════════════════════════════════════════════════════════════
function Hangman({ C, onBack, onWin }) {
  const [words]       = useState(() => shuffle(HANGMAN_BANK))
  const [idx, setIdx] = useState(0)
  const [guessed, setGuessed] = useState([])
  const [done, setDone]       = useState(false)
  const [won, setWon]         = useState(false)
  const MAX   = 6
  const entry = words[idx]
  const word  = entry.word
  const wrong = guessed.filter(l => !word.includes(l))
  const revealed = word.split('').every(l => guessed.includes(l))

  useEffect(() => {
    if (revealed && !done) { setWon(true); setDone(true) }
    if (wrong.length>=MAX && !done) { setWon(false); setDone(true) }
  }, [guessed])

  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const parts = [
    <line key="rope" x1="60" y1="10" x2="60" y2="30" stroke="#e74c3c" strokeWidth="3" />,
    <circle key="head" cx="60" cy="40" r="10" stroke="#e74c3c" strokeWidth="3" fill="none" />,
    <line key="body" x1="60" y1="50" x2="60" y2="90" stroke="#e74c3c" strokeWidth="3" />,
    <line key="la"   x1="60" y1="60" x2="40" y2="75" stroke="#e74c3c" strokeWidth="3" />,
    <line key="ra"   x1="60" y1="60" x2="80" y2="75" stroke="#e74c3c" strokeWidth="3" />,
    <line key="ll"   x1="60" y1="90" x2="40" y2="115" stroke="#e74c3c" strokeWidth="3" />,
    <line key="rl"   x1="60" y1="90" x2="80" y2="115" stroke="#e74c3c" strokeWidth="3" />,
  ]

  return (
    <Shell title="Bible Hangman" icon="🪢" C={C} onBack={onBack}>
      <VoiceGuide gameId="hangman" C={C} />
      <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        <Card C={C} style={{ flexShrink:0, padding:'1rem' }}>
          <svg width="120" height="130" viewBox="0 0 120 130">
            <line x1="10" y1="125" x2="110" y2="125" stroke={C.muted} strokeWidth="3" />
            <line x1="30" y1="125" x2="30"  y2="10"  stroke={C.muted} strokeWidth="3" />
            <line x1="30" y1="10"  x2="60"  y2="10"  stroke={C.muted} strokeWidth="3" />
            {parts.slice(0, wrong.length)}
          </svg>
          <p style={{ color:'#e74c3c', fontWeight:'800', textAlign:'center', fontFamily:'Georgia,serif', fontSize:'0.85rem', margin:'0.5rem 0 0' }}>{wrong.length}/{MAX}</p>
        </Card>
        <div style={{ flex:1 }}>
          <p style={{ color:C.purple, fontSize:'0.75rem', fontWeight:'700', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 0.5rem' }}>{entry.cat}</p>
          <p style={{ color:C.muted, fontFamily:'Georgia,serif', fontStyle:'italic', margin:'0 0 1rem' }}>💡 {entry.hint}</p>
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
            {word.split('').map((l,i) => (
              <div key={i} style={{ width:'32px', height:'40px', borderBottom:'3px solid '+C.purple, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', fontWeight:'800', fontFamily:'Georgia,serif', color:guessed.includes(l)?C.text:done?'#e74c3c':'transparent' }}>
                {guessed.includes(l)||done ? l : ''}
              </div>
            ))}
          </div>
          {wrong.length > 0 && <p style={{ color:'#e74c3c', fontFamily:'Georgia,serif', fontSize:'0.85rem', marginTop:'0.75rem' }}>Wrong: {wrong.join(', ')}</p>}
        </div>
      </div>
      {!done && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', justifyContent:'center', marginBottom:'1.5rem' }}>
          {ALPHA.map(l => {
            const isG = guessed.includes(l)
            const isW = wrong.includes(l)
            const isC = guessed.includes(l) && word.includes(l)
            return <button key={l} onClick={() => !isG&&!done&&setGuessed(g=>[...g,l])} disabled={isG} style={{ width:'38px', height:'38px', background:isC?'rgba(39,174,96,0.2)':isW?'rgba(231,76,60,0.15)':C.card, border:'2px solid '+(isC?'#27ae60':isW?'#e74c3c':C.border), borderRadius:'8px', color:isC?'#27ae60':isW?'#e74c3c':C.text, fontFamily:'Georgia,serif', fontSize:'0.9rem', fontWeight:'700', cursor:isG?'default':'pointer', opacity:isG?0.5:1 }}>{l}</button>
          })}
        </div>
      )}
      {done && (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:won?'#27ae60':'#e74c3c', fontWeight:'800', fontSize:'1.2rem', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>{won?'✅ Correct! The word was '+word+'!':'❌ The word was '+word}</p>
          <Btn onClick={() => onWin('hangman', won?30:5, word)} C={C}>{t('claimXP')}</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 9 — PROPHETIC CONNECTIONS
// ════════════════════════════════════════════════════════════════
function Prophecy({ C, onBack, onWin }) {
  const [pairs]      = useState(() => shuffle(PROPHECY_BANK).slice(0, 5))
  const [ntShuffled] = useState(() => shuffle(pairs.map(p => p.nt)))
  const [matched, setMatched] = useState({})
  const [sel, setSel]         = useState(null)
  const [wrong, setWrong]     = useState(null)
  const [done, setDone]       = useState(false)

  function clickOT(ot) {
    if (matched[ot]) return
    setSel({ side:'ot', val:ot }); setWrong(null)
  }
  function clickNT(nt) {
    if (!sel || sel.side !== 'ot') { setSel({ side:'nt', val:nt }); return }
    const pair = pairs.find(p => p.ot === sel.val)
    if (pair && pair.nt === nt) {
      const nm = { ...matched, [sel.val]:nt }; setMatched(nm); setSel(null)
      if (Object.keys(nm).length === pairs.length) setDone(true)
    } else {
      setWrong({ ot:sel.val, nt }); setTimeout(() => { setWrong(null); setSel(null) }, 900)
    }
  }
  const ntM = Object.values(matched)

  return (
    <Shell title="Prophetic Connections" icon="🔮" C={C} onBack={onBack}>
      <VoiceGuide gameId="prophecy" C={C} />
      <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'1.25rem' }}>Click an OT prophecy then its NT fulfilment.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
        <div>
          <p style={{ color:'#c9a84c', fontWeight:'800', fontSize:'0.82rem', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 0.5rem' }}>📜 Old Testament</p>
          {pairs.map(p => {
            const isM=!!matched[p.ot], isS=sel?.val===p.ot, isW=wrong?.ot===p.ot
            return (
              <button key={p.ot} onClick={() => clickOT(p.ot)} style={{ display:'block', width:'100%', background:isM?'rgba(39,174,96,0.15)':isS?C.purple+'22':isW?'rgba(231,76,60,0.15)':C.card, border:'2px solid '+(isM?'#27ae60':isS?C.purple:isW?'#e74c3c':C.border), borderRadius:'10px', padding:'0.75rem', textAlign:'left', color:isM?'#27ae60':C.text, fontFamily:'Georgia,serif', fontSize:'0.85rem', cursor:isM?'default':'pointer', marginBottom:'0.5rem', fontWeight:'600' }}>
                {p.ot}
              </button>
            )
          })}
        </div>
        <div>
          <p style={{ color:'#4a90d9', fontWeight:'800', fontSize:'0.82rem', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 0.5rem' }}>✝ New Testament</p>
          {ntShuffled.map(nt => {
            const isM=ntM.includes(nt), isW=wrong?.nt===nt
            return (
              <button key={nt} onClick={() => clickNT(nt)} style={{ display:'block', width:'100%', background:isM?'rgba(39,174,96,0.15)':isW?'rgba(231,76,60,0.15)':C.card, border:'2px solid '+(isM?'#27ae60':isW?'#e74c3c':C.border), borderRadius:'10px', padding:'0.75rem', textAlign:'left', color:isM?'#27ae60':C.text, fontFamily:'Georgia,serif', fontSize:'0.85rem', cursor:isM?'default':'pointer', marginBottom:'0.5rem', fontWeight:'600' }}>
                {nt}
              </button>
            )
          })}
        </div>
      </div>
      {done && (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:'#27ae60', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>🎉 All prophecies matched!</p>
          <Btn onClick={() => onWin('prophecy', 60, 'All pairs matched')} C={C}>{t('claim')} +60 XP</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 10 — CHRONOLOGY CHALLENGE
// ════════════════════════════════════════════════════════════════
function Chronology({ C, onBack, onWin }) {
  const [items, setItems]     = useState(() => shuffle(CHRONOLOGY))
  const [checked, setChecked] = useState(false)
  const [score, setScore]     = useState(null)
  const [dragging, setDragging] = useState(null)

  function drop(i) {
    if (dragging===null||dragging===i) return
    const arr=[...items]; const [m]=arr.splice(dragging,1); arr.splice(i,0,m)
    setItems(arr); setDragging(null)
  }
  function check() {
    let c=0; items.forEach((item,i) => { if(item.order===i+1) c++ })
    setScore(c); setChecked(true)
  }

  return (
    <Shell title="Chronology Challenge" icon="📅" C={C} onBack={onBack}>
      <VoiceGuide gameId="chronology" C={C} />
      <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'1.25rem' }}>Drag events into the correct biblical order.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
        {items.map((item,i) => {
          const isC = checked && item.order===i+1
          const isW = checked && item.order!==i+1
          return (
            <div key={item.event} draggable={!checked} onDragStart={() => setDragging(i)} onDragOver={e => e.preventDefault()} onDrop={() => drop(i)}
              style={{ display:'flex', alignItems:'center', gap:'0.85rem', background:isC?'rgba(39,174,96,0.12)':isW?'rgba(231,76,60,0.1)':C.card, border:'2px solid '+(isC?'#27ae60':isW?'#e74c3c':C.border), borderRadius:'10px', padding:'0.85rem 1rem', cursor:checked?'default':'grab', fontFamily:'Georgia,serif' }}>
              <span style={{ color:C.muted, minWidth:'24px', fontWeight:'700' }}>{i+1}.</span>
              <span style={{ flex:1, color:isC?'#27ae60':isW?'#e74c3c':C.text, fontWeight:'600' }}>{item.event}</span>
              {isC && <span>✅</span>}
              {isW && <span style={{ color:'#e74c3c', fontSize:'0.8rem', fontWeight:'700' }}>#{item.order}</span>}
              {!checked && <span style={{ color:C.muted }}>⠿</span>}
            </div>
          )
        })}
      </div>
      {!checked
        ? <Btn onClick={check} C={C}>Check My Order</Btn>
        : (
          <div style={{ textAlign:'center' }}>
            <p style={{ color:C.purple, fontSize:'1.5rem', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>{score}/10 Correct!</p>
            <Btn onClick={() => onWin('chronology', score*5, score+'/10 correct')} C={C}>Claim +{score*5} XP</Btn>
          </div>
        )
      }
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 11 — EMOJI BIBLE
// ════════════════════════════════════════════════════════════════
function EmojiGame({ C, onBack, onWin, xp, selectedRank }) {
  const [questions] = useState(() => getSession(getRankPool(EMOJI_BANK, selectedRank), 8, load(KEY_SEEN,[])))
  const [idx, setIdx]       = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore]   = useState(0)
  const q = questions[idx]

  function choose(opt) {
    if (chosen) return
    setChosen(opt); setScore(s => opt===q.answer?s+1:s)
  }
  function next() {
    if (idx+1 >= questions.length) { markSeen(questions.map(q=>q.id)); onWin('emoji', score*8, score+'/'+questions.length); return }
    setIdx(i=>i+1); setChosen(null)
  }

  return (
    <Shell title="Emoji Bible" icon="😂" C={C} onBack={onBack}>
      <VoiceGuide gameId="emoji" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{idx+1}/{questions.length} <DiffBadge d={q.d} /></span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>Score: {score}</span>
      </div>
      <Card C={C} style={{ textAlign:'center', marginBottom:'1.5rem' }}>
        <p style={{ color:C.muted, fontSize:'0.78rem', fontWeight:'700', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 1rem' }}>What Bible story is this?</p>
        <p style={{ fontSize:'3rem', margin:0, letterSpacing:'0.15em' }}>{q.emojis}</p>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1rem' }}>
        {q.sessionOpts.map(opt => <OptBtn key={opt} opt={opt} chosen={chosen} answer={q.answer} C={C} onClick={() => choose(opt)} />)}
      </div>
      {chosen && (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:chosen===q.answer?'#27ae60':'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>{chosen===q.answer?'✅ Correct!':'❌ It was: '+q.answer}</p>
          <Btn onClick={next} C={C}>{idx+1>=questions.length?'Finish & Claim XP':'Next →'}</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 12 — NAME THAT BOOK
// ════════════════════════════════════════════════════════════════
function NameBook({ C, onBack, onWin, xp, selectedRank }) {
  const [questions] = useState(() => getSession(getRankPool(BOOK_BANK, selectedRank), 8, load(KEY_SEEN,[])))
  const [idx, setIdx]       = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore]   = useState(0)
  const q = questions[idx]

  function choose(opt) {
    if (chosen) return
    setChosen(opt); setScore(s => opt===q.answer?s+1:s)
  }
  function next() {
    if (idx+1 >= questions.length) { markSeen(questions.map(q=>q.id)); onWin('nameBook', score*8, score+'/'+questions.length); return }
    setIdx(i=>i+1); setChosen(null)
  }

  return (
    <Shell title="Name That Book" icon="📚" C={C} onBack={onBack}>
      <VoiceGuide gameId="nameBook" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{idx+1}/{questions.length} <DiffBadge d={q.d} /></span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>Score: {score}</span>
      </div>
      <Card C={C} style={{ marginBottom:'1.5rem' }}>
        <p style={{ color:C.muted, fontSize:'0.78rem', fontWeight:'700', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 0.75rem' }}>Which book is this from?</p>
        <p style={{ color:C.text, fontSize:'1.1rem', lineHeight:'1.8', fontStyle:'italic', fontFamily:'Georgia,serif', margin:0 }}>{q.verse}</p>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem', marginBottom:'1rem' }}>
        {q.sessionOpts.map(opt => <OptBtn key={opt} opt={opt} chosen={chosen} answer={q.answer} C={C} onClick={() => choose(opt)} />)}
      </div>
      {chosen && (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:chosen===q.answer?'#27ae60':'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>{chosen===q.answer?'✅ Correct! From '+q.answer+'!':'❌ It is from '+q.answer}</p>
          <Btn onClick={next} C={C}>{idx+1>=questions.length?'Finish & Claim XP':'Next →'}</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 13 — WISDOM GRID
// ════════════════════════════════════════════════════════════════
function Wisdom({ C, onBack, onWin, xp, selectedRank }) {
  const [questions] = useState(() => {
    const pool = getRankPool(WISDOM_Q, selectedRank)
    return shuffle(pool).slice(0, 5).map(q => ({ ...q, sessionOpts:shuffle(q.opts) }))
  })
  const [idx, setIdx]       = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore]   = useState(0)
  const q = questions[idx]

  function choose(opt) {
    if (chosen) return
    setChosen(opt); setScore(s => opt===q.answer?s+1:s)
  }
  function next() {
    if (idx+1 >= questions.length) { onWin('wisdom', score*15, score+'/'+questions.length); return }
    setIdx(i=>i+1); setChosen(null)
  }

  return (
    <Shell title="Wisdom Grid" icon="🧩" C={C} onBack={onBack}>
      <VoiceGuide gameId="wisdom" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{idx+1}/{questions.length} <DiffBadge d={q.d} /></span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>Score: {score}</span>
      </div>
      <Card C={C} style={{ marginBottom:'1.25rem' }}>
        <p style={{ color:C.purple, fontWeight:'700', fontSize:'0.78rem', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 0.75rem' }}>🧩 Logic Puzzle</p>
        <p style={{ color:C.text, fontFamily:'Georgia,serif', fontSize:'1rem', lineHeight:'1.75', margin:0 }}>{q.q}</p>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1rem' }}>
        {q.sessionOpts.map(opt => <OptBtn key={opt} opt={opt} chosen={chosen} answer={q.answer} C={C} onClick={() => choose(opt)} />)}
      </div>
      {chosen && (
        <div>
          <Card C={C} style={{ background:chosen===q.answer?'rgba(39,174,96,0.1)':'rgba(231,76,60,0.08)', border:'1px solid '+(chosen===q.answer?'#27ae60':'#e74c3c'), marginBottom:'1rem' }}>
            <p style={{ color:chosen===q.answer?'#27ae60':'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', margin:'0 0 0.4rem' }}>{chosen===q.answer?'✅ Correct!':'❌ '+q.answer}</p>
            <p style={{ color:C.text, fontFamily:'Georgia,serif', fontSize:'0.9rem', margin:0 }}>{q.explain}</p>
          </Card>
          <Btn onClick={next} C={C}>{idx+1>=questions.length?'Finish & Claim XP':'Next →'}</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 14 — DAILY CONNECTIONS
// ════════════════════════════════════════════════════════════════
function Connections({ C, onBack, onWin }) {
  const allWords = CONNECTIONS_G.flatMap(g => g.words.map(w => ({ word:w, group:g.title, color:g.color })))
  const [words]    = useState(() => shuffle(allWords))
  const [selected, setSelected] = useState([])
  const [solved, setSolved]     = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [msg, setMsg]           = useState('')
  const [done, setDone]         = useState(false)

  function toggle(w) {
    if (solved.includes(w.word)) return
    const already = selected.find(s => s.word===w.word)
    if (already) { setSelected(s => s.filter(x => x.word!==w.word)); return }
    if (selected.length >= 4) return
    setSelected(s => [...s, w])
  }
  function submit() {
    if (selected.length !== 4) { setMsg('Select exactly 4 words!'); return }
    const group = selected[0].group
    if (selected.every(s => s.group===group)) {
      const ns = [...solved, ...selected.map(s=>s.word)]
      setSolved(ns); setSelected([]); setMsg('✅ "'+group+'" correct!')
      if (ns.length === 16) setDone(true)
    } else {
      setMistakes(m=>m+1); setSelected([])
      setMsg('❌ Not quite! '+(mistakes+1)+' mistake'+(mistakes+1>1?'s':''))
    }
  }

  if (done) return (
    <Shell title="Daily Connections" icon="🔗" C={C} onBack={onBack}>
      <Card C={C} style={{ textAlign:'center', padding:'3rem' }}>
        <p style={{ fontSize:'3rem', margin:'0 0 1rem' }}>🎉</p>
        <p style={{ color:C.text, fontFamily:'Georgia,serif', fontSize:'1.3rem', fontWeight:'800', marginBottom:'1rem' }}>All Groups Found!</p>
        <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'1.5rem' }}>{mistakes} mistake{mistakes!==1?'s':''}</p>
        <Btn onClick={() => onWin('connections', Math.max(65-mistakes*10,10), 'All groups found')} C={C}>Claim XP</Btn>
      </Card>
    </Shell>
  )

  return (
    <Shell title="Daily Connections" icon="🔗" C={C} onBack={onBack}>
      <VoiceGuide gameId="connections" C={C} />
      <p style={{ color:C.muted, fontFamily:'Georgia,serif', marginBottom:'1rem' }}>Select 4 words that share a hidden biblical connection.</p>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif', fontSize:'0.88rem' }}>Groups: {solved.length/4}/4</span>
        <span style={{ color:'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', fontSize:'0.88rem' }}>Mistakes: {mistakes}</span>
      </div>
      {CONNECTIONS_G.filter(g => solved.some(w => g.words.includes(w))).map(g => (
        <div key={g.title} style={{ background:g.color+'22', border:'2px solid '+g.color, borderRadius:'12px', padding:'0.85rem 1rem', marginBottom:'0.5rem', fontFamily:'Georgia,serif' }}>
          <p style={{ color:g.color, fontWeight:'800', fontSize:'0.82rem', textTransform:'uppercase', margin:'0 0 0.3rem' }}>{g.title}</p>
          <p style={{ color:C.text, margin:0, fontWeight:'600' }}>{g.words.join(' · ')}</p>
        </div>
      ))}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem', marginBottom:'1.25rem' }}>
        {words.filter(w => !solved.includes(w.word)).map((w,i) => {
          const isSel = selected.find(s => s.word===w.word)
          return (
            <button key={i} onClick={() => toggle(w)} style={{ background:isSel?C.purple+'33':C.card, border:'2px solid '+(isSel?C.purple:C.border), borderRadius:'10px', padding:'0.75rem 0.4rem', color:isSel?C.purple:C.text, fontFamily:'Georgia,serif', fontSize:'0.82rem', fontWeight:'700', cursor:'pointer', textAlign:'center', transform:isSel?'scale(1.04)':'scale(1)' }}>
              {w.word}
            </button>
          )
        })}
      </div>
      {msg && <p style={{ color:msg.startsWith('✅')?'#27ae60':'#e74c3c', fontFamily:'Georgia,serif', fontWeight:'700', textAlign:'center', marginBottom:'1rem' }}>{msg}</p>}
      <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center' }}>
        <Btn onClick={submit} disabled={selected.length!==4} C={C}>Submit Group</Btn>
        <button onClick={() => setSelected([])} style={{ background:'transparent', border:'1px solid '+C.border, borderRadius:'10px', padding:'0.75rem 1.25rem', color:C.muted, fontFamily:'Georgia,serif', cursor:'pointer', fontWeight:'600' }}>Clear</button>
      </div>
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 15 — BIBLICAL MAP QUEST
// ════════════════════════════════════════════════════════════════
function MapQuest({ C, onBack, onWin }) {
  const [locations]             = useState(() => shuffle(MAP_LOCS))
  const [qIdx, setQIdx]         = useState(0)
  const [score, setScore]       = useState(0)
  const [answered, setAnswered] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [hovered, setHovered]   = useState(null)
  const quiz = locations[qIdx % locations.length]

  function click(loc) {
    if (!quiz||feedback) return
    const correct = loc.id===quiz.id
    setScore(s => correct?s+1:s)
    setAnswered(a => a+1)
    setFeedback({ correct, loc })
    setTimeout(() => { setFeedback(null); setQIdx(i=>i+1) }, 1500)
  }

  return (
    <Shell title="Biblical Map Quest" icon="🗺️" C={C} onBack={onBack}>
      <VoiceGuide gameId="map" C={C} />
      {answered < 6 && (
        <Card C={C} style={{ marginBottom:'1.25rem', background:C.purple+'18', border:'2px solid '+C.purple+'44' }}>
          <p style={{ color:C.muted, fontSize:'0.78rem', textTransform:'uppercase', fontWeight:'700', fontFamily:'Georgia,serif', margin:'0 0 0.3rem' }}>Find this location:</p>
          <p style={{ color:C.text, fontSize:'1.2rem', fontWeight:'800', fontFamily:'Georgia,serif', margin:'0 0 0.25rem' }}>{quiz.name}</p>
          <p style={{ color:C.muted, fontSize:'0.88rem', fontFamily:'Georgia,serif', margin:0, fontStyle:'italic' }}>{quiz.fact}</p>
        </Card>
      )}
      {feedback && (
        <div style={{ textAlign:'center', marginBottom:'1rem', padding:'0.75rem', background:feedback.correct?'rgba(39,174,96,0.12)':'rgba(231,76,60,0.1)', borderRadius:'10px', border:'1px solid '+(feedback.correct?'#27ae60':'#e74c3c') }}>
          <p style={{ color:feedback.correct?'#27ae60':'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', margin:0 }}>{feedback.correct?'✅ Correct! That is '+feedback.loc.name+'!':'❌ That was '+feedback.loc.name}</p>
        </div>
      )}
      <div style={{ background:'#1a3a5c', borderRadius:'16px', padding:'1rem', border:'2px solid rgba(201,168,76,0.3)' }}>
        <svg viewBox="0 0 560 380" style={{ width:'100%', height:'auto', display:'block' }}>
          <rect width="560" height="380" fill="#1a3a5c" />
          <ellipse cx="180" cy="180" rx="140" ry="100" fill="#2a5a8c" opacity="0.6" />
          <text x="120" y="185" fill="rgba(255,255,255,0.4)" fontSize="11" fontStyle="italic">Mediterranean Sea</text>
          <path d="M260,60 Q340,50 420,80 Q480,120 460,200 Q440,280 380,320 Q300,350 240,300 Q200,260 220,200 Q230,140 260,60Z" fill="#8B7355" opacity="0.7" />
          {MAP_LOCS.map(loc => {
            const isH  = hovered===loc.id
            const wasF = feedback?.loc.id===loc.id
            return (
              <g key={loc.id} style={{ cursor:'pointer' }} onClick={() => click(loc)} onMouseEnter={() => setHovered(loc.id)} onMouseLeave={() => setHovered(null)}>
                <circle cx={loc.cx} cy={loc.cy} r={isH?14:10} fill={wasF?(feedback.correct?'#27ae60':'#e74c3c'):isH?'#f0c040':'rgba(201,168,76,0.8)'} />
                <circle cx={loc.cx} cy={loc.cy} r={4} fill="#1a0a00" />
                {isH && <text x={loc.cx} y={loc.cy-18} textAnchor="middle" fill="#f0c040" fontSize="11" fontWeight="bold">{loc.name}</text>}
              </g>
            )
          })}
        </svg>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'1rem', fontFamily:'Georgia,serif' }}>
        <span style={{ color:C.muted }}>Question {Math.min(answered+1,6)} of 6</span>
        <span style={{ color:C.purple, fontWeight:'800' }}>Score: {score}/{answered}</span>
      </div>
      {answered >= 6 && (
        <div style={{ textAlign:'center', marginTop:'1.25rem' }}>
          <p style={{ color:'#27ae60', fontWeight:'800', fontFamily:'Georgia,serif', marginBottom:'1rem' }}>🗺️ {score}/6 locations found!</p>
          <Btn onClick={() => onWin('map', score*8, score+'/6 locations')} C={C}>Claim +{score*8} XP</Btn>
        </div>
      )}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════
// GAME 16 — SWORD DRILL
// ════════════════════════════════════════════════════════════════
function SwordDrill({ C, onBack, onWin }) {
  const [questions]         = useState(() => shuffle(SWORD_BANK).slice(0, 8))
  const [idx, setIdx]       = useState(0)
  const [phase, setPhase]   = useState('intro')
  const [input, setInput]   = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [result, setResult] = useState(null)
  const [score, setScore]   = useState(0)
  const timerRef = useRef(null)
  const inputRef = useRef(null)
  const q = questions[idx]

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => setTimeLeft(t => {
        if (t<=1) { clearInterval(timerRef.current); setResult('timeout'); setPhase('result'); return 0 }
        return t-1
      }), 1000)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  function submit() {
    clearInterval(timerRef.current)
    const isCorrect = input.trim().toLowerCase().replace(/\s/g,'') === q.ref.toLowerCase().replace(/\s/g,'')
    setResult(isCorrect?'correct':'wrong')
    setPhase('result')
    if (isCorrect) setScore(s=>s+1)
  }
  function next() {
    if (idx+1 >= questions.length) { onWin('swordDrill', score*10, score+'/'+questions.length); return }
    setIdx(i=>i+1); setPhase('intro'); setInput(''); setResult(null); setTimeLeft(30)
  }

  return (
    <Shell title="Sword Drill" icon="⚔️" C={C} onBack={onBack}>
      <VoiceGuide gameId="swordDrill" C={C} />
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
        <span style={{ color:C.muted, fontFamily:'Georgia,serif' }}>{idx+1}/{questions.length}</span>
        <span style={{ color:C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>Score: {score}</span>
      </div>
      <Card C={C} style={{ marginBottom:'1.25rem' }}>
        <p style={{ color:C.muted, fontSize:'0.78rem', fontWeight:'700', textTransform:'uppercase', fontFamily:'Georgia,serif', margin:'0 0 0.75rem' }}>⚔️ Type the reference (e.g. John 3:16)</p>
        <p style={{ color:C.text, fontSize:'1.1rem', lineHeight:'1.8', fontStyle:'italic', fontFamily:'Georgia,serif', margin:0 }}>"{q.text}"</p>
      </Card>
      {phase === 'intro' && (
        <div style={{ textAlign:'center' }}>
          <Btn onClick={() => setPhase('playing')} C={C}>⚔️ Draw Your Sword!</Btn>
        </div>
      )}
      {phase === 'playing' && (
        <>
          <div style={{ marginBottom:'1rem' }}>
            <span style={{ color:timeLeft<=10?'#e74c3c':C.purple, fontWeight:'800', fontFamily:'Georgia,serif' }}>⏱ {timeLeft}s</span>
            <div style={{ height:'8px', background:C.border, borderRadius:'999px', overflow:'hidden', marginTop:'0.3rem' }}>
              <div style={{ height:'100%', width:(timeLeft/30*100)+'%', background:timeLeft<=10?'#e74c3c':C.purple, borderRadius:'999px', transition:'width 1s linear' }} />
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.65rem' }}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="e.g. John 3:16"
              style={{ flex:1, background:C.input, border:'2px solid '+C.inputBorder, borderRadius:'10px', padding:'0.75rem 1rem', color:C.text, fontSize:'1rem', fontFamily:'Georgia,serif', outline:'none' }} />
            <Btn onClick={submit} C={C}>Submit</Btn>
          </div>
        </>
      )}
      {phase === 'result' && (
        <div style={{ textAlign:'center' }}>
          <Card C={C} style={{ background:result==='correct'?'rgba(39,174,96,0.12)':'rgba(231,76,60,0.1)', border:'1px solid '+(result==='correct'?'#27ae60':'#e74c3c'), marginBottom:'1.25rem' }}>
            <p style={{ color:result==='correct'?'#27ae60':'#e74c3c', fontWeight:'800', fontFamily:'Georgia,serif', margin:'0 0 0.4rem' }}>
              {result==='correct'?'✅ Correct!':result==='timeout'?'⏱ Time is up!':'❌ Not quite!'}
            </p>
            <p style={{ color:C.text, fontFamily:'Georgia,serif', margin:0 }}>Answer: <strong style={{ color:C.purple }}>{q.ref}</strong></p>
          </Card>
          <Btn onClick={next} C={C}>{idx+1>=questions.length?'Finish & Claim XP':'Next →'}</Btn>
        </div>
      )}
    </Shell>
  )
}