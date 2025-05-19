import React, { useRef, useContext, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Navbar from "../../components/layouts/Navbar";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  useUserAuth();
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const offsetX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const offsetY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 30;
    const y = (e.clientY - top - height / 2) / 30;

    mouseX.set(-x);
    mouseY.set(-y);
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.patch(API_PATHS.AUTH.UPDATE_PROFILE, { name });
      updateUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user name:", error);
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#0f0f0f] text-[#e3e3db] overflow-hidden"
    >
      {/* Background Blur Effects */}
      <div className="absolute w-full h-full top-0 left-0 z-0 pointer-events-none">
        <motion.div
          style={{ x: offsetX, y: offsetY }}
          className="absolute w-60 h-60 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full blur-3xl opacity-70 top-10 left-10"
        />
        <motion.div
          style={{ x: offsetX, y: offsetY }}
          className="absolute w-72 h-72 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-full blur-3xl opacity-60 top-1/3 left-2/3"
        />
        <motion.div
          style={{ x: offsetX, y: offsetY }}
          className="absolute w-56 h-56 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-50 bottom-10 right-10"
        />
        <motion.div
          style={{ x: offsetX, y: offsetY }}
          className="absolute w-40 h-40 bg-gradient-to-br from-fuchsia-500 to-indigo-400 rounded-full blur-3xl opacity-40 bottom-1/3 left-1/4"
        />
      </div>

      <Navbar />

      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md bg-[#1e1e1e] p-6 rounded-2xl shadow-xl text-center border border-[#333]">
          {user?.profileImageUrl && (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-[#333]"
            />
          )}

          <div className="mb-3">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#2d2d2d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h1 className="text-2xl font-semibold text-white">{user?.name}</h1>
            )}
          </div>

          <h2 className="text-md text-gray-400 mb-1">{user?.email}</h2>
          <p className="text-sm text-gray-500 mb-6">Role: {user?.role}</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 cursor-pointer bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 cursor-pointer bg-red-600 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
