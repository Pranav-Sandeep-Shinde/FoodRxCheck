import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import supabase from "../../Supabse/supabse";
import { useState } from "react";
import Modal from "react-modal";
import supabase from "../../Supabase/supabase";
import { Search, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Interactions = () => {
    const { id, name } = useParams();
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };


    const { data: directionData, isLoading, error } = useQuery({
        queryKey: ["food", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("interactions")
                .select("*")
                .eq("drug_id", id)
                .single();
            if (error) {
                throw new Error(error.message);
            }
            console.log("interaction data is", data)
            return data;
        },
    });
    if (isLoading) {
        return (
            <div className="flex justify-center bg-slate-300 items-center h-screen">
                <div className="text-lg text-black font-semibold animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-600 font-semibold">Error: {error.message}</div>
            </div>
        );
    }
    console.log(directionData);
    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/drugList')}
                className="my-6 text-teal-600 hover:text-teal-700 font-medium inline-flex items-center"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to list
            </button>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* {directionData.image_path && (
                    <div onClick={openModal} className="h-64 cursor-pointer md:h-96 overflow-hidden relative">
                        <h2>{directionData?.mechanism_of_action}</h2>
                    </div>
                )} */}
                <div className="p-8">

                </div>
            </div>

            {/* <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            >
                <div className="bg-white p-4 rounded-lg max-w-full max-h-full overflow-auto">
                    <button
                        onClick={closeModal}
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
                    >
                        Close
                    </button>
                    <h2>{directionData?.mechanism_of_action}</h2>
                </div>
            </Modal> */}
        </div>
    );
};

export default Interactions;


/* 
<div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      {/* Header 
      <div className="bg-blue-600 text-white text-center py-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-extrabold">{name}</h1>
        <p className="text-lg mt-2">General Instructions</p>
      </div>

      {/* Drug Details 
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {directionData.image_path && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Image:</h2>
            <span onClick={openModal} className="cursor-pointer">
            <img
              src={directionData.image_path}
              alt="Instruction"
              className="w-full h-64 object-contain rounded-md border border-gray-300"
            /> 
            </span>
            
          </div>
        )}
        {directionData.instructions && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Instruction:</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {directionData.instructions}
            </p>
          </div>
        )}
      </div>
      <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Image Modal"
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            >
              <div className="bg-white p-4 rounded-lg">
              <button
                  onClick={closeModal}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Close
                </button>
                <img
                  src={directionData.image_path}
                  alt="Instruction"
                  className="w-full h-max object-contain rounded-md"
                />
                
              </div>
            </Modal>

    </div> */