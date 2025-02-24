import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { Search, X, Loader2 } from "lucide-react";
import supabase from "../../Supabase/supabase";
import { useTheme } from "../../context/ThemeContext";
const fetchDrugsByFood = async (food, interactionsTable, drugsTable) => {
    if (!food.trim()) return [];

    const { data: interactions, error: interactionsError } = await supabase
        .from(interactionsTable)
        .select("drug_id")
        .ilike("food", `%${food.toLowerCase()}%`);

    if (interactionsError) {
        console.error("Error fetching interactions:", interactionsError);
        throw new Error(interactionsError.message);
    }

    const drugIds = interactions.map((interaction) => interaction.drug_id);
    if (drugIds.length === 0) return [];

    const { data: drugs, error: drugsError } = await supabase
        .from(drugsTable)
        .select("drug_id, drug_name")
        .in("drug_id", drugIds);

    if (drugsError) {
        console.error("Error fetching drugs:", drugsError);
        throw new Error(drugsError.message);
    }
    return drugs;
};

const SearchBar = ({ searchTerm, setSearchTerm, isLoading }) => {
    const { themeColor, role } = useTheme();

    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const placeholders = useMemo(() => [
        "Search for Tea interactions...",
        "Search for Coffee interactions...",
        "Search for Milk interactions...",
        "Try searching for common foods...",
        "Discover drug interactions...",
        "Find medication conflicts..."
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders.length]);

    return (
        <div className="relative w-full max-w-lg mx-auto p-4">
            <div className="relative overflow-hidden">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    className={`w-full p-4 pl-12 text-lg border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-all duration-300`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
                <div
                    className={`absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 ${searchTerm ? 'hidden' : 'block'}`}
                >
                    <div className="animate-roll whitespace-nowrap">
                        {placeholders[placeholderIndex]}
                    </div>
                </div>
                {searchTerm && (
                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors duration-300"
                        onClick={() => setSearchTerm("")}
                        disabled={isLoading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
                {isLoading && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        <Loader2 className={`h-5 w-5 animate-spin text-${themeColor}-500`} />
                    </div>
                )}
            </div>
            {isLoading && (
                <div className={`absolute left-0 bottom-0 w-full h-1 bg-${themeColor}-500 rounded-b-lg animate-pulse`}></div>
            )}
        </div>
    );
};

const FoodSearch = () => {
    const navigate = useNavigate();
    const [drugs_table, setDrugTable] = useState("");
    const [interaction_table, setInteractionTable] = useState("");
    const { role } = useTheme();
    useEffect(() => {
        if (role === "patient") {
            setDrugTable("patient_drugs");
            setInteractionTable("patient_interactions");
        } else {
            setDrugTable("drugs");
            setInteractionTable("interactions");
        }
    }, [role])
    const [searchTerm, setSearchTerm] = useState("");
    const { data: drugs, isLoading, error, refetch } = useQuery({
        queryKey: ["searchDrugs", searchTerm],
        queryFn: () => fetchDrugsByFood(searchTerm, interaction_table, drugs_table),
        enabled: false,
        cacheTime: 600000,  // Cache for 10 minutes
    });

    const debouncedSearch = useCallback(
        debounce((term) => {
            if (term) refetch();
        }, 500),
        [refetch]
    );

    useEffect(() => {
        if (searchTerm) debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch]);

    const predefinedFoods = useMemo(() => [
        { name: "Tea", emoji: "🍵" },
        { name: "Coffee", emoji: "☕" },
        { name: "Milk", emoji: "🥛" },
        { name: "Orange", emoji: "🍊" },
        { name: "Grapefruit", emoji: "🍇" },
        { name: "Banana", emoji: "🍌" },
    ], []);

    const sortedDrugs = useMemo(() => {
        if (!drugs) return [];
        return drugs.sort((a, b) => a.drug_name.localeCompare(b.drug_name));
    }, [drugs]);

    const groupedDrugs = useMemo(() => {
        const groups = {};
        sortedDrugs.forEach((drug) => {
            const firstLetter = drug.drug_name.charAt(0).toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(drug);
        });
        return groups;
    }, [sortedDrugs]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Food-Drug Interactions</h1>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isLoading={isLoading} />

                {searchTerm && Object.keys(groupedDrugs).length > 0 && (
                    <div className="mt-8">
                        {Object.keys(groupedDrugs).map((letter) => (
                            <div key={letter} className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-gray-300 pb-2">
                                    {letter}
                                </h2>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {groupedDrugs[letter].map((drug) => (
                                        <motion.div
                                            key={drug.drug_id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="p-6 bg-white rounded-xl shadow-xl cursor-pointer transform hover:shadow-2xl transition-all duration-300"
                                            onClick={() => navigate(`/drug-interaction/${drug.drug_id}/${drug.drug_name}`)}
                                        >
                                            <p className="text-xl font-semibold text-gray-800">{drug.drug_name}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}

                {searchTerm && !isLoading && drugs?.length === 0 && (
                    <p className="text-gray-500 mt-4 text-lg text-center">No Drugs Found</p>
                )}
                {error && (
                    <p className="text-red-500 mt-4 text-lg text-center">Error: {error.message}</p>
                )}
            </div>

            {!searchTerm && (
                <div className="mt-6 w-full max-w-3xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                        Common Food Items
                    </h2>
                    <div className="grid grid-cols-3 gap-8">
                        {predefinedFoods.map((food) => (
                            <motion.div
                                key={food.name}
                                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                                className={`p-6 bg-white rounded-2xl shadow-lg cursor-pointer transition duration-300 text-center text-xl font-semibold flex flex-col items-center justify-center ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                                    }`}
                                onClick={() => !isLoading && setSearchTerm(food.name)}
                            >
                                <div className="flex items-center justify-center h-24 w-24 bg-teal-100 rounded-full mb-4">
                                    <p className="text-3xl">{food.emoji}</p>
                                </div>
                                <p className="mt-2">{food.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodSearch;