import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const TrendingItems = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/order/trending");
  
        if (response.status !== 200) {
          throw new Error("Failed to fetch trending products");
        }
  
        const trendingItems = response.data.TrendingItems || [];
  
        // Fetch all product details with error handling
        const productRequests = trendingItems.map((item) =>
          axios.get(`http://localhost:3000/api/product/${item.productId}`)
            .then(res => ({
              ...res.data,
              isAvailable: true, // Mark product as available
            }))
            .catch(error => {
              if (error.response?.status === 404) {
                console.warn(`Product ${item.productId} not found.`);
              } else {
                console.error(`Error fetching product ${item.productId}:`, error);
              }
              return { 
                _id: item.productId, 
                name: "Product Not Available", 
                price: 0, 
                image: "/vite.svg", 
                category: "Unknown", 
                rating: 0,
                isAvailable: false, 
              };
            })
        );
  
        const results = await Promise.allSettled(productRequests);
        const products = results.map(result => result.value); // Extract product values
  
        setTrendingProducts(products);
      } catch (error) {
        console.error("Error fetching trending products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTrendingProducts();
  }, []);
  
  

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-lg p-4 animate-pulse">
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

  if (error && trendingProducts.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
          <p className="text-neutral-600">Unable to load trending products. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <Link to="/products" className="text-primary hover:text-primary/80 font-medium flex items-center">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <div
              key={product._id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              onClick={() => {
                
              }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image || "/fallback.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-500 hover:text-rose-500 transition-colors">
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-4">
                <span className="text-sm text-neutral-500">{product.category || "Uncategorized"}</span>
                <h3 className="font-medium text-lg mt-1 mb-2">{product.name}</h3>

                <div className="flex items-center mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-neutral-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-500 ml-1">{product.rating || "0"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">${(product.price || 0).toFixed(2)}</span>
                  <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                    <ShoppingBag size={18} />
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

export default TrendingItems;
