import { useEffect, useState } from 'react';
import logo from '../../assets/drugSpecIcon white.png';
import { Link } from 'react-router-dom'; // Import from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';

function Header() {
  const { session } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 1000); // Trigger animations after 1 second
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
    className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%]  border border-blue-300 backdrop-blur-lg ${
      // Remove border-radius for mobile
      !window.matchMedia('(min-width: 768px)').matches
        ? 'rounded-none'
        : 'rounded-full'
    } px-4 py-3 shadow-lg z-50 transition-transform   ${
      animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
    }`}
  >
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Logo"
            className={`w-10 h-auto transition-all duration-500 ${
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          />
          <span className="text-lg font-semibold text-gray-800">DrugSpec</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-gray-700">
          <Link
            to="/general"
            className="hover:text-blue-500 transition duration-300"
          >
            General Instruction
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-500 transition duration-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-blue-500 transition duration-300"
          >
            Contact
          </Link>
        </nav>

        {/* Profile/Sign In */}
        <div>
          {session ? (
            <Link
              to="/profile"
              className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition"
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/Auth"
              className="hidden md:inline-block px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              Sign In as HCP
            </Link>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            className="text-gray-800 focus:outline-none"
            aria-label="Toggle Menu"
            onClick={toggleMenu}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`md:hidden mt-4 space-y-3 text-center ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <Link
          to="/general"
          className="block text-gray-700 hover:text-blue-500"
        >
          General Instruction
        </Link>
        <Link to="/about" className="block text-gray-700 hover:text-blue-500">
          About
        </Link>
        <Link to="/contact" className="block text-gray-700 hover:text-blue-500">
          Contact
        </Link>
        {session ? (
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition"
          >
            Profile
          </Link>
        ) : (
          <Link
            to="/Auth"
            className="block px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
          >
            Sign In as HCP
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;