import React, { useState, useEffect, useRef } from "react";
import { RiArrowRightDoubleLine, RiCloseLine, RiGithubFill, RiLinkedinBoxFill, RiTwitterXLine, RiInstagramLine } from "react-icons/ri";
import emailjs from "@emailjs/browser";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const form = useRef();

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Email sending
  const sendEmail = (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);
  
    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setSuccess(true);
          form.current.reset();
        },
        () => {
          setError(true);
        }
      );
  };
  

  return (
    <div id="contact" className="relative bg-[#0f0f0f] text-[#e3e3db] px-4 sm:px-8 md:px-12 lg:px-16 pt-8 sm:pt-12 md:pt-16">

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-[#1e1e1e] rounded-2xl p-6 w-[90%] max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-white transition-colors"
            >
              <RiCloseLine className="cursor-pointer" size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">Contact Me</h2>

            <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4">
              <input
                type="email"
                name="user_email"
                placeholder="Your Email"
                className="p-3 rounded-xl bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                required
              />
              <textarea
                name="user_message"
                rows="4"
                placeholder="Your Message"
                className="p-3 rounded-xl bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                required
              ></textarea>
              <button
                type="submit"
                className="mt-2 p-3 cursor-pointer bg-[#363636] hover:bg-[#444444] rounded-xl transition-colors"
              >
                Send
              </button>
              {success && <p className="text-green-500 text-center mt-2">Message sent successfully!</p>}
              {error && <p className="text-red-500 text-center mt-2">Failed to send message. Try again!</p>}
            </form>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
          Let's Connect <br /> There
        </h1>
        <button className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          <div className="h-12 sm:h-14 rounded-2xl px-4 gap-2 cursor-pointer flex items-center justify-center bg-[#2c2c2c] hover:bg-[#E3E3DB] hover:text-black transition-all w-full sm:w-auto">
            <RiArrowRightDoubleLine className="h-4 cursor-pointer w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Lets Connect!</span>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 dark:bg-gray-600 my-8 sm:my-10 md:my-12 lg:my-14"></div>

      {/* Middle Section */}
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 lg:gap-8">
        {/* Profile Info */}
        <div className="w-full md:w-[40%] flex flex-col gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Sujal</h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Hi myself Sujal Parmar. A Fullstack Developer <br /> Creating Intuitive Experience
          </p>
          <div className="flex gap-3 text-xl sm:text-2xl">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/sujal8668">
              <RiGithubFill className="hover:text-gray-300 transition-colors" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/sujal-parmar-748204355/">
              <RiLinkedinBoxFill className="hover:text-gray-300 transition-colors" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://x.com/SUJAL06959111">
              <RiTwitterXLine className="hover:text-gray-300 transition-colors" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/s__u__j__a__l/">
              <RiInstagramLine className="hover:text-gray-300 transition-colors" />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full md:w-[60%]">
          <div>
            <h1 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Address</h1>
            <p className="text-gray-300 text-xs sm:text-sm">India, Uttarakhand</p>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Email:</h1>
            <p className="text-gray-300 text-xs sm:text-sm">parmarsujal098@gmail.com</p>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Phone No:</h1>
            <p className="text-gray-300 text-xs sm:text-sm">9528599245</p>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="h-px bg-gray-300 dark:bg-gray-600 mt-8 sm:mt-10 md:mt-12 lg:mt-14"></div>

      {/* Copyright */}
      <h1 className="text-center py-4 sm:py-5 text-xs sm:text-sm">All rights reserved @Sujal</h1>
    </div>
  );
};

export default Footer;
