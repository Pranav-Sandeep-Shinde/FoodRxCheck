import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";  // ✅ Import useNavigate
import supabase from "../../Supabase/supabase";

type Drug = {
  drug_id: number;
  drug_name: string;
};

const DrugList = () => {
  const { sub_class_id } = useParams<{ sub_class_id: string }>();
  const navigate = useNavigate();  // ✅ Initialize navigation hook

  const [subClassName, setSubClassName] = useState<string | null>(null);

  const parsedSubClassId = Number(sub_class_id);
  console.log("🔹 Parsed subclass_id:", parsedSubClassId, "Type:", typeof parsedSubClassId);

  useEffect(() => {
    const fetchSubClassName = async () => {
      if (isNaN(parsedSubClassId)) return;

      const { data, error } = await supabase
        .from("sub_classes")
        .select("name")
        .eq("sub_class_id", parsedSubClassId)
        .single();

      if (error) {
        console.error("❌ Supabase Error:", error.message);
        return;
      }

      setSubClassName(data ? data.name : "Unknown Subclass");
    };

    fetchSubClassName();
  }, [parsedSubClassId]);

  const { data: drugs, isLoading, error } = useQuery<Drug[]>({
    queryKey: ["drugs", parsedSubClassId],
    queryFn: async () => {
      if (isNaN(parsedSubClassId)) return [];

      const { data, error } = await supabase
        .from("drugs")
        .select("*")
        .eq("subclass_id", parsedSubClassId)
        .order("drug_name", { ascending: true });

      if (error) {
        console.error("❌ Supabase Error:", error.message);
        throw new Error(error.message);
      }
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-6">Error: {error.message}</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8 text-center drop-shadow-lg">
        {subClassName ? `${subClassName} - Drugs` : "Loading Subclass..."}
      </h1>

      {drugs.length === 0 ? (
        <p className="text-gray-300 text-center">No drugs found.</p>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center ml-32">

          {drugs.map((drug) => (
            <div
              key={drug.drug_id}
              onClick={() => navigate(`/interactions/${drug.drug_id}`)}  // ✅ Modify onClick to navigate
              className="w-[220px] h-[140px] bg-white/10 backdrop-blur-lg rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer border-2 border-[#00796b] flex items-center justify-center text-center"
            >
              <p className="text-lg font-semibold text-black px-4">{drug.drug_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugList;
