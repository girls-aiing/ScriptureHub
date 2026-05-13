// ══════════════════════════════════════════════════════════════════
// useTranslation — safe shortcut hook for any component
// Usage:  const { t, lang, isRTL } = useTranslation()
//         <h1>{t('welcomeTitle')}</h1>
// ══════════════════════════════════════════════════════════════════
export { useLanguage as useTranslation } from '../context/LanguageContext.jsx'