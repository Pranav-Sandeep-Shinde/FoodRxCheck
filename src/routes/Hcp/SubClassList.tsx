import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../Supabase/supabase";
type SubClass = {
  sub_class_id: number;
  name: string;
};

const SubClassList = () => {
  const { class_id } = useParams<{ class_id: string }>();
  const navigate = useNavigate();

  // State to hold the class name
  const [className, setClassName] = useState<string | null>(null);

  // Ensure class_id is properly converted to a number
  const parsedClassId = Number(class_id);
  console.log("🔹 Parsed class_id:", parsedClassId, "Type:", typeof parsedClassId);

  // Fetch class details based on class_id
  useEffect(() => {
    const fetchClassName = async () => {
      if (isNaN(parsedClassId)) return;

      const { data, error } = await supabase
        .from("classes")
        .select("class_name")
        .eq("class_id", parsedClassId)
        .single(); // Assuming the class_id is unique

      if (error) {
        console.error("❌ Supabase Error:", error.message);
        return;
      }

      setClassName(data ? data.class_name : "Unknown Class");
    };

    fetchClassName();
  }, [parsedClassId]);

  const { data: subClasses, isLoading, error } = useQuery<SubClass[]>({
    queryKey: ["sub_classes", parsedClassId],
    queryFn: async () => {
      if (isNaN(parsedClassId)) return [];

      const { data, error } = await supabase
        .from("sub_classes")
        .select("*")
        .eq("class_id", parsedClassId)
        .order("name", { ascending: true });

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
        {className ? `${className} - Subclasses` : "Loading Classname..."}
      </h1>

      {subClasses.length === 0 ? (
        <p className="text-gray-300 text-center">No subclasses found.</p>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center ml-32 ">
            {subClasses.map((subClass) => (
              <div
                key={subClass.sub_class_id}
                onClick={() => navigate(`/drugs/${subClass.sub_class_id}`)}
                className="w-[220px] h-[140px] bg-white/10 backdrop-blur-lg rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer border-2 border-[#00796b] flex items-center justify-center text-center"
              >
                <p className="text-lg font-semibold text-black px-4">{subClass.name}</p>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubClassList;
