import { createContext, useState, useContext } from 'react';

// Define the color themes for each role
const roleColors = {
    patient: 'teal', // Color for patient
    hcp: 'sky', // Color for healthcare professional
};

const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    // Initialize role from sessionStorage or default to 'patient'
    const storedRole = sessionStorage.getItem('role') || 'patient';
    const [role, setRole] = useState(storedRole);
    const [themeColor, setThemeColor] = useState(roleColors[storedRole]);

    // Update the theme color and role
    const updateRole = (newRole) => {
        sessionStorage.setItem('role', newRole);
        setRole(newRole);
        setThemeColor(roleColors[newRole] || roleColors.patient);
    };

    // Handle logout by resetting role to 'patient' and updating theme
    const logout = () => {
        sessionStorage.removeItem('role');
        setRole('patient');
        setThemeColor(roleColors['patient']);
    };

    return (
        <ThemeContext.Provider value={{ themeColor, role, updateRole, logout }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to access ThemeContext
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

export { ThemeContext };
