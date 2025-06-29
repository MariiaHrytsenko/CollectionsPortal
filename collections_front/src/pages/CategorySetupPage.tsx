import React from "react";

const CategorySetupPage = () => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Setup Category</h2>
      <input type="text" placeholder="Characteristic 1" className="border p-2 w-full mb-2" />
      <input type="text" placeholder="Characteristic 2" className="border p-2 w-full mb-2" />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
};

export default CategorySetupPage;