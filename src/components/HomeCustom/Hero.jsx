import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, List, Brain, FlaskRound, UserCircle2, LogOut, Pill, TrendingUp, Database, Apple, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import supabase from '../../Supabase/supabase';
import { useTheme } from '../../context/ThemeContext';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
const Home = ({ showHero }) => {
  const { themeColor, logout, role } = useTheme();
  const color = "bg-teal-100";
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const driverInstance = useRef(null);
  useEffect(() => {
    driverInstance.current = driver({
      showProgress: true,
      steps: getTourSteps(role) // Get steps based on role
    });
  }, [role]);

  const getTourSteps = (userRole) => {
    let steps = [];
    if (userRole === "patient") {
      steps = [
        { element: '.intro', popover: { title: 'Welcome, Patient!', description: 'Learn how to find medical information.', side: "left", align: 'start' } },
        { element: '.profile', popover: { title: 'Login as HCP', description: 'Click here to login as HCP.', side: "bottom", align: 'start' } },
        { element: '.icons', popover: { title: 'Navigate the Options', description: 'CLick here to more options.', side: "bottom", align: 'start' } },
        { element: '.GeneralInstruction', popover: { title: 'General Instructions', description: 'CLick here to navigate general instructions', side: "bottom", align: 'start' } },
        { element: '.DrugInteraction', popover: { title: 'Drug Interactions', description: 'CLick here navigate to Drug Interactions', side: "bottom", align: 'start' } },
        { element: '.FoodSearch', popover: { title: 'Food Search', description: 'CLick here to navigate to Food Search', side: "bottom", align: 'start' } },
        { popover: { title: 'Enjoy!', description: 'You are all set. Stay healthy!' } }
      ];
    } else {
      steps = [
        { element: '.intro', popover: { title: 'Welcome, Professional!', description: 'Explore medical resources for professionals.', side: "left", align: 'start' } },
        { element: '.profile', popover: { title: 'Your Profile', description: 'Manage your professional details.', side: "bottom", align: 'start' } },
        { element: '.icons', popover: { title: 'Click here for more options', description: 'Click here for more options', side: "bottom", align: 'start' } },
        { element: '.Drug', popover: { title: 'Drug List', description: 'Click here for accessing drug list', side: "bottom", align: 'start' } },
        { element: '.DrugClassification', popover: { title: 'Drug Classification', description: 'Click here to view classification', side: "bottom", align: 'start' } },
        { element: '.FoodSearch', popover: { title: 'Food Search', description: 'CLick here to navigate to Food Search', side: "bottom", align: 'start' } },
        { popover: { title: 'Enjoy!', description: 'You are all set. Provide the best care!' } }
      ];
    }
    if (window.innerWidth < 768) {
      // Remove a step that is not needed on mobile
      steps = steps.filter(step => step.element !== '.icons');

      // Create a mobile-specific step
      const mobileStep = {
        element: '.mobile-view',
        popover: { title: 'Click here for more options', description: 'Navigate here for more options .', side: "bottom", align: 'start' }
      };

      // Insert the mobile step before the last step (second last position)
      steps.splice(steps.length - 1, 0, mobileStep);
    }
    return steps;
  }

  const startTour = () => {
    if (driverInstance.current) {
      driverInstance.current.drive();
    }
  };


  let qualificationData = null;
  try {
    qualificationData = user?.qualification ? JSON.parse(user.qualification) : null;
  } catch (error) {
    console.error("Error parsing qualification data:", error);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/');
    setShowProfile(false);
  };
  return (
    <>
      {role === 'patient' ?
        (
          <div
            className={`intro max-w-full md:px-28 px-4 py-8 md:ml-20 transition-all duration-300 ${showHero ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Hero Section */}
            <div className="text-center mb-16 relative">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Guide to Medical Care
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Your trusted guide to safe medication—no side effects, just results.
              </p>
              <button
                className={`inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:teal-700 transition-colors`}
                onClick={startTour}
              >
                Take a Tour
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              {/* Profile or Sign-in Button */}
              {session ? (
                <div className="absolute top-0 right-0 mt-4">
                  <button
                    className="profile fixed bottom-10 right-10 flex items-center justify-center w-14 h-14 rounded-full bg-teal-600/80 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:bg-teal-700 active:scale-90 active:shadow-md"
                    onClick={() => role == 'hcp' ? setShowProfile(true) : navigate('/auth')}
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
                  className={`profile fixed bottom-10 right-10 flex items-center justify-center w-14 h-14 rounded-full bg-teal-600/80 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:bg-teal-700 active:scale-90 active:shadow-md`}
                  onClick={() => navigate('/auth')}
                >
                  <UserCircle2 className="h-7 w-7" />
                </button>
              )}
            </div>
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <FeatureCard
                icon={List}
                title="General Instructions"
                description="General Instructions about Medication"
                themeColor='teal'
                className={'GeneralInstruction'}
                page='general'
                navigate={navigate}

              />
              <FeatureCard
                icon={FlaskRound}
                title="Drug Interactions"
                description="Create and analyse effect of your drugList"
                themeColor='teal'
                className={'DrugInteraction'}
                page='interactions'
                navigate={navigate}
              />
              <FeatureCard
                icon={Apple}
                title="Interact with the Food"
                description="Eat what you benefit from"
                themeColor='teal'
                className={'FoodSearch'}
                page='foodSearch'
                navigate={navigate}
              />
            </div>

            {/* CTA Section */}
            <div className="bg-teal-50 rounded-2xl p-8 text-center mt-0.5">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">Access our comprehensive library of medical instructions</p>

              <button
                className={`instruction inline-flex items-center px-6 py-3 bg-${themeColor}-600 text-white rounded-lg hover:bg-${themeColor}-700 transition-colors`}
                onClick={() => navigate('/general')}
              >
                View General Instructions
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )
        :
        (
          <div
            className={`intro max-w-full md:px-28 px-4 py-8 md:ml-20 transition-all duration-300 ${showHero ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Hero Section */}
            <div className="text-center mb-16 relative">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Guide to Medical Instruction
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Clear and precise medical instructions to ensure proper care and treatment
              </p>
              <button
                className={`drug-list inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors`}
                onClick={() => startTour()}
              >
                Take a Tour to HCP guide
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              {/* Profile or Sign-in Button */}
              {session ? (
                <div className="absolute top-0 right-0 mt-4">
                  <button
                    className={`profile fixed bottom-10 right-10 flex items-center justify-center w-14 h-14 rounded-full bg-sky-600/80 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:bg-sky-700 active:scale-90 active:shadow-md`}
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
                          <h5 className={`text-lg font-bold text-sky-500 text-center mb-2`}>Qualification Details</h5>
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
                  className={`fixed bottom-10 right-10 flex items-center justify-center w-14 h-14 rounded-full bg-sky-600/80 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:bg-sky-700 active:scale-90 active:shadow-md`}
                  onClick={() => navigate('/auth')}
                >
                  <UserCircle2 className="h-7 w-7" />
                </button>
              )}
            </div>
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <FeatureCard
                icon={ClipboardCheck}
                title="Drug"
                description="Select Your Drug and its details"
                role={'hcp'}
                className={'Drug'}
                page='HcpDrugList'
                navigate={navigate}
              />
              <FeatureCard
                icon={TrendingUp}
                title="Drug Classification"
                description="Classified Drugs to ease your classification"
                role={'hcp'}
                className={'DrugClassification'}
                page='classification'
                navigate={navigate}
              />
              <FeatureCard
                icon={Database}
                title="Food Search"
                description="Search your Food and interact with it"
                role={'hcp'}
                className={'FoodSearch'}
                page='foodSearch'
                navigate={navigate}
              />
            </div>

            {/* CTA Section */}
            <div className="bg-sky-50 rounded-2xl p-8 text-center mt-0.5">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">Access our comprehensive library of medical instructions</p>
              <button
                className={`inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors`}
                onClick={() => navigate('/hcpdruglist')}
              >
                View Drug List
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )
      }
    </>
  );
};
const FeatureCard = ({ icon: Icon, title, description, role, className, page, navigate, themeColor }) => {
  return (
    <div
      onClick={() => navigate(`/${page}`)}
      className={`${className} bg-white p-6 rounded-xl shadow-md hover:cursor-pointer shadow-lg transition-shadow`}
    >
      <div
        className={`${role === 'hcp' ? 'bg-sky-100' : `bg-${themeColor}-100`
          } w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
      >
        <Icon
          className={`h-6 w-6 ${role === 'hcp' ? 'text-sky-600' : `text-${themeColor}-600`
            }`}
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;
