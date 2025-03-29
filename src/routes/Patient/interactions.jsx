import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Minus, Plus, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrugs } from "../../context/DrugsProvider";
import supabase from "../../Supabase/supabase";
import DrugListDrawer from "./DrugListDrawer";

const Interaction = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(""); // Alphabet filter state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { selectedDrugs, setSelectedDrugs } = useDrugs();
  const navigate = useNavigate();

  /** Load selected drugs from localStorage */
  // useEffect(() => {
  //   try {
  //     const storedDrugs = localStorage.getItem("selectedDrugsPatient");
  //     if (storedDrugs) {
  //       const parsedDrugs = JSON.parse(storedDrugs);
  //       if (Array.isArray(parsedDrugs)) {
  //         setSelectedDrugs(parsedDrugs);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error parsing selected drugs:", error);
  //   }
  // }, [setSelectedDrugs]);

  /** Fetch drugs from Supabase */
  const { data: drugs, isLoading, error } = useQuery({
    queryKey: ["patient_drugs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_drugs")
        .select("drug_id, drug_name")
        .order("drug_name", { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  /** Memoized filtering: Search + Alphabet */
  const filteredDrugs = useMemo(() => {
    if (!drugs) return [];
    return drugs.filter((drug) => {
      const matchesSearch = drug.drug_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = selectedLetter ? drug.drug_name.startsWith(selectedLetter) : true;
      return matchesSearch && matchesLetter;
    });
  }, [searchTerm, selectedLetter, drugs]);

  /** Toggle drug selection */
  const toggleDrug = (drug, event) => {
    event.stopPropagation();
    setDrawerOpen(false);

    setSelectedDrugs((prevDrugs) => {
      const isAlreadySelected = Array.isArray(prevDrugs) && prevDrugs.some((d) => d.drug_id === drug.drug_id);
      let updatedDrugs = isAlreadySelected
        ? prevDrugs.filter((d) => d.drug_id !== drug.drug_id)
        : [...prevDrugs, { ...drug, added_at: new Date().toISOString() }];

      localStorage.setItem("selectedDrugsPatient", JSON.stringify(updatedDrugs));
      return updatedDrugs;
    });
  };

  return (
    <div className="max-w-full px-4 py-8 transition-all duration-300 md:px-28 md:ml-20">
      {/* Search Input  on Mobile */}
      <div className="flex mb-8 justify-center sm:justify-center md:justify-start">
  <div className="relative flex items-center bg-gray-100 rounded-full shadow-md border border-gray-300 transition-all duration-300 w-[75%] h-[47px] sm:w-[55px] sm:h-[50px] sm:p-2 sm:hover:w-[280px] sm:hover:px-4">
    <Search className="w-6 h-9 text-gray-400 cursor-pointer sm:w-6 sm:h-7"  /> {/* Increased size */}
    <input
      type="text"
      placeholder="Search for a drug..."
      className="flex-1 w-0 ml-2 text-sm text-gray-800 transition-all duration-300 bg-transparent outline-none opacity-100 sm:opacity-0 sm:w-0 sm:hover:opacity-100 sm:hover:w-full sm:text-base"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>


      <div className="justify-center hidden mt-4 sm:flex sm:mt-0 md:hidden">
        <h1 className="w-auto px-6 py-3 text-3xl font-bold text-white bg-teal-600 rounded-lg sm:text-3xl">
          Explore Drugs
        </h1>
      </div>

      {/*  A-Z Alphabet Filter */}
      <div className="flex-col items-center hidden w-full my-4 md:flex">
      <h2 className="mb-4 text-xl font-extrabold tracking-wide text-gray-900 whitespace-nowrap">
  🔠 Filter by First Letter
</h2>


        {/* Dropdown for Mobile */}
        <select
          className="hidden w-full max-w-xs p-2 mb-4 text-gray-800 bg-gray-100 border border-gray-300 rounded-md sm:block sm:hidden"
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
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border border-gray-300 hover:bg-gray-200 hover:text-gray-900 ${selectedLetter === letter ? "bg-blue-700 text-white border-blue-700 shadow-lg" : "bg-gray-100 text-gray-800"
                }`}
              onClick={() => setSelectedLetter((prev) => (prev === letter ? "" : letter))}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Error Handling */}
      {error && <p className="text-sm text-center text-red-500 sm:text-base">Failed to load drugs. Please try again.</p>}
      {isLoading && <p className="text-sm text-center text-gray-500 sm:text-base">Loading drugs...</p>}

      {/* Drug List */}
      {/* <div className="grid w-full grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 sm:text-base md:text-base lg:text-lg xl:text-lg"> */}
      <div className="grid w-full grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 sm:text-base md:text-lg lg:text-lg xl:text-xl ">

        {filteredDrugs?.length > 0 ? (
          filteredDrugs.map((drug) => {
            const isSelected = Array.isArray(selectedDrugs) && selectedDrugs.some((d) => d.drug_id === drug.drug_id);
            return (
              <div
                key={drug.drug_id}
                className="flex items-center justify-between p-3 sm:p-5 text-sm transition-all duration-300 transform bg-white shadow-md cursor-pointer rounded-xl hover:shadow-lg hover:scale-105 sm:text-base hover:shadow-xl hover:scale-105 hover:-translate-y-1 rounded-xl 
          shadow-lg sm:shadow-md md:shadow-lg lg:shadow-xl transition-all duration-300 
          hover:shadow-2xl "
                onClick={() => navigate(`/food-interaction/${drug.drug_id}`)}
              >
                 <div className="flex items-center justify-between w-full">
              <h3 className="w-full text-sm font-semibold text-center text-gray-900 sm:text-base md:text-xl  md:text-[19px] md:text-left">{drug.drug_name}</h3>
               
                {/* Add / Remove Button */}
                <div className="relative group">
                <button
                   className={`ml-4 p-2 rounded-full transition ${isSelected ? "bg-gray-500 hover:bg-gray-600" : "bg-teal-500 hover:bg-teal-600"} text-white flex items-center justify-center w-8 h-8 shadow-md 
    hover:shadow-lg focus:shadow-xl hover:ring-2 hover:ring-teal-400`}
                  onClick={(e) =>{  e.stopPropagation(); toggleDrug(drug, e)}}
                  onMouseEnter={() => setDrawerOpen(false)} // Close drawer on hover
                >
                  {isSelected ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
    {isSelected ? "Remove from list" : "Add to list"}
  </span>
              </div>
              </div>
              </div>
            );
          })
        ) : (
          !isLoading && !error && <p className="w-full text-sm text-center text-gray-500 sm:text-base">No drugs found</p>
        )}
      </div>

      {/* 🏷️ Selected Drugs Button */}
   
        <div className="absolute top-20 sm:top-10 right-4 sm:right-6 md:right-24 z-20">
      <div className="relative flex group sm:justify-center">
        <button
  onClick={() => setDrawerOpen(true)}
  className="relative flex items-center gap-1.5 px-2 py-1.5 text-sm transition-all duration-300 bg-white border border-teal-500 rounded-full shadow-sm group-hover:bg-teal-500"
  >
  {selectedDrugs.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
      {selectedDrugs.length}
    </span>
  )}
  <ClipboardList size={20} className="text-black-900 group-hover:text-white md:size-6" />
  <span className="hidden font-medium sm:inline text-black-500 group-hover:text-white">
    Selected Drugs
  </span>
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
      


      {/* Drug Drawer */}
      <DrugListDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </div>
  );
};

export default Interaction;

