import React from 'react';
import { Menu, X, Home, List, Info, Pill, FlaskRound as Flask, Apple, Brain, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  // Enhanced navigation items with icons and descriptions
  const navItems = [
    { page: 'home', icon: Home, text: 'Home', description: 'Main Dashboard' },
    { page: 'general', icon: List, text: 'Instructions', description: 'Medical Guidelines' },
    { page: `${session ? 'profile' : 'auth'}`, icon: UserCircle, text: `${session ? 'Profile' : 'Auth'}`, description: 'Sign In As HCP' },
    { page: 'interactions', icon: Flask, text: 'Interactions', description: 'Drug Interactions' },
    { page: 'FoodInteraction', icon: Apple, text: 'Food Interaction', description: 'Food Interaction' },
    // { page: 'about', icon: Brain, text: 'About', description: 'About FoodRxChecker' }
  ];
  const onNavigate = (page) => {
    if (page === 'home') {
      return navigate('/');
    }
    else {
      navigate(`/${page}`);
    }
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-teal-600 z-50">
        <div className="flex justify-between items-center h-16 px-4">
          <span className="flex items-center space-x-2 text-white">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">FoodRxCheck</span>
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Floating Sidebar */}
      <nav
        className={`hidden md:block fixed left-0 top-0 h-screen bg-white shadow-xl z-50 transition-all duration-300 
          ${isSidebarExpanded ? 'w-64' : 'w-20'} 
          group hover:w-64`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 bg-teal-600 flex items-center px-4 justify-between">
            <span className="flex items-center space-x-2 text-white">
              <Home className="h-6 w-6 flex-shrink-0" />
              <span className={`font-bold text-xl whitespace-nowrap transition-opacity duration-300 
                ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'} 
                group-hover:opacity-100`}>
                FoodRxChecker
              </span>
            </span>
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className={`text-white p-1 rounded-md hover:bg-teal-700 transition-colors
                ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'} 
                group-hover:opacity-100 `}
            >
              {isSidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-6 overflow-y-auto">
            <div className="px-2 space-y-2">
              {navItems.map(({ page, icon: Icon, text, description }) => (
                <button
                  key={page}
                  onClick={() => {
                    onNavigate(page);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 pl-5 py-3 rounded-full transition-all duration-200 ease-in-out  ${location.pathname === `/${page}` || (page === 'home' && location.pathname === '/') ? 'bg-teal-100 text-teal-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-3">

                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className={`transition-opacity duration-300 
                      ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'} 
                      group-hover:opacity-100 whitespace-nowrap`}>
                      <div className="font-medium">{text}</div>
                      <div className="text-xs text-gray-500">{description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="h-16 bg-teal-600" /> {/* Spacer for mobile top bar */}
            <div className="py-6">
              <div className="px-4 space-y-2">
                {navItems.map(({ page, icon: Icon, text, description }) => (
                  <button
                    key={page}
                    onClick={() => {
                      onNavigate(page);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 pl-5 py-3 rounded-lg transition-all duration-200 ease-in-out ${location.pathname === `/${page}` || (page === 'home' && location.pathname === '/') ? 'bg-teal-100 text-teal-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                      }}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;