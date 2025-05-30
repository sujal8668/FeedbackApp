import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Joker from "../../assets/joker.webp";
import jj from "../../assets/jj.jpg";

const Testimonials = () => {
  const [openStates, setOpenStates] = useState(Array(4).fill(false));
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const items = [
    {
      title: "Instant Expression",
      content: "🕒 Say more in less time — emojis speak volumes instantly.",
    },
    {
      title: "Human Touch",
      content: "💬 Add emotion and clarity to your feedback with a single tap.",
    },
    {
      title: "Universal Language",
      content: "🌍 Emojis break language barriers and work for everyone.",
    },
    {
      title: "Fun & Engaging",
      content: "🎉 Feedback becomes interactive and delightful.",
    },
  ];

  const toggleItem = (index) => {
    const updatedStates = [...openStates];
    updatedStates[index] = !openStates[index];
    setOpenStates(updatedStates);
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div
      id="testimonials"
      className="min-h-screen bg-[#0f0f0f] px-4 py-10"
      ref={ref}
    >
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
        {/* Left Image */}
        <motion.div
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate={controls}
          className="w-full md:w-1/2 h-[350px] md:h-[450px]"
        >
          <div className="w-full h-full rounded-3xl overflow-hidden">
            <img
              src={Joker}
              className="w-full h-full object-cover rounded-3xl"
              alt="joker"
            />
          </div>
        </motion.div>

        {/* Right Content: All animated as one block */}
        <motion.div
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate={controls}
          className="w-full md:w-1/2 bg-[#e3e3db] text-black flex flex-col justify-between gap-6 rounded-3xl p-6 sm:p-8 md:p-12 h-[350px] md:h-[450px]"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Why Choose Us
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              We believe feedback should be quick, expressive, and enjoyable.
              Emoji Feedback lets users share how they feel in seconds — no
              typing required.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  openStates[index]
                    ? "border-none"
                    : "border-b border-gray-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-base sm:text-lg font-medium pb-2">
                    {item.title}
                  </h2>
                  <button
                    onClick={() => toggleItem(index)}
                    className="focus:outline-none"
                  >
                    <i
                      className={`${
                        openStates[index]
                          ? "ri-subtract-line"
                          : "ri-add-circle-fill"
                      } text-2xl sm:text-3xl cursor-pointer`}
                    ></i>
                  </button>
                </div>
                {openStates[index] && (
                  <p className="text-sm sm:text-base text-gray-700 pb-2">
                    {item.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 mt-6 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Simple Emoji Selection",
            content:
              "Let users pick from 😄 😐 😢 😠 and more to express how they feel.",
            quote: "“One tap, zero hassle.”",
          },
          {
            title: "Real-Time Results",
            content: "Instantly track user sentiment with visual insights.",
            quote: "“Understand your audience at a glance.”",
          },
          {
            title: "Anonymous & Secure",
            content:
              "We value privacy — feedback stays anonymous and secure.",
            quote: "“Feel safe, speak freely.”",
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            custom={3 + index}
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-[#e3e3db] flex flex-col gap-3 justify-center p-4 rounded-3xl min-h-[200px] hover:bg-[#d7bcf2]"
          >
            <h1 className="text-2xl font-semibold">{card.title}</h1>
            <p className="text-gray-700">{card.content}</p>
            <p className="italic font-medium">{card.quote}</p>
          </motion.div>
        ))}

        {/* Image Box */}
        <motion.div
          custom={6}
          variants={fadeInUp}
          initial="hidden"
          animate={controls}
        >
          <img
            src={jj}
            className="h-50 rounded-3xl w-full object-cover object-center"
            alt="testimonial visual"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
