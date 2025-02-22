import React from "react";
import {
  Menu,
  X,
  Home,
  List,
  UserCircle,
  Pill,
  FlaskRound as Flask,
  Apple,
  Brain,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { themeColor, role } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  // Navigation Items
  const navItems = [
    { page: "home", icon: Home, text: "Home", description: "Main Dashboard" },
    role !== "hcp" && {
      page: "general",
      icon: List,
      text: "General Instructions",
      description: "Direction of use",
    },
    {
      page: `${session ? "profile" : "auth"}`,
      icon: UserCircle,
      text: `${session ? "Profile" : "Auth"}`,
      description: "Sign In As HCP",
    },
    role !== "hcp" && {
      page: "interactions",
      icon: Flask,
      text: "Drug Interaction",
      description: "Drug Interactions",
    },
    role === "hcp" && {
      page: "HcpDrugList",
      icon: Brain,
      text: "Drug",
      description: "Drug MedGuide",
    },
    role === "hcp" && {
      page: "classification",
      icon: Pill,
      text: "Drug Classification",
      description: "Drug Hierarchy",
    },
    { page: "foodSearch", icon: Apple, text: "Food Search", description: "Food Search" },
  ].filter(Boolean);

  const onNavigate = (page) => {
    navigate(page === "home" ? "/" : `/${page}`);
  };

  // Animation Variants
  const navVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 bg-${themeColor}-600 z-50`}>
        <div className="flex justify-between items-center h-16 px-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`text-white p-2 rounded-md hover:bg-${themeColor}-700 transition-colors`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-white">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">FoodRxCheck</span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav
        className={`hidden md:block fixed left-0 top-0 h-screen bg-white shadow-xl z-50 transition-all duration-300 
        ${isSidebarExpanded ? "w-64" : "w-20"} 
        group hover:w-64`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`h-16 bg-${themeColor}-600 relative flex items-center px-4`}>
            <div className="absolute left-4 flex items-center">
              <Home className="h-7 w-7 text-white" />
            </div>
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-white transition-opacity duration-300
                ${isSidebarExpanded ? "opacity-100" : "opacity-0"} 
                group-hover:opacity-100`}
            >
              <span className="font-bold text-xl">FoodRxCheck</span>
            </div>
          </div>

          {/* Navigation Items with Animation */}
          <div className="flex-1 py-6 overflow-y-auto">
            <div className="px-2 space-y-2">
              {navItems.map(({ page, icon: Icon, text, description }, index) => (
                <motion.button
                  key={page}
                  onClick={() => onNavigate(page)}
                  className={`w-full text-left px-4 py-3 rounded-full transition-all duration-200 ease-in-out
                    ${
                      location.pathname === `/${page}` ||
                      (page === "home" && location.pathname === "/")
                        ? `bg-teal-100 text-${themeColor}-700 shadow-sm`
                        : `text-${themeColor}-600 hover:bg-${themeColor}-50`
                    }`}
                  variants={navVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index} // Dynamic stagger effect
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className={`transition-opacity duration-300 
                      ${isSidebarExpanded ? "opacity-100" : "opacity-0"} 
                      group-hover:opacity-100 whitespace-nowrap`}
                    >
                      <div className="font-medium">{text}</div>
                      <div className="text-xs text-gray-500">{description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className={`h-16 bg-${themeColor}-600 flex items-center px-4 justify-center`}>
              <span className="text-white font-bold text-xl">FoodRxCheck</span>
            </div>
            <div className="py-6">
              <div className="px-4 space-y-2">
                {navItems.map(({ page, icon: Icon, text, description }, index) => (
                  <motion.button
                    key={page}
                    onClick={() => {
                      onNavigate(page);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
                      ${
                        location.pathname === `/${page}` ||
                        (page === "home" && location.pathname === "/")
                          ? `bg-teal-100 text-${themeColor}-700 shadow-sm`
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    variants={navVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>
                    </div>
                  </motion.button>
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
