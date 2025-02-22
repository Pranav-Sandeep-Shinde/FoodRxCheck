import React, { useState } from "react";
import { Minus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDrugs } from "../../context/DrugsProvider";
import { useAuth } from "../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../Supabase/supabase";

// Fetch drug interactions
const fetchInteractions = async (selectedDrugs, isHcp) => {
  const interactionsMap = {};

  for (const drug of selectedDrugs) {
    try {
      const { data, error } = await supabase
        .from(isHcp ? "interactions" : "patient_interactions")
        .select("*")
        .eq("drug_id", drug.drug_id);

      if (error) {
        console.error(`Error fetching interactions for ${drug.drug_name}:`, error);
        continue;
      }

      const validInteractions = data
        ?.map((item) => item.food)
        .filter((food) => food && food !== "NA") || [];

      interactionsMap[drug.drug_id] = {
        count: validInteractions.length,
        interactions: validInteractions,
      };
    } catch (err) {
      console.error(`Unexpected error fetching ${drug.drug_name}:`, err);
    }
  }

  return interactionsMap;
};

const DrugListDrawer = ({ drawerOpen, setDrawerOpen }) => {
  const { selectedDrugs, removeDrug, clearAllDrugs } = useDrugs();
  const { isHcp } = useAuth(); // ✅ Moved inside component function
  const navigate = useNavigate();
  const [hoveredDrug, setHoveredDrug] = useState(null);

  const { data: interactionData } = useQuery({
    queryKey: ["interactions", selectedDrugs.map((d) => d.drug_id).join(","), isHcp],
    queryFn: () => fetchInteractions(selectedDrugs, isHcp),
    enabled: selectedDrugs.length > 0,
  });

  // Sort drugs based on interaction count (higher first)
  const sortedDrugs = [...selectedDrugs].sort((a, b) => {
    const aInteractions = interactionData?.[a.drug_id]?.count || 0;
    const bInteractions = interactionData?.[b.drug_id]?.count || 0;
    return bInteractions - aInteractions;
  });

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-gray-50 shadow-lg border-l border-gray-300 z-50 flex flex-col transform transition-transform duration-300 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
      onMouseLeave={() => setDrawerOpen(false)} // ✅ Close drawer on hover outside
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-blue-200">
        <h3 className="text-lg font-semibold text-gray-900">Selected Drugs</h3>
        <button onClick={() => setDrawerOpen(false)} className="text-gray-700 hover:text-gray-900">
          <X size={24} />
        </button>
      </div>

      {/* Drug List */}
      <div className="p-4 space-y-2 overflow-y-auto flex-grow h-[calc(100%-100px)]">
        {sortedDrugs.length > 0 ? (
          sortedDrugs.map((drug) => {
            const interactions = interactionData?.[drug.drug_id]?.interactions || [];
            const interactionCount = interactions.length;
            const hasInteractions = interactionCount > 0;
            const showCounseling = !hasInteractions && !isHcp;

            return (
              <div
                key={drug.drug_id}
                className="relative flex flex-col bg-white p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{drug.drug_name}</span>
                    <div className="text-xs text-gray-600">
                      {hasInteractions ? `${interactionCount} food interaction(s) found` : "No known food interactions"}
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center">
                    {hoveredDrug === drug.drug_id && (
                      <div className="absolute bottom-10 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg transition-opacity duration-300 opacity-100">
                        Remove from list
                      </div>
                    )}

                    <button
                      className="text-gray-700 hover:text-gray-900 p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition"
                      onClick={() => removeDrug(drug.drug_id)}
                      onMouseEnter={() => setHoveredDrug(drug.drug_id)}
                      onMouseLeave={() => setHoveredDrug(null)}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>

                {/* ✅ Only display interactions list */}
                {hasInteractions && (
                  <div className="mt-2 text-xs text-gray-700">
                    {interactions.map((food, index) => (
                      <div key={index} className="text-gray-700">• {food}</div>
                    ))}
                  </div>
                )}

                <button
                  className="mt-2 px-4 py-1 text-sm font-medium text-white rounded-md transition"
                  style={{ backgroundColor: "#127089" }}
                  onClick={() => navigate(isHcp ? `/hcp_foodInteraction/${drug.drug_id}` : `/food-interaction/${drug.drug_id}`)}
                >
                  {showCounseling ? "Counseling" : "More Details"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No drugs selected</p>
        )}
      </div>

      {/* Clear All Button */}
      {selectedDrugs.length > 0 && (
        <div className="p-4 border-t border-gray-300 bg-blue-200">
          <button className="w-full px-4 py-2 font-medium rounded-lg transition text-white" style={{ backgroundColor: "#127089" }} onClick={clearAllDrugs}>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default DrugListDrawer;
