"use client";

import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import '../AuthPage.css';

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup State
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: loginEmail,
                password: loginPassword,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Authentication failed. Please check your credentials.");
            } else {
                toast.success("Logged in successfully!");
                router.push("/home");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signupPassword !== signupConfirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signupName,
                    email: signupEmail,
                    password: signupPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            toast.success("Account created successfully! Please sign in.");
            // Switch to login tab
            setActiveTab('login');
            // Pre-fill login email
            setLoginEmail(signupEmail);
            // Clear signup form
            setSignupName('');
            setSignupEmail('');
            setSignupPassword('');
            setSignupConfirmPassword('');
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { callbackUrl: "/home" });
        } catch (error) {
            toast.error("An error occurred during Google Sign-In.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome</h1>
                    <p className="auth-description">
                        Sign in to your account or create a new one
                    </p>
                </div>

                <div className="auth-content">
                    <div className="auth-tabs">
                        <div className="tabs-list">
                            <button
                                className={`tabs-trigger ${activeTab === 'login' ? 'active' : ''}`}
                                onClick={() => setActiveTab('login')}
                            >
                                Login
                            </button>
                            <button
                                className={`tabs-trigger ${activeTab === 'signup' ? 'active' : ''}`}
                                onClick={() => setActiveTab('signup')}
                            >
                                Sign Up
                            </button>
                        </div>

                        <div className={`tabs-content ${activeTab === 'login' ? 'active' : ''}`}>
                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="login-email" className="form-label">Email</label>
                                    <div className="input-wrapper">
                                        <Mail className="input-icon" />
                                        <input
                                            id="login-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="form-input"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="login-password" className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" />
                                        <input
                                            id="login-password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="form-input"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit-button" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                                        </div>
                                    ) : "Sign In"}
                                </button>

                                <div className="auth-divider">or</div>

                                <button
                                    type="button"
                                    className="google-button"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                >
                                    <svg className="google-icon" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign in with Google
                                </button>

                                <div className="forgot-password">
                                    <a href="#" className="forgot-password-link">
                                        Forgot password?
                                    </a>
                                </div>
                            </form>
                        </div>

                        <div className={`tabs-content ${activeTab === 'signup' ? 'active' : ''}`}>
                            <form onSubmit={handleSignup} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="signup-name" className="form-label">Full Name</label>
                                    <div className="input-wrapper">
                                        <User className="input-icon" />
                                        <input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Enter your name"
                                            className="form-input"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="signup-email" className="form-label">Email</label>
                                    <div className="input-wrapper">
                                        <Mail className="input-icon" />
                                        <input
                                            id="signup-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="form-input"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="signup-password" title="Password" className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" />
                                        <input
                                            id="signup-password"
                                            type="password"
                                            placeholder="Create a password"
                                            className="form-input"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="signup-confirm-password" title="Confirm Password" className="form-label">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" />
                                        <input
                                            id="signup-confirm-password"
                                            type="password"
                                            placeholder="Confirm your password"
                                            className="form-input"
                                            value={signupConfirmPassword}
                                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit-button" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                                        </div>
                                    ) : "Create Account"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="auth-footer">
                    <p className="footer-text">
                        By continuing, you agree to our Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
}
