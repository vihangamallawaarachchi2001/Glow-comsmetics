import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminTopSellingTable = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/order/top");

        if (response.status !== 200) {
          throw new Error("Failed to fetch top-selling products");
        }

        const topItems = response.data.topSellingItems || [];

        // Fetch product details with error handling
        const productRequests = topItems.map((item) =>
          axios
            .get(`http://localhost:3000/api/product/${item.productId}`)
            .then((res) => ({
              ...res.data,
              sold: item.totalSold,
              isAvailable: true, // Mark product as available
            }))
            .catch((error) => {
              if (error.response?.status === 404) {
                console.warn(`Product ${item.productId} not found.`);
              } else {
                console.error(`Error fetching product ${item.productId}:`, error);
              }
              return {
                _id: item.productId,
                name: "Product Not Available",
                price: 0,
                category: "Unknown",
                stock: 0,
                sold: 0,
                image: "/fallback.png",
                isAvailable: false,
              };
            })
        );

        const results = await Promise.allSettled(productRequests);
        const products = results.map((result) => result.value);

        setTopSellingProducts(products);
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  if (loading) {
    return <p className="text-center py-6 text-neutral-600">Loading top-selling products...</p>;
  }

  if (error && topSellingProducts.length === 0) {
    return <p className="text-center py-6 text-red-500">Failed to load top-selling products.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-lg font-bold">Top Selling Products</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Sold</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {topSellingProducts.map((product) => (
              <tr key={product._id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 flex items-center gap-3">
                  <img
                    src={product.image || "/fallback.png"}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{product.category || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.isAvailable && product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isAvailable && product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                  {product.sold.toLocaleString()} sold
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/products/${product._id}`} className="text-primary hover:text-primary/80">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 text-center">
        <Link to="/admin/products" className="text-sm text-primary font-medium hover:text-primary/80">
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default AdminTopSellingTable;
