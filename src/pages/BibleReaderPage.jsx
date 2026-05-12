import React, { useState, useEffect, useRef, useMemo } from 'react'

// ── API KEY ───────────────────────────────────────────────────────
const API_KEY = 'bP7SgKnADnw5o0lKdruPfuFGE7uur_gSyVGLhnlSAK'
const KEY_LOOKS_VALID = API_KEY.length >= 32

// ── 1. Translations ───────────────────────────────────────────────
const TRANSLATIONS = [
  { code:'kjv',   apiBibleId:'de4e12af7f28f599-02', label:'KJV',   full:'King James Version',         desc:'The classic 1611 translation, poetic and majestic.',      badge:'📜' },
  { code:'asv',   apiBibleId:'01b29f4b342acc35-01', label:'ASV',   full:'American Standard Version',   desc:'A precise 1901 revision of the KJV.',                     badge:'📜' },
  { code:'web',   apiBibleId:'65eec8e0b60e656b-01', label:'WEB',   full:'World English Bible',         desc:'A modern public domain translation.',                      badge:'💡' },
  { code:'bbe',   apiBibleId:'f72b840c855f362c-04', label:'BBE',   full:'Bible in Basic English',      desc:'Simple vocabulary, easy for all readers.',                 badge:'💡' },
  { code:'ylt',   apiBibleId:null,                  label:'YLT',   full:"Young's Literal Translation", desc:'A very literal word-for-word translation from 1898.',      badge:'📖' },
  { code:'darby', apiBibleId:null,                  label:'DARBY', full:'Darby Translation',           desc:"John Nelson Darby's 1890 scholarly translation.",          badge:'📖' },
  { code:'dra',   apiBibleId:null,                  label:'DRA',   full:'Douay-Rheims (Catholic)',     desc:'The traditional Catholic English Bible.',                  badge:'✝️' },
]

// ── 2. Book ID map ────────────────────────────────────────────────
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

// ══════════════════════════════════════════════════════════════════
// ── 3. HYMN COLLECTIONS ──────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════

// ── Collection A: Hymns Ancient & Modern (847 hymns) ─────────────
// Representative numbered selection — add more entries following
// the same pattern to reach the full 847.
const HYMNS_ANCIENT_MODERN = [
  { num:1,   title:'Morning Hymn',                    author:'Thomas Ken (1674)',            category:'Morning & Evening',   key:'F',
    verses:[
      {label:'Verse 1', text:"Awake, my soul, and with the sun\nThy daily stage of duty run;\nShake off dull sloth, and joyful rise\nTo pay thy morning sacrifice."},
      {label:'Verse 2', text:"Redeem thy mis-spent time that's past;\nLive this day as if 'twere thy last;\nImprove thy talent with due care;\nFor the great day thyself prepare."},
      {label:'Verse 3', text:"Let all thy converse be sincere,\nThy conscience as the noon-day clear;\nThink how all-seeing God thy ways\nAnd all thy secret thoughts surveys."},
      {label:'Doxology', text:"Praise God, from whom all blessings flow;\nPraise Him, all creatures here below;\nPraise Him above, ye heavenly host;\nPraise Father, Son, and Holy Ghost."},
    ]},
  { num:2,   title:'Holy, Holy, Holy',                author:'Reginald Heber (1826)',        category:'Trinity',             key:'D',
    verses:[
      {label:'Verse 1', text:"Holy, Holy, Holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, Holy, Holy, merciful and mighty!\nGod in three Persons, blessed Trinity!"},
      {label:'Verse 2', text:"Holy, Holy, Holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert, and art, and evermore shalt be."},
      {label:'Verse 3', text:"Holy, Holy, Holy! Though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see;\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity."},
      {label:'Verse 4', text:"Holy, Holy, Holy! Lord God Almighty!\nAll Thy works shall praise Thy Name, in earth, and sky, and sea;\nHoly, Holy, Holy; merciful and mighty!\nGod in three Persons, blessed Trinity!"},
    ]},
  { num:3,   title:'O God, Our Help in Ages Past',    author:'Isaac Watts (1719)',           category:'Providence',          key:'Bb',
    verses:[
      {label:'Verse 1', text:"O God, our help in ages past,\nOur hope for years to come,\nOur shelter from the stormy blast,\nAnd our eternal home."},
      {label:'Verse 2', text:"Under the shadow of Thy throne\nThy saints have dwelt secure;\nSufficient is Thine arm alone,\nAnd our defence is sure."},
      {label:'Verse 3', text:"Before the hills in order stood,\nOr earth received her frame,\nFrom everlasting Thou art God,\nTo endless years the same."},
      {label:'Verse 4', text:"A thousand ages in Thy sight\nAre like an evening gone;\nShort as the watch that ends the night\nBefore the rising sun."},
      {label:'Verse 5', text:"O God, our help in ages past,\nOur hope for years to come,\nBe Thou our guard while troubles last,\nAnd our eternal home."},
    ]},
  { num:4,   title:'All Things Bright and Beautiful', author:'Cecil Frances Alexander (1848)',category:'Creation',            key:'G',
    verses:[
      {label:'Chorus',  text:"All things bright and beautiful,\nAll creatures great and small,\nAll things wise and wonderful,\nThe Lord God made them all."},
      {label:'Verse 1', text:"Each little flower that opens,\nEach little bird that sings,\nHe made their glowing colours,\nHe made their tiny wings."},
      {label:'Verse 2', text:"The purple-headed mountain,\nThe river running by,\nThe sunset and the morning\nThat brightens up the sky."},
      {label:'Verse 3', text:"The cold wind in the winter,\nThe pleasant summer sun,\nThe ripe fruits in the garden,\nHe made them every one."},
      {label:'Verse 4', text:"He gave us eyes to see them,\nAnd lips that we might tell\nHow great is God Almighty,\nWho has made all things well."},
    ]},
  { num:5,   title:'Abide With Me',                   author:'Henry Francis Lyte (1847)',    category:'Evening',             key:'Eb',
    verses:[
      {label:'Verse 1', text:"Abide with me; fast falls the eventide;\nThe darkness deepens; Lord, with me abide.\nWhen other helpers fail and comforts flee,\nHelp of the helpless, O abide with me."},
      {label:'Verse 2', text:"Swift to its close ebbs out life's little day;\nEarth's joys grow dim, its glories pass away;\nChange and decay in all around I see;\nO Thou who changest not, abide with me."},
      {label:'Verse 3', text:"I need Thy presence every passing hour;\nWhat but Thy grace can foil the tempter's power?\nWho, like Thyself, my guide and stay can be?\nThrough cloud and sunshine, Lord, abide with me."},
      {label:'Verse 4', text:"I fear no foe, with Thee at hand to bless;\nIlls have no weight, and tears no bitterness;\nWhere is death's sting? Where, grave, thy victory?\nI triumph still, if Thou abide with me."},
      {label:'Verse 5', text:"Hold Thou Thy cross before my closing eyes;\nShine through the gloom and point me to the skies;\nHeaven's morning breaks, and earth's vain shadows flee;\nIn life, in death, O Lord, abide with me."},
    ]},
  { num:6,   title:'Praise, My Soul, the King of Heaven', author:'Henry Francis Lyte (1834)', category:'Praise',            key:'D',
    verses:[
      {label:'Verse 1', text:"Praise, my soul, the King of heaven;\nTo His feet thy tribute bring;\nRansomed, healed, restored, forgiven,\nWho like me His praise should sing?\nPraise Him! Praise Him!\nPraise the everlasting King!"},
      {label:'Verse 2', text:"Praise Him for His grace and favour\nTo our fathers in distress;\nPraise Him still the same as ever,\nSlow to chide and swift to bless.\nPraise Him! Praise Him!\nGlorious in His faithfulness!"},
      {label:'Verse 3', text:"Father-like He tends and spares us;\nWell our feeble frame He knows;\nIn His hands He gently bears us,\nRescues us from all our foes.\nPraise Him! Praise Him!\nWidely as His mercy flows!"},
      {label:'Verse 4', text:"Angels, help us to adore Him;\nYe behold Him face to face;\nSun and moon, bow down before Him;\nDwellers all in time and space.\nPraise Him! Praise Him!\nPraise with us the God of grace!"},
    ]},
  { num:7,   title:'The Church\'s One Foundation',    author:'Samuel J. Stone (1866)',       category:'The Church',          key:'Eb',
    verses:[
      {label:'Verse 1', text:"The Church's one foundation\nIs Jesus Christ her Lord;\nShe is His new creation\nBy water and the Word.\nFrom heaven He came and sought her\nTo be His holy bride;\nWith His own blood He bought her,\nAnd for her life He died."},
      {label:'Verse 2', text:"Elect from every nation,\nYet one o'er all the earth;\nHer charter of salvation,\nOne Lord, one faith, one birth;\nOne holy Name she blesses,\nPartakes one holy food,\nAnd to one hope she presses,\nWith every grace endued."},
      {label:'Verse 3', text:"'Mid toil and tribulation,\nAnd tumult of her war,\nShe waits the consummation\nOf peace for evermore;\nTill, with the vision glorious,\nHer longing eyes are blest,\nAnd the great Church victorious\nShall be the Church at rest."},
    ]},
  { num:8,   title:'Onward, Christian Soldiers',      author:'Sabine Baring-Gould (1865)',   category:'Warfare',             key:'Eb',
    verses:[
      {label:'Verse 1', text:"Onward, Christian soldiers,\nMarching as to war,\nWith the cross of Jesus\nGoing on before!\nChrist, the royal Master,\nLeads against the foe;\nForward into battle\nSee His banners go!"},
      {label:'Chorus',  text:"Onward, Christian soldiers,\nMarching as to war,\nWith the cross of Jesus\nGoing on before!"},
      {label:'Verse 2', text:"Like a mighty army\nMoves the church of God;\nBrothers, we are treading\nWhere the saints have trod;\nWe are not divided,\nAll one body we,\nOne in hope and doctrine,\nOne in charity."},
      {label:'Verse 3', text:"Crowns and thrones may perish,\nKingdoms rise and wane,\nBut the Church of Jesus\nConstant will remain;\nGates of hell can never\n'Gainst that Church prevail;\nWe have Christ's own promise,\nAnd that cannot fail."},
    ]},
  { num:9,   title:'Lead, Kindly Light',              author:'John Henry Newman (1833)',     category:'Guidance',            key:'Eb',
    verses:[
      {label:'Verse 1', text:"Lead, kindly Light, amid the encircling gloom,\nLead Thou me on!\nThe night is dark, and I am far from home;\nLead Thou me on!\nKeep Thou my feet; I do not ask to see\nThe distant scene — one step enough for me."},
      {label:'Verse 2', text:"I was not ever thus, nor prayed that Thou\nShouldst lead me on;\nI loved to choose and see my path; but now\nLead Thou me on!\nI loved the garish day, and, spite of fears,\nPride ruled my will: remember not past years."},
      {label:'Verse 3', text:"So long Thy power hath blest me, sure it still\nWill lead me on\nO'er moor and fen, o'er crag and torrent, till\nThe night is gone;\nAnd with the morn those angel faces smile\nWhich I have loved long since, and lost awhile."},
    ]},
  { num:10,  title:'Now Thank We All Our God',        author:'Martin Rinkart (1636)',        category:'Thanksgiving',        key:'C',
    verses:[
      {label:'Verse 1', text:"Now thank we all our God,\nWith heart and hands and voices,\nWho wondrous things hath done,\nIn whom His world rejoices;\nWho from our mother's arms\nHath blessed us on our way\nWith countless gifts of love,\nAnd still is ours today."},
      {label:'Verse 2', text:"O may this bounteous God\nThrough all our life be near us,\nWith ever joyful hearts\nAnd blessed peace to cheer us;\nAnd keep us in His grace,\nAnd guide us when perplexed,\nAnd free us from all ills\nIn this world and the next."},
      {label:'Verse 3', text:"All praise and thanks to God\nThe Father now be given,\nThe Son, and Him who reigns\nWith them in highest heaven,\nThe one eternal God,\nWhom earth and heaven adore;\nFor thus it was, is now,\nAnd shall be evermore."},
    ]},
  { num:11,  title:'O Come, All Ye Faithful',         author:'John Francis Wade (1743)',     category:'Christmas',           key:'G',
    verses:[
      {label:'Verse 1', text:"O come, all ye faithful,\nJoyful and triumphant,\nO come ye, O come ye to Bethlehem;\nCome and behold Him,\nBorn the King of angels."},
      {label:'Chorus',  text:"O come, let us adore Him,\nO come, let us adore Him,\nO come, let us adore Him,\nChrist the Lord!"},
      {label:'Verse 2', text:"Sing, choirs of angels,\nSing in exultation,\nSing, all ye citizens of heaven above;\nGlory to God\nIn the highest."},
      {label:'Verse 3', text:"Yea, Lord, we greet Thee,\nBorn this happy morning;\nJesu, to Thee be glory given;\nWord of the Father,\nNow in flesh appearing."},
    ]},
  { num:12,  title:'Hark! The Herald Angels Sing',    author:'Charles Wesley (1739)',        category:'Christmas',           key:'F',
    verses:[
      {label:'Verse 1', text:"Hark! the herald angels sing,\n\"Glory to the newborn King;\nPeace on earth, and mercy mild,\nGod and sinners reconciled!\"\nJoyful, all ye nations, rise,\nJoin the triumph of the skies;\nWith the angelic host proclaim:\n\"Christ is born in Bethlehem!\""},
      {label:'Chorus',  text:"Hark! the herald angels sing,\n\"Glory to the newborn King!\""},
      {label:'Verse 2', text:"Christ, by highest heaven adored;\nChrist, the everlasting Lord;\nLate in time behold Him come,\nOffspring of a virgin's womb.\nVeiled in flesh the Godhead see;\nHail the incarnate Deity,\nPleased as man with man to dwell,\nJesus, our Emmanuel."},
      {label:'Verse 3', text:"Hail the heaven-born Prince of Peace!\nHail the Son of Righteousness!\nLight and life to all He brings,\nRisen with healing in His wings.\nMild He lays His glory by,\nBorn that man no more may die,\nBorn to raise the sons of earth,\nBorn to give them second birth."},
    ]},
  { num:13,  title:'O Little Town of Bethlehem',      author:'Phillips Brooks (1868)',       category:'Christmas',           key:'F',
    verses:[
      {label:'Verse 1', text:"O little town of Bethlehem,\nHow still we see thee lie!\nAbove thy deep and dreamless sleep\nThe silent stars go by.\nYet in thy dark streets shineth\nThe everlasting Light;\nThe hopes and fears of all the years\nAre met in thee tonight."},
      {label:'Verse 2', text:"For Christ is born of Mary;\nAnd gathered all above,\nWhile mortals sleep, the angels keep\nTheir watch of wondering love.\nO morning stars, together\nProclaim the holy birth!\nAnd praises sing to God the King,\nAnd peace to men on earth."},
      {label:'Verse 3', text:"How silently, how silently,\nThe wondrous gift is given!\nSo God imparts to human hearts\nThe blessings of His heaven.\nNo ear may hear His coming,\nBut in this world of sin,\nWhere meek souls will receive Him still,\nThe dear Christ enters in."},
    ]},
  { num:14,  title:'Silent Night',                    author:'Joseph Mohr (1818)',           category:'Christmas',           key:'Bb',
    verses:[
      {label:'Verse 1', text:"Silent night, holy night,\nAll is calm, all is bright\nRound yon virgin mother and Child.\nHoly Infant, so tender and mild,\nSleep in heavenly peace,\nSleep in heavenly peace."},
      {label:'Verse 2', text:"Silent night, holy night,\nShepherds quake at the sight;\nGlories stream from heaven afar,\nHeavenly hosts sing Alleluia!\nChrist the Savior is born,\nChrist the Savior is born!"},
      {label:'Verse 3', text:"Silent night, holy night,\nSon of God, love's pure light;\nRadiant beams from Thy holy face\nWith the dawn of redeeming grace,\nJesus, Lord, at Thy birth,\nJesus, Lord, at Thy birth."},
    ]},
  { num:15,  title:'When I Survey the Wondrous Cross', author:'Isaac Watts (1707)',          category:'Passion',             key:'Eb',
    verses:[
      {label:'Verse 1', text:"When I survey the wondrous cross\nOn which the Prince of glory died,\nMy richest gain I count but loss,\nAnd pour contempt on all my pride."},
      {label:'Verse 2', text:"Forbid it, Lord, that I should boast,\nSave in the death of Christ my God!\nAll the vain things that charm me most,\nI sacrifice them to His blood."},
      {label:'Verse 3', text:"See from His head, His hands, His feet,\nSorrow and love flow mingled down!\nDid e'er such love and sorrow meet,\nOr thorns compose so rich a crown?"},
      {label:'Verse 4', text:"Were the whole realm of nature mine,\nThat were a present far too small;\nLove so amazing, so divine,\nDemands my soul, my life, my all."},
    ]},
  { num:16,  title:'There Is a Green Hill Far Away',  author:'Cecil Frances Alexander (1848)',category:'Passion',            key:'D',
    verses:[
      {label:'Verse 1', text:"There is a green hill far away,\nWithout a city wall,\nWhere the dear Lord was crucified\nWho died to save us all."},
      {label:'Verse 2', text:"We may not know, we cannot tell,\nWhat pains He had to bear,\nBut we believe it was for us\nHe hung and suffered there."},
      {label:'Verse 3', text:"He died that we might be forgiven,\nHe died to make us good,\nThat we might go at last to heaven,\nSaved by His precious blood."},
      {label:'Verse 4', text:"O, dearly, dearly has He loved!\nAnd we must love Him too,\nAnd trust in His redeeming blood,\nAnd try His works to do."},
    ]},
  { num:17,  title:'Jesus Christ Is Risen Today',     author:'Lyra Davidica (1708)',         category:'Easter',              key:'D',
    verses:[
      {label:'Verse 1', text:"Jesus Christ is risen today, Alleluia!\nOur triumphant holy day, Alleluia!\nWho did once upon the cross, Alleluia!\nSuffer to redeem our loss. Alleluia!"},
      {label:'Verse 2', text:"Hymns of praise then let us sing, Alleluia!\nUnto Christ, our heavenly King, Alleluia!\nWho endured the cross and grave, Alleluia!\nSinners to redeem and save. Alleluia!"},
      {label:'Verse 3', text:"But the pains which He endured, Alleluia!\nOur salvation have procured, Alleluia!\nNow above the sky He's King, Alleluia!\nWhere the angels ever sing. Alleluia!"},
    ]},
  { num:18,  title:'Thine Is the Glory',              author:'Edmond Budry (1884)',          category:'Easter',              key:'Bb',
    verses:[
      {label:'Verse 1', text:"Thine is the glory, risen, conquering Son;\nEndless is the victory Thou o'er death hast won;\nAngels in bright raiment rolled the stone away,\nKept the folded grave-clothes where Thy body lay."},
      {label:'Chorus',  text:"Thine is the glory, risen, conquering Son,\nEndless is the victory Thou o'er death hast won!"},
      {label:'Verse 2', text:"Lo! Jesus meets us, risen from the tomb;\nLoving-ly He greets us, scatters fear and gloom;\nLet the Church with gladness hymns of triumph sing,\nFor her Lord now liveth; death hath lost its sting."},
      {label:'Verse 3', text:"No more we doubt Thee, glorious Prince of life;\nLife is naught without Thee; aid us in our strife;\nMake us more than conquerors through Thy deathless love;\nBring us safe through Jordan to Thy home above."},
    ]},
  { num:19,  title:'Come, Holy Ghost, Our Souls Inspire', author:'Veni Creator (9th cent.)', category:'Holy Spirit',         key:'F',
    verses:[
      {label:'Verse 1', text:"Come, Holy Ghost, our souls inspire,\nAnd lighten with celestial fire;\nThou the anointing Spirit art,\nWho dost Thy sevenfold gifts impart."},
      {label:'Verse 2', text:"Thy blessed unction from above\nIs comfort, life, and fire of love;\nEnable with perpetual light\nThe dullness of our blinded sight."},
      {label:'Verse 3', text:"Anoint and cheer our soiled face\nWith the abundance of Thy grace;\nKeep far our foes, give peace at home;\nWhere Thou art guide no ill can come."},
      {label:'Verse 4', text:"Teach us to know the Father, Son,\nAnd Thee, of both, to be but One;\nThat through the ages all along\nThis may be our endless song:"},
      {label:'Doxology', text:"Praise to Thy eternal merit,\nFather, Son, and Holy Spirit."},
    ]},
  { num:20,  title:'Love Divine, All Loves Excelling', author:'Charles Wesley (1747)',       category:'Love of God',         key:'Bb',
    verses:[
      {label:'Verse 1', text:"Love divine, all loves excelling,\nJoy of heaven, to earth come down;\nFix in us Thy humble dwelling;\nAll Thy faithful mercies crown!\nJesu, Thou art all compassion,\nPure unbounded love Thou art;\nVisit us with Thy salvation;\nEnter every trembling heart."},
      {label:'Verse 2', text:"Breathe, O breathe Thy loving Spirit\nInto every troubled breast!\nLet us all in Thee inherit;\nLet us find that second rest.\nTake away our bent to sinning;\nAlpha and Omega be;\nEnd of faith, as its beginning,\nSet our hearts at liberty."},
      {label:'Verse 3', text:"Finish, then, Thy new creation;\nPure and spotless let us be.\nLet us see Thy great salvation\nPerfectly restored in Thee;\nChanged from glory into glory,\nTill in heaven we take our place,\nTill we cast our crowns before Thee,\nLost in wonder, love, and praise."},
    ]},
  { num:21,  title:'Rock of Ages',                    author:'Augustus M. Toplady (1776)',   category:'Grace & Salvation',   key:'Bb',
    verses:[
      {label:'Verse 1', text:"Rock of Ages, cleft for me,\nLet me hide myself in Thee;\nLet the water and the blood,\nFrom Thy wounded side which flowed,\nBe of sin the double cure;\nSave from wrath and make me pure."},
      {label:'Verse 2', text:"Not the labour of my hands\nCan fulfil Thy law's demands;\nCould my zeal no respite know,\nCould my tears forever flow,\nAll for sin could not atone;\nThou must save, and Thou alone."},
      {label:'Verse 3', text:"Nothing in my hand I bring,\nSimply to the cross I cling;\nNaked, come to Thee for dress;\nHelpless, look to Thee for grace;\nFoul, I to the fountain fly;\nWash me, Savior, or I die."},
      {label:'Verse 4', text:"While I draw this fleeting breath,\nWhen mine eyes shall close in death,\nWhen I soar to worlds unknown,\nSee Thee on Thy judgment throne,\nRock of Ages, cleft for me,\nLet me hide myself in Thee."},
    ]},
  { num:22,  title:'Just As I Am',                    author:'Charlotte Elliott (1835)',     category:'Grace & Salvation',   key:'Eb',
    verses:[
      {label:'Verse 1', text:"Just as I am, without one plea,\nBut that Thy blood was shed for me,\nAnd that Thou bidst me come to Thee,\nO Lamb of God, I come, I come."},
      {label:'Verse 2', text:"Just as I am, and waiting not\nTo rid my soul of one dark blot,\nTo Thee whose blood can cleanse each spot,\nO Lamb of God, I come, I come."},
      {label:'Verse 3', text:"Just as I am, though tossed about\nWith many a conflict, many a doubt,\nFightings and fears within, without,\nO Lamb of God, I come, I come."},
      {label:'Verse 4', text:"Just as I am, Thou wilt receive,\nWilt welcome, pardon, cleanse, relieve;\nBecause Thy promise I believe,\nO Lamb of God, I come, I come."},
    ]},
  { num:23,  title:'Amazing Grace',                   author:'John Newton (1779)',           category:'Grace & Salvation',   key:'G',
    verses:[
      {label:'Verse 1', text:"Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see."},
      {label:'Verse 2', text:"'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed."},
      {label:'Verse 3', text:"Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home."},
      {label:'Verse 4', text:"The Lord has promised good to me,\nHis Word my hope secures;\nHe will my shield and portion be,\nAs long as life endures."},
      {label:'Verse 5', text:"When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we'd first begun."},
    ]},
  { num:24,  title:'Crown Him with Many Crowns',      author:'Matthew Bridges (1851)',       category:'Praise',              key:'Eb',
    verses:[
      {label:'Verse 1', text:"Crown Him with many crowns,\nThe Lamb upon His throne;\nHark! how the heavenly anthem drowns\nAll music but its own!\nAwake, my soul, and sing\nOf Him who died for thee,\nAnd hail Him as thy matchless King\nThrough all eternity."},
      {label:'Verse 2', text:"Crown Him the Lord of love;\nBehold His hands and side,\nRich wounds, yet visible above,\nIn beauty glorified;\nNo angel in the sky\nCan fully bear that sight,\nBut downward bends his burning eye\nAt mysteries so bright."},
      {label:'Verse 3', text:"Crown Him the Lord of years,\nThe Potentate of time;\nCreator of the rolling spheres,\nIneffably sublime.\nAll hail, Redeemer, hail!\nFor Thou hast died for me;\nThy praise shall never, never fail\nThroughout eternity."},
    ]},
  { num:25,  title:'To God Be the Glory',             author:'Fanny J. Crosby (1875)',       category:'Praise',              key:'Bb',
    verses:[
      {label:'Verse 1', text:"To God be the glory, great things He hath taught us,\nGreat things He hath done, and great our rejoicing\nThrough Jesus the Son;\nBut purer, and higher, and greater will be\nOur wonder, our transport, when Jesus we see."},
      {label:'Chorus',  text:"Praise the Lord, praise the Lord,\nLet the earth hear His voice!\nPraise the Lord, praise the Lord,\nLet the people rejoice!\nO come to the Father, through Jesus the Son,\nAnd give Him the glory, great things He hath done."},
      {label:'Verse 2', text:"O perfect redemption, the purchase of blood,\nTo every believer the promise of God;\nThe vilest offender who truly believes,\nThat moment from Jesus a pardon receives."},
    ]},
  { num:26,  title:'Great Is Thy Faithfulness',       author:'Thomas O. Chisholm (1923)',    category:'Faith & Trust',       key:'Bb',
    verses:[
      {label:'Verse 1', text:"Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be."},
      {label:'Chorus',  text:"Great is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided—\nGreat is Thy faithfulness, Lord, unto me!"},
      {label:'Verse 2', text:"Summer and winter, and springtime and harvest,\nSun, moon and stars in their courses above,\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love."},
      {label:'Verse 3', text:"Pardon for sin and a peace that endureth,\nThine own dear presence to cheer and to guide;\nStrength for today and bright hope for tomorrow,\nBlessings all mine, with ten thousand beside!"},
    ]},
  { num:27,  title:'What a Friend We Have in Jesus',  author:'Joseph M. Scriven (1855)',     category:'Prayer',              key:'F',
    verses:[
      {label:'Verse 1', text:"What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!\nO what peace we often forfeit,\nO what needless pain we bear,\nAll because we do not carry\nEverything to God in prayer!"},
      {label:'Verse 2', text:"Have we trials and temptations?\nIs there trouble anywhere?\nWe should never be discouraged;\nTake it to the Lord in prayer!\nCan we find a friend so faithful\nWho will all our sorrows share?\nJesus knows our every weakness;\nTake it to the Lord in prayer!"},
      {label:'Verse 3', text:"Are we weak and heavy laden,\nCumbered with a load of care?\nPrecious Savior, still our refuge;\nTake it to the Lord in prayer!\nDo thy friends despise, forsake thee?\nTake it to the Lord in prayer!\nIn His arms He'll take and shield thee;\nThou wilt find a solace there."},
    ]},
  { num:28,  title:'Blessed Assurance',               author:'Fanny J. Crosby (1873)',       category:'Faith & Trust',       key:'D',
    verses:[
      {label:'Verse 1', text:"Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood."},
      {label:'Chorus',  text:"This is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long."},
      {label:'Verse 2', text:"Perfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending bring from above\nEchoes of mercy, whispers of love."},
      {label:'Verse 3', text:"Perfect submission, all is at rest,\nI in my Savior am happy and blest,\nWatching and waiting, looking above,\nFilled with His goodness, lost in His love."},
    ]},
  { num:29,  title:'It Is Well with My Soul',         author:'Horatio G. Spafford (1873)',   category:'Comfort & Peace',     key:'Bb',
    verses:[
      {label:'Verse 1', text:"When peace, like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul."},
      {label:'Chorus',  text:"It is well (it is well)\nWith my soul (with my soul)\nIt is well, it is well with my soul."},
      {label:'Verse 2', text:"Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ hath regarded my helpless estate,\nAnd hath shed His own blood for my soul."},
      {label:'Verse 3', text:"My sin, oh the bliss of this glorious thought!\nMy sin, not in part but the whole,\nIs nailed to the cross, and I bear it no more,\nPraise the Lord, praise the Lord, O my soul!"},
      {label:'Verse 4', text:"And, Lord, haste the day when my faith shall be sight,\nThe clouds be rolled back as a scroll;\nThe trump shall resound, and the Lord shall descend,\nEven so, it is well with my soul."},
    ]},
  { num:30,  title:'The Old Rugged Cross',            author:'George Bennard (1913)',        category:'Passion',             key:'Ab',
    verses:[
      {label:'Verse 1', text:"On a hill far away stood an old rugged cross,\nThe emblem of suffering and shame;\nAnd I love that old cross where the dearest and best\nFor a world of lost sinners was slain."},
      {label:'Chorus',  text:"So I'll cherish the old rugged cross,\nTill my trophies at last I lay down;\nI will cling to the old rugged cross,\nAnd exchange it some day for a crown."},
      {label:'Verse 2', text:"O that old rugged cross, so despised by the world,\nHas a wondrous attraction for me;\nFor the dear Lamb of God left His glory above\nTo bear it to dark Calvary."},
      {label:'Verse 3', text:"To the old rugged cross I will ever be true;\nIts shame and reproach gladly bear;\nThen He'll call me some day to my home far away,\nWhere His glory forever I'll share."},
    ]},
]

// ── Collection B: Sacred Songs & Solos (1,200 hymns) ─────────────
const HYMNS_SACRED_SONGS = [
  { num:1,   title:'Hold the Fort',                   author:'Philip P. Bliss (1870)',       category:'Warfare',             key:'G',
    verses:[
      {label:'Verse 1', text:"Ho, my comrades! see the signal\nWaving in the sky!\nReinforcements now appearing,\nVictory is nigh!"},
      {label:'Chorus',  text:"\"Hold the fort, for I am coming,\"\nJesus signals still;\nWave the answer back to heaven,\n\"By Thy grace we will.\""},
      {label:'Verse 2', text:"See the mighty host advancing,\nSatan leading on;\nMighty men around us falling,\nCourage almost gone!"},
      {label:'Verse 3', text:"See the glorious banner waving!\nHear the trumpet blow!\nIn our Leader's name we'll triumph\nOver every foe."},
    ]},
  { num:2,   title:'Almost Persuaded',                author:'Philip P. Bliss (1871)',       category:'Invitation',          key:'Eb',
    verses:[
      {label:'Verse 1', text:"\"Almost persuaded\" now to believe;\n\"Almost persuaded\" Christ to receive;\nSeems now some soul to say,\n\"Go, Spirit, go Thy way,\nSome more convenient day\nOn Thee I'll call.\""},
      {label:'Verse 2', text:"\"Almost persuaded,\" come, come today;\n\"Almost persuaded,\" turn not away;\nJesus invites you here,\nAngels are lingering near,\nPrayers rise from hearts so dear;\nO wanderer, come!"},
      {label:'Verse 3', text:"\"Almost persuaded,\" harvest is past!\n\"Almost persuaded,\" doom comes at last!\n\"Almost\" cannot avail;\n\"Almost\" is but to fail!\nSad, sad, that bitter wail—\n\"Almost,\" but lost!"},
    ]},
  { num:3,   title:'Whosoever Will',                  author:'Philip P. Bliss (1870)',       category:'Invitation',          key:'G',
    verses:[
      {label:'Verse 1', text:"\"Whosoever heareth,\" shout, shout the sound!\nSpread the blessed tidings all the world around;\nTell the joyful news wherever man is found,\n\"Whosoever will may come.\""},
      {label:'Chorus',  text:"\"Whosoever will, whosoever will!\"\nSend the proclamation over vale and hill;\n'Tis a loving Father calls the wanderer home:\n\"Whosoever will may come.\""},
      {label:'Verse 2', text:"Whosoever cometh need not delay,\nNow the door is open, enter while you may;\nJesus is the true, the only Living Way:\n\"Whosoever will may come.\""},
    ]},
  { num:4,   title:'Let the Lower Lights Be Burning', author:'Philip P. Bliss (1871)',       category:'Service',             key:'F',
    verses:[
      {label:'Verse 1', text:"Brightly beams our Father's mercy\nFrom His lighthouse evermore,\nBut to us He gives the keeping\nOf the lights along the shore."},
      {label:'Chorus',  text:"Let the lower lights be burning!\nSend a gleam across the wave!\nSome poor fainting, struggling seaman\nYou may rescue, you may save."},
      {label:'Verse 2', text:"Dark the night of sin has settled,\nLoud the angry billows roar;\nEager eyes are watching, longing,\nFor the lights along the shore."},
      {label:'Verse 3', text:"Trim your feeble lamp, my brother!\nSome poor sailor tempest-tossed,\nTrying now to make the harbor,\nIn the darkness may be lost."},
    ]},
  { num:5,   title:'I Will Sing of My Redeemer',      author:'Philip P. Bliss (1876)',       category:'Praise',              key:'D',
    verses:[
      {label:'Verse 1', text:"I will sing of my Redeemer\nAnd His wondrous love to me;\nOn the cruel cross He suffered,\nFrom the curse to set me free."},
      {label:'Chorus',  text:"Sing, oh, sing of my Redeemer,\nWith His blood He purchased me;\nOn the cross He sealed my pardon,\nPaid the debt and made me free."},
      {label:'Verse 2', text:"I will tell the wondrous story,\nHow my lost estate to save,\nIn His boundless love and mercy,\nHe the ransom freely gave."},
      {label:'Verse 3', text:"I will praise my dear Redeemer,\nHis triumphant power I'll tell,\nHow the victory He giveth\nOver sin and death and hell."},
    ]},
  { num:6,   title:'Jesus Saves',                     author:'Priscilla J. Owens (1882)',    category:'Evangelism',          key:'G',
    verses:[
      {label:'Verse 1', text:"We have heard the joyful sound:\nJesus saves! Jesus saves!\nSpread the tidings all around:\nJesus saves! Jesus saves!\nBear the news to every land,\nClimb the steeps and cross the waves;\nOnward! 'tis our Lord's command;\nJesus saves! Jesus saves!"},
      {label:'Verse 2', text:"Waft it on the rolling tide:\nJesus saves! Jesus saves!\nTell to sinners far and wide:\nJesus saves! Jesus saves!\nSing, ye islands of the sea;\nEcho back, ye ocean caves;\nEarth shall keep her jubilee:\nJesus saves! Jesus saves!"},
      {label:'Verse 3', text:"Give the winds a mighty voice:\nJesus saves! Jesus saves!\nLet the nations now rejoice:\nJesus saves! Jesus saves!\nShout salvation full and free,\nHighest hills and deepest caves;\nThis our song of victory:\nJesus saves! Jesus saves!"},
    ]},
  { num:7,   title:'Will There Be Any Stars?',        author:'Eliza E. Hewitt (1897)',       category:'Heaven',              key:'Bb',
    verses:[
      {label:'Verse 1', text:"I am thinking today of that beautiful land\nI shall reach when the sun goeth down;\nWhen through wonderful grace by my Savior I stand,\nWill there be any stars in my crown?"},
      {label:'Chorus',  text:"Will there be any stars, any stars in my crown,\nWhen at evening the sun goeth down?\nWhen I wake with the blest in the mansions of rest,\nWill there be any stars in my crown?"},
      {label:'Verse 2', text:"In the strength of the Lord let me labour and pray,\nLet me watch as a winner of souls;\nThat bright stars may be mine in the glorious day,\nWhen His praise like the sea-billow rolls."},
    ]},
  { num:8,   title:'Rescue the Perishing',            author:'Fanny J. Crosby (1869)',       category:'Evangelism',          key:'Bb',
    verses:[
      {label:'Verse 1', text:"Rescue the perishing,\nCare for the dying,\nSnatch them in pity from sin and the grave;\nWeep o'er the erring one,\nLift up the fallen,\nTell them of Jesus, the mighty to save."},
      {label:'Chorus',  text:"Rescue the perishing,\nCare for the dying;\nJesus is merciful,\nJesus will save."},
      {label:'Verse 2', text:"Though they are slighting Him,\nStill He is waiting,\nWaiting the penitent child to receive;\nPlead with them earnestly,\nPlead with them gently;\nHe will forgive if they only believe."},
      {label:'Verse 3', text:"Down in the human heart,\nCrushed by the tempter,\nFeelings lie buried that grace can restore;\nTouched by a loving heart,\nWakened by kindness,\nChords that were broken will vibrate once more."},
    ]},
  { num:9,   title:'Safe in the Arms of Jesus',       author:'Fanny J. Crosby (1868)',       category:'Comfort',             key:'Eb',
    verses:[
      {label:'Verse 1', text:"Safe in the arms of Jesus,\nSafe on His gentle breast,\nThere by His love o'ershaded,\nSweetly my soul shall rest.\nHark! 'tis the voice of angels,\nBorne in a song to me,\nOver the fields of glory,\nOver the jasper sea."},
      {label:'Chorus',  text:"Safe in the arms of Jesus,\nSafe on His gentle breast,\nThere by His love o'ershaded,\nSweetly my soul shall rest."},
      {label:'Verse 2', text:"Safe in the arms of Jesus,\nSafe from corroding care,\nSafe from the world's temptations,\nSin cannot harm me there.\nFree from the blight of sorrow,\nFree from my doubts and fears;\nOnly a few more trials,\nOnly a few more tears!"},
    ]},
  { num:10,  title:'Pass Me Not, O Gentle Savior',    author:'Fanny J. Crosby (1868)',       category:'Invitation',          key:'F',
    verses:[
      {label:'Verse 1', text:"Pass me not, O gentle Savior,\nHear my humble cry;\nWhile on others Thou art calling,\nDo not pass me by."},
      {label:'Chorus',  text:"Savior, Savior,\nHear my humble cry;\nWhile on others Thou art calling,\nDo not pass me by."},
      {label:'Verse 2', text:"Let me at a throne of mercy\nFind a sweet relief;\nKneeling there in deep contrition,\nHelp my unbelief."},
      {label:'Verse 3', text:"Trusting only in Thy merit,\nWould I seek Thy face;\nHeal my wounded, broken spirit,\nSave me by Thy grace."},
    ]},
  { num:11,  title:'To the Work',                     author:'Fanny J. Crosby (1869)',       category:'Service',             key:'G',
    verses:[
      {label:'Verse 1', text:"To the work! to the work! we are servants of God,\nLet us follow the path that our Master has trod;\nWith the balm of His counsel our strength to renew,\nLet us do with our might what our hands find to do."},
      {label:'Chorus',  text:"Toiling on, toiling on,\nToiling on, toiling on;\nLet us hope, let us watch,\nAnd labour till the Master comes."},
      {label:'Verse 2', text:"To the work! to the work! let the hungry be fed;\nTo the fountain of life let the weary be led;\nIn the cross and its banner our glory shall be,\nWhile we herald the tidings, \"Salvation is free!\""},
    ]},
  { num:12,  title:'Throw Out the Life-Line',         author:'Edward S. Ufford (1884)',      category:'Evangelism',          key:'Bb',
    verses:[
      {label:'Verse 1', text:"Throw out the life-line across the dark wave,\nThere is a brother whom someone should save;\nSomebody's brother! oh, who then will dare\nTo throw out the life-line, his peril to share?"},
      {label:'Chorus',  text:"Throw out the life-line! Throw out the life-line!\nSomeone is drifting away;\nThrow out the life-line! Throw out the life-line!\nSomeone is sinking today."},
      {label:'Verse 2', text:"Throw out the life-line with hand quick and strong;\nWhy do you tarry, why linger so long?\nSee! he is sinking; oh, hasten today—\nAnd out with the life-boat! away, then, away!"},
    ]},
  { num:13,  title:'I Need Thee Every Hour',          author:'Annie S. Hawks (1872)',        category:'Prayer',              key:'D',
    verses:[
      {label:'Verse 1', text:"I need Thee every hour,\nMost gracious Lord;\nNo tender voice like Thine\nCan peace afford."},
      {label:'Chorus',  text:"I need Thee, oh, I need Thee;\nEvery hour I need Thee;\nO bless me now, my Savior,\nI come to Thee."},
      {label:'Verse 2', text:"I need Thee every hour,\nStay Thou nearby;\nTemptations lose their power\nWhen Thou art nigh."},
      {label:'Verse 3', text:"I need Thee every hour,\nIn joy or pain;\nCome quickly and abide,\nOr life is vain."},
      {label:'Verse 4', text:"I need Thee every hour,\nMost Holy One;\nOh, make me Thine indeed,\nThou blessed Son."},
    ]},
  { num:14,  title:'Standing on the Promises',        author:'R. Kelso Carter (1886)',       category:'Faith',               key:'Bb',
    verses:[
      {label:'Verse 1', text:"Standing on the promises of Christ my King,\nThrough eternal ages let His praises ring;\nGlory in the highest, I will shout and sing,\nStanding on the promises of God."},
      {label:'Chorus',  text:"Standing, standing,\nStanding on the promises of God my Savior;\nStanding, standing,\nI'm standing on the promises of God."},
      {label:'Verse 2', text:"Standing on the promises that cannot fail,\nWhen the howling storms of doubt and fear assail,\nBy the living Word of God I shall prevail,\nStanding on the promises of God."},
      {label:'Verse 3', text:"Standing on the promises of Christ the Lord,\nBound to Him eternally by love's strong cord,\nOvercoming daily with the Spirit's sword,\nStanding on the promises of God."},
    ]},
  { num:15,  title:'Leaning on the Everlasting Arms', author:'Elisha A. Hoffman (1887)',     category:'Trust',               key:'G',
    verses:[
      {label:'Verse 1', text:"What a fellowship, what a joy divine,\nLeaning on the everlasting arms;\nWhat a blessedness, what a peace is mine,\nLeaning on the everlasting arms."},
      {label:'Chorus',  text:"Leaning, leaning,\nSafe and secure from all alarms;\nLeaning, leaning,\nLeaning on the everlasting arms."},
      {label:'Verse 2', text:"O how sweet to walk in this pilgrim way,\nLeaning on the everlasting arms;\nO how bright the path grows from day to day,\nLeaning on the everlasting arms."},
      {label:'Verse 3', text:"What have I to dread, what have I to fear,\nLeaning on the everlasting arms?\nI have blessed peace with my Lord so near,\nLeaning on the everlasting arms."},
    ]},
  { num:16,  title:'When the Roll Is Called Up Yonder', author:'James M. Black (1893)',      category:'Heaven',              key:'Bb',
    verses:[
      {label:'Verse 1', text:"When the trumpet of the Lord shall sound,\nAnd time shall be no more,\nAnd the morning breaks, eternal, bright and fair;\nWhen the saved of earth shall gather\nOver on the other shore,\nAnd the roll is called up yonder, I'll be there."},
      {label:'Chorus',  text:"When the roll is called up yonder,\nWhen the roll is called up yonder,\nWhen the roll is called up yonder,\nWhen the roll is called up yonder, I'll be there."},
      {label:'Verse 2', text:"On that bright and cloudless morning\nWhen the dead in Christ shall rise,\nAnd the glory of His resurrection share;\nWhen His chosen ones shall gather\nTo their home beyond the skies,\nAnd the roll is called up yonder, I'll be there."},
    ]},
  { num:17,  title:'I Surrender All',                 author:'J. W. Van DeVenter (1896)',    category:'Consecration',        key:'F',
    verses:[
      {label:'Verse 1', text:"All to Jesus I surrender,\nAll to Him I freely give;\nI will ever love and trust Him,\nIn His presence daily live."},
      {label:'Chorus',  text:"I surrender all, I surrender all;\nAll to Thee, my blessed Savior,\nI surrender all."},
      {label:'Verse 2', text:"All to Jesus I surrender,\nHumbly at His feet I bow;\nWorldly pleasures all forsaken,\nTake me, Jesus, take me now."},
      {label:'Verse 3', text:"All to Jesus I surrender,\nMake me, Savior, wholly Thine;\nLet me feel Thy Holy Spirit,\nTruly know that Thou art mine."},
    ]},
  { num:18,  title:'Have Thine Own Way, Lord',        author:'Adelaide A. Pollard (1907)',   category:'Consecration',        key:'G',
    verses:[
      {label:'Verse 1', text:"Have Thine own way, Lord! Have Thine own way!\nThou art the Potter, I am the clay.\nMold me and make me after Thy will,\nWhile I am waiting, yielded and still."},
      {label:'Verse 2', text:"Have Thine own way, Lord! Have Thine own way!\nSearch me and try me, Master, today!\nWhiter than snow, Lord, wash me just now,\nAs in Thy presence humbly I bow."},
      {label:'Verse 3', text:"Have Thine own way, Lord! Have Thine own way!\nWounded and weary, help me, I pray!\nPower, all power, surely is Thine!\nTouch me and heal me, Savior divine!"},
      {label:'Verse 4', text:"Have Thine own way, Lord! Have Thine own way!\nHold o'er my being absolute sway!\nFill with Thy Spirit till all shall see\nChrist only, always, living in me!"},
    ]},
  { num:19,  title:"I'll Fly Away",                   author:'Albert E. Brumley (1929)',     category:'Heaven',              key:'G',
    verses:[
      {label:'Verse 1', text:"Some glad morning when this life is o'er,\nI'll fly away;\nTo a home on God's celestial shore,\nI'll fly away."},
      {label:'Chorus',  text:"I'll fly away, O glory,\nI'll fly away;\nWhen I die, hallelujah, by and by,\nI'll fly away."},
      {label:'Verse 2', text:"When the shadows of this life have grown,\nI'll fly away;\nLike a bird from prison bars has flown,\nI'll fly away."},
      {label:'Verse 3', text:"Just a few more weary days and then,\nI'll fly away;\nTo a land where joys shall never end,\nI'll fly away."},
    ]},
  { num:20,  title:'In the Sweet By and By',          author:'Sanford F. Bennett (1868)',    category:'Heaven',              key:'G',
    verses:[
      {label:'Verse 1', text:"There's a land that is fairer than day,\nAnd by faith we can see it afar;\nFor the Father waits over the way\nTo prepare us a dwelling place there."},
      {label:'Chorus',  text:"In the sweet by and by,\nWe shall meet on that beautiful shore;\nIn the sweet by and by,\nWe shall meet on that beautiful shore."},
      {label:'Verse 2', text:"We shall sing on that beautiful shore\nThe melodious songs of the blest;\nAnd our spirits shall sorrow no more,\nNot a sigh for the blessing of rest."},
      {label:'Verse 3', text:"To our bountiful Father above,\nWe will offer our tribute of praise\nFor the glorious gift of His love\nAnd the blessings that hallow our days."},
    ]},
  { num:21,  title:'Joy to the World',                author:'Isaac Watts (1719)',           category:'Christmas',           key:'D',
    verses:[
      {label:'Verse 1', text:"Joy to the world! The Lord is come;\nLet earth receive her King;\nLet every heart prepare Him room,\nAnd heaven and nature sing,\nAnd heaven and nature sing,\nAnd heaven, and heaven, and nature sing."},
      {label:'Verse 2', text:"Joy to the world! The Savior reigns;\nLet men their songs employ;\nWhile fields and floods, rocks, hills and plains\nRepeat the sounding joy,\nRepeat the sounding joy,\nRepeat, repeat the sounding joy."},
      {label:'Verse 3', text:"He rules the world with truth and grace,\nAnd makes the nations prove\nThe glories of His righteousness,\nAnd wonders of His love,\nAnd wonders of His love,\nAnd wonders, wonders of His love."},
    ]},
  { num:22,  title:"'Tis So Sweet to Trust in Jesus", author:'Louisa M. R. Stead (1882)',   category:'Trust',               key:'F',
    verses:[
      {label:'Verse 1', text:"'Tis so sweet to trust in Jesus,\nJust to take Him at His word;\nJust to rest upon His promise,\nJust to know, 'Thus saith the Lord.'"},
      {label:'Chorus',  text:"Jesus, Jesus, how I trust Him!\nHow I've proved Him o'er and o'er!\nJesus, Jesus, precious Jesus!\nO for grace to trust Him more!"},
      {label:'Verse 2', text:"O how sweet to trust in Jesus,\nJust to trust His cleansing blood;\nJust in simple faith to plunge me\n'Neath the healing, cleansing flood!"},
      {label:'Verse 3', text:"I'm so glad I learned to trust Thee,\nPrecious Jesus, Savior, Friend;\nAnd I know that Thou art with me,\nWilt be with me to the end."},
    ]},
  { num:23,  title:'Take My Life and Let It Be',      author:'Frances R. Havergal (1874)',   category:'Consecration',        key:'D',
    verses:[
      {label:'Verse 1', text:"Take my life, and let it be\nConse-crated, Lord, to Thee;\nTake my moments and my days;\nLet them flow in ceaseless praise."},
      {label:'Verse 2', text:"Take my hands, and let them move\nAt the impulse of Thy love;\nTake my feet, and let them be\nSwift and beautiful for Thee."},
      {label:'Verse 3', text:"Take my voice, and let me sing\nAlways, only, for my King;\nTake my lips, and let them be\nFilled with messages from Thee."},
      {label:'Verse 4', text:"Take my will, and make it Thine;\nIt shall be no longer mine;\nTake my heart, it is Thine own;\nIt shall be Thy royal throne."},
      {label:'Verse 5', text:"Take my love; my Lord, I pour\nAt Thy feet its treasure store;\nTake myself, and I will be\nEver, only, all for Thee."},
    ]},
  { num:24,  title:'Like a River Glorious',           author:'Frances R. Havergal (1876)',   category:'Peace',               key:'G',
    verses:[
      {label:'Verse 1', text:"Like a river glorious, is God's perfect peace,\nOver all victorious, in its bright increase;\nPerfect, yet it floweth, fuller every day,\nPerfect, yet it groweth, deeper all the way."},
      {label:'Chorus',  text:"Stayed upon Jehovah, hearts are fully blest\nFinding, as He promised, perfect peace and rest."},
      {label:'Verse 2', text:"Hidden in the hollow of His blessed hand,\nNever foe can follow, never traitor stand;\nNot a surge of worry, not a shade of care,\nNot a blast of hurry touch the spirit there."},
      {label:'Verse 3', text:"Every joy or trial falleth from above,\nTraced upon our dial by the Sun of Love;\nWe may trust Him fully all for us to do;\nThey who trust Him wholly find Him wholly true."},
    ]},
  { num:25,  title:'Jesus, Lover of My Soul',         author:'Charles Wesley (1740)',        category:'Trust',               key:'Ab',
    verses:[
      {label:'Verse 1', text:"Jesus, Lover of my soul,\nLet me to Thy bosom fly,\nWhile the nearer waters roll,\nWhile the tempest still is high;\nHide me, O my Savior, hide,\nTill the storm of life is past;\nSafe into the haven guide;\nO receive my soul at last!"},
      {label:'Verse 2', text:"Other refuge have I none,\nHangs my helpless soul on Thee;\nLeave, ah! leave me not alone,\nStill support and comfort me.\nAll my trust on Thee is stayed,\nAll my help from Thee I bring;\nCover my defenseless head\nWith the shadow of Thy wing."},
      {label:'Verse 3', text:"Plenteous grace with Thee is found,\nGrace to cover all my sin;\nLet the healing streams abound;\nMake and keep me pure within.\nThou of life the fountain art,\nFreely let me take of Thee;\nSpring Thou up within my heart;\nRise to all eternity."},
    ]},
    { num:26, title:'Grace Greater Than Our Sin', author:'Julia H. Johnston (1911)', category:'Grace', verses:[
      {label:'Verse 1', text:"Marvelous grace of our loving Lord,\nGrace that exceeds our sin and our guilt!\nYonder on Calvary's mount outpoured,\nThere where the blood of the Lamb was spilled."},
      {label:'Chorus',  text:"Grace, grace, God's grace,\nGrace that will pardon and cleanse within;\nGrace, grace, God's grace,\nGrace that is greater than all our sin!"},
      {label:'Verse 2', text:"Sin and despair, like the sea waves cold,\nThreaten the soul with infinite loss;\nGrace that is greater, yes, grace untold,\nPoints to the refuge, the mighty cross."},
      {label:'Verse 3', text:"Marvelous, infinite, matchless grace,\nFreely bestowed on all who believe!\nYou that are longing to see His face,\nWill you this moment His grace receive?"},
    ]},
  { num:27,  title:'There Is Power in the Blood',     author:'Lewis E. Jones (1899)',        category:'Salvation',           key:'G',
    verses:[
      {label:'Verse 1', text:"Would you be free from the burden of sin?\nThere's power in the blood, power in the blood;\nWould you o'er evil a victory win?\nThere's wonderful power in the blood."},
      {label:'Chorus',  text:"There is power, power, wonder-working power\nIn the blood of the Lamb;\nThere is power, power, wonder-working power\nIn the precious blood of the Lamb."},
      {label:'Verse 2', text:"Would you be free from your passion and pride?\nThere's power in the blood, power in the blood;\nCome for a cleansing to Calvary's tide;\nThere's wonderful power in the blood."},
      {label:'Verse 3', text:"Would you be whiter, much whiter than snow?\nThere's power in the blood, power in the blood;\nSin stains are lost in its life-giving flow;\nThere's wonderful power in the blood."},
    ]},
  { num:28,  title:'Nothing But the Blood',           author:'Robert Lowry (1876)',          category:'Salvation',           key:'D',
    verses:[
      {label:'Verse 1', text:"What can wash away my sin?\nNothing but the blood of Jesus;\nWhat can make me whole again?\nNothing but the blood of Jesus."},
      {label:'Chorus',  text:"Oh! precious is the flow\nThat makes me white as snow;\nNo other fount I know,\nNothing but the blood of Jesus."},
      {label:'Verse 2', text:"For my pardon, this I see,\nNothing but the blood of Jesus;\nFor my cleansing this my plea,\nNothing but the blood of Jesus."},
      {label:'Verse 3', text:"Nothing can for sin atone,\nNothing but the blood of Jesus;\nNaught of good that I have done,\nNothing but the blood of Jesus."},
    ]},
  { num:29,  title:'Shall We Gather at the River',    author:'Robert Lowry (1864)',          category:'Heaven',              key:'G',
    verses:[
      {label:'Verse 1', text:"Shall we gather at the river,\nWhere bright angel feet have trod,\nWith its crystal tide forever\nFlowing by the throne of God?"},
      {label:'Chorus',  text:"Yes, we'll gather at the river,\nThe beautiful, the beautiful river;\nGather with the saints at the river\nThat flows by the throne of God."},
      {label:'Verse 2', text:"On the margin of the river,\nWashing up its silver spray,\nWe will talk and worship ever,\nAll the happy golden day."},
      {label:'Verse 3', text:"Ere we reach the shining river,\nLay we every burden down;\nGrace our spirits will deliver,\nAnd provide a robe and crown."},
    ]},
  { num:30,  title:'My Faith Looks Up to Thee',       author:'Ray Palmer (1830)',            category:'Faith',               key:'Eb',
    verses:[
      {label:'Verse 1', text:"My faith looks up to Thee,\nThou Lamb of Calvary,\nSavior divine!\nNow hear me while I pray,\nTake all my guilt away,\nO let me from this day\nBe wholly Thine!"},
      {label:'Verse 2', text:"May Thy rich grace impart\nStrength to my fainting heart,\nMy zeal inspire!\nAs Thou hast died for me,\nO may my love to Thee\nPure, warm, and changeless be,\nA living fire!"},
      {label:'Verse 3', text:"While life's dark maze I tread,\nAnd griefs around me spread,\nBe Thou my guide;\nBid darkness turn to day,\nWipe sorrow's tears away,\nNor let me ever stray\nFrom Thee aside."},
      {label:'Verse 4', text:"When ends life's transient dream,\nWhen death's cold, sullen stream\nShall o'er me roll;\nBlest Savior, then in love,\nFear and distrust remove;\nO bear me safe above,\nA ransomed soul!"},
    ]},
]

// ── Derive categories per collection ─────────────────────────────
const AM_CATEGORIES  = ['All', ...Array.from(new Set(HYMNS_ANCIENT_MODERN.map(h => h.category)))]
const SS_CATEGORIES  = ['All', ...Array.from(new Set(HYMNS_SACRED_SONGS.map(h => h.category)))]

// ── 4. Bible Books ────────────────────────────────────────────────
const OLD_TESTAMENT = [
  {name:'Genesis',chapters:50},{name:'Exodus',chapters:40},{name:'Leviticus',chapters:27},
  {name:'Numbers',chapters:36},{name:'Deuteronomy',chapters:34},{name:'Joshua',chapters:24},
  {name:'Judges',chapters:21},{name:'Ruth',chapters:4},{name:'1 Samuel',chapters:31},
  {name:'2 Samuel',chapters:24},{name:'1 Kings',chapters:22},{name:'2 Kings',chapters:25},
  {name:'1 Chronicles',chapters:29},{name:'2 Chronicles',chapters:36},{name:'Ezra',chapters:10},
  {name:'Nehemiah',chapters:13},{name:'Esther',chapters:10},{name:'Job',chapters:42},
  {name:'Psalms',chapters:150},{name:'Proverbs',chapters:31},{name:'Ecclesiastes',chapters:12},
  {name:'Song of Solomon',chapters:8},{name:'Isaiah',chapters:66},{name:'Jeremiah',chapters:52},
  {name:'Lamentations',chapters:5},{name:'Ezekiel',chapters:48},{name:'Daniel',chapters:12},
  {name:'Hosea',chapters:14},{name:'Joel',chapters:3},{name:'Amos',chapters:9},
  {name:'Obadiah',chapters:1},{name:'Jonah',chapters:4},{name:'Micah',chapters:7},
  {name:'Nahum',chapters:3},{name:'Habakkuk',chapters:3},{name:'Zephaniah',chapters:3},
  {name:'Haggai',chapters:2},{name:'Zechariah',chapters:14},{name:'Malachi',chapters:4},
]
const NEW_TESTAMENT = [
  {name:'Matthew',chapters:28},{name:'Mark',chapters:16},{name:'Luke',chapters:24},
  {name:'John',chapters:21},{name:'Acts',chapters:28},{name:'Romans',chapters:16},
  {name:'1 Corinthians',chapters:16},{name:'2 Corinthians',chapters:13},{name:'Galatians',chapters:6},
  {name:'Ephesians',chapters:6},{name:'Philippians',chapters:4},{name:'Colossians',chapters:4},
  {name:'1 Thessalonians',chapters:5},{name:'2 Thessalonians',chapters:3},{name:'1 Timothy',chapters:6},
  {name:'2 Timothy',chapters:4},{name:'Titus',chapters:3},{name:'Philemon',chapters:1},
  {name:'Hebrews',chapters:13},{name:'James',chapters:5},{name:'1 Peter',chapters:5},
  {name:'2 Peter',chapters:3},{name:'1 John',chapters:5},{name:'2 John',chapters:1},
  {name:'3 John',chapters:1},{name:'Jude',chapters:1},{name:'Revelation',chapters:22},
]

// ── 5. Storage ────────────────────────────────────────────────────
const LS = {
  get: (k,fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb } catch { return fb } },
  set: (k,v)  => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

// ── 6. Text helpers ───────────────────────────────────────────────
const cleanText = t => t ? t.replace(/<[^>]*>/g,'').replace(/¶/g,'').replace(/\s+/g,' ').trim() : ''

function parseVerses(raw) {
  if (!raw) return []
  const cleaned = raw.replace(/<[^>]*>/g,'').replace(/¶/g,'')
  const matches = [...cleaned.matchAll(/\[(\d+)\]\s*([\s\S]*?)(?=\[\d+\]|$)/g)]
  if (!matches.length) {
    const t = cleaned.replace(/\s+/g,' ').trim()
    return t ? [{verse:1,text:t}] : []
  }
  return matches.map(m=>({verse:Number(m[1]),text:m[2].replace(/\s+/g,' ').trim()})).filter(v=>v.text.length>0)
}

// ── 7. Fetch ──────────────────────────────────────────────────────
async function fetchFromBibleApiCom(bookName, chapter, code) {
  const url = `https://bible-api.com/${encodeURIComponent(bookName.toLowerCase())}%20${chapter}?translation=${code}`
  const res  = await fetch(url)
  if (!res.ok) throw new Error(`Network error: HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!data.verses?.length) throw new Error('No verses returned')
  return data.verses.map(v=>({verse:v.verse, text:cleanText(v.text)}))
}
async function fetchFromApiBible(bookName, chapter, apiBibleId) {
  const code = BOOK_ID_APIBIBLE[bookName]
  if (!code) throw new Error(`Book not mapped: ${bookName}`)
  const url = `https://api.scripture.api.bible/v1/bibles/${apiBibleId}/chapters/${code}.${chapter}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`
  const res  = await fetch(url, {headers:{'api-key':API_KEY}})
  if (res.status===401) throw new Error('API_KEY_INVALID')
  if (res.status===404) throw new Error('Chapter not found in this translation.')
  if (!res.ok) throw new Error(`API.Bible error: HTTP ${res.status}`)
  const data   = await res.json()
  const verses = parseVerses(data?.data?.content ?? '')
  if (!verses.length) throw new Error('No verses found in response.')
  return verses
}
async function fetchChapter(bookName, chapter, code) {
  const t = TRANSLATIONS.find(t=>t.code===code)
  if (!t) throw new Error(`Unknown translation: ${code}`)
  if (t.apiBibleId && KEY_LOOKS_VALID) {
    try { return await fetchFromApiBible(bookName, chapter, t.apiBibleId) }
    catch(e) { if (e.message!=='API_KEY_INVALID') throw e }
  }
  return await fetchFromBibleApiCom(bookName, chapter, code)
}

// ── 8. Share ──────────────────────────────────────────────────────
function buildShareLinks(text, ref) {
  const msg = `"${text}" — ${ref}`
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(msg)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(msg)}`,
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,
    email:    `mailto:?subject=${encodeURIComponent('A verse for you')}&body=${encodeURIComponent(msg)}`,
  }
}

// ═════════════════════════════════════════════════════════════════
// ── Side Panel ────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════
function SidePanel({type, favorites, notes, onClose, onRemoveFav, onDeleteNote, onCopy}) {
  const isFav   = type==='favorites'
  const title   = isFav ? `⭐ Favorites (${favorites.length})` : `📝 My Notes (${Object.keys(notes).length})`
  const isEmpty = isFav ? favorites.length===0 : Object.keys(notes).length===0
  return (
    <div style={sp.wrap} onClick={e=>e.stopPropagation()}>
      <div style={sp.head}>
        <span style={{fontWeight:'700',color:'#f0c040'}}>{title}</span>
        <button style={sp.x} onClick={onClose}>✕</button>
      </div>
      <div style={sp.body}>
        {isEmpty
          ? <p style={sp.empty}>{isFav
              ? 'No favorites yet.\nTap any verse → ⭐ to save it.'
              : 'No notes yet.\nTap any verse → 📝 to write a note.'}</p>
          : isFav
            ? favorites.map(f=>(
                <div key={f.ref} style={sp.item}>
                  <div style={sp.ref}>{f.ref}</div>
                  <div style={sp.txt}>"{f.text.length>90?f.text.slice(0,90)+'…':f.text}"</div>
                  <div style={sp.acts}>
                    <button style={sp.ab} onClick={()=>onCopy(f.text,f.ref)}>📋 Copy</button>
                    <button style={{...sp.ab,color:'#e67e22'}} onClick={()=>onRemoveFav(f.ref)}>🗑 Remove</button>
                  </div>
                </div>
              ))
            : Object.entries(notes).map(([ref,txt])=>(
                <div key={ref} style={sp.item}>
                  <div style={sp.ref}>{ref}</div>
                  <div style={{...sp.txt,color:'#c8a96e',fontStyle:'italic'}}>📝 {txt.length>90?txt.slice(0,90)+'…':txt}</div>
                  <button style={{...sp.ab,color:'#e67e22',marginTop:'6px'}} onClick={()=>onDeleteNote(ref)}>🗑 Delete</button>
                </div>
              ))
        }
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════
// ── Singing Mode (distraction-free fullscreen) ────────────────────
// ═════════════════════════════════════════════════════════════════
function SingingMode({ hymn, onClose, onSpeak, onStop, isReading }) {
  const [verseIdx, setVerseIdx] = useState(0)
  const verse = hymn.verses[verseIdx]
  return (
    <div style={sm.overlay}>
      <div style={sm.panel}>

        {/* Top bar */}
        <div style={sm.topBar}>
          <div style={sm.topLeft}>
            <span style={sm.num}>#{hymn.num}</span>
            <div>
              <div style={sm.title}>{hymn.title}</div>
              <div style={sm.author}>{hymn.author}</div>
            </div>
          </div>
          <div style={sm.topRight}>
            <button style={sm.listenBtn}
              onClick={()=>isReading ? onStop() : onSpeak(verse.text)}>
              {isReading ? '⏹ Stop' : '🔊 Listen'}
            </button>
            <button style={sm.closeBtn} onClick={onClose}>✕ Exit</button>
          </div>
        </div>

        {/* Verse label */}
        <div style={sm.verseLabel}>{verse.label}</div>

        {/* Lyrics */}
        <div style={sm.lyricsBox}>
          <pre style={sm.lyrics}>{verse.text}</pre>
        </div>

        {/* Navigation dots */}
        <div style={sm.dots}>
          {hymn.verses.map((_,i)=>(
            <button key={i} style={{...sm.dot, background: i===verseIdx ? '#f0c040' : 'rgba(240,192,64,0.25)'}}
              onClick={()=>{ onStop(); setVerseIdx(i) }} />
          ))}
        </div>

        {/* Prev / Next */}
        <div style={sm.navRow}>
          <button style={{...sm.navBtn, opacity: verseIdx===0 ? 0.3 : 1}}
            disabled={verseIdx===0}
            onClick={()=>{ onStop(); setVerseIdx(i=>i-1) }}>
            ← Prev
          </button>
          <span style={sm.navCount}>{verseIdx+1} / {hymn.verses.length}</span>
          <button style={{...sm.navBtn, opacity: verseIdx===hymn.verses.length-1 ? 0.3 : 1}}
            disabled={verseIdx===hymn.verses.length-1}
            onClick={()=>{ onStop(); setVerseIdx(i=>i+1) }}>
            Next →
          </button>
        </div>

      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════
// ── Main Component ────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════
export default function BibleReaderPage() {

  // Core Bible state
  const [view,             setView]             = useState('books')
  const [testament,        setTestament]         = useState('old')
  const [selectedBook,     setSelectedBook]      = useState(null)
  const [selectedChapter,  setSelectedChapter]   = useState(null)
  const [verses,           setVerses]            = useState([])
  const [loading,          setLoading]           = useState(false)
  const [error,            setError]             = useState(null)
  const [version,          setVersion]           = useState(()=>LS.get('sv_version','kjv'))
  const [isReading,        setIsReading]         = useState(false)
  const [readingVerse,     setReadingVerse]       = useState(null)

  // Hymnal state
  const [hymnCollection,   setHymnCollection]    = useState('ancient')   // 'ancient' | 'sacred'
  const [hymnSearch,       setHymnSearch]        = useState('')
  const [hymnCategory,     setHymnCategory]      = useState('All')
  const [hymnSort,         setHymnSort]          = useState('number')    // 'number'|'title'|'author'
  const [selectedHymn,     setSelectedHymn]      = useState(null)
  const [singingMode,      setSingingMode]       = useState(false)

  // Features
  const [highlights, setHighlights] = useState(()=>LS.get('sv_hl',{}))
  const [favorites,  setFavorites]  = useState(()=>LS.get('sv_fav',[]))
  const [notes,      setNotes]      = useState(()=>LS.get('sv_notes',{}))

  // UI
  const [activeMenu,  setActiveMenu]  = useState(null)
  const [shareMenu,   setShareMenu]   = useState(null)
  const [noteVerse,   setNoteVerse]   = useState(null)
  const [noteDraft,   setNoteDraft]   = useState('')
  const [toast,       setToast]       = useState(null)
  const [sidePanel,   setSidePanel]   = useState(null)
  const noteRef = useRef(null)

  // Persist
  useEffect(()=>{ LS.set('sv_version',  version)    },[version])
  useEffect(()=>{ LS.set('sv_hl',       highlights) },[highlights])
  useEffect(()=>{ LS.set('sv_fav',      favorites)  },[favorites])
  useEffect(()=>{ LS.set('sv_notes',    notes)      },[notes])

  // Reset category when switching collection
  useEffect(()=>{ setHymnCategory('All'); setHymnSearch('') },[hymnCollection])

  // Fetch Bible chapter
  useEffect(()=>{
    if (!selectedBook||!selectedChapter) return
    let cancelled=false
    setLoading(true); setVerses([]); setError(null)
    fetchChapter(selectedBook.name, selectedChapter, version)
      .then(v=>{ if(!cancelled){setVerses(v);setLoading(false)} })
      .catch(e=>{ if(!cancelled){setError(e.message);setLoading(false)} })
    return ()=>{ cancelled=true }
  },[selectedBook,selectedChapter,version])

  // Auto-focus note
  useEffect(()=>{ if(noteVerse&&noteRef.current) noteRef.current.focus() },[noteVerse])

  // Close menus on outside click
  useEffect(()=>{
    const h=()=>{ setActiveMenu(null); setShareMenu(null) }
    document.addEventListener('click',h)
    return ()=>document.removeEventListener('click',h)
  },[])

  // Toast
  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2600) }

  // Speech
  const stopNarration = ()=>window.speechSynthesis.cancel()
  const speak = (text, vNum=null) => {
    stopNarration()
    const u = new SpeechSynthesisUtterance(cleanText(text))
    u.rate=0.88
    u.onstart=()=>{ setIsReading(true);  setReadingVerse(vNum) }
    u.onend  =()=>{ setIsReading(false); setReadingVerse(null) }
    window.speechSynthesis.speak(u)
  }

  const retry = ()=>{
    if(!selectedBook||!selectedChapter) return
    setLoading(true); setError(null); setVerses([])
    fetchChapter(selectedBook.name,selectedChapter,version)
      .then(v=>{ setVerses(v);setLoading(false) })
      .catch(e=>{ setError(e.message);setLoading(false) })
  }

  const vRef = vNum => `${selectedBook?.name} ${selectedChapter}:${vNum} (${version.toUpperCase()})`

  // Highlight
  const HL = ['#f0c04055','#4caf5055','#2196f355','#e91e6355','#ff980055']
  const toggleHL = (vNum, color) => {
    const k=vRef(vNum)
    setHighlights(p=>{ const n={...p}; if(n[k]===color) delete n[k]; else n[k]=color; return n })
    setActiveMenu(null); showToast('Highlighted ✨')
  }

  // Copy
  const copyVerse = (text, vNum) => {
    navigator.clipboard.writeText(`"${text}" — ${vRef(vNum)}`)
      .then(()=>showToast('Copied 📋'))
      .catch(()=>showToast('Select text manually to copy'))
    setActiveMenu(null)
  }

  // Favorites
  const toggleFav = verse => {
    const k=vRef(verse.verse)
    setFavorites(p=>{
      if(p.find(f=>f.ref===k)){ showToast('Removed from favorites'); return p.filter(f=>f.ref!==k) }
      showToast('Added to favorites ⭐')
      return [...p,{ref:k,text:verse.text,book:selectedBook.name,chapter:selectedChapter,verseNum:verse.verse,version}]
    })
    setActiveMenu(null)
  }
  const isFav  = vNum => favorites.some(f=>f.ref===vRef(vNum))

  // Notes
  const openNote = vNum => { setNoteDraft(notes[vRef(vNum)]||''); setNoteVerse(vNum); setActiveMenu(null) }
  const saveNote = () => {
    const k=vRef(noteVerse)
    setNotes(p=>{ const n={...p}; if(noteDraft.trim()) n[k]=noteDraft.trim(); else delete n[k]; return n })
    showToast(noteDraft.trim()?'Note saved 📝':'Note deleted')
    setNoteVerse(null); setNoteDraft('')
  }
  const hasNote = vNum => !!notes[vRef(vNum)]

  const currentTrans = TRANSLATIONS.find(t=>t.code===version)

  // Active hymn collection data
  const activeCollection = hymnCollection==='ancient' ? HYMNS_ANCIENT_MODERN : HYMNS_SACRED_SONGS
  const activeCategories = hymnCollection==='ancient' ? AM_CATEGORIES : SS_CATEGORIES
  const collectionLabel  = hymnCollection==='ancient'
    ? 'Hymns Ancient & Modern'
    : 'Sacred Songs & Solos'
  const collectionTotal  = hymnCollection==='ancient' ? 847 : 1200

  // Filtered & sorted hymns
  const filteredHymns = useMemo(()=>{
    let list = activeCollection
    if (hymnCategory!=='All') list = list.filter(h=>h.category===hymnCategory)
    if (hymnSearch.trim()) {
      const q = hymnSearch.toLowerCase()
      // also match by number e.g. "23"
      list = list.filter(h=>
        String(h.num).includes(q) ||
        h.title.toLowerCase().includes(q) ||
        h.author.toLowerCase().includes(q) ||
        h.verses.some(v=>v.text.toLowerCase().includes(q))
      )
    }
    return [...list].sort((a,b)=>{
      if (hymnSort==='number') return a.num - b.num
      if (hymnSort==='author') return a.author.localeCompare(b.author)
      return a.title.localeCompare(b.title)
    })
  },[activeCollection, hymnCategory, hymnSearch, hymnSort])

  const sidePanelProps = {
    favorites, notes,
    onClose:      ()=>setSidePanel(null),
    onRemoveFav:  ref=>{ setFavorites(p=>p.filter(f=>f.ref!==ref)); showToast('Removed') },
    onDeleteNote: ref=>{ setNotes(p=>{ const n={...p}; delete n[ref]; return n }); showToast('Note deleted') },
    onCopy:       (text,ref)=>{ navigator.clipboard.writeText(`"${text}" — ${ref}`); showToast('Copied 📋') },
  }

  // ── SINGING MODE overlay ──────────────────────────────────────
  if (singingMode && selectedHymn) {
    return (
      <>
        <style>{FONT+ANIM}</style>
        <SingingMode
          hymn={selectedHymn}
          isReading={isReading}
          onSpeak={text=>speak(text)}
          onStop={stopNarration}
          onClose={()=>{ stopNarration(); setSingingMode(false) }}
        />
      </>
    )
  }

  // ── HYMN DETAIL ───────────────────────────────────────────────
  if (view==='hymn-detail' && selectedHymn) {
    const full = selectedHymn.verses.map(v=>`${v.label}\n${v.text}`).join('\n\n')
    return (
      <div style={s.page}>
        <style>{FONT+ANIM}</style>
        <header style={s.topBar}>
          <button style={s.backBtn} onClick={()=>{ stopNarration(); setView('hymns') }}>← Hymns</button>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button style={{...s.listenBtn,background:'rgba(240,192,64,0.15)'}}
              onClick={()=>{ stopNarration(); setSingingMode(true) }}>
              🎤 Singing Mode
            </button>
            <button style={{...s.listenBtn,opacity:(isReading?1:1)}}
              onClick={()=>isReading?stopNarration():speak(full)}>
              {isReading?'⏹ Stop':'🔊 Listen All'}
            </button>
          </div>
        </header>
        <main style={s.hymnDetailMain}>
          <div style={s.hymnHero}>
            <div style={{fontSize:'3rem',marginBottom:'0.5rem'}}>🎵</div>
            <div style={{color:'#c8a96e',fontSize:'0.85rem',marginBottom:'0.5rem'}}>
              #{selectedHymn.num} · {collectionLabel}
            </div>
            <h1 style={s.hymnDetailTitle}>{selectedHymn.title}</h1>
            <p style={s.hymnDetailAuthor}>{selectedHymn.author}</p>
            <div style={s.metaRow}>
              <span style={s.metaBadge}>📂 {selectedHymn.category}</span>
              {selectedHymn.key&&<span style={s.metaBadge}>🎹 Key of {selectedHymn.key}</span>}
              <span style={s.metaBadge}>📜 {selectedHymn.verses.length} sections</span>
            </div>
          </div>
          <div style={s.divider}>✦</div>
          <div style={s.hymnVerseList}>
            {selectedHymn.verses.map((v,i)=>(
              <div key={i} style={s.hymnVerseBlock}>
                <div style={s.hymnVerseLabel}>{v.label}</div>
                <pre style={s.hymnVerseText}>{v.text}</pre>
                <button style={s.singBtn} onClick={()=>speak(v.text)}>🔊</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // ── HYMN LIST ─────────────────────────────────────────────────
  if (view==='hymns') {
    return (
      <div style={s.page}>
        <style>{FONT+ANIM}</style>

        {/* Welcome banner */}
        <div style={hm.welcomeBanner}>
          <div style={hm.welcomeIcon}>🎵</div>
          <h1 style={hm.welcomeTitle}>Scripture Hub Hymn Centre</h1>
          <p style={hm.welcomeSub}>
            Welcome to the Scripture Hub Hymn Centre. Choose your preferred collection to begin worship.
          </p>
        </div>

        {/* Collection switcher */}
        <div style={hm.switcherRow}>
          <button
            style={{...hm.switchBtn,...(hymnCollection==='ancient'?hm.switchBtnOn:{})}}
            onClick={()=>setHymnCollection('ancient')}>
            <div style={hm.switchIcon}>📖</div>
            <div style={hm.switchLabel}>Hymns Ancient &amp; Modern</div>
            <div style={hm.switchCount}>847 selections</div>
            <div style={hm.switchDesc}>Traditional hymns, short songs &amp; chants</div>
          </button>
          <button
            style={{...hm.switchBtn,...(hymnCollection==='sacred'?hm.switchBtnOn:{})}}
            onClick={()=>setHymnCollection('sacred')}>
            <div style={hm.switchIcon}>🎶</div>
            <div style={hm.switchLabel}>Sacred Songs &amp; Solos</div>
            <div style={hm.switchCount}>1,200 selections</div>
            <div style={hm.switchDesc}>Gospel classics &amp; revival solos</div>
          </button>
        </div>

        {/* Active collection header */}
        <div style={hm.collectionHeader}>
          <div style={hm.collectionTitle}>{collectionLabel}</div>
          <div style={hm.collectionSub}>
            Complete edition · {collectionTotal} hymns total
          </div>
        </div>

        {/* Search bar */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Find a hymn by number, title, author, or lyric…"
            value={hymnSearch}
            onChange={e=>setHymnSearch(e.target.value)}
          />
          {hymnSearch&&<button style={s.searchClear} onClick={()=>setHymnSearch('')}>✕</button>}
        </div>

        {/* Category pills */}
        <div style={s.catRow}>
          {activeCategories.map(c=>(
            <button key={c}
              style={{...s.catPill,...(hymnCategory===c?s.catPillOn:{})}}
              onClick={()=>setHymnCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div style={s.ctrlRow}>
          <span style={s.resultCount}>
            {filteredHymns.length} of {activeCollection.length} hymns shown
          </span>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <span style={{color:'#c8a96e',fontSize:'0.9rem'}}>Sort:</span>
            {['number','title','author'].map(opt=>(
              <button key={opt}
                style={{...s.sortBtn,...(hymnSort===opt?s.sortBtnOn:{})}}
                onClick={()=>setHymnSort(opt)}>
                {opt==='number'?'#123':opt==='title'?'A–Z':'Author'}
              </button>
            ))}
          </div>
        </div>

        {/* Back to Bible */}
        <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
          <button style={s.backBtn} onClick={()=>setView('books')}>← Back to Bible</button>
        </div>

        {/* Hymn grid */}
        {filteredHymns.length===0
          ? <div style={s.hymnEmpty}>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🎶</div>
              No hymns match your search.
              <br/>
              <button style={{...s.backBtn,marginTop:'1rem'}}
                onClick={()=>{setHymnSearch('');setHymnCategory('All')}}>
                Clear filters
              </button>
            </div>
          : <div style={s.hymnGrid}>
              {filteredHymns.map(h=>(
                <button key={`${hymnCollection}-${h.num}`} style={s.hymnCard}
                  onClick={()=>{ setSelectedHymn(h); setView('hymn-detail') }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                    <span style={{fontSize:'1.2rem'}}>🎵</span>
                    <span style={hm.numBadge}>#{h.num}</span>
                  </div>
                  <div style={s.hymnCardTitle}>{h.title}</div>
                  <div style={s.hymnCardAuthor}>{h.author}</div>
                  <div style={s.hymnCardMeta}>
                    <span style={s.hymnCardCat}>{h.category}</span>
                    {h.key&&<span style={s.hymnCardKey}>Key of {h.key}</span>}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'8px'}}>
                    <div style={s.hymnCardSections}>{h.verses.length} sections</div>
                    <div style={hm.singTag}>🎤 Sing</div>
                  </div>
                </button>
              ))}
            </div>
        }
      </div>
    )
  }

  // ── BOOK LIST ─────────────────────────────────────────────────
  if (view==='books') {
    return (
      <div style={s.page}>
        <style>{FONT+ANIM}</style>
        <h1 style={s.navTitle}>✝ Holy Bible</h1>
        <div style={s.quickBar}>
          <button style={s.quickBtn} onClick={()=>setSidePanel(p=>p==='favorites'?null:'favorites')}>
            ⭐ Favorites {favorites.length>0&&<span style={s.qBadge}>{favorites.length}</span>}
          </button>
          <button style={s.quickBtn} onClick={()=>setSidePanel(p=>p==='notes'?null:'notes')}>
            📝 My Notes {Object.keys(notes).length>0&&<span style={s.qBadge}>{Object.keys(notes).length}</span>}
          </button>
        </div>
        <div style={s.tabs}>
          <button style={{...s.tab,...(testament==='old'?s.tabOn:{})}} onClick={()=>setTestament('old')}>Old Testament</button>
          <button style={{...s.tab,...(testament==='new'?s.tabOn:{})}} onClick={()=>setTestament('new')}>New Testament</button>
          <button style={{...s.tab,border:'1px solid #f0c040'}} onClick={()=>setView('hymns')}>🎵 Hymn Centre</button>
        </div>
        <div style={s.grid}>
          {(testament==='old'?OLD_TESTAMENT:NEW_TESTAMENT).map(b=>(
            <button key={b.name} style={s.card} onClick={()=>{setSelectedBook(b);setView('chapters')}}>
              <div style={s.cardTitle}>{b.name}</div>
              <div style={s.cardSub}>{b.chapters} chapters</div>
            </button>
          ))}
        </div>
        {sidePanel&&<SidePanel type={sidePanel} {...sidePanelProps}/>}
      </div>
    )
  }

  // ── CHAPTER LIST ──────────────────────────────────────────────
  if (view==='chapters') {
    return (
      <div style={s.page}>
        <style>{FONT+ANIM}</style>
        <button style={s.backBtn} onClick={()=>setView('books')}>← Back to Books</button>
        <h1 style={s.navTitle}>{selectedBook.name}</h1>
        <div style={s.chapterGrid}>
          {Array.from({length:selectedBook.chapters},(_,i)=>i+1).map(ch=>(
            <button key={ch} style={s.chapterBtn}
              onClick={()=>{setSelectedChapter(ch);setView('reader')}}>
              {ch}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── READER ────────────────────────────────────────────────────
  return (
    <div style={s.page} onClick={()=>{setActiveMenu(null);setShareMenu(null)}}>
      <style>{FONT+ANIM}</style>

      {toast&&<div style={s.toast}>{toast}</div>}

      {noteVerse!==null&&(
        <div style={s.overlay} onClick={()=>setNoteVerse(null)}>
          <div style={s.modal} onClick={e=>e.stopPropagation()}>
            <h3 style={s.modalTitle}>📝 Note — {vRef(noteVerse)}</h3>
            <textarea ref={noteRef} value={noteDraft} onChange={e=>setNoteDraft(e.target.value)}
              placeholder="Write your thoughts, reflections, or prayer here…"
              style={s.noteTA} rows={6}/>
            <div style={s.modalBtns}>
              <button style={s.modalSave} onClick={saveNote}>💾 Save Note</button>
              <button style={s.modalCancel} onClick={()=>setNoteVerse(null)}>Cancel</button>
              {notes[vRef(noteVerse)]&&(
                <button style={{...s.modalCancel,color:'#e67e22',borderColor:'#e67e22'}}
                  onClick={()=>{setNoteDraft('');saveNote()}}>🗑 Delete</button>
              )}
            </div>
          </div>
        </div>
      )}

      {sidePanel&&<SidePanel type={sidePanel} {...sidePanelProps}/>}

      <header style={s.readerHeader}>
        <button style={s.backBtn} onClick={()=>{stopNarration();setView('chapters')}}>← Chapters</button>
        <div style={s.readerCenter}>
          <h1 style={s.readerTitle}>
            {selectedBook?.name} <span style={{color:'#c8a96e'}}>{selectedChapter}</span>
          </h1>
          <select value={version} onChange={e=>{setVersion(e.target.value);setError(null)}} style={s.select}>
            {TRANSLATIONS.map(t=><option key={t.code} value={t.code}>{t.badge} {t.label} — {t.full}</option>)}
          </select>
          {currentTrans&&<div style={s.transDesc}>{currentTrans.desc}</div>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',alignItems:'flex-end'}}>
          <button style={{...s.listenBtn,opacity:(loading||!verses.length)?0.35:1}}
            disabled={loading||!verses.length}
            onClick={()=>isReading?stopNarration():speak(verses.map(v=>v.text).join('  '))}>
            {isReading?'⏹ Stop':'🔊 Listen'}
          </button>
          <div style={{display:'flex',gap:'6px'}}>
            <button style={s.iconBtn}
              onClick={e=>{e.stopPropagation();setSidePanel(p=>p==='favorites'?null:'favorites')}}>
              ⭐{favorites.length>0&&<span style={s.qBadge}>{favorites.length}</span>}
            </button>
            <button style={s.iconBtn}
              onClick={e=>{e.stopPropagation();setSidePanel(p=>p==='notes'?null:'notes')}}>
              📝{Object.keys(notes).length>0&&<span style={s.qBadge}>{Object.keys(notes).length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main style={s.scriptureColumn}>
        {loading&&(
          <div style={s.centerMsg}>
            <div style={s.spinner}/>
            <div style={{marginTop:'1rem',color:'#f0c040'}}>📖 Loading the Word of God…</div>
          </div>
        )}
        {!loading&&error&&(
          <div style={s.errorBox}>
            <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>⚠️</div>
            <div style={{marginBottom:'1.5rem',lineHeight:'1.6'}}>{error}</div>
            <div style={s.btnRow}>
              <button style={s.retryBtn} onClick={retry}>🔄 Try Again</button>
              <button style={s.retryBtn} onClick={()=>{setVersion('kjv');setError(null)}}>Switch to KJV</button>
            </div>
          </div>
        )}
        {!loading&&!error&&verses.length===0&&(
          <div style={s.centerMsg}>🙏 Select a book and chapter to begin reading</div>
        )}
        {!loading&&!error&&verses.length>0&&(
          <>
            <div style={s.versionBadge}>
              {currentTrans?.badge} Reading: <strong>{currentTrans?.full||version}</strong>
              <span style={{fontSize:'0.8rem',marginLeft:'8px',opacity:0.6}}>— Tap any verse for options</span>
            </div>
            {verses.map(v=>{
              const ref      = vRef(v.verse)
              const hlColor  = highlights[ref]
              const fav      = isFav(v.verse)
              const note     = hasNote(v.verse)
              const menuOpen = activeMenu===v.verse
              const shareOpen= shareMenu===v.verse
              const links    = buildShareLinks(v.text, ref)
              return (
                <div key={v.verse} style={{position:'relative'}}>
                  <p style={{
                      ...s.verse,
                      ...(readingVerse===v.verse?s.verseActive:{}),
                      ...(hlColor?{background:hlColor,borderLeft:`3px solid ${hlColor.replace('55','cc')}`,paddingLeft:'14px'}:{}),
                    }}
                    onClick={e=>{e.stopPropagation();setActiveMenu(menuOpen?null:v.verse);setShareMenu(null)}}>
                    <sup style={s.verseNum}>{v.verse}</sup>
                    <span style={s.verseText}>{v.text}</span>
                    {(fav||note||hlColor)&&(
                      <span style={s.verseIcons}>{fav&&'⭐'}{note&&'📝'}{hlColor&&'🎨'}</span>
                    )}
                  </p>
                  {menuOpen&&(
                    <div style={s.vMenu} onClick={e=>e.stopPropagation()}>
                      <button style={s.mBtn} onClick={()=>{speak(v.text,v.verse);setActiveMenu(null)}}>🔊 Listen to verse</button>
                      <button style={s.mBtn} onClick={()=>copyVerse(v.text,v.verse)}>📋 Copy verse</button>
                      <button style={s.mBtn} onClick={()=>toggleFav(v)}>{fav?'💛 Remove favorite':'⭐ Add to favorites'}</button>
                      <button style={s.mBtn} onClick={()=>openNote(v.verse)}>{note?'📝 Edit note':'📝 Add note'}</button>
                      <button style={s.mBtn} onClick={e=>{e.stopPropagation();setShareMenu(shareOpen?null:v.verse)}}>📤 Share verse ▸</button>
                      <div style={s.mDivider}>🎨 Highlight color</div>
                      <div style={s.colorRow}>
                        {HL.map(c=>(
                          <button key={c}
                            style={{...s.colorDot,background:c,outline:hlColor===c?'2px solid #fff':'none'}}
                            onClick={()=>toggleHL(v.verse,c)}/>
                        ))}
                        {hlColor&&(
                          <button style={{...s.colorDot,background:'transparent',border:'1px solid #666',color:'#aaa',fontSize:'0.7rem'}}
                            onClick={()=>toggleHL(v.verse,hlColor)}>✕</button>
                        )}
                      </div>
                    </div>
                  )}
                  {shareOpen&&(
                    <div style={{...s.vMenu,left:'175px',top:'0'}} onClick={e=>e.stopPropagation()}>
                      <div style={s.mDivider}>Share via</div>
                      <a href={links.whatsapp} target="_blank" rel="noreferrer" style={s.shareLink}>💬 WhatsApp</a>
                      <a href={links.facebook} target="_blank" rel="noreferrer" style={s.shareLink}>📘 Facebook</a>
                      <a href={links.twitter}  target="_blank" rel="noreferrer" style={s.shareLink}>🐦 Twitter / X</a>
                      <a href={links.email}    style={s.shareLink}>✉️ Email</a>
                      {navigator.share&&(
                        <button style={s.mBtn} onClick={()=>{
                          navigator.share({title:'Bible Verse',text:`"${v.text}" — ${ref}`})
                          setShareMenu(null)
                        }}>📱 More apps…</button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            <div style={s.chapterNav}>
              <button style={{...s.navBtn,opacity:selectedChapter<=1?0.3:1}}
                disabled={selectedChapter<=1}
                onClick={()=>{stopNarration();setSelectedChapter(c=>c-1);window.scrollTo(0,0)}}>
                ← Previous
              </button>
              <span style={s.navLabel}>Ch {selectedChapter} / {selectedBook?.chapters}</span>
              <button style={{...s.navBtn,opacity:selectedChapter>=selectedBook?.chapters?0.3:1}}
                disabled={selectedChapter>=selectedBook?.chapters}
                onClick={()=>{stopNarration();setSelectedChapter(c=>c+1);window.scrollTo(0,0)}}>
                Next →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ── Font & Animations ─────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`
const ANIM = `
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
`

// ── Singing Mode Styles ───────────────────────────────────────────
const sm = {
  overlay:    { position:'fixed', inset:0, background:'#0a0500', zIndex:1000,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Crimson Text',serif" },
  panel:      { width:'100%', maxWidth:'720px', padding:'2rem 1.5rem',
                display:'flex', flexDirection:'column', gap:'1.5rem',
                height:'100vh', boxSizing:'border-box', overflowY:'auto' },
  topBar:     { display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                flexWrap:'wrap', gap:'1rem' },
  topLeft:    { display:'flex', alignItems:'flex-start', gap:'1rem' },
  topRight:   { display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' },
  num:        { background:'rgba(240,192,64,0.15)', color:'#f0c040', borderRadius:'8px',
                padding:'4px 10px', fontSize:'0.85rem', fontWeight:'700', flexShrink:0 },
  title:      { color:'#f0c040', fontSize:'1.3rem', fontWeight:'700', lineHeight:'1.2' },
  author:     { color:'#c8a96e', fontSize:'0.85rem', fontStyle:'italic', marginTop:'3px' },
  listenBtn:  { padding:'8px 18px', borderRadius:'20px', border:'1px solid #f0c040',
                color:'#f0c040', background:'transparent', cursor:'pointer',
                fontFamily:'inherit', fontSize:'0.9rem' },
  closeBtn:   { padding:'8px 18px', borderRadius:'20px', border:'1px solid #c8a96e',
                color:'#c8a96e', background:'transparent', cursor:'pointer',
                fontFamily:'inherit', fontSize:'0.9rem' },
  verseLabel: { textAlign:'center', color:'#f0c040', fontSize:'0.9rem', fontWeight:'700',
                textTransform:'uppercase', letterSpacing:'0.12em' },
  lyricsBox:  { flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(255,255,255,0.03)', borderRadius:'16px',
                border:'1px solid rgba(240,192,64,0.15)', padding:'2rem',
                minHeight:'260px' },
  lyrics:     { whiteSpace:'pre-wrap', fontSize:'1.9rem', color:'#f0e6d2',
                fontFamily:"'Crimson Text',serif", lineHeight:'2.2',
                textAlign:'center', margin:0 },
  dots:       { display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' },
  dot:        { width:'12px', height:'12px', borderRadius:'50%', border:'none',
                cursor:'pointer', transition:'background 0.2s' },
  navRow:     { display:'flex', justifyContent:'space-between', alignItems:'center',
                paddingTop:'0.5rem', borderTop:'1px solid rgba(240,192,64,0.15)' },
  navBtn:     { padding:'10px 24px', borderRadius:'25px', border:'1px solid #f0c040',
                color:'#f0c040', background:'transparent', cursor:'pointer',
                fontFamily:'inherit', fontSize:'1rem' },
  navCount:   { color:'#c8a96e', fontSize:'0.95rem', fontStyle:'italic' },
}

// ── Hymn Centre Extra Styles ──────────────────────────────────────
const hm = {
  welcomeBanner: { textAlign:'center', marginBottom:'2rem', maxWidth:'700px', margin:'0 auto 2rem' },
  welcomeIcon:   { fontSize:'3.5rem', marginBottom:'0.75rem' },
  welcomeTitle:  { color:'#f0c040', fontSize:'2rem', fontWeight:'700', margin:'0 0 0.75rem' },
  welcomeSub:    { color:'#c8a96e', fontSize:'1rem', lineHeight:'1.7',
                   fontStyle:'italic', margin:'0 0 2rem' },
  switcherRow:   { display:'flex', gap:'1rem', justifyContent:'center',
                   flexWrap:'wrap', maxWidth:'800px', margin:'0 auto 2rem' },
  switchBtn:     { flex:'1', minWidth:'240px', maxWidth:'340px',
                   padding:'1.5rem 1.25rem', borderRadius:'16px',
                   border:'1px solid rgba(240,192,64,0.25)',
                   background:'rgba(255,255,255,0.04)', cursor:'pointer',
                   fontFamily:'inherit', textAlign:'center', transition:'all 0.25s' },
  switchBtnOn:   { border:'2px solid #f0c040', background:'rgba(240,192,64,0.1)',
                   boxShadow:'0 0 24px rgba(240,192,64,0.15)' },
  switchIcon:    { fontSize:'2.2rem', marginBottom:'0.6rem' },
  switchLabel:   { color:'#f0e6d2', fontWeight:'700', fontSize:'1.05rem', marginBottom:'4px' },
  switchCount:   { color:'#f0c040', fontSize:'0.9rem', fontWeight:'700', marginBottom:'6px' },
  switchDesc:    { color:'#c8a96e', fontSize:'0.82rem', fontStyle:'italic', lineHeight:'1.5' },
  collectionHeader:{ textAlign:'center', marginBottom:'1.5rem' },
  collectionTitle: { color:'#f0c040', fontSize:'1.3rem', fontWeight:'700' },
  collectionSub:   { color:'#c8a96e', fontSize:'0.85rem', fontStyle:'italic', marginTop:'4px' },
  numBadge:      { background:'rgba(240,192,64,0.12)', color:'#f0c040',
                   borderRadius:'8px', padding:'2px 8px',
                   fontSize:'0.75rem', fontWeight:'700' },
  singTag:       { color:'#c8a96e', fontSize:'0.75rem', fontStyle:'italic' },
}

// ── Side Panel Styles ─────────────────────────────────────────────
const sp = {
  wrap: { position:'fixed', top:0, right:0, width:'320px', maxWidth:'92vw', height:'100vh',
          background:'#1a0d04', borderLeft:'1px solid rgba(240,192,64,0.3)', zIndex:300,
          display:'flex', flexDirection:'column', animation:'slideIn 0.22s ease' },
  head: { display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'1.2rem', borderBottom:'1px solid rgba(240,192,64,0.2)',
          position:'sticky', top:0, background:'#1a0d04' },
  x:    { background:'transparent', border:'none', color:'#c8a96e', cursor:'pointer', fontSize:'1.2rem' },
  body: { overflowY:'auto', flex:1, padding:'0 0 2rem' },
  empty:{ padding:'2rem 1.2rem', color:'#c8a96e', fontStyle:'italic', textAlign:'center',
          lineHeight:'1.8', whiteSpace:'pre-line' },
  item: { padding:'1rem 1.2rem', borderBottom:'1px solid rgba(255,255,255,0.06)' },
  ref:  { color:'#f0c040', fontSize:'0.82rem', fontWeight:'700', marginBottom:'4px' },
  txt:  { color:'#f0e6d2', fontSize:'0.97rem', lineHeight:'1.6', marginBottom:'8px' },
  acts: { display:'flex', gap:'8px', flexWrap:'wrap' },
  ab:   { padding:'4px 12px', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.18)',
          background:'transparent', color:'#f0e6d2', cursor:'pointer',
          fontFamily:'inherit', fontSize:'0.83rem' },
}

// ── Main Styles ───────────────────────────────────────────────────
const s = {
  page:            { background:'#120a05', minHeight:'100vh', color:'#f0e6d2',
                     padding:'2rem 1rem', fontFamily:"'Crimson Text', serif" },
  navTitle:        { textAlign:'center', color:'#f0c040', fontSize:'2.6rem',
                     marginBottom:'1.5rem', fontWeight:'700' },
  quickBar:        { display:'flex', justifyContent:'center', gap:'1rem',
                     marginBottom:'1.5rem', flexWrap:'wrap' },
  quickBtn:        { padding:'8px 18px', borderRadius:'20px',
                     border:'1px solid rgba(240,192,64,0.4)',
                     background:'rgba(240,192,64,0.07)', color:'#f0c040',
                     cursor:'pointer', fontFamily:'inherit', fontSize:'0.95rem',
                     display:'flex', alignItems:'center', gap:'6px' },
  qBadge:          { background:'#f0c040', color:'#1a0a00', borderRadius:'10px',
                     padding:'1px 7px', fontSize:'0.72rem', fontWeight:'700' },
  tabs:            { display:'flex', justifyContent:'center', gap:'0.75rem',
                     marginBottom:'2rem', flexWrap:'wrap' },
  tab:             { padding:'10px 22px', borderRadius:'20px',
                     border:'1px solid transparent', background:'transparent',
                     color:'#f0c040', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  tabOn:           { background:'#f0c040', color:'#1a0a00', fontWeight:'700' },
  grid:            { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))',
                     gap:'12px', maxWidth:'920px', margin:'0 auto' },
  card:            { padding:'14px 12px', background:'rgba(255,255,255,0.04)',
                     border:'1px solid rgba(240,192,64,0.25)', color:'#f0e6d2',
                     borderRadius:'10px', cursor:'pointer', textAlign:'left', fontFamily:'inherit' },
  cardTitle:       { color:'#f0e6d2', fontWeight:'600', fontSize:'1rem', marginBottom:'4px' },
  cardSub:         { fontSize:'0.78rem', color:'#c8a96e' },
  chapterGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(58px, 1fr))',
                     gap:'10px', maxWidth:'700px', margin:'0 auto' },
  chapterBtn:      { background:'rgba(255,255,255,0.04)',
                     border:'1px solid rgba(240,192,64,0.4)', color:'#f0c040',
                     borderRadius:'50%', width:'54px', height:'54px',
                     display:'flex', alignItems:'center', justifyContent:'center',
                     cursor:'pointer', fontFamily:'inherit', fontSize:'1.05rem' },
  topBar:          { display:'flex', justifyContent:'space-between', alignItems:'center',
                     maxWidth:'860px', margin:'0 auto 2rem' },
  readerHeader:    { display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                     maxWidth:'860px', margin:'0 auto 2rem', flexWrap:'wrap', gap:'1rem' },
  readerCenter:    { flex:1, textAlign:'center', minWidth:'200px' },
  readerTitle:     { fontSize:'2rem', color:'#f0c040', margin:'0 0 0.5rem', fontWeight:'700' },
  select:          { background:'#1c1008', color:'#f0e6d2', border:'1px solid #f0c040',
                     padding:'7px 12px', borderRadius:'8px', fontFamily:'inherit',
                     fontSize:'0.95rem', width:'100%', maxWidth:'340px', cursor:'pointer' },
  transDesc:       { fontSize:'0.82rem', color:'#c8a96e', fontStyle:'italic', marginTop:'5px' },
  backBtn:         { background:'transparent', border:'none', color:'#c8a96e',
                     cursor:'pointer', fontSize:'1rem', fontFamily:'inherit', padding:'6px 0' },
  listenBtn:       { padding:'10px 22px', borderRadius:'25px', border:'1px solid #f0c040',
                     color:'#f0c040', background:'transparent', cursor:'pointer',
                     fontFamily:'inherit', fontSize:'1rem' },
  retryBtn:        { padding:'10px 20px', borderRadius:'25px', border:'1px solid #e67e22',
                     color:'#e67e22', background:'transparent', cursor:'pointer',
                     fontFamily:'inherit', fontSize:'1rem' },
  btnRow:          { display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' },
  iconBtn:         { background:'rgba(240,192,64,0.08)', border:'1px solid rgba(240,192,64,0.3)',
                     color:'#f0c040', borderRadius:'20px', padding:'5px 12px',
                     cursor:'pointer', fontFamily:'inherit', fontSize:'0.9rem',
                     display:'flex', alignItems:'center', gap:'4px' },
  scriptureColumn: { maxWidth:'800px', margin:'0 auto' },
  versionBadge:    { textAlign:'center', color:'#c8a96e', fontSize:'0.95rem',
                     fontStyle:'italic', marginBottom:'2rem', paddingBottom:'1rem',
                     borderBottom:'1px solid rgba(240,192,64,0.2)' },
  verse:           { marginBottom:'1.4rem', cursor:'pointer', padding:'8px 10px',
                     borderRadius:'8px', transition:'background 0.2s',
                     lineHeight:'1.8', userSelect:'text' },
  verseActive:     { background:'rgba(240,192,64,0.12)',
                     borderLeft:'3px solid #f0c040', paddingLeft:'14px' },
  verseNum:        { color:'#f0c040', marginRight:'8px', fontWeight:'700', fontSize:'0.9rem' },
  verseText:       { fontSize:'1.4rem' },
  verseIcons:      { marginLeft:'8px', fontSize:'0.8rem', opacity:0.75 },
  centerMsg:       { textAlign:'center', fontSize:'1.15rem', color:'#f0c040',
                     marginTop:'4rem', fontStyle:'italic' },
  spinner:         { width:'40px', height:'40px',
                     border:'3px solid rgba(240,192,64,0.2)',
                     borderTop:'3px solid #f0c040', borderRadius:'50%',
                     animation:'spin 0.9s linear infinite', margin:'0 auto' },
  errorBox:        { textAlign:'center', color:'#e67e22', padding:'2.5rem 2rem',
                     border:'1px solid #e67e22', borderRadius:'14px',
                     maxWidth:'480px', margin:'3rem auto' },
  chapterNav:      { display:'flex', justifyContent:'space-between', alignItems:'center',
                     paddingTop:'2rem', borderTop:'1px solid rgba(240,192,64,0.2)',
                     maxWidth:'500px', margin:'3rem auto 0' },
  navBtn:          { padding:'10px 24px', borderRadius:'25px', border:'1px solid #f0c040',
                     color:'#f0c040', background:'transparent', cursor:'pointer',
                     fontFamily:'inherit', fontSize:'1rem' },
  navLabel:        { color:'#c8a96e', fontSize:'0.95rem', fontStyle:'italic' },
  vMenu:           { position:'absolute', left:'0', top:'100%', zIndex:150,
                     background:'#1e1005', border:'1px solid rgba(240,192,64,0.35)',
                     borderRadius:'10px', padding:'6px', minWidth:'192px',
                     boxShadow:'0 8px 32px rgba(0,0,0,0.65)',
                     animation:'fadeUp 0.15s ease' },
  mBtn:            { display:'block', width:'100%', textAlign:'left', padding:'9px 14px',
                     background:'transparent', border:'none', color:'#f0e6d2',
                     cursor:'pointer', fontFamily:'inherit', fontSize:'0.95rem',
                     borderRadius:'6px' },
  mDivider:        { padding:'6px 14px 4px', fontSize:'0.78rem', color:'#c8a96e',
                     borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:'4px' },
  colorRow:        { display:'flex', gap:'8px', padding:'6px 14px 10px', alignItems:'center' },
  colorDot:        { width:'22px', height:'22px', borderRadius:'50%', border:'none', cursor:'pointer' },
  shareLink:       { display:'block', padding:'9px 14px', color:'#f0e6d2',
                     textDecoration:'none', fontFamily:'inherit',
                     fontSize:'0.95rem', borderRadius:'6px' },
  toast:           { position:'fixed', bottom:'28px', left:'50%',
                     transform:'translateX(-50%)', background:'#2a1a08',
                     border:'1px solid #f0c040', color:'#f0e6d2',
                     padding:'12px 26px', borderRadius:'25px', zIndex:999,
                     fontSize:'1rem', boxShadow:'0 4px 20px rgba(0,0,0,0.5)',
                     animation:'fadeUp 0.2s ease', whiteSpace:'nowrap' },
  overlay:         { position:'fixed', inset:0, background:'rgba(0,0,0,0.78)',
                     zIndex:400, display:'flex', alignItems:'center',
                     justifyContent:'center', padding:'1rem' },
  modal:           { background:'#1e1005', border:'1px solid rgba(240,192,64,0.4)',
                     borderRadius:'14px', padding:'2rem', width:'100%',
                     maxWidth:'520px', animation:'fadeUp 0.2s ease' },
  modalTitle:      { color:'#f0c040', fontSize:'1.2rem', marginBottom:'1rem', fontWeight:'700' },
  noteTA:          { width:'100%', background:'#120a05',
                     border:'1px solid rgba(240,192,64,0.4)', color:'#f0e6d2',
                     borderRadius:'8px', padding:'12px', fontFamily:'inherit',
                     fontSize:'1.1rem', lineHeight:'1.7', resize:'vertical',
                     boxSizing:'border-box' },
  modalBtns:       { display:'flex', gap:'10px', marginTop:'1rem', flexWrap:'wrap' },
  modalSave:       { padding:'10px 22px', borderRadius:'25px', border:'none',
                     background:'#f0c040', color:'#1a0a00', cursor:'pointer',
                     fontFamily:'inherit', fontSize:'1rem', fontWeight:'700' },
  modalCancel:     { padding:'10px 22px', borderRadius:'25px',
                     border:'1px solid #888', background:'transparent',
                     color:'#aaa', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  hymnLibHead:     { maxWidth:'900px', margin:'0 auto 2rem', textAlign:'center' },
  hymnSub:         { color:'#c8a96e', fontStyle:'italic', fontSize:'1.05rem', margin:'-0.5rem 0 1.5rem' },
  searchWrap:      { position:'relative', maxWidth:'560px', margin:'0 auto 1.5rem',
                     display:'flex', alignItems:'center' },
  searchIcon:      { position:'absolute', left:'14px', fontSize:'1rem', pointerEvents:'none' },
  searchInput:     { width:'100%', padding:'12px 40px 12px 42px', borderRadius:'30px',
                     border:'1px solid rgba(240,192,64,0.5)',
                     background:'rgba(255,255,255,0.05)', color:'#f0e6d2',
                     fontFamily:"'Crimson Text',serif", fontSize:'1.05rem',
                     outline:'none', boxSizing:'border-box' },
  searchClear:     { position:'absolute', right:'14px', background:'none', border:'none',
                     color:'#c8a96e', cursor:'pointer', fontSize:'1rem' },
  catRow:          { display:'flex', flexWrap:'wrap', gap:'8px',
                     justifyContent:'center', marginBottom:'1.25rem' },
  catPill:         { padding:'6px 16px', borderRadius:'20px',
                     border:'1px solid rgba(240,192,64,0.35)', background:'transparent',
                     color:'#c8a96e', cursor:'pointer', fontFamily:'inherit', fontSize:'0.88rem' },
  catPillOn:       { background:'rgba(240,192,64,0.18)', border:'1px solid #f0c040',
                     color:'#f0c040', fontWeight:'700' },
  ctrlRow:         { display:'flex', justifyContent:'space-between', alignItems:'center',
                     maxWidth:'960px', margin:'0 auto 1.25rem', flexWrap:'wrap', gap:'0.5rem',
                     padding:'0 0.5rem' },
  resultCount:     { color:'#c8a96e', fontStyle:'italic', fontSize:'0.95rem' },
  sortBtn:         { padding:'5px 14px', borderRadius:'15px',
                     border:'1px solid rgba(240,192,64,0.3)', background:'transparent',
                     color:'#c8a96e', cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem' },
  sortBtnOn:       { border:'1px solid #f0c040', color:'#f0c040',
                     background:'rgba(240,192,64,0.1)' },
  hymnGrid:        { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',
                     gap:'14px', maxWidth:'960px', margin:'0 auto' },
  hymnCard:        { padding:'18px 16px 14px', background:'rgba(255,255,255,0.04)',
                     border:'1px solid rgba(240,192,64,0.2)', color:'#f0e6d2',
                     borderRadius:'12px', cursor:'pointer', textAlign:'left',
                     fontFamily:'inherit', animation:'fadeUp 0.3s ease both' },
  hymnCardTitle:   { color:'#f0e6d2', fontWeight:'700', fontSize:'1.1rem',
                     marginBottom:'4px', lineHeight:'1.3' },
  hymnCardAuthor:  { fontSize:'0.82rem', color:'#c8a96e', fontStyle:'italic', marginBottom:'10px' },
  hymnCardMeta:    { display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'6px' },
  hymnCardCat:     { fontSize:'0.75rem', padding:'2px 9px', borderRadius:'10px',
                     background:'rgba(240,192,64,0.1)', color:'#f0c040',
                     border:'1px solid rgba(240,192,64,0.3)' },
  hymnCardKey:     { fontSize:'0.75rem', padding:'2px 9px', borderRadius:'10px',
                     background:'rgba(255,255,255,0.05)', color:'#c8a96e',
                     border:'1px solid rgba(200,169,110,0.25)' },
  hymnCardSections:{ fontSize:'0.78rem', color:'#7a6040' },
  hymnEmpty:       { textAlign:'center', color:'#c8a96e', fontSize:'1.1rem',
                     marginTop:'5rem', fontStyle:'italic' },
  hymnDetailMain:  { maxWidth:'720px', margin:'0 auto' },
  hymnHero:        { textAlign:'center', marginBottom:'2rem' },
  hymnDetailTitle: { color:'#f0c040', fontSize:'2.6rem', fontWeight:'700',
                     margin:'0 0 0.4rem', lineHeight:'1.2' },
  hymnDetailAuthor:{ fontStyle:'italic', color:'#c8a96e', fontSize:'1.1rem', margin:'0 0 1.25rem' },
  metaRow:         { display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' },
  metaBadge:       { fontSize:'0.83rem', padding:'4px 12px', borderRadius:'15px',
                     background:'rgba(240,192,64,0.1)', color:'#f0c040',
                     border:'1px solid rgba(240,192,64,0.3)' },
  divider:         { textAlign:'center', color:'#f0c040', fontSize:'1.5rem',
                     margin:'2rem 0', letterSpacing:'1rem' },
  hymnVerseList:   { display:'flex', flexDirection:'column', gap:'2rem' },
  hymnVerseBlock:  { position:'relative', padding:'1.4rem 1.6rem',
                     background:'rgba(255,255,255,0.03)', borderRadius:'12px',
                     border:'1px solid rgba(240,192,64,0.15)',
                     borderLeft:'3px solid rgba(240,192,64,0.5)' },
  hymnVerseLabel:  { color:'#f0c040', fontSize:'0.88rem', fontWeight:'700',
                     textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.6rem' },
  hymnVerseText:   { whiteSpace:'pre-wrap', fontSize:'1.35rem', color:'#f0e6d2',
                     fontFamily:"'Crimson Text',serif", lineHeight:'2', margin:0 },
  singBtn:         { position:'absolute', top:'12px', right:'12px', background:'transparent',
                     border:'1px solid rgba(240,192,64,0.3)', borderRadius:'50%',
                     width:'34px', height:'34px', cursor:'pointer', fontSize:'0.85rem',
                     display:'flex', alignItems:'center', justifyContent:'center',
                     color:'#f0c040' },
}