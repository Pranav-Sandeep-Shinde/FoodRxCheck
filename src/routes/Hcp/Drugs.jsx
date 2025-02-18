import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, MinusCircle, Pill } from "lucide-react";

import supabase from "../../Supabase/supabase";

export default function Drugs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState(
    () => JSON.parse(localStorage.getItem("selectedDrugs")) || []
  );
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(""); // ✅ Added missing state
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch drugs from Supabase
  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drugs")
        .select("drug_id, drug_name")
        .order("drug_name", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Filter drugs based on search input and selected letter
  const filteredDrugs = useMemo(() => {
    return drugs.filter(({ drug_name }) => {
      const matchesSearch = drug_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = selectedLetter ? drug_name.startsWith(selectedLetter) : true;
      return matchesSearch && matchesLetter;
    });
  }, [drugs, searchTerm, selectedLetter]);

  // Save selected drugs to local storage
  useEffect(() => {
    localStorage.setItem("selectedDrugs", JSON.stringify(selectedDrugs));
  }, [selectedDrugs]);

  // Handle outside click to close search bar
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle drug selection
  const toggleDrugSelection = useCallback((drug) => {
    setSelectedDrugs((prev) =>
      prev.some(({ drug_id }) => drug_id === drug.drug_id)
        ? prev.filter(({ drug_id }) => drug_id !== drug.drug_id)
        : [...prev, drug]
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-10 relative px-4">
      {/* 🔍 Search Bar */}
      {/* 🔍 Search Bar */}
      <div
        ref={searchRef}
        className="absolute top-5 left-0 sm:left-36 transition-all duration-300 ease-in-out w-full sm:w-auto"
      >
        <div
          className={`flex items-center bg-gray-100 rounded-full shadow-md p-2 border border-gray-300 transition-all duration-300 ${searchExpanded ? "w-[250px]" : "w-[40px]"
            }`}
          onMouseEnter={() => setSearchExpanded(true)}  // Expand on hover
          onMouseLeave={() => setSearchExpanded(false)} // Collapse when mouse leaves
          onClick={() => setSearchExpanded(true)}       // Also expand on click (for mobile)
        >
          <Search className="text-gray-500 cursor-pointer" size={24} />
          {searchExpanded && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drugs..."
              className="ml-2 flex-1 bg-transparent outline-none text-gray-800"
              autoFocus // Auto-focus when expanded
            />
          )}
        </div>
      </div>



      {/* 🏷️ Page Title (Hidden on Mobile) */}
      <h1 className="text-3xl font-bold px-4 py-2 transition-all duration-300 bg-teal-600 text-white rounded-md mt-4 sm:mt-0 sm:block hidden">
        Explore Drugs
      </h1>

      {/* 🔠 A-Z Alphabet Filter */}
      <div className="flex flex-col items-center my-4 w-full">
        <h2
          className="text-xl font-extrabold text-gray-900 mb-4 tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🔠 Filter by First Letter
        </h2>

        {/* Dropdown for Mobile */}
        <select
          className="block sm:hidden w-full max-w-xs p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md mb-4"
          value={selectedLetter}
          onChange={(e) => setSelectedLetter(e.target.value)}
        >
          <option value="">Select a letter</option>
          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>

        {/* Grid for Larger Screens */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 w-full max-w-2xl px-4 py-2  rounded-lg ">
          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter) => (
            <button
              key={letter}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border border-gray-300 
                            hover:bg-gray-200 hover:text-gray-900 
                            ${selectedLetter === letter ? "bg-teal-700 text-white border-teal-700 shadow-lg" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setSelectedLetter((prev) => (prev === letter ? "" : letter))}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* 🏷️ Selected Drugs Button with Hover Dropdown */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate("/druglist", { state: { selectedDrugs } })}
          className="relative flex items-center gap-2 text-gray-800 hover:text-gray-600 transition 
                     hover:border hover:border-gray-400 rounded-full p-3 shadow-sm bg-white"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Pill size={24} />
          {selectedDrugs.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-teal-700 text-white text-xs font-bold px-2 py-1 rounded-full">
              {selectedDrugs.length}
            </span>
          )}
        </button>

        {/* 🛑 Hover Dropdown for Selected Drugs */}
        {hovered && selectedDrugs.length > 0 && (
          <div
            className="absolute right-0 top-12 w-60 bg-white shadow-lg rounded-lg p-3 border border-gray-200 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-md font-bold text-gray-900 mb-2">Selected Drugs</h3>
            <ul className="max-h-40 overflow-y-auto">
              {selectedDrugs.map((drug) => (
                <li key={drug.drug_id} className="text-gray-700 text-sm py-1 border-b">
                  {drug.drug_name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 📦 Drug Grid Display */}
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {filteredDrugs.length > 0 && !isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 mt-4">
          {filteredDrugs.map((drug) => (
            <div
              key={drug.drug_id}
              className="relative w-full h-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-300 flex flex-col justify-between p-4"
              onClick={() => navigate(`/hcp_foodInteraction/${drug.drug_id}`)}
            >
              {/* Drug Name */}
              <h3 className="text-base font-semibold text-gray-900">{drug.drug_name}</h3>

              {/* Action Button */}
              <button
                className={`absolute top-4 right-4 text-gray-700 hover:text-teal-700 ${selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? "text-teal-700" : ""
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDrugSelection(drug);
                }}
              >
                {selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? (
                  <MinusCircle size={24} className="text-white fill-gray-500" />
                ) : (
                  <PlusCircle size={24} className="text-white fill-teal-700 hover:fill-gray-500 transition-colors" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-gray-500 mt-4">No drugs found</p>
      )}
    </div>
  );
}
