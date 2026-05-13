import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ══════════════════════════════════════════════════════════════════
// SUPPORTED LANGUAGES
// ══════════════════════════════════════════════════════════════════
export const LANGUAGES = [
  { code: 'en', name: 'English',    nativeName: 'English',    flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'French',     nativeName: 'Français',   flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',    flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português',  flag: '🇧🇷', dir: 'ltr' },
  { code: 'yo', name: 'Yoruba',     nativeName: 'Yorùbá',     flag: '🇳🇬', dir: 'ltr' },
  { code: 'ig', name: 'Igbo',       nativeName: 'Igbo',       flag: '🇳🇬', dir: 'ltr' },
  { code: 'ha', name: 'Hausa',      nativeName: 'Hausa',      flag: '🇳🇬', dir: 'ltr' },
  { code: 'sw', name: 'Swahili',    nativeName: 'Kiswahili',  flag: '🇰🇪', dir: 'ltr' },
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh', name: 'Chinese',    nativeName: '中文',        flag: '🇨🇳', dir: 'ltr' },
]

// ══════════════════════════════════════════════════════════════════
// MASTER TRANSLATION DICTIONARY
// Every key used anywhere in the app lives here.
// If a translation is missing, English is shown as fallback.
// ══════════════════════════════════════════════════════════════════
const TRANSLATIONS = {

  // ── NAVIGATION ───────────────────────────────────────────────
  home:               { en:'Home',          fr:'Accueil',       es:'Inicio',        pt:'Início',       yo:'Ilé',           ig:'Ụlọ',          ha:'Gida',         sw:'Nyumbani',     ar:'الرئيسية',      zh:'主页' },
  bible:              { en:'Bible',          fr:'Bible',         es:'Biblia',        pt:'Bíblia',       yo:'Bibeli',        ig:'Baịbụl',       ha:'Littafi Mai',  sw:'Biblia',       ar:'الكتاب المقدس', zh:'圣经' },
  quizzes:            { en:'Quizzes',        fr:'Quiz',          es:'Cuestionarios', pt:'Questionários',yo:'Idanwo',        ig:'Ule',          ha:'Tambayoyi',    sw:'Maswali',      ar:'اختبارات',      zh:'测验' },
  games:              { en:'Games',          fr:'Jeux',          es:'Juegos',        pt:'Jogos',        yo:'Ere',           ig:'Egwuregwu',    ha:'Wasanni',      sw:'Michezo',      ar:'ألعاب',         zh:'游戏' },
  community:          { en:'Community',      fr:'Communauté',    es:'Comunidad',     pt:'Comunidade',   yo:'Àwùjọ',        ig:'Obodo',        ha:'Al\'umma',     sw:'Jamii',        ar:'المجتمع',       zh:'社区' },
  settings:           { en:'Settings',       fr:'Paramètres',    es:'Configuración', pt:'Configurações',yo:'Ètò',          ig:'Ntọala',       ha:'Saiti',        sw:'Mipangilio',   ar:'الإعدادات',     zh:'设置' },
  aiAdvisor:          { en:'AI Advisor',     fr:'Conseiller IA', es:'Asesor IA',     pt:'Consultor IA', yo:'Olùkọ AI',     ig:'Ndụmọdụ AI',   ha:'Mai Shawara AI',sw:'Mshauri AI',   ar:'مستشار الذكاء', zh:'AI顾问' },
  discover:           { en:'Discover',       fr:'Découvrir',     es:'Descubrir',     pt:'Descobrir',    yo:'Ṣàwárí',       ig:'Chọpụta',      ha:'Gano',         sw:'Gundua',       ar:'اكتشف',         zh:'发现' },
  myJourney:          { en:'My Journey',     fr:'Mon Parcours',  es:'Mi Camino',     pt:'Minha Jornada',yo:'Ìrìn Mi',      ig:'Njem M',       ha:'Tafiyata',     sw:'Safari Yangu', ar:'رحلتي',         zh:'我的旅程' },

  // ── HOME PAGE ────────────────────────────────────────────────
  welcomeTitle:       { en:'Welcome to ScriptureHub',                    fr:'Bienvenue sur ScriptureHub',              es:'Bienvenido a ScriptureHub',               pt:'Bem-vindo ao ScriptureHub',               yo:'Ẹ káàbọ̀ sí ScriptureHub',                ig:'Nnọọ na ScriptureHub',                    ha:'Barka da zuwa ScriptureHub',              sw:'Karibu ScriptureHub',                     ar:'مرحباً بك في ScriptureHub',               zh:'欢迎来到ScriptureHub' },
  welcomeSub:         { en:'Your sacred digital companion for the Word of God', fr:'Votre compagnon numérique sacré pour la Parole de Dieu', es:'Tu compañero digital sagrado para la Palabra de Dios', pt:'Seu companheiro digital sagrado para a Palavra de Deus', yo:'Ẹlẹgbẹ́ rẹ tó mọ́ fún Ọ̀rọ̀ Ọlọ́run', ig:'Enyi gị dị nsọ maka Okwu Chukwu',        ha:'Abokin dijital mai tsarki don Maganar Allah', sw:'Mwenzako wako mtakatifu wa kidijitali kwa Neno la Mungu', ar:'رفيقك الرقمي المقدس لكلمة الله',          zh:'您神圣的数字圣经伴侣' },
  verseOfDay:         { en:'Verse of the Day',                           fr:'Verset du Jour',                          es:'Versículo del Día',                       pt:'Versículo do Dia',                        yo:'Ẹsẹ Ọjọ́ Yìí',                           ig:'Edemede Nke Ụbọchị',                      ha:'Aya ta Yau',                              sw:'Aya ya Leo',                              ar:'آية اليوم',                               zh:'每日经文' },
  readBible:          { en:'Read the Bible',                             fr:'Lire la Bible',                           es:'Leer la Biblia',                          pt:'Ler a Bíblia',                            yo:'Ka Bibeli',                               ig:'Gụọ Baịbụl',                              ha:'Karanta Littafi Mai Tsarki',              sw:'Soma Biblia',                             ar:'اقرأ الكتاب المقدس',                      zh:'阅读圣经' },
  startLearning:      { en:'Start Learning',                             fr:'Commencer à Apprendre',                   es:'Empezar a Aprender',                      pt:'Começar a Aprender',                      yo:'Bẹ̀rẹ̀ Ìkẹ́kọ̀ọ́',                         ig:'Bido Ịmụta',                              ha:'Fara Koyo',                               sw:'Anza Kujifunza',                          ar:'ابدأ التعلم',                             zh:'开始学习' },
  exploreFeatures:    { en:'Explore Features',                           fr:'Explorer les Fonctionnalités',            es:'Explorar Funciones',                      pt:'Explorar Recursos',                       yo:'Ṣàwárí Àwọn Ẹ̀yà',                       ig:'Nyochaa Atụmatụ',                         ha:'Bincika Fasaloli',                        sw:'Chunguza Vipengele',                      ar:'استكشف الميزات',                          zh:'探索功能' },

  // ── BIBLE READER ─────────────────────────────────────────────
  bibleReader:        { en:'Bible Reader',       fr:'Lecteur de Bible',    es:'Lector de Biblia',    pt:'Leitor de Bíblia',    yo:'Olùkà Bibeli',        ig:'Onye Gụọ Baịbụl',     ha:'Mai Karanta Littafi', sw:'Msomaji wa Biblia',   ar:'قارئ الكتاب المقدس',  zh:'圣经阅读器' },
  selectBook:         { en:'Select Book',        fr:'Choisir un Livre',    es:'Seleccionar Libro',   pt:'Selecionar Livro',    yo:'Yan Ìwé',             ig:'Họrọ Akwụkwọ',        ha:'Zaɓi Littafi',        sw:'Chagua Kitabu',       ar:'اختر الكتاب',         zh:'选择书卷' },
  selectChapter:      { en:'Select Chapter',     fr:'Choisir un Chapitre', es:'Seleccionar Capítulo',pt:'Selecionar Capítulo', yo:'Yan Orí Ìwé',         ig:'Họrọ Isi Ọdịnala',    ha:'Zaɓi Babi',           sw:'Chagua Sura',         ar:'اختر الفصل',          zh:'选择章节' },
  translation:        { en:'Translation',        fr:'Traduction',          es:'Traducción',          pt:'Tradução',            yo:'Ìtumọ̀',              ig:'Ntụgharị',            ha:'Fassara',             sw:'Tafsiri',             ar:'الترجمة',             zh:'译本' },
  oldTestament:       { en:'Old Testament',      fr:'Ancien Testament',    es:'Antiguo Testamento',  pt:'Antigo Testamento',   yo:'Majẹmu Láéláé',       ig:'Akwụkwọ Ochie',       ha:'Tsohon Alkawari',     sw:'Agano la Kale',       ar:'العهد القديم',        zh:'旧约' },
  newTestament:       { en:'New Testament',      fr:'Nouveau Testament',   es:'Nuevo Testamento',    pt:'Novo Testamento',     yo:'Majẹmu Tuntun',       ig:'Akwụkwọ Ọhụrụ',      ha:'Sabon Alkawari',      sw:'Agano Jipya',         ar:'العهد الجديد',        zh:'新约' },
  loading:            { en:'Loading…',           fr:'Chargement…',         es:'Cargando…',           pt:'Carregando…',         yo:'Ń gbé wọlé…',         ig:'Na-ebugharị…',         ha:'Ana lodi…',           sw:'Inapakia…',           ar:'جارٍ التحميل…',       zh:'加载中…' },
  copyVerse:          { en:'Copy Verse',         fr:'Copier le Verset',    es:'Copiar Versículo',    pt:'Copiar Versículo',    yo:'Daakọ Ẹsẹ',           ig:'Detuo Edemede',       ha:'Kwafi Aya',           sw:'Nakili Aya',          ar:'نسخ الآية',           zh:'复制经文' },
  shareVerse:         { en:'Share Verse',        fr:'Partager le Verset',  es:'Compartir Versículo', pt:'Compartilhar Versículo',yo:'Pín Ẹsẹ',            ig:'Kekọrịta Edemede',    ha:'Raba Aya',            sw:'Shiriki Aya',         ar:'مشاركة الآية',        zh:'分享经文' },
  addNote:            { en:'Add Note',           fr:'Ajouter une Note',    es:'Agregar Nota',        pt:'Adicionar Nota',      yo:'Ṣàfikún Àkọsílẹ̀',   ig:'Tinye Ndekọ',         ha:'Ƙara Bayani',         sw:'Ongeza Kumbuka',      ar:'إضافة ملاحظة',        zh:'添加笔记' },
  highlight:          { en:'Highlight',          fr:'Surligner',           es:'Resaltar',            pt:'Destacar',            yo:'Ṣàmì',                ig:'Kọwapụta',            ha:'Haskaka',             sw:'Angazia',             ar:'تمييز',               zh:'高亮' },

  // ── KNOWLEDGE HUB / QUIZZES ───────────────────────────────────
  knowledgeHub:       { en:'Knowledge Hub',      fr:'Centre de Savoir',    es:'Centro de Conocimiento',pt:'Centro de Conhecimento',yo:'Ibi Ìmọ̀',          ig:'Ebe Ihe Ọmụma',       ha:'Cibiyar Ilimi',       sw:'Kituo cha Maarifa',   ar:'مركز المعرفة',        zh:'知识中心' },
  startQuiz:          { en:'Start Quiz',         fr:'Commencer le Quiz',   es:'Iniciar Cuestionario', pt:'Iniciar Questionário', yo:'Bẹ̀rẹ̀ Idanwo',       ig:'Bido Ule',            ha:'Fara Tambayoyi',      sw:'Anza Maswali',        ar:'ابدأ الاختبار',       zh:'开始测验' },
  score:              { en:'Score',              fr:'Score',               es:'Puntuación',           pt:'Pontuação',           yo:'Àmì',                 ig:'Nkọwa',               ha:'Maki',                sw:'Alama',               ar:'النتيجة',             zh:'分数' },
  correct:            { en:'Correct!',           fr:'Correct !',           es:'¡Correcto!',           pt:'Correto!',            yo:'Ó tọ̀!',              ig:'Ọ dị mma!',           ha:'Daidai!',             sw:'Sahihi!',             ar:'صحيح!',               zh:'正确！' },
  incorrect:          { en:'Incorrect',          fr:'Incorrect',           es:'Incorrecto',           pt:'Incorreto',           yo:'Kò tọ̀',              ig:'Ọ dịghị mma',         ha:'Ba daidai ba',        sw:'Si sahihi',           ar:'غير صحيح',            zh:'错误' },
  nextQuestion:       { en:'Next Question',      fr:'Question Suivante',   es:'Siguiente Pregunta',   pt:'Próxima Pergunta',    yo:'Ìbéèrè Tó Kàn',      ig:'Ajụjụ Ọzọ',           ha:'Tambaya Ta Gaba',     sw:'Swali Lijalo',        ar:'السؤال التالي',       zh:'下一题' },
  tryAgain:           { en:'Try Again',          fr:'Réessayer',           es:'Intentar de Nuevo',    pt:'Tentar Novamente',    yo:'Gbìyànjú Lẹ́ẹ̀kan Sí',ig:'Nwaa Ọzọ',           ha:'Sake Gwadawa',        sw:'Jaribu Tena',         ar:'حاول مرة أخرى',      zh:'再试一次' },
  difficulty:         { en:'Difficulty',         fr:'Difficulté',          es:'Dificultad',           pt:'Dificuldade',         yo:'Ìṣòro',               ig:'Isi Ike',             ha:'Wahala',              sw:'Ugumu',               ar:'الصعوبة',             zh:'难度' },
  beginner:           { en:'Beginner',           fr:'Débutant',            es:'Principiante',         pt:'Iniciante',           yo:'Olùbẹ̀rẹ̀',           ig:'Onye Mbido',          ha:'Farawa',              sw:'Mwanzo',              ar:'مبتدئ',               zh:'初级' },
  intermediate:       { en:'Intermediate',       fr:'Intermédiaire',       es:'Intermedio',           pt:'Intermediário',       yo:'Àárín',               ig:'Etiti',               ha:'Matsakaici',          sw:'Kati',                ar:'متوسط',               zh:'中级' },
  advanced:           { en:'Advanced',           fr:'Avancé',              es:'Avanzado',             pt:'Avançado',            yo:'Gíga',                ig:'Dị elu',              ha:'Ci gaba',             sw:'Juu',                 ar:'متقدم',               zh:'高级' },

  // ── AI ADVISOR ───────────────────────────────────────────────
  askQuestion:        { en:'Ask a question…',    fr:'Poser une question…', es:'Hacer una pregunta…', pt:'Fazer uma pergunta…', yo:'Béèrè ìbéèrè…',       ig:'Jụọ ajụjụ…',         ha:'Yi tambaya…',         sw:'Uliza swali…',        ar:'اطرح سؤالاً…',       zh:'提问…' },
  send:               { en:'Send',               fr:'Envoyer',             es:'Enviar',              pt:'Enviar',              yo:'Rán',                  ig:'Zipu',                ha:'Aika',                sw:'Tuma',                ar:'إرسال',               zh:'发送' },
  thinking:           { en:'Thinking…',          fr:'Réflexion…',          es:'Pensando…',           pt:'Pensando…',           yo:'Ń ronú…',              ig:'Na-echeche…',         ha:'Yana tunani…',        sw:'Inafikiri…',          ar:'يفكر…',               zh:'思考中…' },
  clearChat:          { en:'Clear Chat',         fr:'Effacer le Chat',     es:'Limpiar Chat',        pt:'Limpar Chat',         yo:'Mọ́ Ìjíròrò',         ig:'Hichapụ Mkparịta',    ha:'Share Hira',          sw:'Futa Mazungumzo',     ar:'مسح المحادثة',        zh:'清除聊天' },
  suggestedQuestions: { en:'Suggested Questions',fr:'Questions Suggérées', es:'Preguntas Sugeridas', pt:'Perguntas Sugeridas', yo:'Àwọn Ìbéèrè Tí A Dábàá',ig:'Ajụjụ A Tụpụtara', ha:'Tambayoyin da aka ba da shawara',sw:'Maswali Yaliyopendekezwa',ar:'أسئلة مقترحة',       zh:'建议问题' },

  // ── AI DEEP SEARCH ───────────────────────────────────────────
  deepSearch:         { en:'AI Deep Search',     fr:'Recherche Profonde IA',es:'Búsqueda Profunda IA',pt:'Busca Profunda IA',  yo:'Àwárí Jíjinlẹ̀ AI',   ig:'Nchọta Omimi AI',     ha:'Bincike Mai Zurfi AI',sw:'Utafutaji wa Kina AI', ar:'البحث العميق بالذكاء',zh:'AI深度搜索' },
  searchPlaceholder:  { en:'Type how you feel or what you need…', fr:'Tapez ce que vous ressentez ou ce dont vous avez besoin…', es:'Escribe cómo te sientes o lo que necesitas…', pt:'Digite como você se sente ou o que precisa…', yo:'Kọ bí o ṣe nímọ̀ràn tàbí ohun tí o nílò…', ig:'Dee ka ị na-enwe mmetụta ma ọ bụ ihe ị chọrọ…', ha:'Rubuta yadda kake ji ko abin da kake bukata…', sw:'Andika jinsi unavyohisi au unachohitaji…', ar:'اكتب كيف تشعر أو ما تحتاجه…', zh:'输入您的感受或需求…' },
  searchResults:      { en:'verses found',       fr:'versets trouvés',     es:'versículos encontrados',pt:'versículos encontrados',yo:'àwọn ẹsẹ tí a rí',   ig:'edemede achọtara',    ha:'ayoyin da aka samu', sw:'aya zilizopatikana',  ar:'آيات وجدت',           zh:'节经文已找到' },
  bestMatch:          { en:'Best Match',         fr:'Meilleure Correspondance',es:'Mejor Coincidencia',pt:'Melhor Correspondência',yo:'Ìdáhùn Tó Dára Jù', ig:'Nzaghachi Kachasị Mma',ha:'Mafi Dacewa',        sw:'Inayofaa Zaidi',      ar:'أفضل تطابق',          zh:'最佳匹配' },
  aiInsight:          { en:'AI Scripture Insight',fr:'Aperçu Scripturaire IA',es:'Perspectiva Escritural IA',pt:'Perspectiva Escritural IA',yo:'Ìmọ̀ Ìwé Mímọ́ AI', ig:'Nghọta Akwụkwọ Nsọ AI',ha:'Fahimtar Nassi AI',  sw:'Ufahamu wa Maandiko AI',ar:'رؤية الكتاب المقدس بالذكاء',zh:'AI圣经洞察' },
  whyThisVerse:       { en:'Why this verse',     fr:'Pourquoi ce verset',  es:'Por qué este versículo',pt:'Por que este versículo',yo:'Ìdí tí ẹsẹ yìí',    ig:'Ihe mere edemede a',  ha:'Me yasa wannan aya', sw:'Kwa nini aya hii',    ar:'لماذا هذه الآية',     zh:'为什么是这节经文' },
  readInContext:      { en:'Read in Context',    fr:'Lire en Contexte',    es:'Leer en Contexto',    pt:'Ler em Contexto',     yo:'Ka Ní Ìtẹ̀síwájú',    ig:'Gụọ N\'ọnọdụ Ya',    ha:'Karanta a Mahallin', sw:'Soma katika Muktadha',ar:'اقرأ في السياق',       zh:'在上下文中阅读' },
  recentSearches:     { en:'Recent Searches',    fr:'Recherches Récentes', es:'Búsquedas Recientes', pt:'Pesquisas Recentes',  yo:'Àwọn Àwárí Àìpẹ́',   ig:'Nchọta Ọhụrụ',       ha:'Bincike na Kwanan Nan',sw:'Utafutaji wa Hivi Karibuni',ar:'عمليات البحث الأخيرة',zh:'最近搜索' },

  // ── PRAYER JOURNAL ───────────────────────────────────────────
  prayerJournal:      { en:'Prayer Journal',     fr:'Journal de Prière',   es:'Diario de Oración',   pt:'Diário de Oração',    yo:'Ìwé Àdúrà',           ig:'Akwụkwọ Ekpere',      ha:'Littafin Addu\'a',    sw:'Jarida la Maombi',    ar:'مجلة الصلاة',         zh:'祷告日记' },
  newPrayer:          { en:'New Prayer Request', fr:'Nouvelle Demande de Prière',es:'Nueva Petición de Oración',pt:'Novo Pedido de Oração',yo:'Àdúrà Tuntun',       ig:'Arịọ Ekpere Ọhụrụ',  ha:'Sabuwar Addu\'a',     sw:'Ombi Jipya la Maombi',ar:'طلب صلاة جديد',       zh:'新祷告请求' },
  activePrayers:      { en:'Active Prayers',     fr:'Prières Actives',     es:'Oraciones Activas',   pt:'Orações Ativas',      yo:'Àwọn Àdúrà Tó Ń Lọ', ig:'Ekpere Na-arụ Ọrụ',   ha:'Addu\'o\'in da ke aiki',sw:'Maombi Yanayoendelea',ar:'الصلوات النشطة',      zh:'进行中的祷告' },
  answeredPrayers:    { en:'Answered Prayers',   fr:'Prières Exaucées',    es:'Oraciones Respondidas',pt:'Orações Respondidas', yo:'Àwọn Àdúrà Tí A Dáhùn',ig:'Ekpere Nzaghachi',   ha:'Addu\'o\'in da aka amsa',sw:'Maombi Yaliyojibiwa',ar:'الصلوات المستجابة',   zh:'已回应的祷告' },
  markAnswered:       { en:'Mark as Answered',   fr:'Marquer comme Exaucée',es:'Marcar como Respondida',pt:'Marcar como Respondida',yo:'Ṣàmì Gẹ́gẹ́ bí Ìdáhùn',ig:'Kọọ dị ka Nzaghachi',ha:'Alama a matsayin Amsa',sw:'Weka Alama kama Iliyojibiwa',ar:'وضع علامة كمستجابة',zh:'标记为已回应' },
  prayerCategory:     { en:'Category',           fr:'Catégorie',           es:'Categoría',           pt:'Categoria',           yo:'Ẹ̀ka',                ig:'Ụdị',                 ha:'Rukuni',              sw:'Kategoria',           ar:'الفئة',               zh:'类别' },
  personal:           { en:'Personal',           fr:'Personnel',           es:'Personal',            pt:'Pessoal',             yo:'Ti Ara Ẹni',           ig:'Onwe Onye',           ha:'Na Mutum',            sw:'Binafsi',             ar:'شخصي',                zh:'个人' },
  family:             { en:'Family',             fr:'Famille',             es:'Familia',             pt:'Família',             yo:'Ẹbí',                 ig:'Ezinụlọ',             ha:'Iyali',               sw:'Familia',             ar:'العائلة',             zh:'家庭' },
  health:             { en:'Health',             fr:'Santé',               es:'Salud',               pt:'Saúde',               yo:'Ìlera',               ig:'Ahụike',              ha:'Lafiya',              sw:'Afya',                ar:'الصحة',               zh:'健康' },
  provision:          { en:'Provision',          fr:'Provision',           es:'Provisión',           pt:'Provisão',            yo:'Ìpèsè',               ig:'Nchekwa',             ha:'Tanadi',              sw:'Mahitaji',            ar:'الرزق',               zh:'供应' },
  guidance:           { en:'Guidance',           fr:'Guidance',            es:'Guía',                pt:'Orientação',          yo:'Ìtọ́sọ́nà',           ig:'Nduzi',               ha:'Jagoranci',           sw:'Mwongozo',            ar:'التوجيه',             zh:'引导' },

  // ── BIBLE MAPS ───────────────────────────────────────────────
  bibleMaps:          { en:'Bible Maps',         fr:'Cartes Bibliques',    es:'Mapas Bíblicos',      pt:'Mapas Bíblicos',      yo:'Àwòrán Bibeli',       ig:'Maapụ Baịbụl',        ha:'Taswirorin Littafi',  sw:'Ramani za Biblia',    ar:'خرائط الكتاب المقدس', zh:'圣经地图' },
  timelines:          { en:'Timelines',          fr:'Chronologies',        es:'Líneas de Tiempo',    pt:'Linhas do Tempo',     yo:'Àkókò Ìtàn',          ig:'Usoro Oge',           ha:'Tarihin Lokaci',      sw:'Mstari wa Wakati',    ar:'الجداول الزمنية',     zh:'时间线' },
  interactiveMaps:    { en:'Interactive Maps',   fr:'Cartes Interactives', es:'Mapas Interactivos',  pt:'Mapas Interativos',   yo:'Àwòrán Tó Ń Ṣiṣẹ́',  ig:'Maapụ Na-arụ Ọrụ',    ha:'Taswirorin Mu\'amala', sw:'Ramani za Mwingiliano',ar:'الخرائط التفاعلية',   zh:'互动地图' },
  locations:          { en:'locations',          fr:'emplacements',        es:'ubicaciones',         pt:'localizações',        yo:'àwọn ibi',            ig:'ọnọdụ',               ha:'wurare',              sw:'maeneo',              ar:'مواقع',               zh:'地点' },
  filterByJourney:    { en:'Filter by journey',  fr:'Filtrer par voyage',  es:'Filtrar por viaje',   pt:'Filtrar por jornada', yo:'Ṣàlẹ̀ nípasẹ̀ ìrìn',  ig:'Nyochaa site na njem', ha:'Tace ta tafiya',      sw:'Chuja kwa safari',    ar:'تصفية حسب الرحلة',   zh:'按旅程筛选' },
  allLocations:       { en:'All Locations',      fr:'Tous les Emplacements',es:'Todas las Ubicaciones',pt:'Todos os Locais',    yo:'Gbogbo Àwọn Ibi',     ig:'Ọnọdụ Niile',         ha:'Duk Wuraren',         sw:'Maeneo Yote',         ar:'جميع المواقع',        zh:'所有地点' },

  // ── SETTINGS ─────────────────────────────────────────────────
  language:           { en:'Language',           fr:'Langue',              es:'Idioma',              pt:'Idioma',              yo:'Èdè',                 ig:'Asụsụ',               ha:'Harshe',              sw:'Lugha',               ar:'اللغة',               zh:'语言' },
  selectLanguage:     { en:'Select Language',    fr:'Choisir la Langue',   es:'Seleccionar Idioma',  pt:'Selecionar Idioma',   yo:'Yan Èdè',             ig:'Họrọ Asụsụ',          ha:'Zaɓi Harshe',         sw:'Chagua Lugha',        ar:'اختر اللغة',          zh:'选择语言' },
  darkMode:           { en:'Dark Mode',          fr:'Mode Sombre',         es:'Modo Oscuro',         pt:'Modo Escuro',         yo:'Ìpele Òkùnkùn',       ig:'Ọnọdụ Ọchịchọ',       ha:'Yanayin Duhu',        sw:'Hali ya Giza',        ar:'الوضع المظلم',        zh:'深色模式' },
  voiceGuide:         { en:'Voice Guide',        fr:'Guide Vocal',         es:'Guía de Voz',         pt:'Guia de Voz',         yo:'Ìtọ́sọ́nà Ohùn',       ig:'Nduzi Olu',           ha:'Jagoran Murya',       sw:'Mwongozo wa Sauti',   ar:'الدليل الصوتي',       zh:'语音向导' },
  notifications:      { en:'Notifications',      fr:'Notifications',       es:'Notificaciones',      pt:'Notificações',        yo:'Ìfitónilétí',         ig:'Ọkwa',                ha:'Sanarwa',             sw:'Arifa',               ar:'الإشعارات',           zh:'通知' },
  saveSettings:       { en:'Save Settings',      fr:'Enregistrer',         es:'Guardar Configuración',pt:'Salvar Configurações',yo:'Pamọ́ Ètò',            ig:'Chekwaa Ntọala',      ha:'Ajiye Saiti',         sw:'Hifadhi Mipangilio',  ar:'حفظ الإعدادات',       zh:'保存设置' },
  resetSettings:      { en:'Reset to Default',   fr:'Réinitialiser',       es:'Restablecer',         pt:'Redefinir',           yo:'Padà Sí Ìpilẹ̀ṣẹ̀',   ig:'Weghachi na Mbido',   ha:'Mayar da Asali',      sw:'Rejesha Mipangilio',  ar:'إعادة الضبط',         zh:'重置默认' },
  fontSize:           { en:'Font Size',          fr:'Taille de Police',    es:'Tamaño de Fuente',    pt:'Tamanho da Fonte',    yo:'Ìwọ̀n Lẹ́tà',         ig:'Nha Mkpụrụedemede',   ha:'Girman Rubutu',       sw:'Ukubwa wa Fonti',     ar:'حجم الخط',            zh:'字体大小' },
  small:              { en:'Small',              fr:'Petit',               es:'Pequeño',             pt:'Pequeno',             yo:'Kékeré',              ig:'Obere',               ha:'Ƙarami',              sw:'Ndogo',               ar:'صغير',                zh:'小' },
  medium:             { en:'Medium',             fr:'Moyen',               es:'Mediano',             pt:'Médio',               yo:'Àárín',               ig:'Etiti',               ha:'Matsakaici',          sw:'Kati',                ar:'متوسط',               zh:'中' },
  large:              { en:'Large',              fr:'Grand',               es:'Grande',              pt:'Grande',              yo:'Nlá',                 ig:'Nnukwu',              ha:'Babba',               sw:'Kubwa',               ar:'كبير',                zh:'大' },

  // ── COMMUNITY ────────────────────────────────────────────────
  shareTestimony:     { en:'Share a Testimony',  fr:'Partager un Témoignage',es:'Compartir un Testimonio',pt:'Compartilhar Testemunho',yo:'Pín Ẹ̀rí',         ig:'Kekọrịta Àkà',        ha:'Raba Shaida',         sw:'Shiriki Ushuhuda',    ar:'شارك شهادة',          zh:'分享见证' },
  communityWall:      { en:'Community Wall',     fr:'Mur Communautaire',   es:'Muro Comunitario',    pt:'Mural da Comunidade', yo:'Ògiri Àwùjọ',         ig:'Mgbidi Obodo',        ha:'Bangon Al\'umma',     sw:'Ukuta wa Jamii',      ar:'جدار المجتمع',        zh:'社区墙' },
  post:               { en:'Post',               fr:'Publier',             es:'Publicar',            pt:'Publicar',            yo:'Firanṣẹ́',            ig:'Bipụta',              ha:'Buga',                sw:'Chapisha',            ar:'نشر',                 zh:'发布' },
  like:               { en:'Like',               fr:'Aimer',               es:'Me gusta',            pt:'Curtir',              yo:'Fẹ́ràn',              ig:'Hụ n\'anya',          ha:'So',                  sw:'Penda',               ar:'إعجاب',               zh:'点赞' },

  // ── GAMES ────────────────────────────────────────────────────
  playNow:            { en:'Play Now',           fr:'Jouer Maintenant',    es:'Jugar Ahora',         pt:'Jogar Agora',         yo:'Ṣeré Báyìí',          ig:'Grịa Ugbu a',         ha:'Buga Yanzu',          sw:'Cheza Sasa',          ar:'العب الآن',           zh:'立即游戏' },
  yourScore:          { en:'Your Score',         fr:'Votre Score',         es:'Tu Puntuación',       pt:'Sua Pontuação',       yo:'Àmì Rẹ',              ig:'Nkọwa Gị',            ha:'Makin ka',            sw:'Alama Yako',          ar:'نتيجتك',              zh:'你的分数' },
  timeLeft:           { en:'Time Left',          fr:'Temps Restant',       es:'Tiempo Restante',     pt:'Tempo Restante',      yo:'Àkókò Tó Kù',         ig:'Oge Fọdụrụ',          ha:'Lokaci da ya rage',   sw:'Muda Uliobaki',       ar:'الوقت المتبقي',       zh:'剩余时间' },
  gameOver:           { en:'Game Over',          fr:'Jeu Terminé',         es:'Juego Terminado',     pt:'Jogo Encerrado',      yo:'Eré Ti Parí',         ig:'Egwuregwu Agwụla',    ha:'Wasan ya ƙare',       sw:'Mchezo Umekwisha',    ar:'انتهت اللعبة',        zh:'游戏结束' },
  playAgain:          { en:'Play Again',         fr:'Rejouer',             es:'Jugar de Nuevo',      pt:'Jogar Novamente',     yo:'Ṣeré Lẹ́ẹ̀kan Sí',    ig:'Grịa Ọzọ',            ha:'Sake Buga',           sw:'Cheza Tena',          ar:'العب مرة أخرى',      zh:'再玩一次' },
  hint:               { en:'Hint',               fr:'Indice',              es:'Pista',               pt:'Dica',                yo:'Ìtọ́kasí',            ig:'Ntuziaka',            ha:'Shawarwari',          sw:'Kidokezo',            ar:'تلميح',               zh:'提示' },
  submit:             { en:'Submit',             fr:'Soumettre',           es:'Enviar',              pt:'Enviar',              yo:'Fún',                 ig:'Nyefee',              ha:'Aika',                sw:'Wasilisha',           ar:'إرسال',               zh:'提交' },
  skip:               { en:'Skip',               fr:'Passer',              es:'Omitir',              pt:'Pular',               yo:'Fò',                  ig:'Wụfee',               ha:'Tsallake',            sw:'Ruka',                ar:'تخطي',                zh:'跳过' },

  // ── GAMES PAGE EXTRAS ────────────────────────────────────────
  backToArcade:       { en:'Back to Arcade',     fr:'Retour à l\'Arcade',  es:'Volver al Arcade',    pt:'Voltar ao Arcade',    yo:'Padà sí Arcade',      ig:'Laghachi na Arcade',  ha:'Koma Arcade',         sw:'Rudi Arcade',         ar:'العودة إلى الألعاب',  zh:'返回游戏厅' },
  chooseRank:         { en:'Choose your rank before you begin', fr:'Choisissez votre rang avant de commencer', es:'Elige tu rango antes de comenzar', pt:'Escolha seu nível antes de começar', yo:'Yan ìpele rẹ ṣáájú kí o bẹ̀rẹ̀', ig:'Họrọ ogo gị tupu ịbido', ha:'Zaɓi matsayinka kafin ka fara', sw:'Chagua cheo chako kabla ya kuanza', ar:'اختر رتبتك قبل البدء', zh:'开始前选择你的等级' },
  rank:               { en:'Rank',               fr:'Rang',                es:'Rango',               pt:'Nível',               yo:'Ìpele',               ig:'Ogo',                 ha:'Matsayi',             sw:'Cheo',                ar:'الرتبة',              zh:'等级' },
  gamesSubtitle:      { en:'16 games. Dynamic questions. Go deeper into the Word.', fr:'16 jeux. Questions dynamiques. Plongez plus profond dans la Parole.', es:'16 juegos. Preguntas dinámicas. Profundiza en la Palabra.', pt:'16 jogos. Perguntas dinâmicas. Aprofunde-se na Palavra.', yo:'Eré 16. Àwọn ìbéèrè tó yí padà. Jinlẹ̀ sí Ọ̀rọ̀ Ọlọ́run.', ig:'Egwuregwu 16. Ajụjụ ndị na-agbanwe. Banye n\'omimi na Okwu.', ha:'Wasanni 16. Tambayoyi masu canzawa. Zurfafa cikin Maganar.', sw:'Michezo 16. Maswali yanayobadilika. Ingia ndani zaidi ya Neno.', ar:'16 لعبة. أسئلة ديناميكية. تعمق في الكلمة.', zh:'16个游戏。动态问题。深入圣经。' },
  dayStreak:          { en:'Day Streak',         fr:'Série de Jours',      es:'Racha de Días',       pt:'Sequência de Dias',   yo:'Ọjọ́ Tẹ̀lé',         ig:'Ụbọchị Jikọrọ',      ha:'Jerin Kwanaki',       sw:'Mfululizo wa Siku',   ar:'سلسلة الأيام',        zh:'连续天数' },
  xpToNextRank:       { en:'XP to next rank',    fr:'XP pour le rang suivant', es:'XP para el siguiente rango', pt:'XP para o próximo nível', yo:'XP sí ìpele tó kàn',  ig:'XP na ogo ọzọ',       ha:'XP zuwa matsayi na gaba', sw:'XP hadi cheo kinachofuata', ar:'نقاط للرتبة التالية', zh:'升级所需经验' },
  xpEarned:           { en:'XP earned!',         fr:'XP gagné !',          es:'¡XP ganado!',         pt:'XP ganho!',           yo:'XP tí a jèrè!',       ig:'XP enwetara!',        ha:'An samu XP!',         sw:'XP iliyopatikana!',   ar:'تم كسب النقاط!',     zh:'获得经验值！' },
  allGames:           { en:'All Games',          fr:'Tous les Jeux',       es:'Todos los Juegos',    pt:'Todos os Jogos',      yo:'Gbogbo Eré',          ig:'Egwuregwu Niile',     ha:'Duk Wasanni',         sw:'Michezo Yote',        ar:'جميع الألعاب',        zh:'所有游戏' },
  competitive:        { en:'Competitive',        fr:'Compétitif',          es:'Competitivo',         pt:'Competitivo',         yo:'Ìdíje',               ig:'Asọmpi',              ha:'Gasa',                sw:'Ushindani',           ar:'تنافسي',              zh:'竞技' },
  discovery:          { en:'Discovery',          fr:'Découverte',          es:'Descubrimiento',      pt:'Descoberta',          yo:'Ìṣàwárí',            ig:'Nchọpụta',            ha:'Gano',                sw:'Ugunduzi',            ar:'اكتشاف',              zh:'探索' },
  strategy:           { en:'Strategy',           fr:'Stratégie',           es:'Estrategia',          pt:'Estratégia',          yo:'Ètò',                 ig:'Atụmatụ',             ha:'Dabara',              sw:'Mkakati',             ar:'استراتيجية',          zh:'策略' },
  hallOfFame:         { en:'Hall of Fame',       fr:'Temple de la Gloire', es:'Salón de la Fama',    pt:'Hall da Fama',        yo:'Gbọ̀ngàn Òkìkí',      ig:'Ụlọ Ọkachamara',      ha:'Zauren Shahara',      sw:'Ukumbi wa Umaarufu',  ar:'قاعة المشاهير',       zh:'名人堂' },
  completeGame:       { en:'Complete a game to appear here!', fr:'Complétez un jeu pour apparaître ici !', es:'¡Completa un juego para aparecer aquí!', pt:'Complete um jogo para aparecer aqui!', yo:'Parí eré kan láti farahàn níbí!', ig:'Mechaa egwuregwu ka ị pụta ebe a!', ha:'Kammala wasa don bayyana anan!', sw:'Maliza mchezo ili uonekane hapa!', ar:'أكمل لعبة لتظهر هنا!', zh:'完成一个游戏即可显示在这里！' },
  claim:              { en:'Claim',              fr:'Réclamer',            es:'Reclamar',            pt:'Reivindicar',         yo:'Gba',                 ig:'Nara',                ha:'Karɓa',               sw:'Dai',                 ar:'استلام',              zh:'领取' },
  claimXP:            { en:'Claim XP',           fr:'Réclamer XP',         es:'Reclamar XP',         pt:'Reivindicar XP',      yo:'Gba XP',              ig:'Nara XP',             ha:'Karɓi XP',            sw:'Dai XP',              ar:'استلام النقاط',       zh:'领取经验值' },
  finishClaim:        { en:'Finish & Claim XP',  fr:'Terminer et Réclamer XP', es:'Terminar y Reclamar XP', pt:'Terminar e Reivindicar XP', yo:'Parí & Gba XP',      ig:'Mechaa & Nara XP',    ha:'Gama & Karɓi XP',     sw:'Maliza & Dai XP',     ar:'إنهاء واستلام النقاط',zh:'完成并领取经验值' },


  // ── GAMES PAGE EXTRAS ────────────────────────────────────────
  backToArcade:       { en:'Back to Arcade',     fr:'Retour à l\'Arcade',  es:'Volver al Arcade',    pt:'Voltar ao Arcade',    yo:'Padà sí Arcade',      ig:'Laghachi na Arcade',  ha:'Koma Arcade',         sw:'Rudi Arcade',         ar:'العودة إلى الألعاب',  zh:'返回游戏厅' },
  chooseRank:         { en:'Choose your rank before you begin', fr:'Choisissez votre rang avant de commencer', es:'Elige tu rango antes de comenzar', pt:'Escolha seu nível antes de começar', yo:'Yan ìpele rẹ ṣáájú kí o bẹ̀rẹ̀', ig:'Họrọ ogo gị tupu ịbido', ha:'Zaɓi matsayinka kafin ka fara', sw:'Chagua cheo chako kabla ya kuanza', ar:'اختر رتبتك قبل البدء', zh:'开始前选择你的等级' },
  rank:               { en:'Rank',               fr:'Rang',                es:'Rango',               pt:'Nível',               yo:'Ìpele',               ig:'Ogo',                 ha:'Matsayi',             sw:'Cheo',                ar:'الرتبة',              zh:'等级' },
  gamesSubtitle:      { en:'16 games. Dynamic questions. Go deeper into the Word.', fr:'16 jeux. Questions dynamiques. Plongez plus profond dans la Parole.', es:'16 juegos. Preguntas dinámicas. Profundiza en la Palabra.', pt:'16 jogos. Perguntas dinâmicas. Aprofunde-se na Palavra.', yo:'Eré 16. Àwọn ìbéèrè tó yí padà. Jinlẹ̀ sí Ọ̀rọ̀ Ọlọ́run.', ig:'Egwuregwu 16. Ajụjụ ndị na-agbanwe. Banye n\'omimi na Okwu.', ha:'Wasanni 16. Tambayoyi masu canzawa. Zurfafa cikin Maganar.', sw:'Michezo 16. Maswali yanayobadilika. Ingia ndani zaidi ya Neno.', ar:'16 لعبة. أسئلة ديناميكية. تعمق في الكلمة.', zh:'16个游戏。动态问题。深入圣经。' },
  dayStreak:          { en:'Day Streak',         fr:'Série de Jours',      es:'Racha de Días',       pt:'Sequência de Dias',   yo:'Ọjọ́ Tẹ̀lé',         ig:'Ụbọchị Jikọrọ',      ha:'Jerin Kwanaki',       sw:'Mfululizo wa Siku',   ar:'سلسلة الأيام',        zh:'连续天数' },
  xpToNextRank:       { en:'XP to next rank',    fr:'XP pour le rang suivant', es:'XP para el siguiente rango', pt:'XP para o próximo nível', yo:'XP sí ìpele tó kàn',  ig:'XP na ogo ọzọ',       ha:'XP zuwa matsayi na gaba', sw:'XP hadi cheo kinachofuata', ar:'نقاط للرتبة التالية', zh:'升级所需经验' },
  xpEarned:           { en:'XP earned!',         fr:'XP gagné !',          es:'¡XP ganado!',         pt:'XP ganho!',           yo:'XP tí a jèrè!',       ig:'XP enwetara!',        ha:'An samu XP!',         sw:'XP iliyopatikana!',   ar:'تم كسب النقاط!',     zh:'获得经验值！' },
  allGames:           { en:'All Games',          fr:'Tous les Jeux',       es:'Todos los Juegos',    pt:'Todos os Jogos',      yo:'Gbogbo Eré',          ig:'Egwuregwu Niile',     ha:'Duk Wasanni',         sw:'Michezo Yote',        ar:'جميع الألعاب',        zh:'所有游戏' },
  competitive:        { en:'Competitive',        fr:'Compétitif',          es:'Competitivo',         pt:'Competitivo',         yo:'Ìdíje',               ig:'Asọmpi',              ha:'Gasa',                sw:'Ushindani',           ar:'تنافسي',              zh:'竞技' },
  discovery:          { en:'Discovery',          fr:'Découverte',          es:'Descubrimiento',      pt:'Descoberta',          yo:'Ìṣàwárí',            ig:'Nchọpụta',            ha:'Gano',                sw:'Ugunduzi',            ar:'اكتشاف',              zh:'探索' },
  strategy:           { en:'Strategy',           fr:'Stratégie',           es:'Estrategia',          pt:'Estratégia',          yo:'Ètò',                 ig:'Atụmatụ',             ha:'Dabara',              sw:'Mkakati',             ar:'استراتيجية',          zh:'策略' },
  hallOfFame:         { en:'Hall of Fame',       fr:'Temple de la Gloire', es:'Salón de la Fama',    pt:'Hall da Fama',        yo:'Gbọ̀ngàn Òkìkí',      ig:'Ụlọ Ọkachamara',      ha:'Zauren Shahara',      sw:'Ukumbi wa Umaarufu',  ar:'قاعة المشاهير',       zh:'名人堂' },
  completeGame:       { en:'Complete a game to appear here!', fr:'Complétez un jeu pour apparaître ici !', es:'¡Completa un juego para aparecer aquí!', pt:'Complete um jogo para aparecer aqui!', yo:'Parí eré kan láti farahàn níbí!', ig:'Mechaa egwuregwu ka ị pụta ebe a!', ha:'Kammala wasa don bayyana anan!', sw:'Maliza mchezo ili uonekane hapa!', ar:'أكمل لعبة لتظهر هنا!', zh:'完成一个游戏即可显示在这里！' },
  claim:              { en:'Claim',              fr:'Réclamer',            es:'Reclamar',            pt:'Reivindicar',         yo:'Gba',                 ig:'Nara',                ha:'Karɓa',               sw:'Dai',                 ar:'استلام',              zh:'领取' },
  claimXP:            { en:'Claim XP',           fr:'Réclamer XP',         es:'Reclamar XP',         pt:'Reivindicar XP',      yo:'Gba XP',              ig:'Nara XP',             ha:'Karɓi XP',            sw:'Dai XP',              ar:'استلام النقاط',       zh:'领取经验值' },
  finishClaim:        { en:'Finish & Claim XP',  fr:'Terminer et Réclamer XP', es:'Terminar y Reclamar XP', pt:'Terminar e Reivindicar XP', yo:'Parí & Gba XP',      ig:'Mechaa & Nara XP',    ha:'Gama & Karɓi XP',     sw:'Maliza & Dai XP',     ar:'إنهاء واستلام النقاط',zh:'完成并领取经验值' },


  // ── STUDY PROGRESS ───────────────────────────────────────────
  studyProgress:      { en:'Study Progress',     fr:'Progrès d\'Étude',    es:'Progreso de Estudio', pt:'Progresso de Estudo', yo:'Ìlọsíwájú Ìkẹ́kọ̀ọ́',  ig:'Ọganihu Ọmụmụ',       ha:'Ci Gaban Karatu',     sw:'Maendeleo ya Masomo', ar:'تقدم الدراسة',        zh:'学习进度' },
  chaptersRead:       { en:'Chapters Read',      fr:'Chapitres Lus',       es:'Capítulos Leídos',    pt:'Capítulos Lidos',     yo:'Àwọn Orí Tí A Ka',    ig:'Isi Ọdịnala Agụrụ',   ha:'Babi da aka karanta', sw:'Sura Zilizosomwa',    ar:'الفصول المقروءة',     zh:'已读章节' },
  booksCompleted:     { en:'Books Completed',    fr:'Livres Complétés',    es:'Libros Completados',  pt:'Livros Concluídos',   yo:'Àwọn Ìwé Tí A Parí',  ig:'Akwụkwọ Emechara',    ha:'Littattafan da aka gama',sw:'Vitabu Vilivyokamilika',ar:'الكتب المكتملة',     zh:'已完成书卷' },
  dailyGoal:          { en:'Daily Goal',         fr:'Objectif Quotidien',  es:'Meta Diaria',         pt:'Meta Diária',         yo:'Àfojúsùn Ọjọ́ Kọ̀ọ̀kan',ig:'Ebumnuche Ụbọchị',   ha:'Manufar Yau',         sw:'Lengo la Kila Siku',  ar:'الهدف اليومي',        zh:'每日目标' },
  streak:             { en:'Day Streak',         fr:'Série de Jours',      es:'Racha de Días',       pt:'Sequência de Dias',   yo:'Ọjọ́ Tó Tẹ̀lé Ara Wọn',ig:'Ụbọchị Jikọrọ',      ha:'Jerin Kwanaki',       sw:'Mfululizo wa Siku',   ar:'سلسلة الأيام',        zh:'连续天数' },

  // ── BIBLICAL SECRETS ─────────────────────────────────────────
  biblicalSecrets:    { en:'Biblical Secrets',   fr:'Secrets Bibliques',   es:'Secretos Bíblicos',   pt:'Segredos Bíblicos',   yo:'Àwọn Àṣírí Bibeli',   ig:'Ihe Nzuzo Baịbụl',    ha:'Asirin Littafi Mai',  sw:'Siri za Biblia',      ar:'أسرار الكتاب المقدس', zh:'圣经秘密' },
  revealAll:          { en:'Reveal All',         fr:'Tout Révéler',        es:'Revelar Todo',        pt:'Revelar Tudo',        yo:'Ṣàfihàn Gbogbo',      ig:'Kpughee Niile',       ha:'Bayyana Duka',        sw:'Fichua Yote',         ar:'الكشف عن الكل',       zh:'全部揭示' },
  tapToReveal:        { en:'Tap to reveal',      fr:'Appuyez pour révéler',es:'Toca para revelar',   pt:'Toque para revelar',  yo:'Tẹ láti ṣàfihàn',     ig:'Pịa ka ọ pụta',       ha:'Danna don bayyana',   sw:'Gonga kufichua',      ar:'اضغط للكشف',          zh:'点击揭示' },
  discovered:         { en:'discovered',         fr:'découverts',          es:'descubiertos',        pt:'descobertos',         yo:'tí a rí',             ig:'achọtara',            ha:'an gano',             sw:'ziligunduliwa',       ar:'مكتشف',               zh:'已发现' },

  // ── VALUES HUB ───────────────────────────────────────────────
  valuesHub:          { en:'Values Hub',         fr:'Centre des Valeurs',  es:'Centro de Valores',   pt:'Centro de Valores',   yo:'Ibi Àwọn Ìlànà',      ig:'Ebe Ụkpụrụ',          ha:'Cibiyar Dabi\'u',     sw:'Kituo cha Maadili',   ar:'مركز القيم',          zh:'价值观中心' },
  diligence:          { en:'Diligence',          fr:'Diligence',           es:'Diligencia',          pt:'Diligência',          yo:'Ìgboyà',              ig:'Ịrụ ọrụ',             ha:'Himma',               sw:'Bidii',               ar:'الاجتهاد',            zh:'勤奋' },
  integrity:          { en:'Integrity',          fr:'Intégrité',           es:'Integridad',          pt:'Integridade',         yo:'Ìmọ̀tótó',            ig:'Ezi omume',           ha:'Gaskiya',             sw:'Uadilifu',            ar:'النزاهة',             zh:'诚信' },
  leadership:         { en:'Leadership',         fr:'Leadership',          es:'Liderazgo',           pt:'Liderança',           yo:'Ìdarí',               ig:'Ndụzi',               ha:'Jagoranci',           sw:'Uongozi',             ar:'القيادة',             zh:'领导力' },

  // ── DID YOU KNOW ─────────────────────────────────────────────
  didYouKnow:         { en:'Did You Know?',      fr:'Le Saviez-Vous ?',    es:'¿Sabías Que?',        pt:'Você Sabia?',         yo:'Ṣé O Mọ̀?',           ig:'Ị Maara?',            ha:'Shin Ka Sani?',       sw:'Je, Ulijua?',         ar:'هل تعلم؟',            zh:'你知道吗？' },

  // ── GENERAL UI ───────────────────────────────────────────────
  close:              { en:'Close',              fr:'Fermer',              es:'Cerrar',              pt:'Fechar',              yo:'Tì',                  ig:'Mechie',              ha:'Rufe',                sw:'Funga',               ar:'إغلاق',               zh:'关闭' },
  back:               { en:'Back',               fr:'Retour',              es:'Atrás',               pt:'Voltar',              yo:'Padà',                ig:'Laghachi',            ha:'Koma',                sw:'Rudi',                ar:'رجوع',                zh:'返回' },
  next:               { en:'Next',               fr:'Suivant',             es:'Siguiente',           pt:'Próximo',             yo:'Tó Kàn',              ig:'Ọzọ',                 ha:'Na Gaba',             sw:'Ijayo',               ar:'التالي',              zh:'下一个' },
  previous:           { en:'Previous',           fr:'Précédent',           es:'Anterior',            pt:'Anterior',           yo:'Tó Ṣáájú',            ig:'Nke Gara Aga',        ha:'Na Baya',             sw:'Iliyopita',           ar:'السابق',              zh:'上一个' },
  search:             { en:'Search',             fr:'Rechercher',          es:'Buscar',              pt:'Pesquisar',           yo:'Wá',                  ig:'Chọọ',                ha:'Bincika',             sw:'Tafuta',              ar:'بحث',                 zh:'搜索' },
  filter:             { en:'Filter',             fr:'Filtrer',             es:'Filtrar',             pt:'Filtrar',             yo:'Ṣàlẹ̀',               ig:'Nyochaa',             ha:'Tace',                sw:'Chuja',               ar:'تصفية',               zh:'筛选' },
  share:              { en:'Share',              fr:'Partager',            es:'Compartir',           pt:'Compartilhar',        yo:'Pín',                 ig:'Kekọrịta',            ha:'Raba',                sw:'Shiriki',             ar:'مشاركة',              zh:'分享' },
  copy:               { en:'Copy',               fr:'Copier',              es:'Copiar',              pt:'Copiar',              yo:'Daakọ',               ig:'Detuo',               ha:'Kwafi',               sw:'Nakili',              ar:'نسخ',                 zh:'复制' },
  copied:             { en:'Copied!',            fr:'Copié !',             es:'¡Copiado!',           pt:'Copiado!',            yo:'A Daakọ!',            ig:'Adetuola!',           ha:'An kwafi!',           sw:'Imenakiliwa!',        ar:'تم النسخ!',           zh:'已复制！' },
  save:               { en:'Save',               fr:'Enregistrer',         es:'Guardar',             pt:'Salvar',              yo:'Pamọ́',               ig:'Chekwaa',             ha:'Ajiye',               sw:'Hifadhi',             ar:'حفظ',                 zh:'保存' },
  delete:             { en:'Delete',             fr:'Supprimer',           es:'Eliminar',            pt:'Excluir',             yo:'Parẹ́',               ig:'Hichapụ',             ha:'Share',               sw:'Futa',                ar:'حذف',                 zh:'删除' },
  cancel:             { en:'Cancel',             fr:'Annuler',             es:'Cancelar',            pt:'Cancelar',            yo:'Fagilé',              ig:'Kagbuo',              ha:'Soke',                sw:'Ghairi',              ar:'إلغاء',               zh:'取消' },
  confirm:            { en:'Confirm',            fr:'Confirmer',           es:'Confirmar',           pt:'Confirmar',           yo:'Jẹ́rìí',              ig:'Kwenye',              ha:'Tabbatar',            sw:'Thibitisha',          ar:'تأكيد',               zh:'确认' },
  yes:                { en:'Yes',                fr:'Oui',                 es:'Sí',                  pt:'Sim',                 yo:'Bẹ́ẹ̀ni',             ig:'Ee',                  ha:'Eh',                  sw:'Ndiyo',               ar:'نعم',                 zh:'是' },
  no:                 { en:'No',                 fr:'Non',                 es:'No',                  pt:'Não',                 yo:'Rárá',                ig:'Mba',                 ha:'A\'a',                sw:'Hapana',              ar:'لا',                  zh:'否' },
  error:              { en:'Something went wrong. Please try again.', fr:'Une erreur s\'est produite. Veuillez réessayer.', es:'Algo salió mal. Por favor intenta de nuevo.', pt:'Algo deu errado. Por favor tente novamente.', yo:'Ìṣòro kan wà. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí.', ig:'Ihe ọjọọ mere. Biko nwaa ọzọ.', ha:'Wani abu ya faru. Don Allah sake gwadawa.', sw:'Kuna hitilafu. Tafadhali jaribu tena.', ar:'حدث خطأ ما. يرجى المحاولة مرة أخرى.', zh:'出现错误，请重试。' },
  noResults:          { en:'No results found',   fr:'Aucun résultat trouvé',es:'No se encontraron resultados',pt:'Nenhum resultado encontrado',yo:'Kò sí ohun tí a rí',  ig:'Enweghị ihe achọtara',ha:'Ba a samu sakamako ba',sw:'Hakuna matokeo yaliyopatikana',ar:'لم يتم العثور على نتائج',zh:'未找到结果' },
  learnMore:          { en:'Learn More',         fr:'En Savoir Plus',      es:'Saber Más',           pt:'Saiba Mais',          yo:'Kọ́ Síi',             ig:'Mụta Ọzọ',            ha:'Ƙara Koyo',           sw:'Jifunze Zaidi',       ar:'اعرف المزيد',         zh:'了解更多' },
  viewAll:            { en:'View All',           fr:'Voir Tout',           es:'Ver Todo',            pt:'Ver Tudo',            yo:'Wo Gbogbo',           ig:'Hụ Niile',            ha:'Duba Duka',           sw:'Ona Yote',            ar:'عرض الكل',            zh:'查看全部' },
  by:                 { en:'by',                 fr:'par',                 es:'por',                 pt:'por',                 yo:'nípasẹ̀',             ig:'site na',             ha:'ta',                  sw:'na',                  ar:'بواسطة',              zh:'由' },
  of:                 { en:'of',                 fr:'de',                  es:'de',                  pt:'de',                  yo:'nínú',               ig:'nke',                 ha:'na',                  sw:'ya',                  ar:'من',                  zh:'的' },
  and:                { en:'and',                fr:'et',                  es:'y',                   pt:'e',                   yo:'àti',                ig:'na',                  ha:'da',                  sw:'na',                  ar:'و',                   zh:'和' },
  or:                 { en:'or',                 fr:'ou',                  es:'o',                   pt:'ou',                  yo:'tàbí',               ig:'ma ọ bụ',             ha:'ko',                  sw:'au',                  ar:'أو',                  zh:'或' },
  minutes:            { en:'minutes',            fr:'minutes',             es:'minutos',             pt:'minutos',             yo:'ìsẹ́jú',             ig:'nkeji',               ha:'mintuna',             sw:'dakika',              ar:'دقائق',               zh:'分钟' },
  days:               { en:'days',               fr:'jours',               es:'días',                pt:'dias',                yo:'ọjọ́',               ig:'ụbọchị',              ha:'kwanaki',             sw:'siku',                ar:'أيام',                zh:'天' },
  chapter:            { en:'Chapter',            fr:'Chapitre',            es:'Capítulo',            pt:'Capítulo',            yo:'Orí',                ig:'Isi Ọdịnala',         ha:'Babi',                sw:'Sura',                ar:'الفصل',               zh:'章' },
  verse:              { en:'Verse',              fr:'Verset',              es:'Versículo',           pt:'Versículo',           yo:'Ẹsẹ',                ig:'Edemede',             ha:'Aya',                 sw:'Aya',                 ar:'آية',                 zh:'节' },
  prayer:             { en:'Prayer',             fr:'Prière',              es:'Oración',             pt:'Oração',              yo:'Àdúrà',              ig:'Ekpere',              ha:'Addu\'a',             sw:'Maombi',              ar:'صلاة',                zh:'祷告' },
  amen:               { en:'Amen',               fr:'Amen',                es:'Amén',                pt:'Amém',                yo:'Àmín',               ig:'Amen',                ha:'Amin',                sw:'Amina',               ar:'آمين',                zh:'阿门' },
  god:                { en:'God',                fr:'Dieu',                es:'Dios',                pt:'Deus',                yo:'Ọlọ́run',            ig:'Chukwu',              ha:'Allah',               sw:'Mungu',               ar:'الله',                zh:'上帝' },
  jesus:              { en:'Jesus',              fr:'Jésus',               es:'Jesús',               pt:'Jesus',               yo:'Jésù',               ig:'Jizọs',               ha:'Yesu',                sw:'Yesu',                ar:'يسوع',                zh:'耶稣' },
  holy:               { en:'Holy',               fr:'Saint',               es:'Santo',               pt:'Santo',               yo:'Mímọ́',              ig:'Nsọ',                 ha:'Mai Tsarki',          sw:'Mtakatifu',           ar:'مقدس',                zh:'圣' },
  faith:              { en:'Faith',              fr:'Foi',                 es:'Fe',                  pt:'Fé',                  yo:'Ìgbàgbọ́',           ig:'Okwukwe',             ha:'Imani',               sw:'Imani',               ar:'الإيمان',             zh:'信仰' },
  love:               { en:'Love',               fr:'Amour',               es:'Amor',                pt:'Amor',                yo:'Ìfẹ́',               ig:'Ịhụnanya',            ha:'Ƙauna',               sw:'Upendo',              ar:'الحب',                zh:'爱' },
  hope:               { en:'Hope',               fr:'Espoir',              es:'Esperanza',           pt:'Esperança',           yo:'Ìrètí',              ig:'Olileanya',           ha:'Bege',                sw:'Tumaini',             ar:'الأمل',               zh:'希望' },
  peace:              { en:'Peace',              fr:'Paix',                es:'Paz',                 pt:'Paz',                 yo:'Àlàáfíà',            ig:'Udo',                 ha:'Salama',              sw:'Amani',               ar:'السلام',              zh:'平安' },
  grace:              { en:'Grace',              fr:'Grâce',               es:'Gracia',              pt:'Graça',               yo:'Oore-Ọ̀fẹ́',         ig:'Obi ọma',             ha:'Alheri',              sw:'Neema',               ar:'النعمة',              zh:'恩典' },
  wisdom:             { en:'Wisdom',             fr:'Sagesse',             es:'Sabiduría',           pt:'Sabedoria',           yo:'Ọgbọ́n',             ig:'Amamihe',             ha:'Hikima',              sw:'Hekima',              ar:'الحكمة',              zh:'智慧' },
  strength:           { en:'Strength',           fr:'Force',               es:'Fuerza',              pt:'Força',               yo:'Agbára',             ig:'Ike',                 ha:'Ƙarfi',               sw:'Nguvu',               ar:'القوة',               zh:'力量' },
  truth:              { en:'Truth',              fr:'Vérité',              es:'Verdad',              pt:'Verdade',             yo:'Òtítọ́',             ig:'Eziokwu',             ha:'Gaskiya',             sw:'Ukweli',              ar:'الحقيقة',             zh:'真理' },
  word:               { en:'Word',               fr:'Parole',              es:'Palabra',             pt:'Palavra',             yo:'Ọ̀rọ̀',              ig:'Okwu',                ha:'Maganar',             sw:'Neno',                ar:'الكلمة',              zh:'话语' },
}

// ══════════════════════════════════════════════════════════════════
// CONTEXT
// ══════════════════════════════════════════════════════════════════
const LanguageContext = createContext(null)

const STORAGE_KEY = 'scripturehub_language'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || 'en' }
    catch { return 'en' }
  })

  // Apply RTL direction to document when Arabic is selected
  useEffect(() => {
    const langObj = LANGUAGES.find(l => l.code === lang)
    document.documentElement.dir  = langObj?.dir  || 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const changeLanguage = useCallback((code) => {
    if (!LANGUAGES.find(l => l.code === code)) return
    setLang(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch {}
  }, [])

  // t(key) — safe translate with English fallback
  const t = useCallback((key) => {
    const entry = TRANSLATIONS[key]
    if (!entry) return key                    // key itself as last resort
    return entry[lang] || entry['en'] || key  // fallback to English
  }, [lang])

  // tRaw(key, langCode) — translate to a specific language
  const tRaw = useCallback((key, langCode) => {
    const entry = TRANSLATIONS[key]
    if (!entry) return key
    return entry[langCode] || entry['en'] || key
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  const value = {
    lang,
    currentLang,
    languages: LANGUAGES,
    changeLanguage,
    t,
    tRaw,
    translations: TRANSLATIONS,
    isRTL: currentLang.dir === 'rtl',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

export default LanguageContext