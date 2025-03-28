import { useQuery } from "@tanstack/react-query";
import { Minus, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useDrugs } from "../../context/DrugsProvider";
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
  const { isHcp } = useAuth(); //  Moved inside component function
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
      className={`fixed top-0 right-0 h-full w-96 bg-gray-50 shadow-lg border-l border-gray-300 z-50 flex flex-col transform transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"
        } w-[90%] max-w-[400px] sm:w-96 md:w-[500px]"`}
      onMouseLeave={() => setDrawerOpen(false)} //  Close drawer on hover outside
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-200 border-b border-gray-300">
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
                className="relative flex flex-col p-3 transition bg-white border border-gray-300 rounded-md hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{drug.drug_name}</span>
                    <div className="text-xs text-gray-600">
                      {hasInteractions ? `${interactionCount} food interaction(s) found` : "No known food interactions"}
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center">
                    {hoveredDrug === drug.drug_id && (
                      <div className="absolute px-2 py-1 text-xs text-white transition-opacity duration-300 bg-gray-800 rounded-md shadow-lg opacity-100 bottom-10">
                        Remove from list
                      </div>
                    )}

                    <button
                      className="p-2 text-gray-700 transition bg-gray-300 rounded-full hover:text-gray-900 hover:bg-gray-400"
                      onClick={() => removeDrug(drug.drug_id)}
                      onMouseEnter={() => setHoveredDrug(drug.drug_id)}
                      onMouseLeave={() => setHoveredDrug(null)}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>

                {/*  Only display interactions list */}
                {hasInteractions && (
                  <div className="mt-2 text-xs text-gray-700">
                    {interactions.map((food, index) => (
                      <div key={index} className="text-gray-700">• {food}</div>
                    ))}
                  </div>
                )}

                <button
                  className="px-4 py-1 mt-2 text-sm font-medium text-white transition rounded-md"
                  style={{ backgroundColor: "#127089" }}
                  onClick={() => navigate(isHcp ? `/hcp_foodInteraction/${drug.drug_id}` : `/food-interaction/${drug.drug_id}`)}
                >
                  {showCounseling ? "Counseling" : "More Details"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No drugs selected</p>
        )}
      </div>

      {/* Clear All Button */}
      {selectedDrugs.length > 0 && (
        <div className="p-4 bg-blue-200 border-t border-gray-300">
          <button className="w-full px-4 py-2 font-medium text-white transition rounded-lg" style={{ backgroundColor: "#127089" }} onClick={clearAllDrugs}>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default DrugListDrawer;
