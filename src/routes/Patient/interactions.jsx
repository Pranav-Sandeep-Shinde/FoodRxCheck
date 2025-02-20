import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import supabase from "../../Supabase/supabase";
import { Search, Plus, Minus, ClipboardList } from "lucide-react";
import DrugListDrawer from "./DrugListDrawer";
import { useDrugs } from "../../context/DrugsProvider";

const Interaction = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { selectedDrugs, setSelectedDrugs } = useDrugs();
  const navigate = useNavigate();

  /**  Load selected drugs from localStorage */
  useEffect(() => {
    const storedDrugs = localStorage.getItem("selectedDrugs");
    if (storedDrugs) {
      try {
        const parsedDrugs = JSON.parse(storedDrugs);
        if (Array.isArray(parsedDrugs)) {
          setSelectedDrugs(parsedDrugs);
        }
      } catch (error) {
        console.error("Error parsing selected drugs:", error);
      }
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

  /**  Memoized filtering of drugs for efficiency */
  const filteredDrugs = useMemo(() => {
    return drugs?.filter((drug) =>
      drug.drug_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, drugs]);

  /**  Toggle drug selection */
  const toggleDrug = (drug, event) => {
    event.stopPropagation();
    setDrawerOpen(false); // Close drawer when adding/removing a drug

    let updatedDrugs;
    if (selectedDrugs.some((d) => d.drug_id === drug.drug_id)) {
      updatedDrugs = selectedDrugs.filter((d) => d.drug_id !== drug.drug_id);
    } else {
      updatedDrugs = [...selectedDrugs, { ...drug, added_at: new Date().toISOString() }];
    }

    setSelectedDrugs(updatedDrugs);
    localStorage.setItem("selectedDrugs", JSON.stringify(updatedDrugs));
  };

  return (
    <div className="max-w-full md:px-28 px-4 py-8 md:ml-20 transition-all duration-300">
      {/* Search Input */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative max-w-xs md:max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for a drug..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error Handling */}
      {error && <p className="text-red-500 text-center">Failed to load drugs. Please try again.</p>}

      {/* Loading State */}
      {isLoading && <p className="text-gray-500 text-center">Loading drugs...</p>}

      {/* Drug List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
        {filteredDrugs?.length > 0 ? (
          filteredDrugs.map((drug) => {
            const isSelected = selectedDrugs.some((d) => d.drug_id === drug.drug_id);
            return (
              <div
                key={drug.drug_id}
                className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/food-interaction/${drug.drug_id}`)}
              >
                <h3 className="text-xl font-semibold text-gray-900">{drug.drug_name}</h3>
                <button
                  className={`relative group rounded-full p-2 transition ${
                    isSelected ? "bg-gray-500 hover:bg-gray-600" : "bg-teal-500 hover:bg-teal-600"
                  } text-white`}
                  onClick={(e) => toggleDrug(drug, e)}
                  onMouseEnter={() => setDrawerOpen(false)} // Close drawer on hover
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
      <div className="fixed z-[50] right-6 md:right-8 top-[5.5rem] md:top-6">
        <button
          className="relative border border-[#127089] text-[#127089] p-3 rounded-full 
               hover:bg-[#127089] hover:text-white transition shadow-lg 
               md:p-3 flex items-center justify-center bg-white"
          onClick={() => setDrawerOpen(true)}
        >
          <ClipboardList size={24} className="w-6 h-6 md:w-5 md:h-5" />
          {selectedDrugs.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#127089] text-white text-xs 
                      font-bold rounded-full px-2 py-0.5">
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
