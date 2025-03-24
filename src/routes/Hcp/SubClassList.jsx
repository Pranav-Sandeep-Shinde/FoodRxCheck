import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../Supabase/supabase";
import { ArrowLeft } from "lucide-react"; // Back Arrow Icon

const SubClassList = () => {
  const { class_id } = useParams();
  const navigate = useNavigate();

  const [className, setClassName] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const parsedClassId = Number(class_id);

  useEffect(() => {
    const fetchClassName = async () => {
      if (isNaN(parsedClassId)) return;

      const { data, error } = await supabase
        .from("classes")
        .select("class_name")
        .eq("class_id", parsedClassId)
        .single();

      if (error) {
        console.error("❌ Supabase Error:", error.message);
        return;
      }

      setClassName(data ? data.class_name : "Unknown Class");
    };

    fetchClassName();
  }, [parsedClassId]);

  const { data: subClasses = [], isLoading, error } = useQuery({
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

  // Filter subclasses based on search query
  const filteredSubClasses = subClasses.filter((subClass) =>
    subClass.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col items-center relative">
      {/* Back Arrow Button */}
      <div className="w-full max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex sm:ml-14 items-center text-black hover:text-gray-700 transition-all"
        >
          <ArrowLeft className="w-6 h-6 mr-2" /> Back
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-6 text-center drop-shadow-lg mt-8">
        {className ? `${className} - Subclasses` : "Loading Classname..."}
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search for subclasses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:outline-none mb-6"
        />
      </div>

      {filteredSubClasses.length === 0 ? (
        <p className="text-gray-500 text-center">No subclasses found.</p>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center w-[80%] max-w-6xl">
          {filteredSubClasses.map((subClass) => (
            <div
              key={subClass.sub_class_id}
              onClick={() => navigate(`/drugs/${subClass.sub_class_id}`)}
              className="w-full sm:max-w-[220px] sm:h-[140px] bg-white/10 backdrop-blur-lg rounded-lg border-2 border-gray-500 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer flex items-center justify-center text-center p-4 mx-auto"
            >
              <p className="text-lg font-semibold text-black">{subClass.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubClassList;
