import React, { useState, useEffect, useMemo } from 'react'

// ── PASTE YOUR FULL API KEY HERE ─────────────────────────────────
const API_KEY = 'bP7SgKnADnw5o0lKdruPfuFGE7uur_gSyVGLhnlSAK'
const KEY_LOOKS_VALID = API_KEY.length >= 32

// ── 1. Translations ───────────────────────────────────────────────
const TRANSLATIONS = [
  { code:'kjv',    apiBibleId:'de4e12af7f28f599-02', label:'KJV',   full:'King James Version',          desc:'The classic 1611 translation, poetic and majestic.',        badge:'📜' },
  { code:'asv',    apiBibleId:'01b29f4b342acc35-01', label:'ASV',   full:'American Standard Version',    desc:'A precise 1901 revision of the KJV.',                       badge:'📜' },
  { code:'web',    apiBibleId:'65eec8e0b60e656b-01', label:'WEB',   full:'World English Bible',          desc:'A modern public domain translation.',                        badge:'💡' },
  { code:'bbe',    apiBibleId:'f72b840c855f362c-04', label:'BBE',   full:'Bible in Basic English',       desc:'Simple vocabulary, easy for all readers.',                   badge:'💡' },
  { code:'ylt',    apiBibleId:null,                  label:'YLT',   full:"Young's Literal Translation",  desc:'A very literal word-for-word translation from 1898.',        badge:'📖' },
  { code:'darby',  apiBibleId:null,                  label:'DARBY', full:'Darby Translation',            desc:"John Nelson Darby's 1890 scholarly translation.",            badge:'📖' },
  { code:'dra',    apiBibleId:null,                  label:'DRA',   full:'Douay-Rheims (Catholic)',      desc:'The traditional Catholic English Bible.',                    badge:'✝️' },
]

// ── 2. Book ID maps ───────────────────────────────────────────────
const BOOK_ID_APIBIBLE = {
  'Genesis':'GEN','Exodus':'EXO','Leviticus':'LEV','Numbers':'NUM',
  'Deuteronomy':'DEU','Joshua':'JOS','Judges':'JDG','Ruth':'RUT',
  '1 Samuel':'1SA','2 Samuel':'2SA','1 Kings':'1KI','2 Kings':'2KI',
  '1 Chronicles':'1CH','2 Chronicles':'2CH','Ezra':'EZR','Nehemiah':'NEH',
  'Esther':'EST','Job':'JOB','Psalms':'PSA','Proverbs':'PRO',
  'Ecclesiastes':'ECC','Song of Solomon':'SNG','Isaiah':'ISA',
  'Jeremiah':'JER','Lamentations':'LAM','Ezekiel':'EZK','Daniel':'DAN',
  'Hosea':'HOS','Joel':'JOL','Amos':'AMO','Obadiah':'OBA',
  'Jonah':'JON','Micah':'MIC','Nahum':'NAM','Habakkuk':'HAB',
  'Zephaniah':'ZEP','Haggai':'HAG','Zechariah':'ZEC','Malachi':'MAL',
  'Matthew':'MAT','Mark':'MRK','Luke':'LUK','John':'JHN',
  'Acts':'ACT','Romans':'ROM','1 Corinthians':'1CO','2 Corinthians':'2CO',
  'Galatians':'GAL','Ephesians':'EPH','Philippians':'PHP','Colossians':'COL',
  '1 Thessalonians':'1TH','2 Thessalonians':'2TH','1 Timothy':'1TI',
  '2 Timothy':'2TI','Titus':'TIT','Philemon':'PHM','Hebrews':'HEB',
  'James':'JAS','1 Peter':'1PE','2 Peter':'2PE','1 John':'1JN',
  '2 John':'2JN','3 John':'3JN','Jude':'JUD','Revelation':'REV',
}

// ── 3. Full Hymn Library ──────────────────────────────────────────
const HYMNS = [
  // ── GRACE & SALVATION ──────────────────────────────────────────
  {
    id: 'amazing-grace', title: 'Amazing Grace', author: 'John Newton (1779)',
    category: 'Grace & Salvation', key: 'G',
    verses: [
      { label: 'Verse 1', text: "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see." },
      { label: 'Verse 2', text: "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed." },
      { label: 'Verse 3', text: "Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home." },
      { label: 'Verse 4', text: "The Lord has promised good to me,\nHis Word my hope secures;\nHe will my shield and portion be,\nAs long as life endures." },
      { label: 'Verse 5', text: "When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we'd first begun." },
    ]
  },
  {
    id: 'just-as-i-am', title: 'Just As I Am', author: 'Charlotte Elliott (1835)',
    category: 'Grace & Salvation', key: 'Eb',
    verses: [
      { label: 'Verse 1', text: "Just as I am, without one plea,\nBut that Thy blood was shed for me,\nAnd that Thou bidst me come to Thee,\nO Lamb of God, I come, I come." },
      { label: 'Verse 2', text: "Just as I am, and waiting not\nTo rid my soul of one dark blot,\nTo Thee whose blood can cleanse each spot,\nO Lamb of God, I come, I come." },
      { label: 'Verse 3', text: "Just as I am, though tossed about\nWith many a conflict, many a doubt,\nFightings and fears within, without,\nO Lamb of God, I come, I come." },
      { label: 'Verse 4', text: "Just as I am, poor, wretched, blind;\nSight, riches, healing of the mind,\nYea, all I need in Thee to find,\nO Lamb of God, I come, I come." },
      { label: 'Verse 5', text: "Just as I am, Thou wilt receive,\nWilt welcome, pardon, cleanse, relieve;\nBecause Thy promise I believe,\nO Lamb of God, I come, I come." },
    ]
  },
  {
    id: 'rock-of-ages', title: 'Rock of Ages', author: 'Augustus M. Toplady (1776)',
    category: 'Grace & Salvation', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "Rock of Ages, cleft for me,\nLet me hide myself in Thee;\nLet the water and the blood,\nFrom Thy wounded side which flowed,\nBe of sin the double cure;\nSave from wrath and make me pure." },
      { label: 'Verse 2', text: "Not the labor of my hands\nCan fulfill Thy law's demands;\nCould my zeal no respite know,\nCould my tears forever flow,\nAll for sin could not atone;\nThou must save, and Thou alone." },
      { label: 'Verse 3', text: "Nothing in my hand I bring,\nSimply to the cross I cling;\nNaked, come to Thee for dress;\nHelpless, look to Thee for grace;\nFoul, I to the fountain fly;\nWash me, Savior, or I die." },
      { label: 'Verse 4', text: "While I draw this fleeting breath,\nWhen mine eyes shall close in death,\nWhen I soar to worlds unknown,\nSee Thee on Thy judgment throne,\nRock of Ages, cleft for me,\nLet me hide myself in Thee." },
    ]
  },
  {
    id: 'there-is-a-fountain', title: 'There Is a Fountain', author: 'William Cowper (1772)',
    category: 'Grace & Salvation', key: 'D',
    verses: [
      { label: 'Verse 1', text: "There is a fountain filled with blood\nDrawn from Immanuel's veins;\nAnd sinners plunged beneath that flood\nLose all their guilty stains." },
      { label: 'Verse 2', text: "The dying thief rejoiced to see\nThat fountain in his day;\nAnd there have I, though vile as he,\nWashed all my sins away." },
      { label: 'Verse 3', text: "Dear dying Lamb, Thy precious blood\nShall never lose its power\nTill all the ransomed church of God\nBe saved, to sin no more." },
      { label: 'Verse 4', text: "E'er since, by faith, I saw the stream\nThy flowing wounds supply,\nRedeeming love has been my theme,\nAnd shall be till I die." },
    ]
  },
  {
    id: 'grace-greater', title: 'Grace Greater Than Our Sin', author: 'Julia H. Johnston (1911)',
    category: 'Grace & Salvation', key: 'F',
    verses: [
      { label: 'Verse 1', text: "Marvelous grace of our loving Lord,\nGrace that exceeds our sin and our guilt!\nYonder on Calvary's mount outpoured,\nThere where the blood of the Lamb was spilled." },
      { label: 'Chorus', text: "Grace, grace, God's grace,\nGrace that will pardon and cleanse within;\nGrace, grace, God's grace,\nGrace that is greater than all our sin!" },
      { label: 'Verse 2', text: "Sin and despair, like the sea waves cold,\nThreaten the soul with infinite loss;\nGrace that is greater, yes, grace untold,\nPoints to the refuge, the mighty cross." },
      { label: 'Verse 3', text: "Dark is the stain that we cannot hide;\nWhat can avail to wash it away?\nLook! There is flowing a crimson tide,\nWhiter than snow you may be today." },
    ]
  },

  // ── PRAISE & WORSHIP ───────────────────────────────────────────
  {
    id: 'holy', title: 'Holy, Holy, Holy', author: 'Reginald Heber (1826)',
    category: 'Praise & Worship', key: 'D',
    verses: [
      { label: 'Verse 1', text: "Holy, Holy, Holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, Holy, Holy, merciful and mighty!\nGod in three Persons, blessed Trinity!" },
      { label: 'Verse 2', text: "Holy, Holy, Holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert, and art, and evermore shalt be." },
      { label: 'Verse 3', text: "Holy, Holy, Holy! Though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see;\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity." },
      { label: 'Verse 4', text: "Holy, Holy, Holy! Lord God Almighty!\nAll Thy works shall praise Thy Name, in earth, and sky, and sea;\nHoly, Holy, Holy; merciful and mighty!\nGod in three Persons, blessed Trinity!" },
    ]
  },
  {
    id: 'all-hail', title: "All Hail the Power of Jesus' Name", author: 'Edward Perronet (1779)',
    category: 'Praise & Worship', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "All hail the power of Jesus' name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all." },
      { label: 'Verse 2', text: "Ye chosen seed of Israel's race,\nYe ransomed from the fall,\nHail Him who saves you by His grace,\nAnd crown Him Lord of all." },
      { label: 'Verse 3', text: "Let every kindred, every tribe\nOn this terrestrial ball\nTo Him all majesty ascribe,\nAnd crown Him Lord of all." },
      { label: 'Verse 4', text: "O that with yonder sacred throng\nWe at His feet may fall!\nWe'll join the everlasting song,\nAnd crown Him Lord of all." },
    ]
  },
  {
    id: 'to-god-be-glory', title: 'To God Be the Glory', author: 'Fanny J. Crosby (1875)',
    category: 'Praise & Worship', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "To God be the glory, great things He hath taught us,\nGreat things He hath done, and great our rejoicing\nThrough Jesus the Son;\nBut purer, and higher, and greater will be\nOur wonder, our transport, when Jesus we see." },
      { label: 'Chorus', text: "Praise the Lord, praise the Lord,\nLet the earth hear His voice!\nPraise the Lord, praise the Lord,\nLet the people rejoice!\nO come to the Father, through Jesus the Son,\nAnd give Him the glory, great things He hath done." },
      { label: 'Verse 2', text: "O perfect redemption, the purchase of blood,\nTo every believer the promise of God;\nThe vilest offender who truly believes,\nThat moment from Jesus a pardon receives." },
    ]
  },
  {
    id: 'praise-him', title: 'Praise Him! Praise Him!', author: 'Fanny J. Crosby (1869)',
    category: 'Praise & Worship', key: 'G',
    verses: [
      { label: 'Verse 1', text: "Praise Him! Praise Him! Jesus, our blessed Redeemer!\nSing, O Earth, His wonderful love proclaim!\nHail Him! Hail Him! Highest archangels in glory;\nStrength and honor give to His holy name!" },
      { label: 'Chorus', text: "Praise Him! Praise Him! Tell of His excellent greatness;\nPraise Him! Praise Him! Ever in joyful song!" },
      { label: 'Verse 2', text: "Praise Him! Praise Him! Jesus, our blessed Redeemer!\nFor our sins He suffered, and bled, and died;\nHe our Rock, our hope of eternal salvation,\nHail Him! Hail Him! Jesus the Crucified." },
      { label: 'Verse 3', text: "Praise Him! Praise Him! Jesus, our blessed Redeemer!\nHeavenly portals loud with hosannas ring!\nJesus, Savior, reigneth forever and ever;\nCrown Him! Crown Him! Prophet, and Priest, and King!" },
    ]
  },
  {
    id: 'crown-him', title: 'Crown Him with Many Crowns', author: 'Matthew Bridges (1851)',
    category: 'Praise & Worship', key: 'Eb',
    verses: [
      { label: 'Verse 1', text: "Crown Him with many crowns,\nThe Lamb upon His throne;\nHark! how the heavenly anthem drowns\nAll music but its own!\nAwake, my soul, and sing\nOf Him who died for thee,\nAnd hail Him as thy matchless King\nThrough all eternity." },
      { label: 'Verse 2', text: "Crown Him the Lord of love;\nBehold His hands and side,\nRich wounds, yet visible above,\nIn beauty glorified;\nNo angel in the sky\nCan fully bear that sight,\nBut downward bends his burning eye\nAt mysteries so bright." },
      { label: 'Verse 3', text: "Crown Him the Lord of years,\nThe Potentate of time;\nCreator of the rolling spheres,\nIneffably sublime.\nAll hail, Redeemer, hail!\nFor Thou hast died for me;\nThy praise shall never, never fail\nThroughout eternity." },
    ]
  },

  // ── FAITH & TRUST ──────────────────────────────────────────────
  {
    id: 'great-is-thy', title: 'Great Is Thy Faithfulness', author: 'Thomas O. Chisholm (1923)',
    category: 'Faith & Trust', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be." },
      { label: 'Chorus', text: "Great is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided—\nGreat is Thy faithfulness, Lord, unto me!" },
      { label: 'Verse 2', text: "Summer and winter, and springtime and harvest,\nSun, moon and stars in their courses above,\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love." },
      { label: 'Verse 3', text: "Pardon for sin and a peace that endureth,\nThine own dear presence to cheer and to guide;\nStrength for today and bright hope for tomorrow,\nBlessings all mine, with ten thousand beside!" },
    ]
  },
  {
    id: 'tis-so-sweet', title: "'Tis So Sweet to Trust in Jesus", author: 'Louisa M. R. Stead (1882)',
    category: 'Faith & Trust', key: 'F',
    verses: [
      { label: 'Verse 1', text: "'Tis so sweet to trust in Jesus,\nJust to take Him at His word;\nJust to rest upon His promise,\nJust to know, 'Thus saith the Lord.'" },
      { label: 'Chorus', text: "Jesus, Jesus, how I trust Him!\nHow I've proved Him o'er and o'er!\nJesus, Jesus, precious Jesus!\nO for grace to trust Him more!" },
      { label: 'Verse 2', text: "O how sweet to trust in Jesus,\nJust to trust His cleansing blood;\nJust in simple faith to plunge me\n'Neath the healing, cleansing flood!" },
      { label: 'Verse 3', text: "Yes, 'tis sweet to trust in Jesus,\nJust from sin and self to cease;\nJust from Jesus simply taking\nLife and rest and joy and peace." },
      { label: 'Verse 4', text: "I'm so glad I learned to trust Thee,\nPrecious Jesus, Savior, Friend;\nAnd I know that Thou art with me,\nWilt be with me to the end." },
    ]
  },
  {
    id: 'leaning', title: 'Leaning on the Everlasting Arms', author: 'Elisha A. Hoffman (1887)',
    category: 'Faith & Trust', key: 'G',
    verses: [
      { label: 'Verse 1', text: "What a fellowship, what a joy divine,\nLeaning on the everlasting arms;\nWhat a blessedness, what a peace is mine,\nLeaning on the everlasting arms." },
      { label: 'Chorus', text: "Leaning, leaning,\nSafe and secure from all alarms;\nLeaning, leaning,\nLeaning on the everlasting arms." },
      { label: 'Verse 2', text: "O how sweet to walk in this pilgrim way,\nLeaning on the everlasting arms;\nO how bright the path grows from day to day,\nLeaning on the everlasting arms." },
      { label: 'Verse 3', text: "What have I to dread, what have I to fear,\nLeaning on the everlasting arms?\nI have blessed peace with my Lord so near,\nLeaning on the everlasting arms." },
    ]
  },
  {
    id: 'blessed-assurance', title: 'Blessed Assurance', author: 'Fanny J. Crosby (1873)',
    category: 'Faith & Trust', key: 'D',
    verses: [
      { label: 'Verse 1', text: "Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood." },
      { label: 'Chorus', text: "This is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long." },
      { label: 'Verse 2', text: "Perfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending bring from above\nEchoes of mercy, whispers of love." },
      { label: 'Verse 3', text: "Perfect submission, all is at rest,\nI in my Savior am happy and blest,\nWatching and waiting, looking above,\nFilled with His goodness, lost in His love." },
    ]
  },
  {
    id: 'standing-on-promises', title: 'Standing on the Promises', author: 'R. Kelso Carter (1886)',
    category: 'Faith & Trust', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "Standing on the promises of Christ my King,\nThrough eternal ages let His praises ring;\nGlory in the highest, I will shout and sing,\nStanding on the promises of God." },
      { label: 'Chorus', text: "Standing, standing,\nStanding on the promises of God my Savior;\nStanding, standing,\nI'm standing on the promises of God." },
      { label: 'Verse 2', text: "Standing on the promises that cannot fail,\nWhen the howling storms of doubt and fear assail,\nBy the living Word of God I shall prevail,\nStanding on the promises of God." },
      { label: 'Verse 3', text: "Standing on the promises of Christ the Lord,\nBound to Him eternally by love's strong cord,\nOvercoming daily with the Spirit's sword,\nStanding on the promises of God." },
    ]
  },

  // ── COMFORT & PEACE ────────────────────────────────────────────
  {
    id: 'abide', title: 'Abide With Me', author: 'Henry Francis Lyte (1847)',
    category: 'Comfort & Peace', key: 'Eb',
    verses: [
      { label: 'Verse 1', text: "Abide with me; fast falls the eventide;\nThe darkness deepens; Lord, with me abide.\nWhen other helpers fail and comforts flee,\nHelp of the helpless, O abide with me." },
      { label: 'Verse 2', text: "Swift to its close ebbs out life's little day;\nEarth's joys grow dim, its glories pass away;\nChange and decay in all around I see;\nO Thou who changest not, abide with me." },
      { label: 'Verse 3', text: "I need Thy presence every passing hour;\nWhat but Thy grace can foil the tempter's power?\nWho, like Thyself, my guide and stay can be?\nThrough cloud and sunshine, Lord, abide with me." },
      { label: 'Verse 4', text: "I fear no foe, with Thee at hand to bless;\nIlls have no weight, and tears no bitterness;\nWhere is death's sting? Where, grave, thy victory?\nI triumph still, if Thou abide with me." },
      { label: 'Verse 5', text: "Hold Thou Thy cross before my closing eyes;\nShine through the gloom and point me to the skies;\nHeaven's morning breaks, and earth's vain shadows flee;\nIn life, in death, O Lord, abide with me." },
    ]
  },
  {
    id: 'it-is-well', title: 'It Is Well with My Soul', author: 'Horatio G. Spafford (1873)',
    category: 'Comfort & Peace', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "When peace, like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul." },
      { label: 'Chorus', text: "It is well (it is well)\nWith my soul (with my soul)\nIt is well, it is well with my soul." },
      { label: 'Verse 2', text: "Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ hath regarded my helpless estate,\nAnd hath shed His own blood for my soul." },
      { label: 'Verse 3', text: "My sin, oh the bliss of this glorious thought!\nMy sin, not in part but the whole,\nIs nailed to the cross, and I bear it no more,\nPraise the Lord, praise the Lord, O my soul!" },
      { label: 'Verse 4', text: "And, Lord, haste the day when my faith shall be sight,\nThe clouds be rolled back as a scroll;\nThe trump shall resound, and the Lord shall descend,\nEven so, it is well with my soul." },
    ]
  },
  {
    id: 'what-friend', title: 'What a Friend We Have in Jesus', author: 'Joseph M. Scriven (1855)',
    category: 'Comfort & Peace', key: 'F',
    verses: [
      { label: 'Verse 1', text: "What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!\nO what peace we often forfeit,\nO what needless pain we bear,\nAll because we do not carry\nEverything to God in prayer!" },
      { label: 'Verse 2', text: "Have we trials and temptations?\nIs there trouble anywhere?\nWe should never be discouraged;\nTake it to the Lord in prayer!\nCan we find a friend so faithful\nWho will all our sorrows share?\nJesus knows our every weakness;\nTake it to the Lord in prayer!" },
      { label: 'Verse 3', text: "Are we weak and heavy laden,\nCumbered with a load of care?\nPrecious Savior, still our refuge;\nTake it to the Lord in prayer!\nDo thy friends despise, forsake thee?\nTake it to the Lord in prayer!\nIn His arms He'll take and shield thee;\nThou wilt find a solace there." },
    ]
  },
  {
    id: 'like-a-river', title: 'Like a River Glorious', author: 'Frances R. Havergal (1876)',
    category: 'Comfort & Peace', key: 'G',
    verses: [
      { label: 'Verse 1', text: "Like a river glorious, is God's perfect peace,\nOver all victorious, in its bright increase;\nPerfect, yet it floweth, fuller every day,\nPerfect, yet it groweth, deeper all the way." },
      { label: 'Chorus', text: "Stayed upon Jehovah, hearts are fully blest\nFinding, as He promised, perfect peace and rest." },
      { label: 'Verse 2', text: "Hidden in the hollow of His blessed hand,\nNever foe can follow, never traitor stand;\nNot a surge of worry, not a shade of care,\nNot a blast of hurry touch the spirit there." },
      { label: 'Verse 3', text: "Every joy or trial falleth from above,\nTraced upon our dial by the Sun of Love;\nWe may trust Him fully all for us to do;\nThey who trust Him wholly find Him wholly true." },
    ]
  },

  // ── JESUS CHRIST ───────────────────────────────────────────────
  {
    id: 'fairest-lord', title: 'Fairest Lord Jesus', author: 'Münster Gesangbuch (1677)',
    category: 'Jesus Christ', key: 'Eb',
    verses: [
      { label: 'Verse 1', text: "Fairest Lord Jesus, Ruler of all nature,\nO Thou of God and man the Son,\nThee will I cherish, Thee will I honor,\nThou, my soul's glory, joy, and crown." },
      { label: 'Verse 2', text: "Fair are the meadows, fairer still the woodlands,\nRobed in the blooming garb of spring;\nJesus is fairer, Jesus is purer,\nWho makes the woeful heart to sing." },
      { label: 'Verse 3', text: "Fair is the sunshine, fairer still the moonlight,\nAnd all the twinkling starry host;\nJesus shines brighter, Jesus shines purer\nThan all the angels heaven can boast." },
    ]
  },
  {
    id: 'jesus-lover', title: 'Jesus, Lover of My Soul', author: 'Charles Wesley (1740)',
    category: 'Jesus Christ', key: 'Ab',
    verses: [
      { label: 'Verse 1', text: "Jesus, Lover of my soul,\nLet me to Thy bosom fly,\nWhile the nearer waters roll,\nWhile the tempest still is high;\nHide me, O my Savior, hide,\nTill the storm of life is past;\nSafe into the haven guide;\nO receive my soul at last!" },
      { label: 'Verse 2', text: "Other refuge have I none,\nHangs my helpless soul on Thee;\nLeave, ah! leave me not alone,\nStill support and comfort me.\nAll my trust on Thee is stayed,\nAll my help from Thee I bring;\nCover my defenseless head\nWith the shadow of Thy wing." },
      { label: 'Verse 3', text: "Plenteous grace with Thee is found,\nGrace to cover all my sin;\nLet the healing streams abound;\nMake and keep me pure within.\nThou of life the fountain art,\nFreely let me take of Thee;\nSpring Thou up within my heart;\nRise to all eternity." },
    ]
  },
  {
    id: 'jesus-name', title: 'Take the Name of Jesus with You', author: 'Lydia Baxter (1870)',
    category: 'Jesus Christ', key: 'G',
    verses: [
      { label: 'Verse 1', text: "Take the name of Jesus with you,\nChild of sorrow and of woe;\nIt will joy and comfort give you;\nTake it then, where'er you go." },
      { label: 'Chorus', text: "Precious name, O how sweet!\nHope of earth and joy of heaven;\nPrecious name, O how sweet!\nHope of earth and joy of heaven." },
      { label: 'Verse 2', text: "Take the name of Jesus ever,\nAs a shield from every snare;\nIf temptations round you gather,\nBreathe that holy name in prayer." },
      { label: 'Verse 3', text: "At the name of Jesus bowing,\nFalling prostrate at His feet,\nKing of kings in heaven we'll crown Him,\nWhen our journey is complete." },
    ]
  },
  {
    id: 'the-old-rugged-cross', title: 'The Old Rugged Cross', author: 'George Bennard (1913)',
    category: 'Jesus Christ', key: 'Ab',
    verses: [
      { label: 'Verse 1', text: "On a hill far away stood an old rugged cross,\nThe emblem of suffering and shame;\nAnd I love that old cross where the dearest and best\nFor a world of lost sinners was slain." },
      { label: 'Chorus', text: "So I'll cherish the old rugged cross,\nTill my trophies at last I lay down;\nI will cling to the old rugged cross,\nAnd exchange it some day for a crown." },
      { label: 'Verse 2', text: "O that old rugged cross, so despised by the world,\nHas a wondrous attraction for me;\nFor the dear Lamb of God left His glory above\nTo bear it to dark Calvary." },
      { label: 'Verse 3', text: "In that old rugged cross, stained with blood so divine,\nA wondrous beauty I see,\nFor 'twas on that old cross Jesus suffered and died,\nTo pardon and sanctify me." },
      { label: 'Verse 4', text: "To the old rugged cross I will ever be true;\nIts shame and reproach gladly bear;\nThen He'll call me some day to my home far away,\nWhere His glory forever I'll share." },
    ]
  },

  // ── CONSECRATION ───────────────────────────────────────────────
  {
    id: 'have-thine', title: 'Have Thine Own Way, Lord', author: 'Adelaide A. Pollard (1907)',
    category: 'Consecration', key: 'G',
    verses: [
      { label: 'Verse 1', text: "Have Thine own way, Lord! Have Thine own way!\nThou art the Potter, I am the clay.\nMold me and make me after Thy will,\nWhile I am waiting, yielded and still." },
      { label: 'Verse 2', text: "Have Thine own way, Lord! Have Thine own way!\nSearch me and try me, Master, today!\nWhiter than snow, Lord, wash me just now,\nAs in Thy presence humbly I bow." },
      { label: 'Verse 3', text: "Have Thine own way, Lord! Have Thine own way!\nWounded and weary, help me, I pray!\nPower, all power, surely is Thine!\nTouch me and heal me, Savior divine!" },
      { label: 'Verse 4', text: "Have Thine own way, Lord! Have Thine own way!\nHold o'er my being absolute sway!\nFill with Thy Spirit till all shall see\nChrist only, always, living in me!" },
    ]
  },
  {
    id: 'take-my-life', title: 'Take My Life and Let It Be', author: 'Frances R. Havergal (1874)',
    category: 'Consecration', key: 'D',
    verses: [
      { label: 'Verse 1', text: "Take my life, and let it be\nConse-crated, Lord, to Thee;\nTake my moments and my days;\nLet them flow in ceaseless praise." },
      { label: 'Verse 2', text: "Take my hands, and let them move\nAt the impulse of Thy love;\nTake my feet, and let them be\nSwift and beautiful for Thee." },
      { label: 'Verse 3', text: "Take my voice, and let me sing\nAlways, only, for my King;\nTake my lips, and let them be\nFilled with messages from Thee." },
      { label: 'Verse 4', text: "Take my silver and my gold;\nNot a mite would I withhold;\nTake my intellect, and use\nEvery power as Thou shalt choose." },
      { label: 'Verse 5', text: "Take my will, and make it Thine;\nIt shall be no longer mine;\nTake my heart, it is Thine own;\nIt shall be Thy royal throne." },
      { label: 'Verse 6', text: "Take my love; my Lord, I pour\nAt Thy feet its treasure store;\nTake myself, and I will be\nEver, only, all for Thee." },
    ]
  },
  {
    id: 'i-surrender-all', title: 'I Surrender All', author: 'J. W. Van DeVenter (1896)',
    category: 'Consecration', key: 'F',
    verses: [
      { label: 'Verse 1', text: "All to Jesus I surrender,\nAll to Him I freely give;\nI will ever love and trust Him,\nIn His presence daily live." },
      { label: 'Chorus', text: "I surrender all, I surrender all;\nAll to Thee, my blessed Savior,\nI surrender all." },
      { label: 'Verse 2', text: "All to Jesus I surrender,\nHumbly at His feet I bow;\nWorldly pleasures all forsaken,\nTake me, Jesus, take me now." },
      { label: 'Verse 3', text: "All to Jesus I surrender,\nMake me, Savior, wholly Thine;\nLet me feel Thy Holy Spirit,\nTruly know that Thou art mine." },
      { label: 'Verse 4', text: "All to Jesus I surrender,\nLord, I give myself to Thee;\nFill me with Thy love and power,\nLet Thy blessing fall on me." },
    ]
  },

  // ── SERVICE & MISSION ──────────────────────────────────────────
  {
    id: 'onward-christian', title: 'Onward, Christian Soldiers', author: 'Sabine Baring-Gould (1865)',
    category: 'Service & Mission', key: 'Eb',
    verses: [
      { label: 'Verse 1', text: "Onward, Christian soldiers,\nMarching as to war,\nWith the cross of Jesus\nGoing on before!\nChrist, the royal Master,\nLeads against the foe;\nForward into battle\nSee His banners go!" },
      { label: 'Chorus', text: "Onward, Christian soldiers,\nMarching as to war,\nWith the cross of Jesus\nGoing on before!" },
      { label: 'Verse 2', text: "At the sign of triumph\nSatan's host doth flee;\nOn then, Christian soldiers,\nOn to victory!\nHell's foundations quiver\nAt the shout of praise;\nBrothers, lift your voices,\nLoud your anthems raise." },
      { label: 'Verse 3', text: "Like a mighty army\nMoves the church of God;\nBrothers, we are treading\nWhere the saints have trod;\nWe are not divided,\nAll one body we,\nOne in hope and doctrine,\nOne in charity." },
    ]
  },
  {
    id: 'send-revival', title: 'Lord, Send a Revival', author: 'B. B. McKinney (1927)',
    category: 'Service & Mission', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "Lord, send a revival,\nLord, send a revival,\nLord, send a revival,\nAnd let it begin in me." },
      { label: 'Verse 2', text: "We need Thy power, Lord,\nWe need Thy power, Lord,\nWe need Thy power, Lord,\nSend it from heaven today." },
    ]
  },
  {
    id: 'rescue-perishing', title: 'Rescue the Perishing', author: 'Fanny J. Crosby (1869)',
    category: 'Service & Mission', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "Rescue the perishing,\nCare for the dying,\nSnatch them in pity from sin and the grave;\nWeep o'er the erring one,\nLift up the fallen,\nTell them of Jesus, the mighty to save." },
      { label: 'Chorus', text: "Rescue the perishing,\nCare for the dying;\nJesus is merciful,\nJesus will save." },
      { label: 'Verse 2', text: "Though they are slighting Him,\nStill He is waiting,\nWaiting the penitent child to receive;\nPlead with them earnestly,\nPlead with them gently;\nHe will forgive if they only believe." },
      { label: 'Verse 3', text: "Down in the human heart,\nCrushed by the tempter,\nFeelings lie buried that grace can restore;\nTouched by a loving heart,\nWakened by kindness,\nChords that were broken will vibrate once more." },
    ]
  },

  // ── HEAVEN & ETERNITY ──────────────────────────────────────────
  {
    id: 'when-the-roll', title: 'When the Roll Is Called Up Yonder', author: 'James M. Black (1893)',
    category: 'Heaven & Eternity', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "When the trumpet of the Lord shall sound,\nAnd time shall be no more,\nAnd the morning breaks, eternal, bright and fair;\nWhen the saved of earth shall gather\nOver on the other shore,\nAnd the roll is called up yonder, I'll be there." },
      { label: 'Chorus', text: "When the roll is called up yonder,\nWhen the roll is called up yonder,\nWhen the roll is called up yonder,\nWhen the roll is called up yonder, I'll be there." },
      { label: 'Verse 2', text: "On that bright and cloudless morning\nWhen the dead in Christ shall rise,\nAnd the glory of His resurrection share;\nWhen His chosen ones shall gather\nTo their home beyond the skies,\nAnd the roll is called up yonder, I'll be there." },
    ]
  },
  {
    id: 'sweet-by-and-by', title: 'In the Sweet By and By', author: 'Sanford F. Bennett (1868)',
    category: 'Heaven & Eternity', key: 'G',
    verses: [
      { label: 'Verse 1', text: "There's a land that is fairer than day,\nAnd by faith we can see it afar;\nFor the Father waits over the way\nTo prepare us a dwelling place there." },
      { label: 'Chorus', text: "In the sweet by and by,\nWe shall meet on that beautiful shore;\nIn the sweet by and by,\nWe shall meet on that beautiful shore." },
      { label: 'Verse 2', text: "We shall sing on that beautiful shore\nThe melodious songs of the blest;\nAnd our spirits shall sorrow no more,\nNot a sigh for the blessing of rest." },
      { label: 'Verse 3', text: "To our bountiful Father above,\nWe will offer our tribute of praise\nFor the glorious gift of His love\nAnd the blessings that hallow our days." },
    ]
  },
  {
    id: 'going-home', title: "I'll Fly Away", author: 'Albert E. Brumley (1929)',
    category: 'Heaven & Eternity', key: 'G',
    verses: [
      { label: 'Verse 1', text: "Some glad morning when this life is o'er,\nI'll fly away;\nTo a home on God's celestial shore,\nI'll fly away." },
      { label: 'Chorus', text: "I'll fly away, O glory,\nI'll fly away;\nWhen I die, hallelujah, by and by,\nI'll fly away." },
      { label: 'Verse 2', text: "When the shadows of this life have grown,\nI'll fly away;\nLike a bird from prison bars has flown,\nI'll fly away." },
      { label: 'Verse 3', text: "Just a few more weary days and then,\nI'll fly away;\nTo a land where joys shall never end,\nI'll fly away." },
    ]
  },

  // ── CHRISTMAS & SPECIAL ────────────────────────────────────────
  {
    id: 'o-little-town', title: 'O Little Town of Bethlehem', author: 'Phillips Brooks (1868)',
    category: 'Christmas', key: 'F',
    verses: [
      { label: 'Verse 1', text: "O little town of Bethlehem,\nHow still we see thee lie!\nAbove thy deep and dreamless sleep\nThe silent stars go by.\nYet in thy dark streets shineth\nThe everlasting Light;\nThe hopes and fears of all the years\nAre met in thee tonight." },
      { label: 'Verse 2', text: "For Christ is born of Mary;\nAnd gathered all above,\nWhile mortals sleep, the angels keep\nTheir watch of wondering love.\nO morning stars, together\nProclaim the holy birth!\nAnd praises sing to God the King,\nAnd peace to men on earth." },
      { label: 'Verse 3', text: "How silently, how silently,\nThe wondrous gift is given!\nSo God imparts to human hearts\nThe blessings of His heaven.\nNo ear may hear His coming,\nBut in this world of sin,\nWhere meek souls will receive Him still,\nThe dear Christ enters in." },
    ]
  },
  {
    id: 'joy-to-the-world', title: 'Joy to the World', author: 'Isaac Watts (1719)',
    category: 'Christmas', key: 'D',
    verses: [
      { label: 'Verse 1', text: "Joy to the world! The Lord is come;\nLet earth receive her King;\nLet every heart prepare Him room,\nAnd heaven and nature sing,\nAnd heaven and nature sing,\nAnd heaven, and heaven, and nature sing." },
      { label: 'Verse 2', text: "Joy to the world! The Savior reigns;\nLet men their songs employ;\nWhile fields and floods, rocks, hills and plains\nRepeat the sounding joy,\nRepeat the sounding joy,\nRepeat, repeat the sounding joy." },
      { label: 'Verse 3', text: "He rules the world with truth and grace,\nAnd makes the nations prove\nThe glories of His righteousness,\nAnd wonders of His love,\nAnd wonders of His love,\nAnd wonders, wonders of His love." },
    ]
  },
  {
    id: 'silent-night', title: 'Silent Night', author: 'Joseph Mohr (1818)',
    category: 'Christmas', key: 'Bb',
    verses: [
      { label: 'Verse 1', text: "Silent night, holy night,\nAll is calm, all is bright\nRound yon virgin mother and Child.\nHoly Infant, so tender and mild,\nSleep in heavenly peace,\nSleep in heavenly peace." },
      { label: 'Verse 2', text: "Silent night, holy night,\nShepherds quake at the sight;\nGlories stream from heaven afar,\nHeavenly hosts sing Alleluia!\nChrist the Savior is born,\nChrist the Savior is born!" },
      { label: 'Verse 3', text: "Silent night, holy night,\nSon of God, love's pure light;\nRadiant beams from Thy holy face\nWith the dawn of redeeming grace,\nJesus, Lord, at Thy birth,\nJesus, Lord, at Thy birth." },
    ]
  },
]

// derive categories
const ALL_CATEGORIES = ['All', ...Array.from(new Set(HYMNS.map(h => h.category)))]

// ── 4. Bible Books ────────────────────────────────────────────────
const OLD_TESTAMENT = [
  {name:'Genesis',chapters:50},{name:'Exodus',chapters:40},
  {name:'Leviticus',chapters:27},{name:'Numbers',chapters:36},
  {name:'Deuteronomy',chapters:34},{name:'Joshua',chapters:24},
  {name:'Judges',chapters:21},{name:'Ruth',chapters:4},
  {name:'1 Samuel',chapters:31},{name:'2 Samuel',chapters:24},
  {name:'1 Kings',chapters:22},{name:'2 Kings',chapters:25},
  {name:'1 Chronicles',chapters:29},{name:'2 Chronicles',chapters:36},
  {name:'Ezra',chapters:10},{name:'Nehemiah',chapters:13},
  {name:'Esther',chapters:10},{name:'Job',chapters:42},
  {name:'Psalms',chapters:150},{name:'Proverbs',chapters:31},
  {name:'Ecclesiastes',chapters:12},{name:'Song of Solomon',chapters:8},
  {name:'Isaiah',chapters:66},{name:'Jeremiah',chapters:52},
  {name:'Lamentations',chapters:5},{name:'Ezekiel',chapters:48},
  {name:'Daniel',chapters:12},{name:'Hosea',chapters:14},
  {name:'Joel',chapters:3},{name:'Amos',chapters:9},
  {name:'Obadiah',chapters:1},{name:'Jonah',chapters:4},
  {name:'Micah',chapters:7},{name:'Nahum',chapters:3},
  {name:'Habakkuk',chapters:3},{name:'Zephaniah',chapters:3},
  {name:'Haggai',chapters:2},{name:'Zechariah',chapters:14},
  {name:'Malachi',chapters:4},
]
const NEW_TESTAMENT = [
  {name:'Matthew',chapters:28},{name:'Mark',chapters:16},
  {name:'Luke',chapters:24},{name:'John',chapters:21},
  {name:'Acts',chapters:28},{name:'Romans',chapters:16},
  {name:'1 Corinthians',chapters:16},{name:'2 Corinthians',chapters:13},
  {name:'Galatians',chapters:6},{name:'Ephesians',chapters:6},
  {name:'Philippians',chapters:4},{name:'Colossians',chapters:4},
  {name:'1 Thessalonians',chapters:5},{name:'2 Thessalonians',chapters:3},
  {name:'1 Timothy',chapters:6},{name:'2 Timothy',chapters:4},
  {name:'Titus',chapters:3},{name:'Philemon',chapters:1},
  {name:'Hebrews',chapters:13},{name:'James',chapters:5},
  {name:'1 Peter',chapters:5},{name:'2 Peter',chapters:3},
  {name:'1 John',chapters:5},{name:'2 John',chapters:1},
  {name:'3 John',chapters:1},{name:'Jude',chapters:1},
  {name:'Revelation',chapters:22},
]

// ── 5. Helpers ────────────────────────────────────────────────────
const KEY_VERSION = 'scripturehub_version'
function loadPref(key, fb) { try { return JSON.parse(localStorage.getItem(key)) ?? fb } catch { return fb } }
function savePref(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }
function cleanText(text) {
  if (!text) return ''
  return text.replace(/<[^>]*>/g, '').replace(/¶/g, '').replace(/\s+/g, ' ').trim()
}
function parseVerses(raw) {
  if (!raw) return []
  const cleaned = raw.replace(/<[^>]*>/g, '').replace(/¶/g, '')
  const matches = [...cleaned.matchAll(/\[(\d+)\]\s*([\s\S]*?)(?=\[\d+\]|$)/g)]
  if (matches.length === 0) {
    const t = cleaned.replace(/\s+/g, ' ').trim()
    return t ? [{ verse: 1, text: t }] : []
  }
  return matches.map(m => ({ verse: Number(m[1]), text: m[2].replace(/\s+/g, ' ').trim() })).filter(v => v.text.length > 0)
}

// ── 6. Fetch ──────────────────────────────────────────────────────
async function fetchFromBibleApiCom(bookName, chapter, code) {
  const slug = encodeURIComponent(bookName.toLowerCase())
  const url = `https://bible-api.com/${slug}%20${chapter}?translation=${code}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`bible-api.com error: HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!data.verses?.length) throw new Error('No verses returned')
  return data.verses.map(v => ({ verse: v.verse, text: cleanText(v.text) }))
}
async function fetchFromApiBible(bookName, chapter, apiBibleId) {
  const bookCode = BOOK_ID_APIBIBLE[bookName]
  if (!bookCode) throw new Error(`Book not mapped: ${bookName}`)
  const chapterId = `${bookCode}.${chapter}`
  const url = `https://api.scripture.api.bible/v1/bibles/${apiBibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`
  const res = await fetch(url, { headers: { 'api-key': API_KEY } })
  if (res.status === 401) throw new Error('API_KEY_INVALID')
  if (res.status === 404) throw new Error('Chapter not found in this translation.')
  if (!res.ok) throw new Error(`API.Bible error: HTTP ${res.status}`)
  const data = await res.json()
  const verses = parseVerses(data?.data?.content ?? '')
  if (!verses.length) throw new Error('No verses found in response.')
  return verses
}
async function fetchChapter(bookName, chapter, translationCode) {
  const translation = TRANSLATIONS.find(t => t.code === translationCode)
  if (!translation) throw new Error(`Unknown translation: ${translationCode}`)
  if (translation.apiBibleId && KEY_LOOKS_VALID) {
    try { return await fetchFromApiBible(bookName, chapter, translation.apiBibleId) }
    catch (err) { if (err.message !== 'API_KEY_INVALID') throw err }
  }
  return await fetchFromBibleApiCom(bookName, chapter, translationCode)
}

// ── 7. Main Component ─────────────────────────────────────────────
export default function BibleReaderPage() {
  const [view, setView]                       = useState('books')
  const [testament, setTestament]             = useState('old')
  const [selectedBook, setSelectedBook]       = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedHymn, setSelectedHymn]       = useState(null)
  const [verses, setVerses]                   = useState([])
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState(null)
  const [version, setVersion]                 = useState(() => loadPref(KEY_VERSION, 'kjv'))
  const [isReading, setIsReading]             = useState(false)
  const [readingVerse, setReadingVerse]       = useState(null)
  // Hymnal state
  const [hymnSearch, setHymnSearch]           = useState('')
  const [hymnCategory, setHymnCategory]       = useState('All')
  const [hymnSort, setHymnSort]               = useState('title') // 'title' | 'author'

  useEffect(() => { savePref(KEY_VERSION, version) }, [version])

  useEffect(() => {
    if (!selectedBook || !selectedChapter) return
    let cancelled = false
    setLoading(true); setVerses([]); setError(null)
    fetchChapter(selectedBook.name, selectedChapter, version)
      .then(v  => { if (!cancelled) { setVerses(v); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [selectedBook, selectedChapter, version])

  const stopNarration = () => window.speechSynthesis.cancel()
  const speak = (text, verseNum = null) => {
    stopNarration()
    const utt = new SpeechSynthesisUtterance(cleanText(text))
    utt.rate = 0.88
    utt.onstart = () => { setIsReading(true);  setReadingVerse(verseNum) }
    utt.onend   = () => { setIsReading(false); setReadingVerse(null) }
    window.speechSynthesis.speak(utt)
  }
  const retry = () => {
    if (!selectedBook || !selectedChapter) return
    setLoading(true); setError(null); setVerses([])
    fetchChapter(selectedBook.name, selectedChapter, version)
      .then(v  => { setVerses(v); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }

  const currentTranslation = TRANSLATIONS.find(t => t.code === version)

  // Filtered & sorted hymns
  const filteredHymns = useMemo(() => {
    let list = HYMNS
    if (hymnCategory !== 'All') list = list.filter(h => h.category === hymnCategory)
    if (hymnSearch.trim()) {
      const q = hymnSearch.toLowerCase()
      list = list.filter(h =>
        h.title.toLowerCase().includes(q) ||
        h.author.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.verses.some(v => v.text.toLowerCase().includes(q))
      )
    }
    return [...list].sort((a, b) =>
      hymnSort === 'author'
        ? a.author.localeCompare(b.author)
        : a.title.localeCompare(b.title)
    )
  }, [hymnSearch, hymnCategory, hymnSort])

  // ── VIEW: Hymn Detail ────────────────────────────────────────────
  if (view === 'hymn-detail' && selectedHymn) {
    const fullLyrics = selectedHymn.verses.map(v => `${v.label}\n${v.text}`).join('\n\n')
    return (
      <div style={s.page}>
        <style>{FONT}</style>
        <style>{ANIMATIONS}</style>

        <header style={s.topBar}>
          <button style={s.backBtn} onClick={() => { stopNarration(); setView('hymns') }}>← Hymns</button>
          <button
            style={{...s.listenBtn, opacity: isReading ? 1 : undefined}}
            onClick={() => isReading ? stopNarration() : speak(fullLyrics)}
          >
            {isReading ? '⏹ Stop' : '🔊 Listen'}
          </button>
        </header>

        <main style={s.hymnDetailMain}>
          {/* Title block */}
          <div style={s.hymnDetailHero}>
            <div style={s.hymnDetailNote}>🎵</div>
            <h1 style={s.hymnDetailTitle}>{selectedHymn.title}</h1>
            <p style={s.hymnDetailAuthor}>{selectedHymn.author}</p>
            <div style={s.hymnMetaRow}>
              <span style={s.hymnMetaBadge}>📂 {selectedHymn.category}</span>
              {selectedHymn.key && <span style={s.hymnMetaBadge}>🎹 Key of {selectedHymn.key}</span>}
              <span style={s.hymnMetaBadge}>📜 {selectedHymn.verses.length} sections</span>
            </div>
          </div>

          {/* Divider */}
          <div style={s.hymnDivider}><span style={s.hymnDividerCross}>✦</span></div>

          {/* Verses */}
          <div style={s.hymnVerseList}>
            {selectedHymn.verses.map((v, i) => (
              <div key={i} style={s.hymnVerseBlock}>
                <div style={s.hymnVerseLabel}>{v.label}</div>
                <pre style={s.hymnVerseText}>{v.text}</pre>
                <button
                  style={s.hymnSingBtn}
                  onClick={() => speak(v.text)}
                  title={`Listen to ${v.label}`}
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // ── VIEW: Hymn List ──────────────────────────────────────────────
  if (view === 'hymns') {
    return (
      <div style={s.page}>
        <style>{FONT}</style>
        <style>{ANIMATIONS}</style>

        <div style={s.hymnLibHeader}>
          <button style={s.backBtn} onClick={() => setView('books')}>← Back to Bible</button>
          <h1 style={s.navTitle}>🎵 Hymn Library</h1>
          <p style={s.hymnLibSubtitle}>{HYMNS.length} classic hymns • Select a song to sing together</p>

          {/* Search bar */}
          <div style={s.hymnSearchWrap}>
            <span style={s.hymnSearchIcon}>🔍</span>
            <input
              style={s.hymnSearchInput}
              type="text"
              placeholder="Search hymns, authors, or lyrics…"
              value={hymnSearch}
              onChange={e => setHymnSearch(e.target.value)}
            />
            {hymnSearch && (
              <button style={s.hymnSearchClear} onClick={() => setHymnSearch('')}>✕</button>
            )}
          </div>

          {/* Category pills */}
          <div style={s.hymnCategoryRow}>
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                style={{...s.hymnCatPill, ...(hymnCategory === cat ? s.hymnCatPillActive : {})}}
                onClick={() => setHymnCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div style={s.hymnControlRow}>
            <span style={s.hymnResultCount}>{filteredHymns.length} hymn{filteredHymns.length !== 1 ? 's' : ''}</span>
            <div style={s.hymnSortGroup}>
              <span style={s.hymnSortLabel}>Sort:</span>
              <button
                style={{...s.hymnSortBtn, ...(hymnSort === 'title' ? s.hymnSortBtnActive : {})}}
                onClick={() => setHymnSort('title')}
              >A–Z Title</button>
              <button
                style={{...s.hymnSortBtn, ...(hymnSort === 'author' ? s.hymnSortBtnActive : {})}}
                onClick={() => setHymnSort('author')}
              >Author</button>
            </div>
          </div>
        </div>

        {/* Hymn grid */}
        {filteredHymns.length === 0 ? (
          <div style={s.hymnEmpty}>
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>🎶</div>
            <div>No hymns match your search.</div>
            <button style={{...s.backBtn, marginTop:'1rem'}} onClick={() => { setHymnSearch(''); setHymnCategory('All') }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={s.hymnGrid}>
            {filteredHymns.map(h => (
              <button
                key={h.id}
                style={s.hymnCard}
                onClick={() => { setSelectedHymn(h); setView('hymn-detail') }}
              >
                <div style={s.hymnCardNote}>🎵</div>
                <div style={s.hymnCardTitle}>{h.title}</div>
                <div style={s.hymnCardAuthor}>{h.author}</div>
                <div style={s.hymnCardMeta}>
                  <span style={s.hymnCardCat}>{h.category}</span>
                  {h.key && <span style={s.hymnCardKey}>Key of {h.key}</span>}
                </div>
                <div style={s.hymnCardVerseCount}>{h.verses.length} sections</div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── VIEW: Book List ──────────────────────────────────────────────
  if (view === 'books') {
    return (
      <div style={s.page}>
        <style>{FONT}</style>
        <h1 style={s.navTitle}>✝ Holy Bible</h1>
        <div style={s.tabs}>
          <button style={{...s.tab,...(testament==='old'?s.tabActive:{})}} onClick={() => setTestament('old')}>Old Testament</button>
          <button style={{...s.tab,...(testament==='new'?s.tabActive:{})}} onClick={() => setTestament('new')}>New Testament</button>
          <button style={{...s.tab, border:'1px solid #f0c040'}} onClick={() => setView('hymns')}>🎵 Hymns</button>
        </div>
        <div style={s.grid}>
          {(testament === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT).map(b => (
            <button key={b.name} style={s.card} onClick={() => { setSelectedBook(b); setView('chapters') }}>
              <div style={s.cardTitle}>{b.name}</div>
              <div style={s.cardSub}>{b.chapters} chapters</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── VIEW: Chapter List ───────────────────────────────────────────
  if (view === 'chapters') {
    return (
      <div style={s.page}>
        <style>{FONT}</style>
        <button style={s.backBtn} onClick={() => setView('books')}>← Back to Books</button>
        <h1 style={s.navTitle}>{selectedBook.name}</h1>
        <div style={s.chapterGrid}>
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
            <button key={ch} style={s.chapterBtn} onClick={() => { setSelectedChapter(ch); setView('reader') }}>
              {ch}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── VIEW: Reader ─────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{FONT}</style>
      <style>{ANIMATIONS}</style>
      <header style={s.readerHeader}>
        <button style={s.backBtn} onClick={() => { stopNarration(); setView('chapters') }}>← Chapters</button>
        <div style={s.readerCenter}>
          <h1 style={s.readerTitle}>
            {selectedBook?.name} <span style={{color:'#c8a96e'}}>{selectedChapter}</span>
          </h1>
          <select value={version} onChange={e => { setVersion(e.target.value); setError(null) }} style={s.select}>
            {TRANSLATIONS.map(t => (
              <option key={t.code} value={t.code}>{t.badge} {t.label} — {t.full}</option>
            ))}
          </select>
          {currentTranslation && <div style={s.transDesc}>{currentTranslation.desc}</div>}
        </div>
        <button
          style={{...s.listenBtn, opacity:(loading||!verses.length)?0.35:1}}
          disabled={loading || !verses.length}
          onClick={() => isReading ? stopNarration() : speak(verses.map(v=>v.text).join('  '))}
        >
          {isReading ? '⏹ Stop' : '🔊 Listen'}
        </button>
      </header>

      <main style={s.scriptureColumn}>
        {loading && (
          <div style={s.centerMsg}>
            <div style={s.spinner}/>
            <div style={{marginTop:'1rem',color:'#f0c040'}}>📖 Loading the Word of God...</div>
          </div>
        )}
        {!loading && error && (
          <div style={s.errorBox}>
            <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>⚠️</div>
            <div style={{marginBottom:'1.5rem',lineHeight:'1.6'}}>{error}</div>
            <div style={s.btnRow}>
              <button style={s.retryBtn} onClick={retry}>🔄 Try Again</button>
              <button style={s.retryBtn} onClick={() => { setVersion('kjv'); setError(null) }}>Switch to KJV</button>
            </div>
          </div>
        )}
        {!loading && !error && verses.length === 0 && (
          <div style={s.centerMsg}>🙏 Select a book and chapter to begin reading</div>
        )}
        {!loading && !error && verses.length > 0 && (
          <>
            <div style={s.versionBadge}>
              {currentTranslation?.badge} Reading: <strong>{currentTranslation?.full || version}</strong>
            </div>
            {verses.map(v => (
              <p key={v.verse}
                style={{...s.verse,...(readingVerse===v.verse?s.verseActive:{})}}
                onClick={() => speak(v.text, v.verse)}
                title="Tap to hear this verse"
              >
                <sup style={s.verseNum}>{v.verse}</sup>
                <span style={s.verseText}>{v.text}</span>
              </p>
            ))}
            <div style={s.chapterNav}>
              <button
                style={{...s.navBtn, opacity: selectedChapter<=1 ? 0.3 : 1}}
                disabled={selectedChapter <= 1}
                onClick={() => { stopNarration(); setSelectedChapter(c=>c-1); window.scrollTo(0,0) }}
              >← Previous</button>
              <span style={s.navLabel}>Ch {selectedChapter} / {selectedBook?.chapters}</span>
              <button
                style={{...s.navBtn, opacity: selectedChapter>=selectedBook?.chapters ? 0.3 : 1}}
                disabled={selectedChapter >= selectedBook?.chapters}
                onClick={() => { stopNarration(); setSelectedChapter(c=>c+1); window.scrollTo(0,0) }}
              >Next →</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ── Font ──────────────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`
const ANIMATIONS = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
`

// ── Styles ────────────────────────────────────────────────────────
const s = {
  page:               { background:'#120a05', minHeight:'100vh', color:'#f0e6d2', padding:'2rem 1rem', fontFamily:"'Crimson Text', serif" },
  navTitle:           { textAlign:'center', color:'#f0c040', fontSize:'2.6rem', marginBottom:'1.5rem', fontWeight:'700' },
  tabs:               { display:'flex', justifyContent:'center', gap:'0.75rem', marginBottom:'2rem', flexWrap:'wrap' },
  tab:                { padding:'10px 22px', borderRadius:'20px', border:'1px solid transparent', background:'transparent', color:'#f0c040', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  tabActive:          { background:'#f0c040', color:'#1a0a00', fontWeight:'700' },
  grid:               { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'12px', maxWidth:'920px', margin:'0 auto' },
  card:               { padding:'14px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(240,192,64,0.25)', color:'#f0e6d2', borderRadius:'10px', cursor:'pointer', textAlign:'left', fontFamily:'inherit' },
  cardTitle:          { color:'#f0e6d2', fontWeight:'600', fontSize:'1rem', marginBottom:'4px' },
  cardSub:            { fontSize:'0.78rem', color:'#c8a96e' },
  chapterGrid:        { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(58px, 1fr))', gap:'10px', maxWidth:'700px', margin:'0 auto' },
  chapterBtn:         { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(240,192,64,0.4)', color:'#f0c040', borderRadius:'50%', width:'54px', height:'54px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontFamily:'inherit', fontSize:'1.05rem' },
  topBar:             { display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'860px', margin:'0 auto 2rem' },
  readerHeader:       { display:'flex', justifyContent:'space-between', alignItems:'flex-start', maxWidth:'860px', margin:'0 auto 2rem', flexWrap:'wrap', gap:'1rem' },
  readerCenter:       { flex:1, textAlign:'center', minWidth:'200px' },
  readerTitle:        { fontSize:'2rem', color:'#f0c040', margin:'0 0 0.5rem', fontWeight:'700' },
  select:             { background:'#1c1008', color:'#f0e6d2', border:'1px solid #f0c040', padding:'7px 12px', borderRadius:'8px', fontFamily:'inherit', fontSize:'0.95rem', width:'100%', maxWidth:'340px', cursor:'pointer' },
  transDesc:          { fontSize:'0.82rem', color:'#c8a96e', fontStyle:'italic', marginTop:'5px' },
  backBtn:            { background:'transparent', border:'none', color:'#c8a96e', cursor:'pointer', fontSize:'1rem', fontFamily:'inherit', padding:'6px 0' },
  listenBtn:          { padding:'10px 22px', borderRadius:'25px', border:'1px solid #f0c040', color:'#f0c040', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  retryBtn:           { padding:'10px 20px', borderRadius:'25px', border:'1px solid #e67e22', color:'#e67e22', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  btnRow:             { display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' },
  scriptureColumn:    { maxWidth:'800px', margin:'0 auto' },
  versionBadge:       { textAlign:'center', color:'#c8a96e', fontSize:'0.95rem', fontStyle:'italic', marginBottom:'2rem', paddingBottom:'1rem', borderBottom:'1px solid rgba(240,192,64,0.2)' },
  verse:              { marginBottom:'1.6rem', cursor:'pointer', padding:'8px 10px', borderRadius:'8px', transition:'background 0.2s', lineHeight:'1.8' },
  verseActive:        { background:'rgba(240,192,64,0.12)', borderLeft:'3px solid #f0c040', paddingLeft:'14px' },
  verseNum:           { color:'#f0c040', marginRight:'8px', fontWeight:'700', fontSize:'0.9rem' },
  verseText:          { fontSize:'1.4rem' },
  centerMsg:          { textAlign:'center', fontSize:'1.15rem', color:'#f0c040', marginTop:'4rem', fontStyle:'italic' },
  spinner:            { width:'40px', height:'40px', border:'3px solid rgba(240,192,64,0.2)', borderTop:'3px solid #f0c040', borderRadius:'50%', animation:'spin 0.9s linear infinite', margin:'0 auto' },
  errorBox:           { textAlign:'center', color:'#e67e22', padding:'2.5rem 2rem', border:'1px solid #e67e22', borderRadius:'14px', maxWidth:'480px', margin:'3rem auto' },
  chapterNav:         { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid rgba(240,192,64,0.2)', maxWidth:'500px', margin:'3rem auto 0' },
  navBtn:             { padding:'10px 24px', borderRadius:'25px', border:'1px solid #f0c040', color:'#f0c040', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  navLabel:           { color:'#c8a96e', fontSize:'0.95rem', fontStyle:'italic' },

  // ── Hymn Library ─────────────────────────────────────────────────
  hymnLibHeader:      { maxWidth:'900px', margin:'0 auto 2rem', textAlign:'center' },
  hymnLibSubtitle:    { color:'#c8a96e', fontStyle:'italic', fontSize:'1.05rem', margin:'-0.5rem 0 1.5rem' },
  hymnSearchWrap:     { position:'relative', maxWidth:'500px', margin:'0 auto 1.5rem', display:'flex', alignItems:'center' },
  hymnSearchIcon:     { position:'absolute', left:'14px', fontSize:'1rem', pointerEvents:'none' },
  hymnSearchInput:    { width:'100%', padding:'12px 40px 12px 42px', borderRadius:'30px', border:'1px solid rgba(240,192,64,0.5)', background:'rgba(255,255,255,0.05)', color:'#f0e6d2', fontFamily:"'Crimson Text', serif", fontSize:'1.05rem', outline:'none', boxSizing:'border-box' },
  hymnSearchClear:    { position:'absolute', right:'14px', background:'none', border:'none', color:'#c8a96e', cursor:'pointer', fontSize:'1rem', padding:'0' },
  hymnCategoryRow:    { display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'center', marginBottom:'1.25rem' },
  hymnCatPill:        { padding:'6px 16px', borderRadius:'20px', border:'1px solid rgba(240,192,64,0.35)', background:'transparent', color:'#c8a96e', cursor:'pointer', fontFamily:'inherit', fontSize:'0.88rem', transition:'all 0.18s' },
  hymnCatPillActive:  { background:'rgba(240,192,64,0.18)', border:'1px solid #f0c040', color:'#f0c040', fontWeight:'700' },
  hymnControlRow:     { display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'900px', margin:'0 auto 1.25rem', flexWrap:'wrap', gap:'0.5rem' },
  hymnResultCount:    { color:'#c8a96e', fontStyle:'italic', fontSize:'0.95rem' },
  hymnSortGroup:      { display:'flex', alignItems:'center', gap:'6px' },
  hymnSortLabel:      { color:'#c8a96e', fontSize:'0.9rem' },
  hymnSortBtn:        { padding:'5px 14px', borderRadius:'15px', border:'1px solid rgba(240,192,64,0.3)', background:'transparent', color:'#c8a96e', cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem' },
  hymnSortBtnActive:  { border:'1px solid #f0c040', color:'#f0c040', background:'rgba(240,192,64,0.1)' },
  hymnGrid:           { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'14px', maxWidth:'960px', margin:'0 auto' },
  hymnCard:           { padding:'18px 16px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(240,192,64,0.2)', color:'#f0e6d2', borderRadius:'12px', cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'border-color 0.2s, background 0.2s', animation:'fadeUp 0.3s ease both' },
  hymnCardNote:       { fontSize:'1.4rem', marginBottom:'8px' },
  hymnCardTitle:      { color:'#f0e6d2', fontWeight:'700', fontSize:'1.1rem', marginBottom:'4px', lineHeight:'1.3' },
  hymnCardAuthor:     { fontSize:'0.82rem', color:'#c8a96e', fontStyle:'italic', marginBottom:'10px' },
  hymnCardMeta:       { display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'6px' },
  hymnCardCat:        { fontSize:'0.75rem', padding:'2px 9px', borderRadius:'10px', background:'rgba(240,192,64,0.1)', color:'#f0c040', border:'1px solid rgba(240,192,64,0.3)' },
  hymnCardKey:        { fontSize:'0.75rem', padding:'2px 9px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', color:'#c8a96e', border:'1px solid rgba(200,169,110,0.25)' },
  hymnCardVerseCount: { fontSize:'0.78rem', color:'#7a6040' },
  hymnEmpty:          { textAlign:'center', color:'#c8a96e', fontSize:'1.1rem', marginTop:'5rem', fontStyle:'italic' },

  // ── Hymn Detail ───────────────────────────────────────────────────
  hymnDetailMain:     { maxWidth:'720px', margin:'0 auto' },
  hymnDetailHero:     { textAlign:'center', marginBottom:'2rem' },
  hymnDetailNote:     { fontSize:'3rem', marginBottom:'0.5rem' },
  hymnDetailTitle:    { color:'#f0c040', fontSize:'2.6rem', fontWeight:'700', margin:'0 0 0.4rem', lineHeight:'1.2' },
  hymnDetailAuthor:   { fontStyle:'italic', color:'#c8a96e', fontSize:'1.1rem', margin:'0 0 1.25rem' },
  hymnMetaRow:        { display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' },
  hymnMetaBadge:      { fontSize:'0.83rem', padding:'4px 12px', borderRadius:'15px', background:'rgba(240,192,64,0.1)', color:'#f0c040', border:'1px solid rgba(240,192,64,0.3)' },
  hymnDivider:        { textAlign:'center', color:'rgba(240,192,64,0.4)', fontSize:'1.5rem', margin:'2rem 0', letterSpacing:'1rem' },
  hymnDividerCross:   { color:'#f0c040', letterSpacing:0 },
  hymnVerseList:      { display:'flex', flexDirection:'column', gap:'2rem' },
  hymnVerseBlock:     { position:'relative', padding:'1.4rem 1.6rem 1.4rem', background:'rgba(255,255,255,0.03)', borderRadius:'12px', border:'1px solid rgba(240,192,64,0.15)', borderLeft:'3px solid rgba(240,192,64,0.5)' },
  hymnVerseLabel:     { color:'#f0c040', fontSize:'0.88rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.6rem' },
  hymnVerseText:      { whiteSpace:'pre-wrap', fontSize:'1.35rem', color:'#f0e6d2', fontFamily:"'Crimson Text', serif", lineHeight:'2', margin:0 },
  hymnSingBtn:        { position:'absolute', top:'12px', right:'12px', background:'transparent', border:'1px solid rgba(240,192,64,0.3)', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#f0c040' },
}
