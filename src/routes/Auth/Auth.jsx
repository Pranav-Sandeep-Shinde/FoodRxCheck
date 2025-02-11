import { useState } from 'react';
import './Auth.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
// import supabase from '../../Supabse/supabse'; // Update with the correct path to your supabase.js
import supabase from '../../Supabase/supabase';
import QualificationModal from '../../components/Qualification';
import { useNavigate } from 'react-router-dom';
function AuthLayout() {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qualifications, setQualifications] = useState(null);
  const navigate = useNavigate();
  const handleAddQualification = (qualification) => {
    setQualifications(qualification);
  };
  const resetPassword = (email) => async () => {
    if (!email) {
      alert('Please provide your email.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/PasswordReset',
    })
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert('Password reset email sent to your email id!');
    }
  }
  // Login Function
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(`Login Error: ${error.message}`);
    } else {
      alert('Login successful!');
      navigate('/profile');
    }
    setLoading(false);
  };

  // Register Function
  const handleRegister = async () => {

    if (!qualifications || !qualifications.degree || !qualifications.department || !qualifications.institution) {
      alert("Incomplete Information. Please provide your qualification details.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'hcp',
          qualification: qualifications,
        },
      },
    });
    if (error) {
      alert(`Registration Error: ${error.message}`);
    } else {
      alert('successful! Please verify your email.');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff]">
      <div className={`container relative bg-white rounded-[30px] shadow-lg overflow-hidden ${isActive ? 'active' : ''}`}>
        {/* Login Form */}
        <div
          className={`absolute w-1/2 h-full right-0 flex flex-col justify-evenly items-center text-center text-[#333] formbox p-4 
          transition-all duration-[1200ms] ease-in-out ${isActive ? 'translate-x-full opacity-0 invisible' : 'translate-x-0 opacity-100 visible'}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="w-full"
          >
            <h1 className="text-[36px] font-bold font-fit">Login</h1>
            <div className="relative my-[20px]">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-box"
              />
              <FaEnvelope className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#888]" />
            </div>
            <div className="relative my-[20px]">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-box"
              />
              <FaLock className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#888]" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-teal-500 rounded-lg shadow-lg border-none cursor-pointer text-[16px] text-[#fff] font-semibold"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <button className='hover:text-blue-600' onClick={resetPassword(email)}>Forgot password?</button>
        </div>

        {/* Register Form */}
        <div
          className={`absolute  left-0 w-1/2 h-full flex items-center text-center text-[#333] formbox p-4 
          transition-all duration-[1200ms] ease-in-out ${isActive ? 'translate-x-0 opacity-100 visible ' : '-translate-x-full opacity-0 invisible'}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            className="w-full"
          >
            <h1 className="text-[36px] font-bold font-fit">Register</h1>
            <div className="relative my-[20px]">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-box"
              />
              <FaUser className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#888]" />
            </div>
            <div className="relative my-[20px]">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-box"
              />
              <FaEnvelope className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#888]" />
            </div>
            <div className="relative my-[20px]">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-box"
              />
              <FaLock className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#888]" />
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className=" rounded-lg shadow-lg border border-teal-500 cursor-pointer text-[16px] text-teal-500 h-[40px] w-2/3 mb-4 flex items-center justify-center self-center mx-auto hover:text-white hover:bg-[#7494ec] "
            >
              {qualifications ? 'Edit Qualifications' : 'Add Qualifications'}
            </div>


            {/* Display Saved Qualifications */}
            {qualifications && (
              <ul className="list-disc list-inside justify-center  flex flex-col text-left">
                <li>
                  Degree: {qualifications.degree}
                </li>
                <li>
                  Department: {qualifications.department}
                </li>
                <li>
                  Institution: {qualifications.institution}
                </li>

              </ul>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-teal-500 rounded-lg shadow-lg border-none cursor-pointer text-[16px] text-[#fff] font-semibold "
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
        <QualificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddQualification}
        />
        {/* Toggle Box */}
        <div className="absolute w-full h-full toggel-box bg-white">
          <div
            className={`absolute left-0 bg-none w-1/2 h-full  flex items-center flex-col justify-center text-center text-white z-10 tg Left
              transition-all duration-700 ease-in-out ${isActive ? '-left-[50%] opacity-0 invisible' : 'left-0 opacity-100 visible'}`}>
            <div className="text-[35px] font-bold font-fit">Welcome Back!</div>
            <div className="my-1">Don't Have an Account?</div>
            <button
              className="bg-none text-white p-2  w-1/3 border-2 border-solid border-white rounded-lg"
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>

          <div
            className={`absolute right-0 bg-none w-1/2 h-full flex items-center flex-col justify-center text-center text-white z-10 tg Right
              transition-all duration-700 ease-in-out ${isActive ? 'right-0 opacity-100 visible' : '-right-[50%] opacity-0 invisible'}`}>
            <div className="text-[35px] font-bold font-fit">Welcome!</div>
            <div className="my-1">Already Have an Account?</div>
            <button
              className="bg-none text-white p-2 w-1/3 border-2 border-solid border-white rounded-lg"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
