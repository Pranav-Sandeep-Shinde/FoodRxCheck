import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../Supabase/supabase";
import { useTheme } from "../../context/ThemeContext";
const FoodInteraction = ({ moduleType = "patient" }) => {
  const { drug_id } = useParams();
  const navigate = useNavigate();

  const numericDrugId = Number(drug_id);
  if (isNaN(numericDrugId)) {
    console.error("Invalid drug_id:", drug_id);
    return <div className="text-center text-red-500">Error: Invalid drug ID</div>;
  }

  const drugTable = moduleType === "hcp" ? "drugs" : "patient_drugs";
  const interactionTable = moduleType === "hcp" ? "interactions" : "patient_interactions";

  // Fetch drug name
  const { data: drug, isLoading: isLoadingDrug, error: drugError } = useQuery({
    queryKey: [drugTable, drug_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(drugTable)
        .select("drug_name")
        .eq("drug_id", numericDrugId)
        .single();

      if (error) {
        console.error("Error fetching drug:", error.message);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!numericDrugId,
  });

  // Fetch food interactions
  const { data: interactions = [], isLoading, error } = useQuery({
    queryKey: [interactionTable, drug_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(interactionTable)
        .select(
          moduleType === "hcp"
            ? "food, mechanism_of_action, severity, management, reference"
            : "food, management, counselling_tips"
        )
        .eq("drug_id", numericDrugId);

      if (error) {
        console.error("Error fetching interactions:", error.message);
        throw new Error(error.message);
      }
      console.log(data);
      return data || [];
    },
    enabled: !!numericDrugId,
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
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );

  if (drugError || error)
    return (
      <div className="font-semibold text-center text-red-500">
        Error: {drugError?.message || error?.message}
      </div>
    );

  console.log("Module Type:", moduleType);
  console.log("Valid Interactions:", validInteractions);

  const themeColor = useTheme();
  return (
    <div className="max-w-3xl p-4 mx-auto mt-6 bg-white border border-gray-200 rounded-lg shadow-lg md:p-6 md:mt-10">
      {/* Header */}
      <div className={`p-3 text-white bg-${themeColor.themeColor}-600 rounded-t-lg md:p-4`}>
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200"
          >
            <ArrowLeft size={16} className="mr-2" />
          </button>
          <h2 className="text-base font-semibold md:text-lg">Food Drug Interaction</h2>
        </div>
        <h3 className="mt-1 text-sm font-medium md:text-base">
          {drug ? drug.drug_name : "Not Found"}
        </h3>
      </div>

      <div className="p-4">
        {/* Food Interaction Count */}
        <p className="mb-4 text-sm text-gray-600 md:text-base">
          Food Interactions: {validInteractions.length}
        </p>

        {/* Food Interaction Collapsibles */}
        {validInteractions.length > 0 &&
          validInteractions.map((interaction, index) => (
            <details
              key={index}
              className="mb-4 overflow-hidden border border-gray-300 rounded-lg"
            >
              <summary className="p-3 text-sm font-semibold bg-gray-100 cursor-pointer md:p-4 md:text-lg">
                {interaction.food || `Food Interaction ${index + 1}`}
              </summary>
              <div className="p-3 space-y-2 text-sm text-gray-800 bg-white md:p-4 md:text-base">
                {/* HCP-specific fields */}
                {moduleType === "hcp" && interaction.mechanism_of_action && (
                  <p>
                    <strong>Mechanism of Action:</strong>{" "}
                    {interaction.mechanism_of_action}
                  </p>
                )}
                {moduleType === "hcp" && interaction.severity && (
                  <p>
                    <strong>Severity:</strong> {interaction.severity}
                  </p>
                )}
                {interaction.management && interaction.management.trim().toUpperCase() !== "NA" && (
                  <p>
                    <strong>Management:</strong> {interaction.management}
                  </p>
                )}
                {moduleType === "hcp" && interaction.reference && (
                  <p>
                    <strong>Reference:</strong> {interaction.reference}
                  </p>
                )}
              </div>
            </details>
          ))}

        {/* Counselling Tips (separate from collapsible) */}
        {moduleType === "patient" && uniqueCounsellingTips.length > 0 && (
          <div className="p-3 border border-gray-300 rounded-lg md:p-4 bg-gray-50">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 md:text-lg">Counselling Tips:</h3>
            <ul className="space-y-2 text-sm text-gray-700 list-none list-inside md:text-base">
              {formatTips(uniqueCounsellingTips)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodInteraction;

