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
//     <div className="relative flex flex-col items-center justify-center min-h-screen py-10 bg-white">
//       <button
//         onClick={() => navigate("/selecteddrugs", { state: { selectedDrugs } })}
//         className="absolute flex items-center gap-2 text-gray-800 transition top-4 right-4 hover:text-gray-600"
//       >
//         <Pill size={24} />
//         <span className="text-lg font-medium">Selected Drugs ({selectedDrugs.length})</span>
//       </button>

//       <h1 className="mb-8 text-4xl font-extrabold text-gray-900">Explore Drugs</h1>

//       {/* Search Bar */}
//       <div className="relative mb-6" ref={searchRef}>
//         <motion.div
//           className="flex items-center p-2 bg-gray-100 rounded-full shadow-md"
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
//               className="flex-1 ml-2 text-gray-800 bg-transparent outline-none"
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
//             className="absolute text-gray-600 transition-transform transform top-1/2 left-2 hover:text-gray-400 hover:scale-110 disabled:opacity-50"
//             onClick={() => setScrollIndex((prev) => Math.max(0, prev - itemsPerPage))}
//             disabled={scrollIndex === 0}
//           >
//             <ChevronLeft size={30} />
//           </button>

//           <div className="flex items-center justify-center p-6 space-x-6 overflow-hidden">
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
//             className="absolute text-gray-600 transition-transform transform top-1/2 right-2 hover:text-gray-400 hover:scale-110 disabled:opacity-50"
//             onClick={() => setScrollIndex((prev) => Math.min(prev + itemsPerPage, filteredDrugs.length - itemsPerPage))}
//             disabled={scrollIndex + itemsPerPage >= filteredDrugs.length}
//           >
//             <ChevronRight size={30} />
//           </button>
//         </div>
//       ) : (
//         !isLoading && <p className="mt-4 text-gray-500">No drugs found</p>
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
//     <div className="relative flex flex-col items-center justify-center min-h-screen py-10 bg-white">
//       {/* Navigate to Selected Drugs List */}
//       <button
//         onClick={() => navigate("/druglist", { state: { selectedDrugs } })}
//         className="absolute flex items-center gap-2 text-gray-800 transition top-4 right-4 hover:text-gray-600"
//       >
//         <Pill size={24} />
//         <span className="text-lg font-medium">Selected Drugs ({selectedDrugs.length})</span>
//       </button>

//       <h1 className="mb-8 text-4xl font-extrabold text-gray-900">Explore Drugs</h1>

//       {/* Search Bar */}
//       <div className="relative mb-6" ref={searchRef}>
//         <motion.div
//           className="flex items-center p-2 bg-gray-100 rounded-full shadow-md"
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
//               className="flex-1 ml-2 text-gray-800 bg-transparent outline-none"
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
//             className="absolute text-gray-600 transition-transform transform top-1/2 left-2 hover:text-gray-400 hover:scale-110 disabled:opacity-50"
//             onClick={() => setScrollIndex((prev) => Math.max(0, prev - itemsPerPage))}
//             disabled={scrollIndex === 0}
//           >
//             <ChevronLeft size={30} />
//           </button>

//           {/* Drug Carousel */}
//           <div className="flex items-center justify-center p-6 space-x-6 overflow-hidden">
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
//             className="absolute text-gray-600 transition-transform transform top-1/2 right-2 hover:text-gray-400 hover:scale-110 disabled:opacity-50"
//             onClick={() =>
//               setScrollIndex((prev) => Math.min(prev + itemsPerPage, filteredDrugs.length - itemsPerPage))
//             }
//             disabled={scrollIndex + itemsPerPage >= filteredDrugs.length}
//           >
//             <ChevronRight size={30} />
//           </button>
//         </div>
//       ) : (
//         !isLoading && <p className="mt-4 text-gray-500">No drugs found</p>
//       )}
//     </div>
//   );
// }
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Minus, Plus, Search } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../Supabase/supabase";
import { useDrugs } from "../../context/DrugsProvider";
import { useTheme } from "../../context/ThemeContext";
import DrugListDrawer from "../Patient/DrugListDrawer";

export default function DrugCarousel() {
  // Access theme and drug selection context
  const { themeColor } = useTheme();
  const { selectedDrugs, setSelectedDrugs } = useDrugs();

  // Local state for search, filtering, and UI interactions
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Ref to manage search bar interactions
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Sync selected drugs with localStorage to persist selection across reloads
  useEffect(() => {
    const syncStorage = () => {
      const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugsHCP")) || [];
      if (JSON.stringify(storedDrugs) !== JSON.stringify(selectedDrugs)) {
        setSelectedDrugs(storedDrugs);
      }
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, [selectedDrugs, setSelectedDrugs]);

  // Fetch drug list from Supabase (React Query handles caching)
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
    return drugs.filter(({ drug_name }) =>
      drug_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedLetter || drug_name.startsWith(selectedLetter))
    );
  }, [drugs, searchTerm, selectedLetter]);

  // Toggle drug selection and store it in localStorage
  const toggleDrugSelection = useCallback((drug, e) => {
    e.stopPropagation(); // Prevent navigation on button click

    setSelectedDrugs((prev) => {
      const isSelected = prev.some(({ drug_id }) => drug_id === drug.drug_id);
      const updatedDrugs = isSelected
        ? prev.filter(({ drug_id }) => drug_id !== drug.drug_id)
        : [...prev, drug];

      localStorage.setItem("selectedDrugsHCP", JSON.stringify(updatedDrugs));
      window.dispatchEvent(new Event("storage"));

      return updatedDrugs;
    });
  }, [setSelectedDrugs]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-white">

      {/* 🔍 Search Bar - Only Visible on Web (sm and larger) */}
      <div
        ref={searchRef}
        className="absolute left-0 hidden w-full transition-all duration-300 top-5 sm:left-36 sm:w-auto sm:block"
      >
        <div
          className={`flex items-center bg-gray-100 rounded-full shadow-md p-2 border border-gray-300 transition-all duration-300 ${searchExpanded ? "w-[250px]" : "w-[40px]"
            }`}
          onMouseEnter={() => setSearchExpanded(true)}
          onMouseLeave={() => setSearchExpanded(false)}
          onClick={() => setSearchExpanded(true)}
        >
          <Search className="text-gray-500 cursor-pointer" size={24} />
          {searchExpanded && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drugs..."
              className="flex-1 ml-2 text-gray-800 bg-transparent outline-none"
              autoFocus
            />
          )}
        </div>
      </div>




      {/* 🏷️ Page Title */}
      <h1 className="hidden px-4 py-2 mt-4 text-3xl font-bold text-white rounded-md bg-sky-600 sm:mt-0 sm:block">
        Explore Drugs
      </h1>

      {/* 🔠 A-Z Alphabet Filter */}
      <div className="flex flex-col items-center w-full my-4">
        <h2 className="mb-4 text-xl font-extrabold tracking-wide text-gray-900">🔠 Filter by First Letter</h2>

        {/* Dropdown for Mobile */}
        <select
          className="block w-full max-w-xs p-2 mb-4 text-gray-800 bg-gray-100 border border-gray-300 rounded-md sm:hidden"
          value={selectedLetter}
          onChange={(e) => setSelectedLetter(e.target.value)}
        >
          <option value="">Select a letter</option>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <option key={letter} value={letter}>{letter}</option>
          ))}
        </select>

        {/* Grid for Desktop */}
        <div className="flex-wrap justify-center hidden w-full max-w-2xl gap-2 px-4 py-2 rounded-lg sm:flex">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <button
              key={letter}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border border-gray-300 hover:bg-gray-200 hover:text-gray-900 ${selectedLetter === letter ? "bg-sky-700 text-white border-sky-700 shadow-lg" : "bg-gray-100 text-gray-800"
                }`}
              onClick={() => setSelectedLetter((prev) => (prev === letter ? "" : letter))}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* 📦 Drug Grid Display */}
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6 mt-4 pb-24 px-[10%]">
        {filteredDrugs.map((drug) => {
          const isSelected = selectedDrugs.some((d) => d.drug_id === drug.drug_id);
          return (
            <div
              key={drug.drug_id}
              className="flex items-center justify-between p-5 transition-all duration-300 transform bg-white shadow-md cursor-pointer rounded-xl hover:shadow-lg hover:scale-105"
              onClick={() => navigate(`/hcp_foodInteraction/${drug.drug_id}`)}
            >
              <h3 className="text-lg font-semibold text-gray-900">{drug.drug_name}</h3>
              <button
                className={`relative group rounded-full w-9 h-9 flex items-center justify-center text-white ${isSelected ? "bg-gray-500 hover:bg-gray-600" : "bg-sky-500 hover:bg-sky-600"
                  }`}
                onClick={(e) => toggleDrugSelection(drug, e)}
                onMouseEnter={() => setDrawerOpen(false)}
              >
                {isSelected ? <Minus size={18} /> : <Plus size={18} />}

                {/* Tooltip */}
                <span className="absolute px-2 py-1 text-xs text-white transition transform -translate-x-1/2 bg-gray-800 rounded-md opacity-0 left-1/2 -top-8 group-hover:opacity-100">
                  {isSelected ? "Remove from list" : "Add to list"}
                </span>
              </button>

            </div>
          );
        })}
      </div>

      {/* 🏷️ Selected Drugs Button */}
      <div className="absolute top-4 right-4">
        <div className="relative group">
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center px-3 py-2 space-x-2 transition-all duration-300 bg-white border rounded-full shadow-sm border-sky-500 group-hover:bg-sky-500"
          >
            {selectedDrugs.length > 0 && (
              <span className="absolute top-0 -right-2 bg-sky-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px]">
                {selectedDrugs.length}
              </span>
            )}
            <ClipboardList size={24} className="w-6 h-6 text-black-900 group-hover:text-white" />
            <span className="hidden font-medium text-black-500 group-hover:text-white sm:inline">Selected Drugs</span>
          </button>

          {/* Tooltip for selected drugs (Hidden on mobile, visible on md+ screens) */}
          {selectedDrugs.length > 0 && (
            <div className="absolute right-0 invisible hidden p-3 text-sm text-black transition-all duration-200 scale-95 bg-white rounded-lg shadow-xl top-12 w-60 group-hover:visible group-hover:scale-100 md:block">
              <strong className="block pb-2 mb-2 text-base border-b border-gray-600">
                Selected Drugs:
              </strong>
              <ul className="space-y-1">
                {selectedDrugs.map((drug, index) => (
                  <li key={index} className="truncate">• {drug.name || drug.drug_name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>




      {/* 📋 Drug Drawer */}
      <DrugListDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </div>
  );
}