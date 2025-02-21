import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import supabase from "../../Supabase/supabase";
import { Search, Plus, Minus, ClipboardList } from "lucide-react";
import DrugListDrawer from "./DrugListDrawer";
import { useDrugs } from "../../context/DrugsProvider";
const Interaction = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(""); // Alphabet filter state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { selectedDrugs, setSelectedDrugs } = useDrugs();
  const navigate = useNavigate();

  /** Load selected drugs from localStorage */
  useEffect(() => {
    try {
      const storedDrugs = localStorage.getItem("selectedDrugsPatient");
      if (storedDrugs) {
        const parsedDrugs = JSON.parse(storedDrugs);
        if (Array.isArray(parsedDrugs)) {
          setSelectedDrugs(parsedDrugs);
        }
      }
    } catch (error) {
      console.error("Error parsing selected drugs:", error);
    }
  }, [setSelectedDrugs]);

  /** Fetch drugs from Supabase */
  const { data: drugs, isLoading, error } = useQuery({
    queryKey: ["patient_drugs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_drugs")
        .select("drug_id, drug_name")
        .order("drug_name", { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  /** Memoized filtering: Search + Alphabet */
  const filteredDrugs = useMemo(() => {
    if (!drugs) return [];
    return drugs.filter((drug) => {
      const matchesSearch = drug.drug_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = selectedLetter ? drug.drug_name.startsWith(selectedLetter) : true;
      return matchesSearch && matchesLetter;
    });
  }, [searchTerm, selectedLetter, drugs]);

  /** Toggle drug selection */
  const toggleDrug = (drug, event) => {
    event.stopPropagation();
    setDrawerOpen(false);

    setSelectedDrugs((prevDrugs) => {
      const isAlreadySelected = Array.isArray(prevDrugs) && prevDrugs.some((d) => d.drug_id === drug.drug_id);
      let updatedDrugs = isAlreadySelected
        ? prevDrugs.filter((d) => d.drug_id !== drug.drug_id)
        : [...prevDrugs, { ...drug, added_at: new Date().toISOString() }];

      localStorage.setItem("selectedDrugsPatient", JSON.stringify(updatedDrugs));
      return updatedDrugs;
    });
  };

  return (
    <div className="max-w-full md:px-28 px-4 py-8 md:ml-20 transition-all duration-300">
      {/* Search Input */}
      <div className="flex justify-between items-center mb-8">
        <div
          className="relative flex items-center bg-gray-100 rounded-full shadow-md border border-gray-300 transition-all duration-300 w-[40px] h-[40px] p-2 hover:w-[250px] hover:px-4"
        >
          <Search className="text-gray-400 cursor-pointer w-5 h-5" />
          <input
            type="text"
            placeholder="Search for a drug..."
            className="ml-2 flex-1 bg-transparent outline-none text-gray-800 opacity-0 w-0 transition-all duration-300 hover:opacity-100 hover:w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="hidden sm:flex justify-center mt-4 sm:mt-0">
        <h1 className="text-3xl font-bold px-6 py-3 bg-teal-600 text-white rounded-lg w-auto">
          Explore Drugs
        </h1>
      </div>

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

      {/* Error Handling */}
      {error && <p className="text-red-500 text-center">Failed to load drugs. Please try again.</p>}
      {isLoading && <p className="text-gray-500 text-center">Loading drugs...</p>}

      {/* Drug List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
        {filteredDrugs?.length > 0 ? (
          filteredDrugs.map((drug) => {
            const isSelected = Array.isArray(selectedDrugs) && selectedDrugs.some((d) => d.drug_id === drug.drug_id);
            return (
              <div
                key={drug.drug_id}
                className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/food-interaction/${drug.drug_id}`)}
              >
                <h3 className="text-xl font-semibold text-gray-900">{drug.drug_name}</h3>
                <button
                  className={`relative group rounded-full p-2 transition ${isSelected ? "bg-gray-500 hover:bg-gray-600" : "bg-teal-500 hover:bg-teal-600"} text-white`}
                  onClick={(e) => toggleDrug(drug, e)}
                  onMouseEnter={() => setDrawerOpen(false)}
                >
                  {isSelected ? <Minus size={20} /> : <Plus size={20} />}
                  <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                    {isSelected ? "Remove from list" : "Add to list"}
                  </span>
                </button>
              </div>
            );
          })
        ) : (
          !isLoading && !error && <p className="text-gray-500 text-center w-full">No drugs found</p>
        )}
      </div>

      {/* Floating "Selected Drugs" Button */}
      <div className="fixed z-[50] right-6 md:right-8 top-[5.5rem] md:top-6 group">
        <button
          className="relative border border-[#127089] text-[#127089] p-3 rounded-full hover:bg-[#127089] hover:text-white transition shadow-lg md:p-3 flex items-center justify-center bg-white"
          onClick={() => setDrawerOpen(true)}
        >
          <ClipboardList size={24} className="w-6 h-6 md:w-5 md:h-5" />
          {selectedDrugs.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#127089] text-white text-xs font-bold rounded-full px-2 py-0.5">
              {selectedDrugs.length}
            </span>
          )}
        </button>
      </div>

      {/* Drug Drawer */}
      <DrugListDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </div>
  );
};

export default Interaction;
