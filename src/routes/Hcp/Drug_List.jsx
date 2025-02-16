import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MinusCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Drug_List() {
  const navigate = useNavigate();
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  // Load selected drugs from localStorage
  useEffect(() => {
    const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugs")) || [];
    setSelectedDrugs(storedDrugs);
  }, []);

  // Remove a single drug from the list
  const removeDrug = (drugId) => {
    const updatedDrugs = selectedDrugs.filter((drug) => drug.drug_id !== drugId);
    setSelectedDrugs(updatedDrugs);
    localStorage.setItem("selectedDrugs", JSON.stringify(updatedDrugs));
  };

  // Clear the entire list
  const clearAllDrugs = () => {
    setSelectedDrugs([]);
    localStorage.removeItem("selectedDrugs");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-teal-600 text-white px-8 py-5 rounded-2xl shadow-md">
        <button onClick={() => navigate(-1)} className="flex items-center text-lg font-medium">
          <ArrowLeft size={20} className="mr-2" /> Selected Drugs
        </button>
        {selectedDrugs.length > 0 && (
          <button
            className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-grey-800 transition"
            onClick={clearAllDrugs}
          >
            <Trash2 size={18} className="mr-2" /> Clear All
          </button>
        )}
      </div>

      {/* Drug List */}
      <motion.div
        className="flex flex-wrap gap-4 mt-6 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {selectedDrugs.length > 0 ? (
          selectedDrugs.map((drug) => (
            <motion.div
              key={drug.drug_id}
              className="relative bg-white shadow-md rounded-2xl p-4 flex items-center justify-between w-64 border border-gray-200 hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <h3 className="text-md font-semibold text-gray-800">{drug.drug_name}</h3>
              <button
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-00 transition"
                onClick={() => removeDrug(drug.drug_id)}
              >
                <MinusCircle size={18} />
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-6">No drugs selected.</p>
        )}
      </motion.div>
    </div>
  );
}
