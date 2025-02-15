import React, { useState } from 'react';
import { ArrowRight, Shield, Heart, Clock, UserCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import supabase from '../../Supabase/supabase';
import Draggable, { DraggableCore } from 'react-draggable';
const Home = ({ showHero }) => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  let qualificationData = null;
  try {
    qualificationData = user?.qualification ? JSON.parse(user.qualification) : null;
  } catch (error) {
    console.error("Error parsing qualification data:", error);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowProfile(false);
  };

  return (
    <div
      className={`max-w-full md:px-28 px-4 py-8 md:ml-20 transition-all duration-300 ${showHero ? 'opacity-100' : 'opacity-0'
        }`}
    >
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Guide to Medical Care
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Clear and precise medical instructions to ensure proper care and treatment
        </p>
        <button
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          onClick={() => navigate('/general')}
        >
          View Instructions
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>

        {/* Profile or Sign-in Button */}
        {session ? (
          <div className="absolute top-0 right-0 mt-4">
            {/* <button
              className="md:inline-flex hidden items-center px-3 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors md:px-6 md:py-3"
              onClick={() => setShowProfile(!showProfile)}
            >
              <UserCircle2 className="mr-2 h-5 w-5" />
              <span className="hidden md:inline">{user?.full_name.split(' ')[0] || 'Profile'}</span>
            </button> */}
            <button
              className="fixed bottom-10 right-10 flex items-center justify-center w-14 h-14 rounded-full bg-teal-600/80 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:bg-teal-700 active:scale-90 active:shadow-md"
              onClick={() => setShowProfile(!showProfile)}
            >
              <UserCircle2 className="h-7 w-7" />
            </button>
            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 text-gray-900 z-50">
                <h3 className="text-lg font-bold mb-2">{user?.full_name}</h3>
                <p className="text-sm text-gray-600">{user?.role === 'patient' ? 'Patient' : 'Healthcare Professional'}</p>
                <hr className="my-2" />
                {qualificationData && (
                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h5 className="text-lg font-bold text-teal-500 text-center mb-2">Qualification Details</h5>
                    <p className="text-gray-700 text-sm"><span className="font-semibold">Degree: </span>{qualificationData.degree}</p>
                    <p className="text-gray-700 text-sm"><span className="font-semibold">Department: </span>{qualificationData.department}</p>
                    <p className="text-gray-700 text-sm"><span className="font-semibold">Institution: </span>{qualificationData.institution}</p>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-gray-500 hover:bg-red-100 rounded-lg mt-2"
                >
                  <LogOut className="mr-2 h-5 w-5" /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="fixed bottom-10 right-10 flex items-center justify-center w-14 h-14 rounded-full bg-teal-600/80 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:bg-teal-700 active:scale-90 active:shadow-md"
            onClick={() => navigate('/auth')}
          >
            <UserCircle2 className="h-7 w-7" />
          </button>
        )}
      </div>
      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={Shield}
          title="Safe & Reliable"
          description="Verified medical instructions from healthcare professionals"
        />
        <FeatureCard
          icon={Heart}
          title="Patient-Focused"
          description="Easy to understand instructions for better care"
        />
        <FeatureCard
          icon={Clock}
          title="Always Available"
          description="24/7 access to important medical guidelines"
        />
      </div>
      {/* CTA Section */}
      <div className="bg-teal-50 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-6">Access our comprehensive library of medical instructions</p>
        <button
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Browse Instructions
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-teal-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;
