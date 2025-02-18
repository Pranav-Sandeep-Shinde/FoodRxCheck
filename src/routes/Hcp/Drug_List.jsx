import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation hook
import { Minus, Trash2 } from "lucide-react";

const Drug_List = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object to access passed state
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  useEffect(() => {
    // Check if state was passed via navigation, else fallback to localStorage
    const drugsFromState = location.state?.selectedDrugs || JSON.parse(localStorage.getItem("selectedDrugs")) || [];
    setSelectedDrugs(drugsFromState);
  }, [location.state]); // Depend on location.state to update when passed state changes

  const removeDrug = (drugId) => {
    const updatedDrugs = selectedDrugs.filter((drug) => drug.drug_id !== drugId);
    setSelectedDrugs(updatedDrugs);
    localStorage.setItem("selectedDrugs", JSON.stringify(updatedDrugs));
  };

  const clearAllDrugs = () => {
    setSelectedDrugs([]);
    localStorage.removeItem("selectedDrugs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10">
      {/* Header */}
      <div
        className="flex items-center justify-between bg-teal-700 text-white px-8 py-6 rounded-xl shadow-xl max-w-5xl mx-auto transition-transform"
        style={{ transform: "translateY(0)", opacity: 1 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-xl font-semibold hover:underline transition hover:opacity-80"
        >
          ← Selected Drugs
        </button>

        {selectedDrugs.length > 0 && (
          <button
            className="flex items-center bg-transparent border-2 border-teal-500 text-teal-500 px-5 py-2 rounded-lg shadow-md hover:bg-teal-500 hover:text-white transition-transform transform hover:scale-105"
            onClick={clearAllDrugs}
          >
            <Trash2 size={20} className="mr-2" /> Clear All
          </button>
        )}
      </div>

      {/* Drug List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 max-w-6xl mx-auto">
        {selectedDrugs.length > 0 ? (
          selectedDrugs.map((drug, index) => (
            <div
              key={drug.drug_id}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center transition-all transform hover:-translate-y-2 hover:shadow-2xl w-full h-48 relative"
              style={{
                opacity: 1,
                transform: `translateY(0)`,
                transition: `opacity 0.3s, transform 0.3s ${index * 0.1}s`,
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900">{drug.drug_name}</h3>

              {/* Animated Remove Button */}
              <button
                className="absolute bottom-4 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-900 transition transform hover:scale-110"
                onClick={() => removeDrug(drug.drug_id)}
                style={{
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <Minus size={22} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full text-lg">
            No drugs selected.
          </p>
        )}
      </div>
    </div>
  );
};

export default Drug_List;