"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa6";
import { HiOutlineBuildingOffice, HiOutlineUserCircle, HiOutlineBriefcase } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client"; // Ensure this matches your file path

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  
  // Interaction Pipeline States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guest" | "owner">("guest");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Client-Side ImageBB Upload Implementation Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Best Practice: Replace with process.env.NEXT_PUBLIC_IMGBB_API_KEY in production
      const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY"; 
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
      } else {
        setErrorMessage("Image upload failed. Please try a different photo.");
      }
    } catch (error) {
      console.error("Image upload configuration failure:", error);
      setErrorMessage("Could not connect to image server.");
    } finally {
      setIsUploading(false);
    }
  };

  // Google OAuth Social Authentication Execution
  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // Target route after successful landing authorization
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during Google Sign Up.");
    }
  };

  // Standard Credentials Pipeline Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: username,
        image: imageUrl || undefined,
        // Better Auth saves extra payload fields natively inside the dynamic 'data' object attributes mapping.
        // Ensure you configure 'role' on your DB adapter if strict schema protection maps it explicitly.
        data: {
          role: role,
        },
      });

      if (error) {
        setErrorMessage(error.message || "Registration failed. Please check your credentials.");
      } else {
        // Registration success -> Push to your authenticated application landing space
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage("Unable to process request at this time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 selection:bg-indigo-600/10 selection:text-indigo-600 overflow-hidden bg-neutral-950">
      
      {/* MATCHING VIDEO BACKGROUND LAYER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover scale-105">
          <source src="/videos/oceanvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-950/40 dark:bg-neutral-950/60 z-10" />
      </div>

      {/* CENTRALIZED AUTH CARD FRAME */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-5xl min-h-[660px] grid grid-cols-1 md:grid-cols-12 rounded-[28px] overflow-hidden border border-white/25 dark:border-neutral-800/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]"
      >
        
        {/* LEFT COLUMN: CURATED OPAQUE IMAGE LAYOUT */}
        <section className="hidden md:block md:col-span-5 lg:col-span-6 relative overflow-hidden bg-neutral-900 dark:bg-neutral-950">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
            alt="Premium luxury resort architecture orientation"
            className="w-full h-full object-cover select-none pointer-events-none relative z-0"
          />
          
          <div className="absolute inset-0 p-10 z-20 flex flex-col justify-between items-start">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-extrabold tracking-tight text-lg group">
              <HiOutlineBuildingOffice className="h-5 w-5 text-indigo-400 group-hover:scale-105 transition-transform" />
              Equinox
            </Link>
            <div className="max-w-xs">
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Step {step} of 2</span>
              <p className="text-white text-base font-medium mt-1 leading-relaxed">
                {step === 1 
                  ? "Begin your journey into specialized premium spatial management architecture."
                  : "Tailor your suite experience around your active platform designation."
                }
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: REFINED REGISTRATION PROGRESSIVE INPUTS */}
        <section className="col-span-1 md:col-span-7 lg:col-span-6 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white/75 dark:bg-neutral-900/85 backdrop-blur-2xl">
          <div className="w-full space-y-6">
            
            {/* Form Top Matrix Headers */}
            <div>
              <Link href="/" className="md:hidden inline-flex items-center gap-2 mb-4 text-neutral-900 dark:text-neutral-100 font-extrabold tracking-tight text-base">
                <HiOutlineBuildingOffice className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Equinox
              </Link>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">
                Create your account
              </h1>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {step === 1 ? "Set up your foundational secure access details." : "Complete your profile customization configuration."}
              </p>
            </div>

            {/* ERROR HUD ELEMENT */}
            {errorMessage && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl border border-red-200/60 dark:border-red-900/40">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Google OAuth Option */}
                    <Button
                      type="button"
                      variant="bordered"
                      radius="xl"
                      onClick={handleGoogleSignUp}
                      startContent={<FaGoogle className="text-xs text-neutral-600 dark:text-neutral-400" />}
                      className="w-full h-11 border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 font-bold text-xs active:scale-98 transition-all"
                    >
                      Sign up with Google
                    </Button>

                    <div className="relative flex py-1 items-center text-[10px] text-neutral-400 dark:text-neutral-600 uppercase tracking-widest font-bold">
                      <div className="flex-grow border-t border-neutral-200/50 dark:border-neutral-800/40"></div>
                      <span className="flex-shrink mx-3">or credentials</span>
                      <div className="flex-grow border-t border-neutral-200/50 dark:border-neutral-800/40"></div>
                    </div>

                    {/* Username Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">User Name</label>
                      <input
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full h-10 px-4 text-xs rounded-xl border border-neutral-200 bg-white/70 dark:bg-neutral-950/60 focus:outline-none focus:border-indigo-600 dark:border-neutral-800 dark:focus:border-indigo-400 text-neutral-900 dark:text-neutral-50"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-10 px-4 text-xs rounded-xl border border-neutral-200 bg-white/70 dark:bg-neutral-950/60 focus:outline-none focus:border-indigo-600 dark:border-neutral-800 dark:focus:border-indigo-400 text-neutral-900 dark:text-neutral-50"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">Password</label>
                      <div className="relative w-full flex items-center">
                        <input
                          type={isVisible ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full h-10 pl-4 pr-10 text-xs rounded-xl border border-neutral-200 bg-white/70 dark:bg-neutral-950/60 focus:outline-none focus:border-indigo-600 dark:border-neutral-800 dark:focus:border-indigo-400 text-neutral-900 dark:text-neutral-50"
                        />
                        <button type="button" onClick={toggleVisibility} className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                          {isVisible ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      radius="xl"
                      className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all"
                      endContent={<FaArrowRight className="text-[10px]" />}
                    >
                      Continue to Profile
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Role Picker Architecture */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">Select Platform Role</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          onClick={() => setRole("guest")}
                          className={`relative p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col gap-2 ${role === "guest" ? "border-indigo-600 bg-indigo-600/5 dark:border-indigo-400 dark:bg-indigo-400/5" : "border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-950/20 hover:border-neutral-300"}`}
                        >
                          <HiOutlineUserCircle className={`h-5 w-5 ${role === "guest" ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-500"}`} />
                          <div>
                            <p className="text-xs font-bold text-neutral-900 dark:text-white">Hotel Guest</p>
                            <p className="text-[10px] text-neutral-400">Book and explore premium destinations.</p>
                          </div>
                          {role === "guest" && <div className="absolute top-2 right-2 h-3.5 w-3.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-[8px] text-white"><FaCheck /></div>}
                        </div>

                        <div 
                          onClick={() => setRole("owner")}
                          className={`relative p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col gap-2 ${role === "owner" ? "border-indigo-600 bg-indigo-600/5 dark:border-indigo-400 dark:bg-indigo-400/5" : "border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-950/20 hover:border-neutral-300"}`}
                        >
                          <HiOutlineBriefcase className={`h-5 w-5 ${role === "owner" ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-500"}`} />
                          <div>
                            <p className="text-xs font-bold text-neutral-900 dark:text-white">Hotel Owner</p>
                            <p className="text-[10px] text-neutral-400">List, handle metrics and manage stays.</p>
                          </div>
                          {role === "owner" && <div className="absolute top-2 right-2 h-3.5 w-3.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-[8px] text-white"><FaCheck /></div>}
                        </div>
                      </div>
                    </div>

                    {/* Image Upload/URL Field */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">Profile Image</label>
                      <div className="flex gap-3 items-center">
                        <div className="h-12 w-12 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 flex-shrink-0 overflow-hidden flex items-center justify-center text-xs text-neutral-400 font-medium">
                          {imageUrl ? <img src={imageUrl} alt="Uploaded preview" className="h-full w-full object-cover" /> : "Avatar"}
                        </div>
                        <div className="flex-grow relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="hidden" 
                            id="file-upload" 
                            disabled={isUploading || isSubmitting}
                          />
                          <label 
                            htmlFor="file-upload" 
                            className={`inline-flex w-full h-10 items-center justify-center px-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                          >
                            {isUploading ? "Uploading to ImgBB..." : "Upload Profile Photo"}
                          </label>
                        </div>
                      </div>
                      <div className="relative flex py-1 items-center text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                        <div className="flex-grow border-t border-neutral-200/40"></div>
                        <span className="mx-2">or specify URL</span>
                        <div className="flex-grow border-t border-neutral-200/40"></div>
                      </div>
                      <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full h-10 px-4 text-xs rounded-xl border border-neutral-200 bg-white/70 dark:bg-neutral-950/60 focus:outline-none focus:border-indigo-600 dark:border-neutral-800 dark:focus:border-indigo-400 text-neutral-900 dark:text-neutral-50 disabled:opacity-50"
                      />
                    </div>

                    {/* Step Navigation Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="bordered"
                        radius="xl"
                        onClick={() => setStep(1)}
                        disabled={isSubmitting}
                        className="h-11 border-neutral-200 dark:border-neutral-800 text-xs font-bold disabled:opacity-50"
                        startContent={<FaArrowLeft className="text-[10px]" />}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        radius="xl"
                        isLoading={isSubmitting}
                        disabled={isUploading}
                        className="flex-grow h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? "Creating Account..." : "Complete Registration"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign in
              </Link>
            </p>

          </div>
        </section>

      </motion.div>
    </main>
  );
}