# 🚀 Technical Challenge: Community Habit Tracker

Welcome to the technical assessment for the AI/ML Full-Stack position. This challenge is designed to evaluate your ability to build a modern, data-driven web application using **Supabase**, **Vercel**, and **Real-time** architecture.

## 📅 Submission & Deadline
- **Deadline:** February 16, 2026.
- **The "Silent" Review:** Once you accept this challenge, your progress will be tracked automatically via this repository. You do not need to email us your progress.
- **Final Submission:**
  1. Ensure your latest code is pushed to the `main` branch of **this** repository.
  2. Paste your **Live Vercel URL** at the very top of this README.
  3. After the deadline, this repository will become **Read-Only**.

---

## 🎯 The Goal
Build a social habit tracker where users log daily tasks and see a **Live Community Feed** of others checking off their habits instantly.

### Core Requirements
1.  **Authentication:** Users must be able to Sign Up and Log In using **Supabase Auth**.
2.  **Habit Management:** Users can create, edit, and delete their own habits.
3.  **Daily Check-in:** A simple interface to mark a habit as "Done" for the current day.
4.  **Community Real-time Feed:** - Implement a feed that shows when *any* user in the system completes a habit.
    - **Requirement:** This must use **Supabase Realtime**. The UI must update instantly without a page refresh.
5.  **Smart Logic: The Streak Predictor:**
    - Calculate a "Probability of Success" for tomorrow based on the user's last 7 days of activity.
    - **Formula:** $P = (\text{Days Completed in last 7} / 7) \times 100$.

---

## 🤖 AI Usage Policy
**AI usage is highly encouraged.** In this role, we value efficiency and the ability to leverage modern tools (ChatGPT, Claude, GitHub Copilot, etc.) to solve problems faster. However, you must be able to explain your code and architectural choices during the interview. Blindly copy-pasting AI code that doesn't work or that you don't understand will be a disqualifier.

---

## 🛠️ Technical Stack
- **Frontend:** React, Next.js, or Vue (hosted on Vercel).
- **Backend:** Supabase (PostgreSQL + Realtime).
- **Database:** Use the provided `schema.sql` for the required table structure.

---

## 🏗️ Setup Instructions
1.  **Database:** Run the provided `schema.sql` in your Supabase SQL Editor.
2.  **Auth:** Enable Email/Password provider in your Supabase Auth settings.
3.  **Deployment:** Deploy to **Vercel** and ensure your Supabase Environment Variables are configured.

---

## 🔍 Evaluation Criteria
- **Real-time Implementation:** Does the feed update across different browser sessions instantly?
- **Data Integrity:** Is Row Level Security (RLS) enabled?
- **Logic:** Is the "Streak Predictor" accurate and edge-case handled (e.g., new users with 0 days)?
- **Git Workflow:** Clean, descriptive commit messages showing your progress.

**Good luck! We are excited to see your progress over the next few days.**
