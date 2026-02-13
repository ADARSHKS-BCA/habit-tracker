# Habit Tracker

A modern, social habit tracking application built with **Next.js 15 (App Router)**, **Supabase**, and **TypeScript**. This application allows users to track their daily habits, maintain streaks, view comprehensive analytics, and engage with a community feed of habit completions.

## Features

- **🔐 Secure Authentication**: Full user signup and login functionality powered by Supabase Auth.
- **📊 Interactive Dashboard**: track your daily habits and view your current streaks at a glance.
- **✨ Habit Management**: Create, edit, and delete habits with customizable details.
- **🌍 Social Feed**: A real-time community feed showing habit completions from all users.
- **📈 Advanced Analytics**: Visualizations of your progress, completion rates, and streak history.
- **🎨 Modern UI**: Fully responsive design with Dark Mode support, built using **Shadcn UI** and **Tailwind CSS**.
- **⚡ Fast & Reactive**: Optimistic UI updates and efficient data fetching with **React Query**.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Toasts**: [Sonner](https://sonner.emilkowal.ski/)

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or later)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/habit-tracker.git
   cd habit-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Project Structure

```bash
src/
├── app/                 # Next.js App Router pages
│   ├── (authenticated)/ # Protected routes (Dashboard, Profile)
│   ├── api/             # API routes
│   └── ...
├── components/          # React components
│   ├── auth/            # Authentication forms
│   ├── dashboard/       # Dashboard widgets
│   ├── habits/          # Habit management components
│   ├── feed/            # Social feed components
│   └── ui/              # Reusable UI components (Shadcn)
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── types/               # TypeScript type definitions
└── utils/               # Helper functions and Supabase client
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).
