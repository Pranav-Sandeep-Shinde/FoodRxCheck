import { createContext, useContext, useState, useEffect } from "react";

const DrugsContext = createContext(null);

export const DrugsProvider = ({ children }) => {
  const [selectedDrugs, setSelectedDrugs] = useState(() => {
    try {
      const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugs"));
      return Array.isArray(storedDrugs) ? storedDrugs : [];
    } catch {
      return [];
    }
  });

  // ✅ Only update localStorage when selectedDrugs changes
  useEffect(() => {
    if (selectedDrugs.length > 0) {
      localStorage.setItem("selectedDrugs", JSON.stringify(selectedDrugs));
    }
  }, [selectedDrugs]);

  return (
    <DrugsContext.Provider value={{ selectedDrugs, setSelectedDrugs }}>
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
