# BiblePath — Site Architecture Plan

> Prepared for: BiblePath development session
> Rule: Every page has ONE job. This keeps users focused and never overwhelmed.

---

## 🗺️ THE DAILY GROWTH JOURNEY

Here is how a real user moves through BiblePath from first click to final reflection:

| Step | User Action | Page They Land On | Why It Matters |
|------|-------------|-------------------|----------------|
| 1. Arrival | Sees Verse of the Day + their streak | **HomePage** | Triggers the daily habit loop immediately |
| 2. Discovery | Clicks 'Start Daily Quiz' or a 'Did You Know' card | **KnowledgeHubPage** | Moves from passive reading to active learning |
| 3. Engagement | Completes a 10-question biblical quiz | **KnowledgeHubPage** | Challenges the user and builds their profile |
| 4. Inquiry | Clicks 'Ask the AI Assistant' on a hard question | **AIConsultantPage** | Gives instant clarity before frustration sets in |
| 5. Reflection | Views updated score and monthly progress chart | **GrowthDashboardPage** | Closes the loop — the user sees real growth |

---

## 📶 THE OFFLINE FLOW

Because BiblePath promises offline access, here is the secondary journey for users with no internet:

```
User opens app on train (no Wi-Fi)
        ↓
"Offline Mode Active" toast notification appears
        ↓
User reads Bible or attempts a cached quiz
        ↓
Quiz result is saved to the device (localStorage)
        ↓
User reconnects at home → Growth Dashboard syncs silently
```

Components responsible for this flow:
- **OfflineToast** — detects connection and shows a subtle banner
- **BibleReaderPage** — loads from cached content
- **KnowledgeHubPage** — serves cached quizzes
- **GrowthDashboardPage** — reads from localStorage until sync

---

## 📄 PAGES (6 Total)

### 1. HomePage
- **Route:** `/`
- **Journey Step:** Arrival (Step 1)
- **Job (The Gateway):** First impression and daily habit trigger.
- **What it does:** Shows the Verse of the Day, the user's current streak, key feature highlights, and two bold call-to-action buttons — 'Start Daily Quiz' and 'Open Bible Reader'. New visitors get oriented; returning users get pulled straight back into their habit.
- **Key sections:** Hero banner with Verse of the Day, Streak counter, FeatureCard row, Did You Know preview card, CTA buttons
- **Components used:** Navbar, Footer, FeatureCard, DidYouKnowCard, StatCard

---

### 2. BibleReaderPage
- **Route:** `/bible`
- **Journey Step:** Offline Action (Offline Flow)
- **Job (The Library):** A clean, distraction-free place to read Scripture.
- **What it does:** Displays the full Bible text organised by book and chapter. Works fully offline using cached content. Users can search by keyword, jump to a specific verse, and highlight passages for later reference.
- **Key sections:** Book/chapter selector sidebar, Main reading pane, Search bar, Offline status indicator
- **Components used:** Navbar, Footer, OfflineToast

---

### 3. KnowledgeHubPage
- **Route:** `/knowledge`
- **Journey Steps:** Discovery + Engagement (Steps 2 & 3)
- **Job (The Arena):** Where passive curiosity becomes active learning.
- **What it does:** Shows a grid of quizzes organised by topic and difficulty. Each quiz card shows the topic, number of questions, and a difficulty badge. Users pick a quiz, answer 10 questions, and get an instant score. A 'Did You Know' strip at the top surfaces surprising biblical facts to spark curiosity.
- **Key sections:** Did You Know strip, Quiz grid (filterable by topic/difficulty), Individual quiz view, Score summary screen
- **Components used:** Navbar, Footer, QuizCard, DifficultyBadge, DidYouKnowCard

---

### 4. AIConsultantPage
- **Route:** `/ai-consultant`
- **Journey Step:** Inquiry (Step 4)
- **Job (The Scholar):** Instant, Scripture-grounded answers to hard questions.
- **What it does:** Provides a conversational AI chat interface. Users type a theological question and receive a clear, scholarly answer with relevant Bible references. Suggested prompt buttons help users who are not sure what to ask. This page prevents quiz frustration by giving context on demand.
- **Key sections:** Chat window, Suggested prompts row, Input bar, Disclaimer notice
- **Components used:** Navbar, Footer, ChatBubble, SuggestedPrompt

---

### 5. GrowthDashboardPage
- **Route:** `/dashboard`
- **Journey Step:** Reflection (Step 5)
- **Job (The Mirror):** Show the user how far they have come.
- **What it does:** Displays the user's personal stats — quizzes completed, streak days, accuracy rate, and favourite topics. A monthly progress chart shows growth over time. A downloadable Monthly Report summarises the month's achievements. All data is read from localStorage so it works even offline.
- **Key sections:** Stat cards row, Monthly progress chart, Topic breakdown, Monthly Report download button
- **Components used:** Navbar, Footer, StatCard, MonthlyReport

---

### 6. NotFoundPage
- **Route:** `*` (catches any unknown URL)
- **Job (The Redirect):** Friendly error page — no dead ends.
- **What it does:** Shows a warm, on-brand message when a user lands on a page that does not exist. Offers clear links back to the Home page and Bible Reader so the user is never stranded.
- **Key sections:** 404 message, Navigation links back to safety
- **Components used:** Navbar, Footer

---

## 🧩 REUSABLE COMPONENTS (10 Total)

Think of components like LEGO bricks — build them once, use them everywhere.

| Component | Where It Lives | Job |
|-----------|---------------|-----|
| **Navbar** | Every page (top) | Navigation bar with BiblePath logo and page links. Shows 'Offline Mode' indicator when needed. |
| **Footer** | Every page (bottom) | Site links, copyright, and a short tagline. |
| **FeatureCard** | HomePage | A single card highlighting one key feature (icon + title + description). |
| **QuizCard** | KnowledgeHubPage | Displays one quiz topic with its title, question count, and difficulty badge. |
| **DidYouKnowCard** | HomePage + KnowledgeHubPage | A visually striking card showing one surprising biblical fact. |
| **ChatBubble** | AIConsultantPage | A single chat message bubble — styled differently for user vs. AI responses. |
| **StatCard** | GrowthDashboardPage | Displays one key stat (e.g. '42 Quizzes Completed') with an icon and label. |
| **MonthlyReport** | GrowthDashboardPage | A summary panel of the user's monthly activity, printable or downloadable. |
| **DifficultyBadge** | KnowledgeHubPage + QuizCard | A small colour-coded tag: Beginner (green), Intermediate (amber), Advanced (red). |
| **SuggestedPrompt** | AIConsultantPage | A clickable prompt chip (e.g. 'What is the Trinity?') that pre-fills the chat input. |

---

## 🛣️ REACT ROUTER ROUTES

```jsx
// All routes planned for src/App.jsx

<BrowserRouter>
  <Routes>
    <Route path="/"              element={<HomePage />} />
    <Route path="/bible"         element={<BibleReaderPage />} />
    <Route path="/knowledge"     element={<KnowledgeHubPage />} />
    <Route path="/ai-consultant" element={<AIConsultantPage />} />
    <Route path="/dashboard"     element={<GrowthDashboardPage />} />
    <Route path="*"              element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

---

## ✅ PLANNING CHECKLIST

- [x] Every page has exactly ONE clear job
- [x] The Daily Growth Journey maps cleanly across pages
- [x] The Offline Flow is accounted for in BibleReaderPage and KnowledgeHubPage
- [x] Every component is named and its job is described
- [x] All 6 routes are defined with their paths
- [x] No page tries to do too many things at once

---

> **Next step:** Start building the Navbar and Footer components first —
> because every single page will need them. That is the smartest place to begin!
