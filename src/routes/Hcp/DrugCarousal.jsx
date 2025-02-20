
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, MinusCircle, ClipboardList } from "lucide-react";
import supabase from "../../Supabase/supabase";
import { useTheme } from "../../context/ThemeContext";
import DrugListDrawer from "../Patient/DrugListDrawer";

export default function DrugCarousel() {
  const { themeColor } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Load selected drugs from localStorage initially
  const [selectedDrugs, setSelectedDrugs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("selectedDrugs")) || [];
    } catch {
      return [];
    }
  });

  //  Sync storage updates across tabs & components
  useEffect(() => {
    const syncStorage = () => {
      const updatedDrugs = JSON.parse(localStorage.getItem("selectedDrugs")) || [];
      setSelectedDrugs([...updatedDrugs]); // Ensures re-render
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  //  Fetch drugs from Supabase
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

  //  Filter drugs based on search & letter
  const filteredDrugs = useMemo(() => {
    return drugs.filter(({ drug_name }) => {
      return (
        drug_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedLetter ? drug_name.startsWith(selectedLetter) : true)
      );
    });
  }, [drugs, searchTerm, selectedLetter]);

  // ✅ Toggle drug selection and FORCE RE-RENDER
  const toggleDrugSelection = useCallback((drug) => {
    setSelectedDrugs((prev) => {
      let updatedDrugs;
      if (prev.some(({ drug_id }) => drug_id === drug.drug_id)) {
        updatedDrugs = prev.filter(({ drug_id }) => drug_id !== drug.drug_id);
      } else {
        updatedDrugs = [...prev, drug];
      }
  
      localStorage.setItem("selectedDrugs", JSON.stringify(updatedDrugs));
  
      if (updatedDrugs.length === 0) {
        localStorage.removeItem("selectedDrugs"); // Ensure storage is clean
        setSelectedDrugs([]); // Force re-render
      }
  
      window.dispatchEvent(new Event("storage")); // Sync across tabs
  
      return [...updatedDrugs]; // New reference forces UI update
    });
  }, []);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-10 relative px-4">
      {/* 🔍 Search Bar */}
      <div ref={searchRef} className="absolute top-5 left-0 sm:left-36 w-full sm:w-auto">
        <div
          className={`flex items-center bg-gray-100 rounded-full shadow-md p-2 border border-gray-300 transition-all ${
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
            />
          )}
        </div>
      </div>

      {/* 🏷️ Page Title */}
      <h1 className="text-3xl font-bold px-4 py-2 bg-teal-600 text-white rounded-md mt-4 sm:mt-0 sm:block hidden">
        Explore Drugs
      </h1>

      {/* 🔠 A-Z Alphabet Filter */}
      <div className="flex flex-col items-center my-4 w-full">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">🔠 Filter by First Letter</h2>
        <div className="flex flex-wrap justify-center gap-2 w-full max-w-2xl px-4 py-2 rounded-lg">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <button
              key={letter}
              className={`px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 ${
                selectedLetter === letter ? "bg-teal-700 text-white border-teal-700" : "bg-gray-100 text-gray-800"
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
      {!isLoading && filteredDrugs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 mt-4">
          {filteredDrugs.map((drug) => (
            <div
              key={drug.drug_id}
              className="w-full bg-white rounded-lg shadow-md border border-gray-300 p-4 cursor-pointer"
              onClick={() => navigate(`/hcp_foodInteraction/${drug.drug_id}`)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-900">{drug.drug_name}</h3>
                <button
                  className="p-1 bg-white rounded-full shadow-sm hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDrugSelection(drug);
                  }}
                >
                  {selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? (
                    <MinusCircle size={30} className="text-teal-700" />
                  ) : (
                    <PlusCircle size={30} className="text-gray-500 hover:text-teal-700" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-gray-500 mt-4">No drugs found</p>
      )}

      {/* 🏷️ Selected Drugs Button */}
      <button onClick={() => setDrawerOpen(true)} className="absolute top-4 right-4 p-3 shadow-sm bg-white rounded-full">
        <ClipboardList size={24} />
      </button>

      {/* 📋 Drug Drawer */}
      <DrugListDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </div>
  );
}
