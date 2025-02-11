import React, { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../../Supabase/supabase";
const PassReset = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const resetPassword = async () => {
        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            email,
            password,
            redirectTo: 'http://localhost:5173/auth'
        });

        if (error) {
            setError(`Error: ${error.message}`);
        } else {
            alert("Password reset successful! Please log in again.");
            navigate('/auth');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center  h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9fff8] gap-5">
            <div className="flex flex-col gap-5 p-10 bg-teal-50 rounded-md w-3/4">
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    className="p-4 rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter new Password"
                    value={password}
                    className="p-4 rounded-lg"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    className="p-4 rounded-lg"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>


            {error && <p style={{ color: "red" }}>{error}</p>}

            <button className="w-3/12 h-[48px] bg-teal-500 rounded-lg shadow-lg border-none cursor-pointer text-[16px] text-[#fff] font-semibold" onClick={resetPassword} disabled={password !== confirmPassword}>
                Reset Password
            </button>
        </div>
    );
};

export default PassReset;
