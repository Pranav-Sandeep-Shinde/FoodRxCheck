import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../Supabase/supabase";
import { ArrowLeft } from "lucide-react";

const FoodInteraction = () => {
  const { drug_id } = useParams();
  const navigate = useNavigate();

  // Fetch drug name
  const { data: drug, isLoading: isLoadingDrug, error: drugError } = useQuery({
    queryKey: ["patient_drugs", drug_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_drugs")
        .select("drug_name")
        .eq("drug_id", Number(drug_id))
        .single();

      if (error) {
        console.error("Error fetching drug:", error.message);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!drug_id,
  });

  // Fetch food interactions
  const { data: interactions = [], isLoading, error } = useQuery({
    queryKey: ["patient_interactions", drug_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_interactions")
        .select("food, management, counselling_tips")
        .eq("drug_id", Number(drug_id));

      if (error) {
        console.error("Error fetching interactions:", error.message);
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!drug_id,
  });

  // Filter valid interactions
  const validInteractions = interactions.filter(
    (item) => item.food && item.food.trim().toUpperCase() !== "NA"
  );

  // Extract unique counselling tips
  const uniqueCounsellingTips = [
    ...new Set(
      interactions
        .map((item) => item.counselling_tips?.trim())
        .filter((tip) => tip && tip.toUpperCase() !== "NA")
    ),
  ];

  // Function to format tips correctly
  const formatTips = (tips) => {
    return tips.flatMap((tip, i) =>
      tip
        .split("\n") // Split by new lines
        .filter((line) => line.trim() !== "") // Remove empty lines
        .map((line, j) => (
          <li key={`${i}-${j}`} className="whitespace-pre-line">
            {line.trim()}
          </li>
        ))
    );
  };

  if (isLoadingDrug || isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );

  if (drugError || error)
    return (
      <div className="text-red-500 text-center font-semibold">
        Error: {drugError?.message || error?.message}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Header */}
      <div className="bg-teal-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200"
          >
            <ArrowLeft size={16} className="mr-2" />
          </button>
          <h2 className="text-lg font-semibold">Food Drug Interaction</h2>
        </div>
        <h3 className="text-base font-medium mt-1">
          {drug ? drug.drug_name : "Not Found"}
        </h3>
      </div>

      <div className="p-4">
        {/* Food Interaction Count */}
        <p className="text-gray-600 mb-4">
          Food Interactions: {validInteractions.length}
        </p>

        {/* Food Interaction Collapsibles */}
        {validInteractions.length > 0 &&
          validInteractions.map((interaction, index) => (
            <details
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden mb-4"
            >
              <summary className="bg-gray-100 p-4 text-lg font-semibold cursor-pointer">
                {interaction.food || `Food Interaction ${index + 1}`}
              </summary>
              <div className="p-4 space-y-2 text-gray-800 bg-white">
                {/* Management inside collapsible */}
                {interaction.management && interaction.management.trim().toUpperCase() !== "NA" && (
                  <p>
                    <strong>Management:</strong> {interaction.management}
                  </p>
                )}
              </div>
            </details>
          ))}

        {/* Counselling Tips (separate from collapsible) */}
        {uniqueCounsellingTips.length > 0 && (
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Counselling Tips:</h3>
            <ul className="list-none list-inside text-gray-700 space-y-2">
              {formatTips(uniqueCounsellingTips)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodInteraction;