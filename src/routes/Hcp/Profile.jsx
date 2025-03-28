import React from 'react';
import { useAuth } from "../../context/AuthProvider";
import supabase from '../../Supabase/supabase';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const { logout, themeColor } = useTheme();
  const navigate = useNavigate();

  let qualificationData = null;
  try {
    qualificationData = user?.qualification ? JSON.parse(user.qualification) : null;
  } catch (error) {
    console.error("Error parsing qualification data:", error);
  }

  const handleSignout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/');
  };

  // Parent container animation (staggered children)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Time delay between child animations
      },
    },
  };

  // Child element animation (slide from left + fade-in)
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <div className="max-h-screen bg-gradient-to-r from-gray-100 to-blue-100 flex flex-col items-center justify-center px-5 ">

      {/* Static Card Container */}
      <div className="max-h-screen w-full md:w-3/4 lg:w-1/2 bg-gradient-to-r from-blue-100 rounded-3xl shadow-lg px-2 py-10 overflow-hidden mt-10 pb-10">

        {/* Animated Content with Staggered Children */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-4 text-center text-gray-800">
            Profile
          </motion.h1>

          {/* Profile Section */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 text-4xl text-white bg-sky-600 rounded-full shadow-lg">
              <span>{user?.full_name?.charAt(0)}</span>
            </div>
            <div className="flex flex-col items-center justify-center mt-2">
              <p className="text-gray-500">Welcome</p>
              <h2 className="text-xl font-bold text-gray-800">{user?.full_name}</h2>
            </div>
          </motion.div>

          {/* Role Section */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <span className="px-4 py-2 text-white bg-sky-500 rounded-lg shadow">
              {user?.role === 'patient' ? 'Patient' : 'Healthcare Professional'}
            </span>
          </motion.div>

          {/* Qualification Section */}
          {qualificationData && (
            <motion.div variants={itemVariants} className="p-4 bg-white w-full md:w-3/4 lg:w-1/2 rounded-lg shadow-md mx-auto mt-4">
              <h3 className="text-lg font-bold text-sky-500 mb-4 text-center">
                Qualification Details
              </h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Degree: </span>
                {qualificationData.degree}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Department: </span>
                {qualificationData.department}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Institution: </span>
                {qualificationData.institution}
              </p>
            </motion.div>
          )}

          {/* Sign Out Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleSignout}
            className={`w-full md:w-1/2 mt-6 flex items-center justify-center self-center mx-auto px-4 py-2 bg-${themeColor}-500 text-white font-bold rounded-lg shadow-lg hover:bg-sky-600`}
          >
            Sign out
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
