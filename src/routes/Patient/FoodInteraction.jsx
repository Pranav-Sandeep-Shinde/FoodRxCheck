import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../Supabase/supabase";
import { ArrowLeft } from "lucide-react";

const FoodInteraction = () => {
  const { drug_id } = useParams();
  const navigate = useNavigate();

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

  const { data: interactions = [], isLoading, error } = useQuery({
    queryKey: ["patient_interactions", drug_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_interactions")
        .select("management, counselling_tips")
        .eq("drug_id", Number(drug_id));

      if (error) {
        console.error("Error fetching interactions:", error.message);
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!drug_id,
  });

  if (isLoadingDrug || isLoading)
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;

  if (drugError || error)
    return <div className="text-red-500 text-center font-semibold">Error: {drugError?.message || error?.message}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="bg-teal-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Food Drug Interaction</h2>
        <button onClick={() => navigate(-1)} className="flex items-center text-white hover:text-gray-200">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Drug Name: {drug ? drug.drug_name : "Not Found"}</h3>
        <p className="text-gray-600 mb-4">
          Food Interactions: {
            interactions.filter(interaction => interaction.management !== "NA").length || 0
          }
        </p>

        {interactions.length > 0 ? (
          interactions.map((interaction, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Management:</h3>
              <p className="text-gray-600">{interaction.management || "No information available"}</p>
              <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Counselling Tips:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {interaction.counselling_tips ? (
                    interaction.counselling_tips.split("\n").map((tip, idx) => (
                      <li key={idx}>{tip.replace(/^\d+\.\s*/, "").trim()}</li>
                    ))
                  ) : (
                    <li>No tips available</li>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No food interactions found for this drug.</p>
        )}
      </div>
    </div>
  );
};

export default FoodInteraction;