"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Checkbox, Label, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa6";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client"; 

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 🧠 Hook into Better-Auth's client-side session status
  const { data: session } = authClient.useSession();
  
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // 🛠️ Helper utility to calculate the target route based on user roles dynamically
  const getRedirectDestination = (userRole?: string | null) => {
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl) return callbackUrl;

    if (userRole === "admin") return "/dashboard/admin";
    if (userRole === "owner") return "/dashboard/owner";
    return "/dashboard/guest"; // Safe fallback baseline
  };

  // Email/Password Login implementation
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    await authClient.signIn.email({
      email: email,
      password: password,
      rememberMe: rememberMe, // Pass the boolean state directly (or just shorthand: rememberMe)
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          
          // 🧠 Extract the freshly logged-in user's role from context contextually
          const userRole = ctx.data?.user?.role;
          const destination = getRedirectDestination(userRole);
          
          router.push(destination);
          router.refresh();
        },
        onError: (ctx) => {
          setIsLoading(false);
          setErrorMessage(ctx.error.message || "Invalid email or password coordination rules.");
        }
      }
    });
  };

  // Google OAuth Login implementation
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    
    // For OAuth, pass a static fallback route; your server callback code 
    // can intercept the landing role mapping safely later.
    // `role` is now properly typed via the inferAdditionalFields client plugin.
    const baselineDestination = getRedirectDestination(session?.user?.role);

    await authClient.signIn.social({
      provider: "google",
      callbackURL: baselineDestination
    });
  };

  return (
    <main className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 selection:bg-indigo-600/10 selection:text-indigo-600 overflow-hidden bg-neutral-950">
      
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="/videos/oceanvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-950/40 dark:bg-neutral-950/60 z-10" />
      </div>

      {/* CENTRALIZED AUTH CARD FRAME */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-5xl min-h-[620px] grid grid-cols-1 md:grid-cols-12 rounded-[28px] overflow-hidden border border-white/25 dark:border-neutral-800/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]"
      >
        
        {/* LEFT COLUMN: CURATED SPACE IMAGE LAYOUT */}
        <section className="hidden md:block md:col-span-5 lg:col-span-6 relative overflow-hidden bg-neutral-900 dark:bg-neutral-950">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80"
            alt="Boutique premium interior design alignment"
            className="w-full h-full object-cover select-none pointer-events-none relative z-0"
          />
          <div className="absolute inset-0 p-10 z-20 flex flex-col justify-between items-start">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-extrabold tracking-tight text-lg group">
              <HiOutlineBuildingOffice className="h-5 w-5 text-indigo-400 group-hover:scale-105 transition-transform" />
              Equinox
            </Link>
            <div className="max-w-xs">
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Sanctuary Stays</span>
              <p className="text-white text-base font-medium mt-1 leading-relaxed">
                Unlock continuous hospitality configured around architectural integrity.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: CREDENTIAL INPUT LAYOUT */}
        <section className="col-span-1 md:col-span-7 lg:col-span-6 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white/75 dark:bg-neutral-900/85 backdrop-blur-2xl">
          <div className="w-full space-y-7">
            
            <div>
              <Link href="/" className="md:hidden inline-flex items-center gap-2 mb-4 text-neutral-900 dark:text-neutral-100 font-extrabold tracking-tight text-base">
                <HiOutlineBuildingOffice className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Equinox
              </Link>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">
                Welcome back
              </h1>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Enter your system coordinates to access your suite dashboard.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <Button
              variant="outline"
              onPress={handleGoogleLogin}
              className="w-full h-11 rounded-xl border-neutral-200/80 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm font-bold text-xs hover:bg-white/80 dark:hover:bg-neutral-900/80 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <FaGoogle className="text-xs text-neutral-600 dark:text-neutral-400" />
              Sign in with Google
            </Button>

            <div className="relative flex py-1 items-center text-[10px] text-neutral-400 dark:text-neutral-600 uppercase tracking-widest font-bold">
              <div className="flex-grow border-t border-neutral-200/50 dark:border-neutral-800/40"></div>
              <span className="flex-shrink mx-3">or credentials</span>
              <div className="flex-grow border-t border-neutral-200/50 dark:border-neutral-800/40"></div>
            </div>

            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full h-10 px-4 text-xs rounded-xl border border-neutral-200 bg-white/70 dark:bg-neutral-950/60 focus:bg-white/90 dark:focus:bg-neutral-950 hover:border-neutral-300 focus:border-indigo-600 focus:outline-none dark:border-neutral-800 dark:hover:border-neutral-700 dark:focus:border-indigo-400 transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-neutral-50 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative w-full flex items-center">
                  <input
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full h-10 pl-4 pr-10 text-xs rounded-xl border border-neutral-200 bg-white/70 dark:bg-neutral-950/60 focus:bg-white/90 dark:focus:bg-neutral-950 hover:border-neutral-300 focus:border-indigo-600 focus:outline-none dark:border-neutral-800 dark:hover:border-neutral-700 dark:focus:border-indigo-400 transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-neutral-50 disabled:opacity-50"
                  />
                  <button 
                    type="button" 
                    onClick={toggleVisibility}
                    className="absolute right-3.5 focus:outline-none text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    aria-label="Toggle password identity vision state"
                  >
                    {isVisible ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  isSelected={rememberMe}
                  onChange={setRememberMe}
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 select-none">
                      Remember this hardware session
                    </Label>
                  </Checkbox.Content>
                </Checkbox>
              </div>

              <Button
                type="submit"
                variant="primary"
                isDisabled={isLoading}
                isPending={isLoading}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-indigo-600/10 active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-70"
              >
                {({ isPending }) => (isPending ? <Spinner size="sm" color="current" /> : "Sign In to Account")}
              </Button>
            </form>

            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              New to Equinox?{" "}
              <Link 
                href="/register" 
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create an account
              </Link>
            </p>

          </div>
        </section>

      </motion.div>
    </main>
  );
}