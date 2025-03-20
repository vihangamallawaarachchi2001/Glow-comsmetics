import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const TopSellingItems = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/order/top");

        if (response.status !== 200) {
          throw new Error("Failed to fetch top-selling products");
        }

        const topItems = response.data.topSellingItems || [];

        // Extract product details from response directly if available
        const products = topItems.map((item) => ({
          ...item.productDetails, // Assuming product details are available
          sold: item.totalSold, // Ensure correct reference for sold count
        }));

        setTopProducts(products);
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4 animate-pulse shadow-sm">
                <div className="w-full h-64 bg-neutral-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && topProducts.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Best Sellers</h2>
          <p className="text-neutral-600">Unable to load top-selling products. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <Link to="/products" className="text-primary hover:text-primary/80 font-medium flex items-center">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white text-sm font-bold px-2 py-1 rounded-md z-10">
                    {product.discount}% OFF
                  </div>
                )}
                <img
                  src={product.image || "/fallback.png"}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <div className="text-sm text-neutral-500">{product.sold.toLocaleString()} sold</div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    {product.discount > 0 ? (
                      <>
                        <span className="font-bold text-lg text-primary">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-neutral-500 line-through ml-2">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    )}
                  </div>

                  <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <ShoppingBag size={16} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellingItems;
