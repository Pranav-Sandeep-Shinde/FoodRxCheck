import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import supabase from "../../Supabase/supabase";
import parseAndRenderText from "../../utils/parseAndRenderText";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "../../context/ThemeContext";

const fetchDrugDetails = async ({ queryKey }) => {
  const [interaction_table, id] = queryKey;
  if (!interaction_table || !id) return [];

  console.log("Query Key", queryKey);
  const { data, error } = await supabase.from(interaction_table).select('*').eq('drug_id', id);
  if (error) throw new Error(error.message);
  console.log(data);
  return data || [];
};

const DrugInteractionList = () => {
  const { id, name } = useParams();
  const { role } = useTheme();
  const [expandedItems, setExpandedItems] = useState({});
  const [drugs_table, setDrugTable] = useState("");
  const [interaction_table, setInteractionTable] = useState("");

  useEffect(() => {
    if (role === "patient") {
      setDrugTable("patient_drugs");
      setInteractionTable("patient_interactions");
    } else {
      setDrugTable("drugs");
      setInteractionTable("interactions");
    }
  }, [role]);

  const { data: drugDetails = [], isLoading, error } = useQuery({
    queryKey: [interaction_table, id],
    queryFn: fetchDrugDetails,
    enabled: Boolean(interaction_table && id),
  });

  if (isLoading)
    return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Loading...</div>;
  if (error) return <p className="text-red-500 text-center">Error: {error.message}</p>;

  const dataWithCounsellingTips =
    interaction_table === "patient_interactions" && drugDetails.length > 0 && drugDetails[0]?.food !== "NA"
      ? [
        ...drugDetails,
        {
          drug_id: id,
          food: "",
          counselling_tips: drugDetails[0]?.counselling_tips,
          isCounsellingTips: true,
        },
      ]
      : drugDetails;

  const renderInteractionItem = (item, index) => {
    const isExpanded = expandedItems[index];

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white p-5 mb-4 rounded-2xl shadow-lg border border-gray-200"
      >
        {item.isCounsellingTips ? (
          <>
            <p className="font-bold">Counselling Tips:</p>
            <p>{item.counselling_tips}</p>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }))}>
              <p className="text-lg font-semibold text-gray-900">{item.food}</p>
              <FontAwesomeIcon icon={faChevronRight} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </div>

            {isExpanded && (
              <div className="mt-2 border-t pt-2">
                {item.mechanism_of_action && (
                  <p className="text-gray-700">
                    <span className="font-bold">Mechanism:</span> {item.mechanism_of_action}
                  </p>
                )}
                {item.severity && (
                  <p className="text-gray-700">
                    <span className="font-bold">Severity:</span> {item.severity}
                  </p>
                )}
                {item.management && (
                  <p className="text-gray-700">
                    <span className="font-bold">Management:</span> {item.management}
                  </p>
                )}
                {item.reference && (
                  <div className="overflow-auto">
                    <p className="font-bold">Reference:</p>
                    {parseAndRenderText(item.reference)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block w-1/4 bg-gray-200 p-4">Sidebar</div>
      <div className="w-full md:w-3/4 p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200"
        >
          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            Drug Name: <span className="text-blue-600">{name}</span>
          </h2>
        </motion.div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-auto">
          {dataWithCounsellingTips.map((item, index) => renderInteractionItem(item, index))}
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionList;