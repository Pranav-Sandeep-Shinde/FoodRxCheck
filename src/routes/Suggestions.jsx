import React, { useState } from "react";
import { motion } from "framer-motion";
import supabase from "../Supabase/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";

const Suggestions = () => {
  const { theme, role } = useTheme();  

  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("Drug Missing");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const queryOptions = ["Drug Missing", "Required More Info", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (description.trim().length === 0) {
      setError("Description cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("suggestions")
      .insert([{ role, query, description }]);

    if (error) {
      setError("Failed to submit suggestion. Please try again.");
    } else {
      setSuccess("Suggestion submitted successfully!");
      setDescription("");
    }


  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{
        background: theme === "dark" ? "linear-gradient(135deg, #1a1a2e, #16213e)" : "linear-gradient(135deg, #f8f9fa, #e0e0e0)",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Submit a Suggestion</h2>

        <div className="mb-4 relative">
          <label className="block font-medium mb-1">Query</label>
          <div
            className="w-full p-3 border rounded-md flex justify-between items-center cursor-pointer bg-gray-100 hover:bg-gray-200"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {query}
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 right-0 mt-1 bg-white shadow-md rounded-md z-10"
            >
              {queryOptions.map((option) => (
                <div
                  key={option}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setQuery(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Description (up to 50 words)</label>
          <textarea
            className="w-full p-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your suggestion..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mb-2">{error}</motion.p>}
        {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-center mb-2">{success}</motion.p>}

        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`w-full text-white py-2 px-4 rounded-md transition ${
            role === "patient" ? "bg-teal-600 hover:bg-teal-700" : "bg-sky-600 hover:bg-sky-700"
          }`}
          onClick={handleSubmit}
        >
          Submit
        </motion.button>        
      </motion.div>
    </div>
  );
};

export default Suggestions;