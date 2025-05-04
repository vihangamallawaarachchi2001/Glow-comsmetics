import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductFormModal = ({ product, onClose, onSave }) => {
  const isEditMode = !!product;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    salesCount: 0,
    views: 0,
    cartAdditions: 0,
    replenishmentThreshold: 0.2,
    autoReplenish: true,
    criticalStock: 10,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
        image: product.image || "",
        salesCount: product.salesCount || 0,
        views: product.views || 0,
        cartAdditions: product.cartAdditions || 0,
        replenishmentThreshold: product.replenishmentThreshold || 0.2,
        autoReplenish: product.autoReplenish || true,
        criticalStock: product.criticalStock || 10,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const validationErrors = {};
    if (!formData.name) validationErrors.name = "Product name is required";
    if (!formData.category)
      validationErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      validationErrors.price = "Price must be greater than zero";
    if (!formData.stock || formData.stock < 0)
      validationErrors.stock = "Stock cannot be negative";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white max-w-xl w-full mx-4 p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.name ? "border-red-500" : "border-neutral-300"
              } rounded-md p-2`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.category ? "border-red-500" : "border-neutral-300"
              } rounded-md p-2`}
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={`mt-1 block w-full border ${
                errors.price ? "border-red-500" : "border-neutral-300"
              } rounded-md p-2`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`mt-1 block w-full border ${
                errors.stock ? "border-red-500" : "border-neutral-300"
              } rounded-md p-2`}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full border border-neutral-300 rounded-md p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Critical Stock Threshold
              </label>
              <input
                type="number"
                name="criticalStock"
                value={formData.criticalStock}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-neutral-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mt-2">
                Auto Replenish
              </label>
              <input
                type="checkbox"
                name="autoReplenish"
                checked={formData.autoReplenish}
                onChange={handleChange}
                className="mt-3"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;