import { createContext, useContext, useState, useEffect } from "react";

const DrugsContext = createContext(null);

export const DrugsProvider = ({ children }) => {
  // Load from localStorage or initialize as an empty array
  const [selectedDrugs, setSelectedDrugs] = useState(() => {
    try {
      const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugs"));
      return Array.isArray(storedDrugs) ? storedDrugs : [];
    } catch {
      return [];
    }
  });

  // Sync localStorage whenever selectedDrugs changes
  useEffect(() => {
    if (selectedDrugs.length > 0) {
      localStorage.setItem("selectedDrugs", JSON.stringify(selectedDrugs));
    } else {
      localStorage.removeItem("selectedDrugs"); // ✅ Clear localStorage when empty
    }
  }, [selectedDrugs]);

  // 🛑 Remove a single drug
  const removeDrug = (drugId) => {
    setSelectedDrugs((prevDrugs) => {
      const updatedDrugs = prevDrugs.filter((drug) => drug.drug_id !== drugId);
      return updatedDrugs;
    });
  };

  // 🔄 Clear all selected drugs
  const clearAllDrugs = () => setSelectedDrugs([]);

  // ✅ Sync localStorage changes from other sources (like another tab)
  useEffect(() => {
    const syncStorage = () => {
      const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugs")) || [];
      setSelectedDrugs(storedDrugs);
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  return (
    <DrugsContext.Provider value={{ selectedDrugs, setSelectedDrugs, removeDrug, clearAllDrugs }}>
      {children}
    </DrugsContext.Provider>
  );
};

export const useDrugs = () => {
  const context = useContext(DrugsContext);
  if (!context) {
    throw new Error("useDrugs must be used within a DrugsProvider");
  }
  return context;
};
