import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DrugListDrawer = ({ selectedDrugs, setSelectedDrugs, drawerOpen, setDrawerOpen }) => {
  const [hoveredDrug, setHoveredDrug] = useState(null);
  const navigate = useNavigate();

  const removeDrug = (drug) => {
    const updatedDrugs = selectedDrugs.filter((d) => d.drug_id !== drug.drug_id);
    setSelectedDrugs(updatedDrugs);
    localStorage.setItem("selectedDrugs", JSON.stringify(updatedDrugs));
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 z-50 flex flex-col"
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">Selected Drugs</h3>
            <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Drug List */}
          <div className="p-4 space-y-2 overflow-y-auto flex-grow h-[calc(100%-100px)]">
            {selectedDrugs.length > 0 ? (
              selectedDrugs.map((drug) => (
                <motion.div
                  key={drug.drug_id}
                  className="relative flex justify-between items-center bg-gray-100 p-3 rounded-md cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => navigate(`/food-interaction/${drug.drug_id}`)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* ✅ Drug Name - Changed from Blue to a Neutral Color */}
                  <span className="text-sm font-medium text-gray-800">{drug.drug_name}</span>

                  {/* Remove Button */}
                  <div className="relative flex flex-col items-center">
                    <AnimatePresence>
                      {hoveredDrug === drug.drug_id && (
                        <motion.div
                          className="absolute bottom-10 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                        >
                          Remove from list
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      className="text-gray-700 hover:text-gray-900 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents navigation when clicking remove
                        removeDrug(drug);
                      }}
                      onMouseEnter={() => setHoveredDrug(drug.drug_id)}
                      onMouseLeave={() => setHoveredDrug(null)}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No drugs selected</p>
            )}
          </div>

          {/* Clear All Button */}
          {selectedDrugs.length > 0 && (
            <div className="p-4 border-t border-gray-300">
              <button
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                onClick={() => {
                  setSelectedDrugs([]);
                  localStorage.removeItem("selectedDrugs");
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrugListDrawer;
