// import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight, Search, PlusCircle, MinusCircle, Pill } from "lucide-react";
// import { motion } from "framer-motion";
// import supabase from "../../Supabase/supabase";

// export default function DrugCarousel() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDrugs, setSelectedDrugs] = useState(
//     () => JSON.parse(localStorage.getItem("selectedDrugs")) || []
//   );
//   const [scrollIndex, setScrollIndex] = useState(0);
//   const [searchExpanded, setSearchExpanded] = useState(false);
//   const searchRef = useRef(null);

//   const navigate = useNavigate();
//   const itemsPerPage = 3;

//   // Fetch drugs from Supabase
//   const { data: drugs = [], isLoading, error } = useQuery({
//     queryKey: ["drugs_list"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("drugs")
//         .select("drug_id, drug_name, class_id")
//         .order("drug_name", { ascending: true });
//       if (error) throw new Error(error.message);
//       return data;
//     },
//   });

//   // Filter drugs based on search term
//   const filteredDrugs = useMemo(
//     () =>
//       drugs.filter(({ drug_name, drug_id }) =>
//         drug_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         drug_id.toString().includes(searchTerm)
//       ),
//     [drugs, searchTerm]
//   );

//   useEffect(() => {
//     localStorage.setItem("selectedDrugs", JSON.stringify(selectedDrugs));
//   }, [selectedDrugs]);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSearchExpanded(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Toggle drug selection
//   const toggleDrugSelection = useCallback((drug) => {
//     setSelectedDrugs((prev) =>
//       prev.some(({ drug_id }) => drug_id === drug.drug_id)
//         ? prev.filter(({ drug_id }) => drug_id !== drug.drug_id)
//         : [...prev, drug]
//     );
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white py-10 relative">
//       <button
//         onClick={() => navigate("/selecteddrugs", { state: { selectedDrugs } })}
//         className="absolute top-4 right-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition"
//       >
//         <Pill size={24} />
//         <span className="text-lg font-medium">Selected Drugs ({selectedDrugs.length})</span>
//       </button>

//       <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Explore Drugs</h1>

//       {/* Search Bar */}
//       <div className="relative mb-6" ref={searchRef}>
//         <motion.div
//           className="flex items-center bg-gray-100 rounded-full shadow-md p-2"
//           initial={{ width: 40 }}
//           animate={{ width: searchExpanded ? 300 : 40 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Search
//             className="text-gray-500 cursor-pointer"
//             size={24}
//             onClick={() => setSearchExpanded(true)}
//           />
//           {searchExpanded && (
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search drugs..."
//               className="ml-2 flex-1 bg-transparent outline-none text-gray-800"
//               autoFocus
//             />
//           )}
//         </motion.div>
//       </div>

//       {isLoading && <p className="text-gray-500">Loading...</p>}
//       {error && <p className="text-red-500">Error: {error.message}</p>}

//       {filteredDrugs.length > 0 && !isLoading ? (
//         <div className="relative w-full max-w-4xl">
//           <button
//             className="absolute top-1/2 left-2 text-gray-600 hover:text-gray-400 transition-transform transform hover:scale-110 disabled:opacity-50"
//             onClick={() => setScrollIndex((prev) => Math.max(0, prev - itemsPerPage))}
//             disabled={scrollIndex === 0}
//           >
//             <ChevronLeft size={30} />
//           </button>

//           <div className="flex justify-center items-center space-x-6 p-6 overflow-hidden">
//             {filteredDrugs.slice(scrollIndex, scrollIndex + itemsPerPage).map((drug) => (
//               <div
//                 key={drug.drug_id}
//                 className="relative w-[240px] h-[220px] bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 cursor-pointer border border-gray-300 flex flex-col items-center justify-center text-center p-5"
//                 onClick={() => navigate(`/drug-info/${drug.drug_id}`)}
//               >
//                 <h3 className="text-lg font-bold text-gray-900">{drug.drug_name}</h3>
//                 <p className="text-sm text-gray-600">Class ID: {drug.class_id}</p>
//                 <p className="text-sm text-gray-600">Drug ID: {drug.drug_id}</p>
//                 <button
//                   className={`absolute bottom-4 text-gray-700 hover:text-green-500 ${selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? 'text-green-500' : ''}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleDrugSelection(drug);
//                   }}
//                 >
//                   {selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? (
//                     <MinusCircle size={24} />
//                   ) : (
//                     <PlusCircle size={24} />
//                   )}
//                 </button>
//               </div>
//             ))}
//           </div>

//           <button
//             className="absolute top-1/2 right-2 text-gray-600 hover:text-gray-400 transition-transform transform hover:scale-110 disabled:opacity-50"
//             onClick={() => setScrollIndex((prev) => Math.min(prev + itemsPerPage, filteredDrugs.length - itemsPerPage))}
//             disabled={scrollIndex + itemsPerPage >= filteredDrugs.length}
//           >
//             <ChevronRight size={30} />
//           </button>
//         </div>
//       ) : (
//         !isLoading && <p className="text-gray-500 mt-4">No drugs found</p>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight, Search, PlusCircle, MinusCircle, Pill } from "lucide-react";
// import { motion } from "framer-motion";
// import supabase from "../../Supabase/supabase";

// export default function DrugCarousel() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDrugs, setSelectedDrugs] = useState(
//     () => JSON.parse(localStorage.getItem("selectedDrugs")) || []
//   );
//   const [scrollIndex, setScrollIndex] = useState(0);
//   const [searchExpanded, setSearchExpanded] = useState(false);
//   const searchRef = useRef(null);

//   const navigate = useNavigate();
//   const itemsPerPage = 3;

//   // Fetch drugs from Supabase
//   const { data: drugs = [], isLoading, error } = useQuery({
//     queryKey: ["drugs_list"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("drugs")
//         .select("drug_id, drug_name")
//         .order("drug_name", { ascending: true });
//       if (error) throw new Error(error.message);
//       return data;
//     },
//   });

//   // Filter drugs based on search term
//   const filteredDrugs = useMemo(
//     () =>
//       drugs.filter(({ drug_name }) =>
//         drug_name.toLowerCase().includes(searchTerm.toLowerCase())
//       ),
//     [drugs, searchTerm]
//   );

//   useEffect(() => {
//     localStorage.setItem("selectedDrugs", JSON.stringify(selectedDrugs));
//   }, [selectedDrugs]);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSearchExpanded(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Toggle drug selection
//   const toggleDrugSelection = useCallback((drug) => {
//     setSelectedDrugs((prev) =>
//       prev.some(({ drug_id }) => drug_id === drug.drug_id)
//         ? prev.filter(({ drug_id }) => drug_id !== drug.drug_id)
//         : [...prev, drug]
//     );
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white py-10 relative">
//       {/* Navigate to Selected Drugs List */}
//       <button
//         onClick={() => navigate("/druglist", { state: { selectedDrugs } })}
//         className="absolute top-4 right-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition"
//       >
//         <Pill size={24} />
//         <span className="text-lg font-medium">Selected Drugs ({selectedDrugs.length})</span>
//       </button>

//       <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Explore Drugs</h1>

//       {/* Search Bar */}
//       <div className="relative mb-6" ref={searchRef}>
//         <motion.div
//           className="flex items-center bg-gray-100 rounded-full shadow-md p-2"
//           initial={{ width: 40 }}
//           animate={{ width: searchExpanded ? 300 : 40 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Search
//             className="text-gray-500 cursor-pointer"
//             size={24}
//             onClick={() => setSearchExpanded(true)}
//           />
//           {searchExpanded && (
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search drugs..."
//               className="ml-2 flex-1 bg-transparent outline-none text-gray-800"
//               autoFocus
//             />
//           )}
//         </motion.div>
//       </div>

//       {isLoading && <p className="text-gray-500">Loading...</p>}
//       {error && <p className="text-red-500">Error: {error.message}</p>}

//       {filteredDrugs.length > 0 && !isLoading ? (
//         <div className="relative w-full max-w-4xl">
//           {/* Left Scroll Button */}
//           <button
//             className="absolute top-1/2 left-2 text-gray-600 hover:text-gray-400 transition-transform transform hover:scale-110 disabled:opacity-50"
//             onClick={() => setScrollIndex((prev) => Math.max(0, prev - itemsPerPage))}
//             disabled={scrollIndex === 0}
//           >
//             <ChevronLeft size={30} />
//           </button>

//           {/* Drug Carousel */}
//           <div className="flex justify-center items-center space-x-6 p-6 overflow-hidden">
//             {filteredDrugs.slice(scrollIndex, scrollIndex + itemsPerPage).map((drug) => (
//               <div
//                 key={drug.drug_id}
//                 className="relative w-[240px] h-[150px] bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 cursor-pointer border border-gray-300 flex flex-col items-center justify-center text-center p-5"
//                 onClick={() => navigate(`/foodinteraction/${drug.drug_id}`)}
//               >
//                 <h3 className="text-lg font-bold text-gray-900">{drug.drug_name}</h3>
//                 <button
//                   className={`absolute bottom-4 text-gray-700 hover:text-green-500 ${
//                     selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? "text-green-500" : ""
//                   }`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleDrugSelection(drug);
//                   }}
//                 >
//                   {selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? (
//                     <MinusCircle size={24} />
//                   ) : (
//                     <PlusCircle size={24} />
//                   )}
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Right Scroll Button */}
//           <button
//             className="absolute top-1/2 right-2 text-gray-600 hover:text-gray-400 transition-transform transform hover:scale-110 disabled:opacity-50"
//             onClick={() =>
//               setScrollIndex((prev) => Math.min(prev + itemsPerPage, filteredDrugs.length - itemsPerPage))
//             }
//             disabled={scrollIndex + itemsPerPage >= filteredDrugs.length}
//           >
//             <ChevronRight size={30} />
//           </button>
//         </div>
//       ) : (
//         !isLoading && <p className="text-gray-500 mt-4">No drugs found</p>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, MinusCircle, Pill } from "lucide-react";
import { motion } from "framer-motion";
import supabase from "../../Supabase/supabase";
import { useTheme } from "../../context/ThemeContext";
export default function DrugCarousel() {
  const { themeColor } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState(
    () => JSON.parse(localStorage.getItem("selectedDrugs")) || []
  );
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(""); // ✅ Added missing state
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch drugs from Supabase
  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drugs")
        .select("drug_id, drug_name")
        .order("drug_name", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Filter drugs based on search input and selected letter
  const filteredDrugs = useMemo(() => {
    return drugs.filter(({ drug_name }) => {
      const matchesSearch = drug_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = selectedLetter ? drug_name.startsWith(selectedLetter) : true;
      return matchesSearch && matchesLetter;
    });
  }, [drugs, searchTerm, selectedLetter]);

  // Save selected drugs to local storage
  useEffect(() => {
    localStorage.setItem("selectedDrugs", JSON.stringify(selectedDrugs));
  }, [selectedDrugs]);

  // Handle outside click to close search bar
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle drug selection
  const toggleDrugSelection = useCallback((drug) => {
    setSelectedDrugs((prev) =>
      prev.some(({ drug_id }) => drug_id === drug.drug_id)
        ? prev.filter(({ drug_id }) => drug_id !== drug.drug_id)
        : [...prev, drug]
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-10 relative">
      {/* 🔍 Search Bar */}
      <div
        ref={searchRef}
        className="absolute top-8 left-36 transition-all duration-300 ease-in-out"
        onMouseEnter={() => setSearchExpanded(true)}
        onMouseLeave={() => setSearchExpanded(false)}
      >
        <motion.div
          className="flex items-center bg-gray-100 rounded-full shadow-md p-2 border border-gray-300"
          initial={{ width: 40 }}
          animate={{ width: searchExpanded ? 250 : 40 }}
          transition={{ duration: 0.3 }}
        >
          <Search className="text-gray-500 cursor-pointer" size={24} />
          {searchExpanded && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drugs..."
              className="ml-2 flex-1 bg-transparent outline-none text-gray-800"
              autoFocus
            />
          )}
        </motion.div>
      </div>

      {/* 🏷️ Page Title */}
      <h1 className={`text-3xl font-bold px-4 py-2 transition-all duration-300 bg-${themeColor}-600 text-white rounded-md`}>
        Explore Drugs
      </h1>



      {/* 🔠 A-Z Alphabet Filter */}
      <div className="flex flex-col items-center my-4 w-full">
        <motion.h2
          className="text-xl font-extrabold text-gray-900 mb-4 tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🔠 Filter by First Letter
        </motion.h2>
        {["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ"].map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2 mb-2 flex-wrap">
            {row.split("").map((letter) => (
              <button
                key={letter}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border border-gray-300 
                            hover:bg-gray-200 hover:text-gray-900
                            ${selectedLetter === letter ? "bg-blue-500 text-white border-blue-600 shadow-lg" : "bg-gray-100 text-gray-800"}`}
                onClick={() => setSelectedLetter((prev) => (prev === letter ? "" : letter))}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}


      </div>

      {/* 🏷️ Selected Drugs Button with Hover Dropdown */}
      <motion.div className="absolute top-4 right-4">
        <motion.button
          onClick={() => navigate("/druglist", { state: { selectedDrugs } })}
          className="relative flex items-center gap-2 text-gray-800 hover:text-gray-600 transition 
                     hover:border hover:border-gray-400 rounded-full p-3 shadow-sm bg-white"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Pill size={24} />
          {selectedDrugs.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {selectedDrugs.length}
            </span>
          )}
        </motion.button>

        {/* 🛑 Hover Dropdown for Selected Drugs */}
        {hovered && selectedDrugs.length > 0 && (
          <motion.div
            className="absolute right-0 top-12 w-60 bg-white shadow-lg rounded-lg p-3 border border-gray-200 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-md font-bold text-gray-900 mb-2">Selected Drugs</h3>
            <ul className="max-h-40 overflow-y-auto">
              {selectedDrugs.map((drug) => (
                <li key={drug.drug_id} className="text-gray-700 text-sm py-1 border-b">
                  {drug.drug_name}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* 📦 Drug Grid Display */}
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {filteredDrugs.length > 0 && !isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3  gap-4 px-6">
          {filteredDrugs.map((drug) => (
            <div
              key={drug.drug_id}
              className="relative w-full h-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-300 flex flex-col justify-between p-4"
              onClick={() => navigate(`/hcp_foodInteraction/${drug.drug_id}`)}
            >
              {/* Drug Name */}
              <h3 className="text-base font-semibold text-gray-900">{drug.drug_name}</h3>

              {/* Action Button */}
              <button
                className={`absolute top-4 right-4 text-gray-700 hover:text-green-500 ${selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? "text-green-500" : ""
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDrugSelection(drug);
                }}
              >
                {selectedDrugs.some(({ drug_id }) => drug_id === drug.drug_id) ? (
                  <MinusCircle
                    size={24}
                    className="text-white fill-gray-500" // White "-" sign, gray background
                  />
                ) : (
                  <PlusCircle
                    size={24}
                    className="text-white fill-green-500 hover:fill-gray-500 transition-colors"
                  />
                )}


              </button>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-gray-500 mt-4">No drugs found</p>
      )}

    </div>
  );
}
