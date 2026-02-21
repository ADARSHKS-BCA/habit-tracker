"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex bg-background items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Social Habit Tracker
        </h1>
        <p className="text-lg text-muted-foreground">
          Build better habits together. Join the community and track your streak.
        </p>
      </div>
      <AuthForm />
    </main>
  );
}
