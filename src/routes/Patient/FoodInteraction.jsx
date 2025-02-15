import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../Supabase/supabase";

const FoodInteraction = () => {
  const { drug_id } = useParams();
  console.log("Drug ID from URL:", drug_id);

  // Fetch the drug name from `patient_drugs`
  const { data: drug, isLoading: isLoadingDrug, error: drugError } = useQuery({
    queryKey: ["patient_drugs", drug_id],
    queryFn: async () => {
      console.log("Fetching drug name for ID:", drug_id);
      const { data, error } = await supabase
        .from("patient_drugs")
        .select("drug_name") // 
        .eq("drug_id", Number(drug_id)) // 
        .single();

      if (error) {
        console.error("Error fetching drug:", error.message);
        throw new Error(error.message);
      }

      console.log("Fetched drug data:", data);
      return data;
    },
    enabled: !!drug_id,
  });

  // Fetch food interactions
  const { data: interactions = [], isLoading, error } = useQuery({
    queryKey: ["patient_interactions", drug_id],
    queryFn: async () => {
      console.log("Fetching interactions for drug ID:", drug_id);
      const { data, error } = await supabase
        .from("patient_interactions")
        .select("management, counselling_tips")
        .eq("drug_id", Number(drug_id)); // 

      if (error) {
        console.error("Error fetching interactions:", error.message);
        throw new Error(error.message);
      }

      console.log("Fetched interactions data:", data);
      return data || [];
    },
    enabled: !!drug_id, // 
  });

  if (isLoadingDrug || isLoading)
    return <div className="flex justify-center items-center h-screen
text-lg font-semibold">Loading...</div>;

  if (drugError || error)
    return <div className="text-red-500 text-center
font-semibold">Error: {drugError?.message || error?.message}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Food
        Interaction</h2>
      <h3 className="text-xl font-semibold text-blue-700 mb-2">
        Drug Name: {drug ? drug.drug_name : "Not Found"}
      </h3>

      {interactions.length > 0 ? (
        interactions.map((interaction, index) => (
          <div key={index} className="mb-6 border-b pb-4 last:border-none">
            <div className="mb-4">
              <h3 className="text-lg font-semibold
text-gray-700">Management:</h3>
              <p className="text-gray-600">{interaction.management ||
                "No information available"}</p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-700
mb-2">Counselling Tips:</h3>
              <ul className="list-decimal list-inside text-gray-700 space-y-2">
                {interaction.counselling_tips
                  ? interaction.counselling_tips
                    .split("\n")
                    .map((tip, idx) => (
                      <li key={idx}>{tip.replace(/^\d+\.\s*/,
                        "").trim()}</li>
                    ))
                  : <li>No tips available</li>}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">No food interactions
          found for this drug.</p>
      )}
    </div>
  );
};

export default FoodInteraction;
