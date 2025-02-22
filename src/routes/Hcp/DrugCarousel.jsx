import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Minus, ClipboardList } from "lucide-react";
import supabase from "../../Supabase/supabase";
import { useTheme } from "../../context/ThemeContext";
import { useDrugs } from "../../context/DrugsProvider";
import DrugListDrawer from "../Patient/DrugListDrawer";

export default function DrugCarousel() {
  // Access theme and drug selection context
  const { themeColor } = useTheme();
  const { selectedDrugs, setSelectedDrugs } = useDrugs();

  // Local state for search, filtering, and UI interactions
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Ref to manage search bar interactions
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Sync selected drugs with localStorage to persist selection across reloads
  useEffect(() => {
    const syncStorage = () => {
      const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugsHCP")) || [];
      if (JSON.stringify(storedDrugs) !== JSON.stringify(selectedDrugs)) {
        setSelectedDrugs(storedDrugs);
      }
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, [selectedDrugs, setSelectedDrugs]);

  // Fetch drug list from Supabase (React Query handles caching)
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
    return drugs.filter(({ drug_name }) =>
      drug_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedLetter || drug_name.startsWith(selectedLetter))
    );
  }, [drugs, searchTerm, selectedLetter]);

  // Toggle drug selection and store it in localStorage
  const toggleDrugSelection = useCallback((drug, e) => {
    e.stopPropagation(); // Prevent navigation on button click

    setSelectedDrugs((prev) => {
      const isSelected = prev.some(({ drug_id }) => drug_id === drug.drug_id);
      const updatedDrugs = isSelected
        ? prev.filter(({ drug_id }) => drug_id !== drug.drug_id)
        : [...prev, drug];

      localStorage.setItem("selectedDrugsHCP", JSON.stringify(updatedDrugs));
      window.dispatchEvent(new Event("storage"));

      return updatedDrugs;
    });
  }, [setSelectedDrugs]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-10 relative px-4">
      
      {/* 🔍 Search Bar - Only Visible on Web (sm and larger) */}
<div
  ref={searchRef}
  className="absolute top-5 left-0 sm:left-36 transition-all duration-300 w-full sm:w-auto hidden sm:block"
>
  <div
    className={`flex items-center bg-gray-100 rounded-full shadow-md p-2 border border-gray-300 transition-all duration-300 ${
      searchExpanded ? "w-[250px]" : "w-[40px]"
    }`}
    onMouseEnter={() => setSearchExpanded(true)}
    onMouseLeave={() => setSearchExpanded(false)}
    onClick={() => setSearchExpanded(true)}
  >
    <Search className="text-gray-500 cursor-pointer" size={24} />
    {searchExpanded && (
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search drugs..."
        className="ml-2 flex-1 bg-transparent outline-none text-gray-800"
        autoFocus
      />
    )}
  </div>
</div>


      

      {/* 🏷️ Page Title */}
      <h1 className="text-3xl font-bold px-4 py-2 bg-blue-600 text-white rounded-md mt-4 sm:mt-0 sm:block hidden">
        Explore Drugs
      </h1>

      {/* 🔠 A-Z Alphabet Filter */}
      <div className="flex flex-col items-center my-4 w-full">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-wide">🔠 Filter by First Letter</h2>

        {/* Dropdown for Mobile */}
        <select
          className="block sm:hidden w-full max-w-xs p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md mb-4"
          value={selectedLetter}
          onChange={(e) => setSelectedLetter(e.target.value)}
        >
          <option value="">Select a letter</option>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <option key={letter} value={letter}>{letter}</option>
          ))}
        </select>

        {/* Grid for Desktop */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 w-full max-w-2xl px-4 py-2 rounded-lg">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <button
              key={letter}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border border-gray-300 hover:bg-gray-200 hover:text-gray-900 ${
                selectedLetter === letter ? "bg-blue-700 text-white border-blue-700 shadow-lg" : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setSelectedLetter((prev) => (prev === letter ? "" : letter))}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

    {/* 📦 Drug Grid Display */}
{isLoading && <p className="text-gray-500">Loading...</p>}
{error && <p className="text-red-500">Error: {error.message}</p>}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6 mt-4 pb-24 px-[10%]">
  {filteredDrugs.map((drug) => {
    const isSelected = selectedDrugs.some((d) => d.drug_id === drug.drug_id);
    return (
      <div
        key={drug.drug_id}
        className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
        onClick={() => navigate(`/hcp_foodInteraction/${drug.drug_id}`)}
      >
        <h3 className="text-lg font-semibold text-gray-900">{drug.drug_name}</h3>
        <button
  className={`relative group rounded-full w-9 h-9 flex items-center justify-center text-white ${
    isSelected ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
  }`}
  onClick={(e) => toggleDrugSelection(drug, e)}
  onMouseEnter={() => setDrawerOpen(false)}
>
  {isSelected ? <Minus size={18} /> : <Plus size={18} />}
  
  {/* Tooltip */}
  <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition">
    {isSelected ? "Remove from list" : "Add to list"}
  </span>
</button>

      </div>
    );
  })}
</div>

{/* 🏷️ Selected Drugs Button */}
<div className="absolute top-4 right-4">
  <div className="relative group">
    <button 
      onClick={() => setDrawerOpen(true)} 
      className="relative flex items-center space-x-2 px-3 py-2 shadow-sm bg-white rounded-full border border-blue-500 transition-all duration-300 group-hover:bg-blue-500"
    >
      {selectedDrugs.length > 0 && (
        <span className="absolute top-0 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">
          {selectedDrugs.length}
        </span>
      )}
      <ClipboardList size={24} className="w-6 h-6 text-black-900 group-hover:text-white" />
      <span className="text-black-500 group-hover:text-white font-medium hidden md:inline">Selected Drugs</span>
    </button>

    {/* Tooltip for selected drugs (Hidden on mobile, visible on md+ screens) */}
    {selectedDrugs.length > 0 && (
      <div className="absolute top-12 right-0 w-60 bg-white text-black text-sm rounded-lg shadow-xl p-3 
          invisible group-hover:visible scale-95 group-hover:scale-100 transition-all duration-200 
          hidden md:block">
        <strong className="block border-b border-gray-600 pb-2 mb-2 text-base">
          Selected Drugs:
        </strong>
        <ul className="space-y-1">
          {selectedDrugs.map((drug, index) => (
            <li key={index} className="truncate">• {drug.name || drug.drug_name}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>




      {/* 📋 Drug Drawer */}
      <DrugListDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </div>
  );
}
