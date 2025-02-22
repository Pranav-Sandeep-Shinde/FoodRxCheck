import { createContext, useContext, useState, useEffect } from "react";

const DrugsContext = createContext(null);

export const DrugsProvider = ({ children, moduleType }) => {
  // Use separate localStorage keys for Patient and HCP
  const storageKey = moduleType === "patient" ? "selectedDrugsPatient" : "selectedDrugsHCP";

  // Load selected drugs from localStorage (specific to the module)
  const [selectedDrugs, setSelectedDrugs] = useState(() => {
    try {
      const storedDrugs = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(storedDrugs) ? storedDrugs : [];
    } catch {
      return [];
    }
  });

  // Sync localStorage whenever selectedDrugs changes
  useEffect(() => {
    if (selectedDrugs.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(selectedDrugs));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [selectedDrugs]);

  // Remove a specific drug
  const removeDrug = (drugId) => {
    setSelectedDrugs((prevDrugs) => prevDrugs.filter((drug) => drug.drug_id !== drugId));
  };

  // Clear all drugs
  const clearAllDrugs = () => setSelectedDrugs([]);

  // Add a specific drug
  const addDrug = (drug) => {
    setSelectedDrugs((prevDrugs) => {
      if (!prevDrugs.some((d) => d.drug_id === drug.drug_id)) {
        return [...prevDrugs, drug];
      }
      return prevDrugs; // Don't add if drug already exists
    });
  };

  // Sync storage updates from other tabs/windows
  useEffect(() => {
    const syncStorage = () => {
      const storedDrugs = JSON.parse(localStorage.getItem(storageKey)) || [];
      setSelectedDrugs(storedDrugs);
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, [storageKey]);

  return (
    <DrugsContext.Provider value={{ selectedDrugs, setSelectedDrugs, removeDrug, clearAllDrugs, addDrug }}>
      {children}
    </DrugsContext.Provider>
  );
};

// Custom hook for using the context
export const useDrugs = () => {
  const context = useContext(DrugsContext);
  if (!context) {
    throw new Error("useDrugs must be used within a DrugsProvider");
  }
  return context;
};
