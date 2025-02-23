import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import  supabase  from "../../Supabase/supabase";
import { IoArrowBack } from "react-icons/io5";

const InteractionList = () => {
  const { drug_id } = useParams();
  const { class_id } = useParams();
  const navigate = useNavigate();
  console.log("Class ID for direct interaction:", class_id);

  useEffect(() => {
    console.log("Received Drug ID:", drug_id);
  }, [drug_id]);

  const { data: drug, isLoading: drugLoading, error: drugError } = useQuery({
    queryKey: ["drug_list", drug_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drugs")
        .select("drug_name")
        .eq("drug_id", drug_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!drug_id,
  });

  const { data: interactions, isLoading: interactionLoading, error: interactionError } = useQuery({
    queryKey: ["interactions", drug_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interactions")
        .select("food, mechanism_of_action, severity, management, reference")
        .eq("drug_id", drug_id);
      if (error) throw error;
      
      // Filter out entries where food is "NA", null, or empty
      return (data || []).filter(item => item.food && item.food.trim().toUpperCase() !== "NA");
    },
    enabled: !!drug_id,
  });

  if (drugLoading || interactionLoading)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (drugError || interactionError)
    return (
      <div className="p-6 max-w-lg mx-auto bg-red-100 text-red-700 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{drugError?.message || interactionError?.message}</p>
      </div>
    );

  if (!drug)
    return (
      <div className="p-6 max-w-lg mx-auto bg-yellow-100 text-yellow-700 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">No Data Found</h2>
        <p>We couldn't find any drug details.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10">
      {/* Header */}
      <div className="bg-teal-600 text-white p-4 flex items-center">
        <IoArrowBack className="text-2xl cursor-pointer" onClick={() => navigate(-1)} />  
        <div className="ml-3">
          <h2 className="text-xl font-semibold">Food Drug Interaction</h2>
          <h3 className="text-lg">{drug.drug_name}</h3>
        </div>
      </div>

      {/* Drug Name */}
      <div className="p-4 border-b border-gray-300 bg-gray-100">
        <p className="text-lg font-bold text-gray-800">
          Total Food Interactions: <span className="text-xl text-black-700">{interactions?.length || 0}</span>
        </p>
      </div>

      {/* Interaction Details */}
      <div className="p-4 bg-gray-50">
        {interactions.length > 0 ? (
          interactions.map((item, index) => (
            <details key={index} className="border border-gray-300 rounded-lg overflow-hidden mb-4">
              <summary className="bg-gray-100 p-4 text-lg font-semibold cursor-pointer">
                {item.food || "Food Interaction"}
              </summary>
              <div className="p-4 space-y-2 text-gray-800 bg-white">
                <p><strong>Mechanism:</strong> {item.mechanism_of_action || "N/A"}</p>
                <p><strong>Severity:</strong> {item.severity || "N/A"}</p>
                <p><strong>Management:</strong> {item.management || "N/A"}</p>
                <p><strong>Reference:</strong> {item.reference || "N/A"}</p>
              </div>
            </details>
          ))
        ) : (
          <p className="text-gray-500">No food interactions found.</p>
        )}
      </div>
    </div>
  );
};

export default InteractionList;
