import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Plus, Edit, Trash2, Download } from "lucide-react";

import ProductFormModal from "./ProductFormModal";
import AdminLayout from "../../components/admin/AdminLayout";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 10;

  // Load all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/product");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters & search
  useEffect(() => {
    let result = [...products];

    // Search by name or category
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Filter by stock status
    if (selectedStatus !== "all") {
      switch (selectedStatus) {
        case "In Stock":
          result = result.filter((p) => p.stock > p.criticalStock);
          break;
        case "Low Stock":
          result = result.filter(
            (p) => p.stock <= p.criticalStock && p.stock > 0
          );
          break;
        case "Out of Stock":
          result = result.filter((p) => p.stock <= 0);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Handle pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Open modals
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDeleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/product/${selectedProduct._id}`);
      setProducts(products.filter((p) => p._id !== selectedProduct._id));
      setFilteredProducts(filteredProducts.filter((p) => p._id !== selectedProduct._id));
    } catch (err) {
      alert("Failed to delete product.");
      console.error("Error deleting product:", err);
    }
    setIsDeleteModalOpen(false);
  };

  // Save new or updated product
  const handleSaveProduct = async (productData) => {
    try {
      let updatedProduct;
      if (selectedProduct) {
        // Update existing product
        updatedProduct = await axios.put(
          `http://localhost:3000/api/product/${selectedProduct._id}`,
          productData
        );
        setProducts(
          products.map((p) =>
            p._id === selectedProduct._id ? updatedProduct.data : p
          )
        );
      } else {
        // Create new product
        updatedProduct = await axios.post(
          "http://localhost:3000/api/product",
          productData
        );
        setProducts([updatedProduct.data, ...products]);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      alert("Failed to save product.");
      console.error("Error saving product:", err);
    }
  };

  // Export as CSV
  const downloadCSV = () => {
    const csvRows = [
      ["ID", "Name", "Category", "Price", "Stock", "Status"].join(","),
      ...filteredProducts.map((p) => {
        let status = "In Stock";
        if (p.stock <= p.criticalStock && p.stock > 0) status = "Low Stock";
        if (p.stock <= 0) status = "Out of Stock";
        return [
          p._id,
          p.name,
          p.category,
          p.price,
          p.stock,
          status,
        ].join(",");
      }),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "products-report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Get unique categories for filter dropdown
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category)),
  ];

  // Get product status label
  const getStatusLabel = (stock, criticalStock) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= criticalStock) return "Low Stock";
    return "In Stock";
  };

  const getStatusColor = (stock, criticalStock) => {
    const status = getStatusLabel(stock, criticalStock);
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
            <button
              onClick={downloadCSV}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50"
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-neutral-300 rounded-md py-2 px-3 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-neutral-300 rounded-md py-2 px-3 text-sm"
            >
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {currentProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded bg-neutral-100 overflow-hidden flex items-center justify-center">
                              <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">${parseFloat(product.price).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{product.stock}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              product.stock,
                              product.criticalStock
                            )}`}
                          >
                            {getStatusLabel(product.stock, product.criticalStock)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
                <div className="sm:flex-1"></div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-l-md hover:bg-neutral-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-primary text-white"
                          : "text-neutral-500 bg-white hover:bg-neutral-50"
                      } border border-neutral-300`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-r-md hover:bg-neutral-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {isProductModalOpen && (
          <ProductFormModal
            product={selectedProduct}
            onClose={() => setIsProductModalOpen(false)}
            onSave={handleSaveProduct}
          />
        )}

        {/* Modal for Delete Confirmation */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white max-w-md mx-auto p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Are you sure you want to delete{" "}
                <strong>{selectedProduct?.name}</strong>?
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;