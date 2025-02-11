import React from 'react'
import { FaCartPlus } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { Search, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { data, useNavigate } from 'react-router-dom';
// import supabase from "../../Supabse/supabse";
import supabase from '../../Supabase/supabase';
const DrugList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: drugs, isLoading, error } = useQuery({
        queryKey: ["drug_name"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("drugs")
                .select("drug_name,drug_id")
                .order("drug_name", { ascending: true });
            if (error) {
                throw new Error(error.message);
            }
            console.log("data is ", data)
            return data;
        },
    });
    if (isLoading) {
        return (
            // <div className="flex justify-center bg-slate-300 items-center h-screen">
            //     <div className="text-lg text-black font-semibold animate-pulse">Loading...</div>
            // </div>
            <div className="flex justify-center items-center h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div className='h-[250px] bg-slate-300 rounded-xl cursor-pointer animate-pulse' key={index}>

                        </div>
                    ))
                    }
                </div>
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
    const filteredDrugs = drugs?.filter((drug) =>
        drug?.drug_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // if (filteredDrugs.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <div className="text-red-600 font-semibold">no drugs in list: {error?.message}</div>
    //         </div>
    //     );
    // }
    console.log("new", filteredDrugs?.drug?.drug_name);
    return (

        <>
            <div className="max-w-full md:px-28 px-4 py-8 md:ml-20 transition-all duration-300">
                {/* Search and Filter Section */}
                <div className="mb-8 space-y-4">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search instructions..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
                    {filteredDrugs?.map((drug) => (
                        <div
                            key={drug?.drug_id}
                            className="bg-white flex justify-center items-center rounded-xl shadow-md overflow-hidden hover:shadow-lg transition ease-in-out duration-300 transform hover:-translate-y-1 cursor-pointer"
                            onClick={() =>
                                navigate(`/drugList/${drug.drug_id}`, {
                                    state: { id: drug.drug_id, name: drug.drug_name },
                                })
                            }
                        >
                            {/* <div className="h-48 overflow-hidden relative"> */}
                            {/* <img
                                    src={drug.image_path || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=2084'}
                                    alt={drug?.drug_name}
                                    className="w-full h-full object-cover"
                                /> */}
                            {/* {instruction.severity && (
                              <div className="absolute top-4 right-4">
                                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(instruction.severity)}`}>
                                  <AlertTriangle className="h-4 w-4" />
                                  <span className="capitalize">{instruction.severity} Risk</span>
                                </div>
                              </div>

                            )} */}

                            {/* </div> */}
                            <div className='flex flex-col justify-end items-center gap-5'>

                                <div className="p-6 ">
                                    {/* <div className="text-sm font-medium text-teal-600 mb-1">
                              {instruction.category}
                              </div> */}
                                    <h1 className='text-3xl font-bold break-words max-w-[250px]'>{drug?.drug_name}</h1>
                                    {/* <h3 className="text-md font-semibold text-gray-900 mb-2">
                                    {drug?.drug_name}
                                    </h3> */}

                                </div>
                                <div className='flex justify-between items-center gap-2 mb-2 '>
                                    <button className='bg-teal-600 font-bold text-sm p-2 rounded-lg flex justify-between items-center gap-2 hover:bg-teal-700'><FaCartPlus /><span className='text-sm font-bold text-white'>Add to cart</span></button>
                                    <button className='bg-teal-600 font-bold text-sm p-2 rounded-lg flex justify-between items-center gap-2 hover:bg-teal-700'><GiMedicines /><span className='text-sm font-bold text-white'>Manage</span></button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}

export default DrugList
