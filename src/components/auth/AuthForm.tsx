"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, RefreshCw } from "lucide-react";

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleResendConfirmation = async () => {
        if (!email) {
            toast.error("Please enter your email address first.");
            return;
        }

        setResendLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email,
            });
            if (error) throw error;
            toast.success("Confirmation email resent! Check your inbox.");
        } catch (error: any) {
            toast.error(error.message || "Failed to resend confirmation email.");
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setEmailNotConfirmed(false);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    // Detect unconfirmed email — Supabase returns this exact message
                    if (error.message === "Email not confirmed") {
                        setEmailNotConfirmed(true);
                        return;
                    }
                    throw error;
                }

                toast.success("Welcome back!");
                router.push("/dashboard");
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        },
                    },
                });
                if (error) throw error;

                // If email confirmation is enabled, the user object exists but
                // the session will be null until the email is confirmed.
                if (data.user && !data.session) {
                    setSignupSuccess(true);
                    toast.success("Check your email to confirm your account.");
                } else {
                    // Email confirmation is disabled — user is signed in immediately
                    toast.success("Account created successfully!");
                    router.push("/dashboard");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleMode = () => {
        setIsLogin(!isLogin);
        setEmailNotConfirmed(false);
        setSignupSuccess(false);
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl border border-border shadow-lg">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    {isLogin ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {isLogin
                        ? "Enter your credentials to access your account"
                        : "Enter your information to get started"}
                </p>
            </div>

            {/* Email not confirmed banner */}
            {emailNotConfirmed && (
                <div className="flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-amber-500">
                                Email not verified
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Please confirm your email. A verification link has been
                                sent to your inbox.
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                        onClick={handleResendConfirmation}
                        disabled={resendLoading}
                    >
                        {resendLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Resend confirmation email
                    </Button>
                </div>
            )}

            {/* Signup success banner */}
            {signupSuccess && (
                <div className="flex flex-col gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-emerald-500">
                                Check your email
                            </p>
                            <p className="text-sm text-muted-foreground">
                                We&apos;ve sent a verification link to{" "}
                                <span className="font-medium text-foreground">{email}</span>.
                                Please confirm your email to continue.
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                        onClick={handleResendConfirmation}
                        disabled={resendLoading}
                    >
                        {resendLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Resend confirmation email
                    </Button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-2">
                        <Input
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailNotConfirmed(false);
                        }}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLogin ? "Sign In" : "Sign Up"}
                </Button>
            </form>

            <div className="text-center">
                <button
                    type="button"
                    onClick={handleToggleMode}
                    className="text-sm text-primary hover:underline transition-all"
                    disabled={isLoading}
                >
                    {isLogin
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
}
