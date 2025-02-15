import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useOutletContext } from 'react-router-dom';
import supabase from "../../Supabase/supabase";
import { Search, Plus, Minus, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const Interaction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedDrugs, setSelectedDrugs } = useOutletContext(); // Shared state
  const navigate = useNavigate();

  // Fetch drugs from Supabase
  const { data: drugs, isLoading, error } = useQuery({
    queryKey: ['patient_drugs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_drugs')
        .select('drug_id, drug_name')
        .order('drug_name', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  useEffect(() => {
    const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugs")) || [];
    setSelectedDrugs(storedDrugs);
  }, [setSelectedDrugs]);

  if (isLoading)
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;

  if (error)
    return <div className="text-red-500 text-center font-semibold">Error: {error.message}</div>;

  const filteredDrugs = drugs?.filter((drug) =>
    drug.drug_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add or Remove Drug from List (using localStorage)
  const toggleDrug = (drug, event) => {
    event.stopPropagation(); // Prevent navigation when clicking the button

    let storedDrugs = JSON.parse(localStorage.getItem("selectedDrugs")) || [];
    const isSelected = storedDrugs.some((d) => d.drug_id === drug.drug_id);

    if (isSelected) {
      // Remove drug
      storedDrugs = storedDrugs.filter((d) => d.drug_id !== drug.drug_id);
    } else {
      // Add drug
      storedDrugs.push(drug);
    }

    // Update localStorage and state
    localStorage.setItem("selectedDrugs", JSON.stringify(storedDrugs));
    setSelectedDrugs(storedDrugs);
  };

  return (
    <div className="max-w-full md:px-28 px-4 py-8 md:ml-20 transition-all duration-300">
      {/* Search & Drug List Button */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for a drug..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Transparent Drug List Button with Border */}
        <button
          className="relative flex items-center border border-[#127089] text-[#127089] px-4 py-2 rounded-lg hover:bg-[#127089] hover:text-white transition"
          onClick={() => navigate('/drug-list')}
        >
          <ClipboardList size={20} className="mr-2" />
          Selected Drugs
          {selectedDrugs.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#127089] text-white text-xs font-bold rounded-full px-2 py-0.5">
              {selectedDrugs.length}
            </span>
          )}
        </button>
      </div>

      {/* Grid Layout with Drug Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {filteredDrugs?.map((drug) => {
          const isSelected = selectedDrugs.some((d) => d.drug_id === drug.drug_id);
          return (
            <motion.div
              key={drug.drug_id}
              className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/food-interaction/${drug.drug_id}`)} // Navigate to Food Interaction
            >
              {/* Drug Name (Clickable) */}
              <h3
                className="text-xl font-semibold text-gray-900"
                onClick={() => navigate(`/food-interaction/${drug.drug_id}`)} // Navigate when clicking the name
              >
                {drug.drug_name}
              </h3>

              {/* Add/Remove Button with Tooltip */}
              <div className="relative flex items-center">
                <button
                  className={`relative rounded-full p-2 transition ${isSelected ? 'bg-gray-500 hover:bg-gray-600' : 'bg-teal-500 hover:bg-teal-600'
                    } text-white group`}
                  onClick={(e) => toggleDrug(drug, e)} // Prevents navigation
                >
                  {isSelected ? <Minus size={20} /> : <Plus size={20} />}

                  {/* Tooltip */}
                  <span className="absolute left-1/2 -translate-x-1/2 -top-10 px-2 py-1 text-xs text-white bg-gray-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                    {isSelected ? "Remove from List" : "Add to List"}
                  </span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Interaction;
