import React from 'react';

const ProductEditor: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">New product</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Product details</h3>
          <input className="w-full p-3 border rounded" placeholder="Product title" />
          <textarea className="w-full p-3 border rounded h-32" placeholder="Description" />
        </section>
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Images</h3>
          <input type="file" className="block" multiple />
        </section>
      </div>
    </div>
  );
};

export default ProductEditor;
