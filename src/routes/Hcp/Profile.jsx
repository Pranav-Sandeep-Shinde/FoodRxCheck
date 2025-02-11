import React from 'react';
import { useAuth } from "../../context/AuthProvider";
// import supabase from '../../Supabse/supabse';
import supabase from '../../Supabase/supabase';
import { useQuery, useQueryClient } from "@tanstack/react-query";
const Profile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  let qualificationData = null;
  try {
    qualificationData = user?.qualification ? JSON.parse(user.qualification) : null;
  } catch (error) {
    console.error("Error parsing qualification data:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-100 flex flex-col items-center px-5 justify-center">
      <div className="h-[550px] w-full md:w-3/4 lg:w-1/2 bg-gradient-to-r from-blue-100 rounded-3xl shadow-lg px-2 py-10 overflow-auto pb-10">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Profile</h1>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 text-4xl text-white bg-teal-600 rounded-full shadow-lg">
            {user?.full_name?.charAt(0)}
          </div>
          <div className="ml-4 md:ml-0 md:w-1/2 text-center md:text-left">
            <p className="text-gray-500">Welcome</p>
            <h2 className="text-xl font-bold text-gray-800">{user?.full_name}</h2>
          </div>
        </div>

        {/* Role Section */}
        <div className="flex justify-center mb-8">
          <span className="px-4 py-2 text-white bg-teal-500 rounded-lg shadow">
            {user?.role === 'patient' ? 'Patient' : 'Healthcare Professional'}
          </span>
        </div>

        {/* Qualification Section */}
        {qualificationData && (
          <div className="p-4 bg-white w-full md:w-3/4 lg:w-1/2 rounded-lg shadow-md mx-auto mt-4">
            <h3 className="text-lg font-bold text-teal-500 mb-4 text-center">
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
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full md:w-1/2 mt-6 flex items-center justify-center self-center mx-auto px-4 py-2 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Profile;