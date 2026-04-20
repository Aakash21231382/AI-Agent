import React, { useState } from "react";
import { motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsCoin, BsCheckCircleFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import AuthModel from "../components/AuthModel";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "₹99",
    credits: 100,
    color: "border-gray-200",
    badge: null,
    features: [
      "100 Interview Credits",
      "2 Full Mock Interviews",
      "AI Answer Evaluation",
      "Performance Report",
      "PDF Download",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹249",
    credits: 300,
    color: "border-green-500",
    badge: "Most Popular",
    features: [
      "300 Interview Credits",
      "6 Full Mock Interviews",
      "AI Answer Evaluation",
      "Performance Report",
      "PDF Download",
      "Resume-Based Questions",
      "Priority AI Processing",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: "₹499",
    credits: 700,
    color: "border-gray-800",
    badge: "Best Value",
    features: [
      "700 Interview Credits",
      "14 Full Mock Interviews",
      "AI Answer Evaluation",
      "Performance Report",
      "PDF Download",
      "Resume-Based Questions",
      "Priority AI Processing",
      "HR + Technical Modes",
      "Advanced Analytics",
    ],
  },
];

const Pricing = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBuy = async (plan) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const { data } = await axios.post(
        ServerUrl + "/api/payment/create-order",
        { plan: plan.id },
        { withCredentials: true }
      );

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "InterviewIQ",
        description: `${plan.name} Plan – ${plan.credits} Credits`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verify = await axios.post(
              ServerUrl + "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                credits: data.credits,
              },
              { withCredentials: true }
            );
            dispatch(setUserData({ ...userData, credits: verify.data.credits }));
            setSuccess(`${data.credits} credits added to your account!`);
            setTimeout(() => setSuccess(""), 4000);
          } catch {
            setError("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
        prefill: {
          name: userData.name,
          email: userData.email,
        },
        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setShowAuth(true);
      } else {
        setError(error.response?.data?.message || "Failed to initiate payment. Please try again.");
        setTimeout(() => setError(""), 4000);
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f3f3f3]">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Back */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-10 text-sm"
          >
            <FaArrowLeft size={13} />
            Back to Home
          </button>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm px-4 py-2 rounded-full mb-6">
              <HiSparkles size={15} />
              Simple, Transparent Pricing
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
            >
              Invest in Your{" "}
              <span className="text-green-600">Interview Success</span>
            </motion.h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Buy credits once, use them anytime. No subscriptions, no hidden fees.
            </p>

            {userData && (
              <div className="inline-flex items-center gap-2 mt-6 bg-white border border-gray-200 px-5 py-2 rounded-full shadow-sm text-sm text-gray-600">
                <BsCoin className="text-green-500" size={16} />
                Current balance:{" "}
                <span className="font-semibold text-gray-900">
                  {userData.credits} credits
                </span>
              </div>
            )}
          </div>

          {/* Toast messages */}
          {success && (
            <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg text-sm font-medium">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg text-sm font-medium">
              ✕ {error}
            </div>
          )}

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative bg-white rounded-3xl border-2 ${plan.color} p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold shadow ${
                      plan.id === "pro"
                        ? "bg-green-500 text-white"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {plan.name}
                  </h2>
                  <div className="flex items-end gap-1 mt-3">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 mb-1 text-sm">one-time</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-green-600 font-medium text-sm">
                    <BsCoin size={15} />
                    {plan.credits} Credits
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <BsCheckCircleFill
                        size={15}
                        className="text-green-500 shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBuy(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full py-3 rounded-2xl font-medium text-sm transition ${
                    plan.id === "pro"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : plan.id === "elite"
                      ? "bg-gray-900 hover:bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  } disabled:opacity-60`}
                >
                  {loadingPlan === plan.id ? "Processing..." : `Get ${plan.name}`}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-gray-400 text-sm mt-12">
            Payments are secured by Razorpay. Credits never expire.
          </p>
        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Pricing;
