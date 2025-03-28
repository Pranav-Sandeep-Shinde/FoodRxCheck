import { useQuery } from "@tanstack/react-query";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../Supabase/supabase";

const HcpfoodInteraction = () => {
  const { id: drugId } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("Received Drug ID:", drugId);
  // }, [drugId]);

  

  const { data: drug, isLoading: drugLoading, error: drugError } = useQuery({
    queryKey: ["drug_list", drugId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drugs")
        .select("drug_name")
        .eq("drug_id", drugId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!drugId,
  });

  const { data: interactions, isLoading: interactionLoading, error: interactionError } = useQuery({
    queryKey: ["interactions", drugId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interactions")
        .select("food, mechanism_of_action, severity, management, reference")
        .eq("drug_id", drugId);
      if (error) throw error;

      return (data || []).filter((item) => item.food && item.food.trim().toUpperCase() !== "NA");
    },
    enabled: !!drugId,
  });

  if (drugLoading || interactionLoading)
    return <div className="flex justify-center items-center h-screen text-sm sm:text-md">Loading...</div>;

  if (drugError || interactionError)
    return (
      <div className="p-4 w-full max-w-md mx-auto bg-red-100 text-red-700 rounded-xl shadow-md space-y-3 text-xs sm:text-sm">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{drugError?.message || interactionError?.message}</p>
      </div>
    );

  if (!drug)
    return (
      <div className="p-4 w-full max-w-md mx-auto bg-yellow-100 text-yellow-700 rounded-xl shadow-md space-y-3 text-xs sm:text-sm">
        <h2 className="text-lg font-semibold">No Data Found</h2>
        <p>We couldn't find any drug details.</p>
      </div>
    );

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-3 md:mt-8">
      {/* Header */}
      <div className="bg-sky-600 text-white px-3 py-2 sm:p-4 flex items-center">
        <button onClick={() => navigate("/hcpdruglist")} className="flex items-center">
          <IoArrowBack className="text-xl sm:text-2xl" />
        </button>
        <div className="ml-3">
          <h2 className="text-sm sm:text-lg font-semibold">Food Drug Interaction</h2>
          <h3 className="text-xs sm:text-sm">{drug.drug_name}</h3>
        </div>
      </div>

      {/* Drug Info */}
      <div className="px-3 py-2 border-b border-gray-300 bg-gray-100 text-xs sm:text-sm">
        <p className="font-bold text-gray-800">
          Total Food Interactions: <span className="text-sm sm:text-lg">{interactions?.length || 0}</span>
        </p>
      </div>

      {/* Interaction Details */}
      <div className="p-3 bg-gray-50 max-h-[50vh] overflow-y-auto">
        {interactions.length > 0 ? (
          interactions.map((item, index) => (
            <details key={index} className="border border-gray-300 rounded-lg overflow-hidden mb-2 sm:mb-3">
              <summary className="bg-gray-100 p-2 sm:p-3 text-xs sm:text-sm font-semibold cursor-pointer">
                {item.food || "Food Interaction"}
              </summary>
              <div className="p-2 sm:p-3 space-y-1 sm:space-y-2 text-gray-800 bg-white text-xs sm:text-sm">
                <p><strong>Mechanism:</strong> {item.mechanism_of_action || "N/A"}</p>
                <p><strong>Severity:</strong> {item.severity || "N/A"}</p>
                <p><strong>Management:</strong> {item.management || "N/A"}</p>
                <p><strong>Reference:</strong> {item.reference || "N/A"}</p>
              </div>
            </details>
          ))
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm">No food interactions found.</p>
        )}
      </div>
    </div>
  );
};

export default HcpfoodInteraction;