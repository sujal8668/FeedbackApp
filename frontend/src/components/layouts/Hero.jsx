import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Navbar from "./Navbar";
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInstance";

import One from "../../assets/Excited.png";
import Two from "../../assets/Happy.png";
import Three from "../../assets/Neutral.png";
import Four from "../../assets/Mad.png";
import Five from "../../assets/Sad.png";

const EMOJIS = [
  { id: "very clean", src: One, label: "Very Clean" },
  { id: "clean", src: Two, label: "Clean" },
  { id: "average", src: Three, label: "Average" },
  { id: "dirty", src: Four, label: "Dirty" },
  { id: "very dirty", src: Five, label: "Very Dirty" },
];

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeOnly = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, delay: 0.9 } },
};

const Hero = () => {
  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const offsetX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const offsetY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 30;
    const y = (e.clientY - top - height / 2) / 30;
    mouseX.set(-x);
    mouseY.set(-y);
  };

  const handleEmojiSelect = async (emojiId) => {
    setSelectedEmoji(emojiId);
    try {
      const token = localStorage.getItem("token");

      await axiosInstance.post(
        "/api/feedback/submit",
        { emoji: emojiId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`You selected: ${emojiId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit emoji");
    }

    setIsModalOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#0f0f0f] text-[#e3e3db] flex flex-col overflow-hidden"
    >
      <Navbar />
      {/* Gradient Blobs */}
      <motion.div style={{ x: offsetX, y: offsetY }} className="absolute w-60 h-60 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full blur-3xl opacity-70 top-10 left-10" />
      <motion.div style={{ x: offsetX, y: offsetY }} className="absolute w-72 h-72 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-full blur-3xl opacity-60 top-1/3 left-2/3" />
      <motion.div style={{ x: offsetX, y: offsetY }} className="absolute w-56 h-56 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-50 bottom-10 right-10" />
      <motion.div style={{ x: offsetX, y: offsetY }} className="absolute w-40 h-40 bg-gradient-to-br from-fuchsia-500 to-indigo-400 rounded-full blur-3xl opacity-40 bottom-1/3 left-1/4" />

      {/* Emoji Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="relative bg-transparent rounded-3xl p-10 w-[90%] max-w-3xl flex flex-wrap gap-6 justify-center items-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white cursor-pointer bg-black rounded-full p-2 hover:text-red-400 transition"
            >
              <RiCloseLine size={28} />
            </button>

            {EMOJIS.map((emoji) => (
              <div
                key={emoji.id}
                onClick={() => handleEmojiSelect(emoji.id)}
                className={`cursor-pointer w-25 h-25 rounded-full overflow-hidden border-4 transition ${
                  selectedEmoji === emoji.id ? "border-green-400 scale-110" : "border-transparent hover:scale-105"
                }`}
              >
                <img
                  src={emoji.src}
                  alt={emoji.label}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <motion.div
        className="hero relative z-10 flex px-4 sm:px-6 md:px-8 text-center gap-6 sm:gap-10 flex-col min-h-[calc(100vh-90px)] items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-[95%] sm:max-w-[90%] md:max-w-[80%] leading-snug sm:leading-tight font-semibold"
          variants={itemVariants}
        >
          Express Your Experience: <br className="hidden sm:block" />
          <span className="text-gradient">One Emoji at a Time</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl max-w-[90%] md:max-w-[70%] leading-relaxed"
          variants={itemVariants}
        >
          Share your thoughts quickly and playfully using emojis — <br className="hidden md:block" />
          because feelings speak louder than words.
        </motion.p>

        {/* Button fade-in only */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r cursor-pointer from-orange-400 via-pink-300 to-purple-400 text-black font-semibold px-6 py-3 rounded-full shadow-md flex items-center gap-4 hover:scale-105 transition-transform duration-300"
          variants={fadeOnly}
        >
          Submit Feedback
          <span className="bg-white/50 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Hero;
