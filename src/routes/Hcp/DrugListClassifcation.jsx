import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../Supabase/supabase";
import { ArrowLeft } from "lucide-react";

const DrugList = () => {
  const { sub_class_id } = useParams();
  const navigate = useNavigate();
  const parsedId = Number(sub_class_id);

  const [title, setTitle] = useState("Drugs");
  const [isClassId, setIsClassId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine if parsedId refers to class_id or subclass_id
  useEffect(() => {
    const determineIdType = async () => {
      if (isNaN(parsedId)) return;

      const { data, error } = await supabase
        .from("drugs")
        .select("class_id")
        .eq("class_id", parsedId)
        .limit(1)
        .single();

      if (!error && data) {
        setIsClassId(true);
      } else {
        setIsClassId(false);
      }
    };

    determineIdType();
  }, [parsedId]);

  // Fetch title (Class or Subclass name)
  useEffect(() => {
    const fetchTitle = async () => {
      if (isNaN(parsedId) || isClassId === null) return;

      const referenceTable = isClassId ? "classes" : "sub_classes";
      const referenceColumn = isClassId ? "class_name" : "name";
      const idColumn = isClassId ? "class_id" : "sub_class_id";

      const { data, error } = await supabase
        .from(referenceTable)
        .select(referenceColumn)
        .eq(idColumn, parsedId)
        .single();

      if (!error && data) {
        setTitle(`${data[referenceColumn]} - Drugs`);
      }
    };

    fetchTitle();
  }, [parsedId, isClassId]);

  // Fetch drugs based on class or subclass ID
  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs", parsedId],
    queryFn: async () => {
      if (isNaN(parsedId) || isClassId === null) return [];

      const filterColumn = isClassId ? "class_id" : "subclass_id";

      const { data, error } = await supabase
        .from("drugs")
        .select("*")
        .eq(filterColumn, parsedId)
        .order("drug_name", { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: isClassId !== null,
  });

  // Filter drugs based on search input
  const filteredDrugs = drugs.filter((drug) =>
    drug.drug_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-6 text-center drop-shadow-lg mt-8">
        {title}
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search for drugs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796b] focus:outline-none mb-6"
        />
      </div>

      {/* Drug List */}
      {filteredDrugs.length === 0 ? (
        <p className="text-gray-300 text-center">No drugs found.</p>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center w-[80%] max-w-6xl">
          {filteredDrugs.map((drug) => (
            <div
              key={drug.drug_id}
              onClick={() => navigate(`/interactions/${drug.drug_id}`)}
              className="w-full sm:max-w-[220px] sm:h-[140px] bg-white/10 backdrop-blur-lg rounded-lg border-2 border-gray-500 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer flex items-center justify-center text-center p-4 mx-auto"
            >
              <p className="text-lg font-semibold text-black">{drug.drug_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugList;
