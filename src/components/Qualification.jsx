import React, { useState } from "react";

const QualificationModal = ({ isOpen, onClose, onSave }) => {
  const [degree, setDegree] = useState("");
  const [department, setDepartment] = useState("");
  const [institution, setInstitution] = useState("");

  const handleSave = () => {
    onSave({ degree, department, institution }); // Pass data to parent
    onClose(); // Close the modal
  };

  if (!isOpen) return null; // Hide modal if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-96 mx-4">
        <h2 className="text-lg font-semibold mb-4">Add Qualification</h2>

        {/* Degree Dropdown */}
        <label className="block mb-2 font-medium text-gray-700">Degree</label>
        <select
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        >
          <option value="">Select Degree</option>
          <option value="MBBS">MBBS</option>
          <option value="MD">MD</option>
          <option value="MS">MS</option>
          <option value="BAMS">BAMS</option>
          <option value="BHAMS">BHAMS</option>
          <option value="MD(HOMEOPATHY)">MD(HOMEOPATHY)</option>
          <option value="DM">DM</option>
          <option value="MCh">MCh</option>
          <option value="BDS">BDS</option>
          <option value="MDS">MDS</option>
          <option value="BPharm">BPharm</option>
          <option value="MPharm">MPharm</option>
          <option value="Pharm.D">Pharm.D</option>
          <option value="BPT">BPT</option>
          <option value="MPT">MPT</option>
          <option value="Diploma in nursing">Diploma in nursing</option>
          <option value="BSc">BSc</option>
          <option value="MSc">MSc</option>
        </select>

        {/* Department Input */}
        <label className="block mb-2 font-medium text-gray-700">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter Department"
        />

        {/* Institution Input */}
        <label className="block mb-2 font-medium text-gray-700">Institution</label>
        <input
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter Institution"
        />

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualificationModal;
