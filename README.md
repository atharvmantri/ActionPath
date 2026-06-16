# ActionPath

ActionPath is an AI-powered executive function tool designed specifically for high school students with Attention-Deficit/Hyperactivity Disorder (ADHD) who struggle with managing academic obligations buried within school communications. By replacing administrative overwhelm with structural clarity, ActionPath translates dense, stressful school updates, emails, syllabi, and learning management system (LMS) notifications into plain, structured, and manageable action checklists.

This project was built for the USAII Global AI Hackathon 2026 under the High School Track (Challenge 1A).

The source code and repository are hosted at: https://github.com/atharvmantri/ActionPath

---

## The Problem Statement

School districts and educational environments produce a constant stream of digital communications. Announcements on Google Classroom, Canvas LMS, Schoology, weekly email newsletters, and PDF forms are filled with deadlines, permission slips, external resource links, and action items.

For typical students, filtering through this prose is an annoyance. For students dealing with executive dysfunction, it presents a significant neurological barrier. 

### The Executive Dysfunction Failure Cascade

1. **Inbox Accumulation**: The student receives multiple 400-plus-word emails. The visual volume makes the inbox feel highly intimidating, leading to inbox avoidance.
2. **Dense Noise**: The critical action items are buried in lines of boilerplate text. Without immediate cues, the brain struggles to prioritize the signal from the noise.
3. **Task Initiation Paralysis**: When opening a message, the cognitive effort required to figure out "what needs to be done first" blocks task initiation.
4. **Working Memory Failure**: Out of sight equals out of working memory. The email is closed, and the obligations are forgotten.
5. **Deadline Violation**: The deadline passes without the student ever identifying the hidden action.
6. **Systemic Failure**: Cumulative missed assignments lead to grade degradation, loss of social/extracurricular opportunities, and chronic anxiety.

ActionPath stops this cascade at the extraction point. It acts as an automated cognitive intermediary, filtering the noise, evaluating consequences, organizing schedules, and generating physical task-initiation cues.

---

## System Architecture: The 7-Stage Gemini AI Pipeline

ActionPath runs a collaborative, multi-agent pipeline powered entirely by the Google Gemini API using the official SDK (`@google/genai`). Each stage has a single, isolated job, operates under strict JSON outputs, and feeds its output directly to the subsequent stage to eliminate rule-based bottlenecks and parsing errors.

```
[Raw Input] 
    |
    v
+--------------------------------------------------------+
| Stage 1: Intake Classifier (gemini-3.1-flash-lite)     | -> Categorizes text, scores cognitive load (0-10)
+--------------------------------------------------------+
    |
    v
+--------------------------------------------------------+
| Stage 2: Entity Extraction (gemini-3.1-flash-lite)     | -> Parses tasks, dates, confidence levels, subject areas
+--------------------------------------------------------+
    |
    v
+--------------------------------------------------------+
| Stage 3: Scoring & Collision (gemini-3.1-flash-lite)  | -> Urgency, effort level, consequence severity analysis
+--------------------------------------------------------+
    |
    v
+--------------------------------------------------------+
| Stage 4: Context Fusion (gemini-3.1-flash-lite)        | -> Matches with student history, detects recurring tasks
+--------------------------------------------------------+
    |
    v
+--------------------------------------------------------+
| Stage 5: Day-by-Day Planning (gemini-3.1-flash-lite)   | -> Spreads tasks, budgets time, monitors day limits
+--------------------------------------------------------+
    |
    v
+--------------------------------------------------------+
| Stage 6: Language Rewriter (gemini-3.1-flash-lite)     | -> Rewrites to active voice (<= 12 words), generates start cues
+--------------------------------------------------------+
    |
    v
+--------------------------------------------------------+
| Stage 7: Quality Assurance (gemini-3.1-flash-lite)     | -> Validates output integrity, flags errors or low confidence
+--------------------------------------------------------+
    |
    v
[ADHD-Optimized UI Checklist]
```

### Stage 1: Intake Classifier
* **Primary Model**: `gemini-3.1-flash-lite`
* **Purpose**: Performs high-speed initial analysis on the raw communication text. It identifies the nature of the text and calculates a Cognitive Load Score to dictate routing downstream.
* **Output Schema**:
```json
{
  "comm_type": "deadline_notice",
  "cognitive_load_score": 7.4,
  "word_count": 412,
  "action_density": 0.08,
  "routing_template": "DEADLINE_V2",
  "language_complexity": "high",
  "model": "gemini-3.1-flash-lite"
}
```

### Stage 2: Entity & Context Extraction
* **Primary Model**: `gemini-3.1-flash-lite` (Designed for `gemini-3.1-pro-preview` for high-complexity text)
* **Purpose**: Isolates every individual task, deadline, and context point. For every extracted task, it links the exact source sentence verbatim to ground the AI and enable verification.
* **Output Schema**:
```json
{
  "items": [
    {
      "task_id": "t1",
      "task": "Return signed field trip permission form",
      "deadline": "2026-06-17",
      "days_remaining": 2,
      "source_sentence": "Please return the signed form to room 204 by Wednesday.",
      "item_type": "form",
      "people": ["Ms. Rivera"],
      "subject": "Biology",
      "url": null,
      "confidence": 0.94
    }
  ],
  "model": "gemini-3.1-flash-lite"
}
```

### Stage 3: Scoring & Collision Agent
* **Primary Model**: `gemini-3.1-flash-lite` (Designed for `gemini-3.5-flash` for multi-step logic)
* **Purpose**: Assigns weight indicators to tasks and flags deadline collisions (three or more tasks scheduled on the same calendar day), prompting automated rescheduling suggestions.
* **Output Schema**:
```json
{
  "scored_items": [
    {
      "task_id": "t1",
      "urgency": 9,
      "effort": "low",
      "consequence": "social",
      "dependency": null,
      "composite_score": 8.7
    }
  ],
  "collision_days": [],
  "reorder_suggestion": null,
  "model": "gemini-3.1-flash-lite"
}
```

### Stage 4: Context Fusion Agent
* **Primary Model**: `gemini-3.1-flash-lite`
* **Purpose**: Synthesizes new items with the student's historical state. It flags duplicates, identifies recurring patterns (e.g. weekly newsletters), and matches task subjects against known academic folders.
* **Output Schema**:
```json
{
  "merged_items": [
    {
      "task_id": "t1",
      "task": "Return signed field trip permission form",
      "deadline": "2026-06-17",
      "days_remaining": 2,
      "source_sentence": "Please return the signed form to room 204 by Wednesday.",
      "item_type": "form",
      "people": ["Ms. Rivera"],
      "subject": "Biology",
      "url": null,
      "confidence": 0.94,
      "is_recurring": false
    }
  ],
  "deduplicated": [],
  "recurring_detected": false,
  "student_subject_match": {
    "Biology": ["t1"]
  },
  "model": "gemini-3.1-flash-lite"
}
```

### Stage 5: Day-by-Day Planning Agent
* **Primary Model**: `gemini-3.1-flash-lite` (Designed for `gemini-3.5-flash`)
* **Purpose**: Distributes tasks chronologically across four horizons: Today, Tomorrow, This Week, and Later. It enforces strict cognitive load-balancing rules (e.g., maximum of three high-effort items scheduled per day) and estimates time budgets.
* **Output Schema**:
```json
{
  "plan": {
    "today": [{"task_id": "t1", "est_mins": 5}],
    "tomorrow": [],
    "this_week": [],
    "later": []
  },
  "daily_budgets": {
    "today": 5
  },
  "load_warning": null,
  "model": "gemini-3.1-flash-lite"
}
```

### Stage 6: Language Rewriter Agent
* **Primary Model**: `gemini-3.1-flash-lite` (Designed for `gemini-3.5-flash`)
* **Purpose**: Addresses the initiation barrier. It rewrites task copy into calm, action-oriented syntax (maximum 12 words, beginning with an active verb) and creates a "Start Cue" (the exact first physical action required to begin).
* **Output Schema**:
```json
{
  "rewritten_items": [
    {
      "task_id": "t1",
      "rewritten": "Sign field trip form. Hand to room 204.",
      "why_it_matters": "Missing this means you cannot go on the trip.",
      "start_cue": "Open your backpack and find the blue permission slip.",
      "original": "Return signed field trip permission form"
    }
  ],
  "model": "gemini-3.1-flash-lite"
}
```

### Stage 7: Quality Assurance Agent
* **Primary Model**: `gemini-3.1-flash-lite`
* **Purpose**: Runs a sanity-check pass before delivering data to the frontend, verifying that all extracted tasks are accounted for, flags items with confidence scores below 0.7, and flags any rewritten tasks exceeding 12 words.
* **Output Schema**:
```json
{
  "qa_passed": true,
  "qa_issues": [],
  "model": "gemini-3.1-flash-lite"
}
```

---

## Complete Feature Set

### Core MVP Features
* **Multi-Format Input System**: Supports drag-and-drop or raw paste of text, as well as client-side processing of PDF files, text files, EML formats, and HTML files.
* **ADHD-Optimized Formatting**: Re-formats items into short active sentences (max 12 words). Includes a plain language toggle that allows students to switch back to the original text.
* **Time Budgets**: Outlines daily time commitments (e.g., Today: ~30 minutes total) and presents effort ratings (low, medium, high, very high) for each item.
* **Interactive Timeline**: A seven-day horizontal grid visualizes scheduling. Overloaded days are flagged in red, and timeline collisions are flagged in amber.
* **Start Cue Cards**: Every task features a start cue (the first step, such as opening a backpack or loading a website) to minimize task avoidance.
* **Source Sentence Tooltips**: Hovering over or tapping any action item shows the verbatim sentence from which the task was extracted.
* **Calendar Export**: One-click generation of standard ICS files that sync automatically with Google Calendar, Apple Calendar, and Microsoft Outlook.

### Stretch Features (Implemented)
* **Voice Dictation Parser**: Converts spoken assignments or notes into structured tasks using the Web Speech API and Gemini-driven transcription.
* **Google Classroom Integration**: Secure OAuth workflow to pull course updates directly from the student's Classroom feed without copy-pasting.
* **Mood Check-In**: A quick daily scale (1-5) evaluation that dynamically scales the maximum daily task count to prevent burnout on low-energy days.
* **Streak Tracker**: Tracks consecutive days of completing the "Today" list to build positive momentum.
* **Pomodoro Focus Timer**: Integrated 25-minute timer directly on tasks that checks off tasks upon completion.
* **Parent & Counselor View**: Generates a secure, read-only URL showing the current checklist without exposing private text inputs or logging credentials.
* **Boilerplate Suppression**: Auto-detects recurring school newsletter templates to hide repetitive headers, boilerplate text, and low-priority updates.
* **Email Forwarding Panel**: Simulates an automated inbox setup where forwarded emails are routed directly into structured checklists.
* **Accessibility Settings**: Dynamic controls for high contrast mode, keyboard navigation, and larger text scaling options.

---

## Responsible AI by Design

ActionPath is built around safety-first AI design principles, prioritizing transparency and user control.

* **Human-in-the-Loop Constraint**: The system does not possess autonomous access. It never signs forms, schedules meetings, or processes payments automatically. It presents recommendations; the student must confirm, check off, or modify tasks manually.
* **Verifiable Grounding**: Every checklist item provides direct source sentence linking. If a deadline or date is generated, the student can hover over it to see the exact sentence in the original document to check for hallucinations.
* **Confidence Grading**: Items with low extraction confidence (under 0.70) are highlighted with red border frames and review warnings.
* **Strict Data Privacy**: Sensitive student communications are never stored on external databases or used for training. All personal contexts, checklists, and active session histories are persisted locally in the browser's localStorage.

---

## Technical Stack

* **Frontend Framework**: Next.js 16 (React 19) utilizing the App Router architecture.
* **Styling**: Tailwind CSS v4 for fast, light layouts with native dark mode support.
* **AI Integration**: Official Google Gen AI SDK (`@google/genai`).
* **Client Utilities**:
  * `pdfjs-dist`: Extracting text layers from PDF attachments client-side.
  * `ics` & `file-saver`: Building and packaging calendar files in the browser.

---

## Directory Structure

```
actionpath/
├── app/
│   ├── api/
│   │   ├── auth/            # OAuth authentication endpoints
│   │   ├── export/          # ICS calendar generation routes
│   │   ├── pipeline/        # Endpoint running the 7-stage Gemini pipeline
│   │   └── tasks/           # CRUD endpoints for shareable tasks
│   ├── share/               # Pages for shared counselor views
│   ├── favicon.ico
│   ├── globals.css          # Core CSS variables and animations
│   ├── layout.tsx           # Global App context wrapper
│   └── page.tsx             # Interactive dashboard and Landing UI
├── components/
│   ├── AuthModal.tsx        # User authentication dialog
│   ├── ClassroomImport.tsx  # Google Classroom dashboard controls
│   ├── ConfidenceBadge.tsx  # Visual high/medium/review indicators
│   ├── FeedbackModal.tsx    # Effort verification feedback prompts
│   ├── FocusTimer.tsx       # Focus tracking Pomodoro timer
│   ├── ForwardingPanel.tsx  # Email inbox routing simulator
│   ├── InputArea.tsx        # File drag-and-drop and text paste entry
│   ├── LoadWarning.tsx      # Multi-task collision notices
│   ├── MoodCheckIn.tsx      # Mood state interface
│   ├── OnboardingDisclaimer.# Product warnings and disclaimer screen
│   ├── PipelineProgress.tsx # Visual execution state of 7 agents
│   ├── StartCue.tsx         # Initiation cues card
│   ├── StreakTracker.tsx    # Gamified completion streak counters
│   ├── TaskCard.tsx         # Detailed individual task details
│   ├── VoiceInput.tsx       # Microphone dictation components
│   └── WeekView.tsx         # Timeline calendar component
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── db.ts                # Database wrappers (if applicable)
│   ├── gemini.ts            # Gemini API pipeline setup
│   ├── ics.ts               # ICS structure builder
│   ├── mocks.ts             # Synthetic data structures for demos
│   ├── schema.ts            # Unified TypeScript pipeline interfaces
│   ├── share.ts             # Sharing utility routines
│   ├── storage.ts           # Browser localStorage interface routines
│   └── utils.ts             # General utility functions
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Getting Started

### Prerequisites
* Node.js version 18.0.0 or higher
* A Google Gemini API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/atharvmantri/ActionPath.git
```

2. Navigate to the project root:
```bash
cd ActionPath
```

3. Install the dependencies:
```bash
npm install
```

4. Configure your environmental variables:
Create a file named `.env.local` in the root folder and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running Locally

To run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Linting and Formatting

To verify the code styling and run ESLint checks:
```bash
npm run lint
```

### Building for Production

To generate the production build:
```bash
npm run build
```

To run the production build locally:
```bash
npm run start
```
