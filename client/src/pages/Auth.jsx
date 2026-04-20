import React, { useState } from "react";
import axios from "axios";
import { FaRobot } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { BsShieldCheck, BsClock, BsBarChart } from "react-icons/bs";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Auth = ({ isModel = false }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleAuth = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await signInWithPopup(auth, provider);
      const { displayName: name, email } = response.user;
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (err) {
      console.error(err);
      setError("Sign-in failed. Please try again.");
      dispatch(setUserData(null));
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: <IoSparkles size={14} />, text: "AI-powered mock interviews" },
    { icon: <BsClock size={14} />, text: "Real-time performance feedback" },
    { icon: <BsBarChart size={14} />, text: "Detailed analytics & reports" },
    { icon: <BsShieldCheck size={14} />, text: "Secure Google sign-in" },
  ];

  return (
    <div
      className={`w-full ${
        isModel
          ? "py-4"
          : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full ${
          isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"
        } bg-white shadow-2xl border border-gray-100`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-black text-white p-2.5 rounded-xl">
            <FaRobot size={18} />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            InterviewIQ.AI
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug mb-3">
      AI Interview 
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Practice with AI, get scored, and land the job.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {perks.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-600"
            >
              <span className="text-green-500">{p.icon}</span>
              {p.text}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* Google Button */}
        <motion.button
          onClick={handleGoogleAuth}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-black text-white rounded-2xl shadow-md hover:bg-gray-900 transition disabled:opacity-60 font-medium"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FcGoogle size={20} />
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </motion.button>

        <p className="text-center text-xs text-gray-400 mt-5">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
