import { useState, useEffect } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Recommendations = ({ user }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/order/recommendations/${localStorage.getItem("id")}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch recommendations");
        }

        const recommendedItems = response.data.recommendations || [];
        console.log("Fetching recommendations...");
console.log("User ID:", localStorage.getItem("id"));
console.log("Recommendations API response:", response.data.recommendations);


        const productRequests = recommendedItems.map((item) =>
          axios
            .get(`http://localhost:3000/api/product/${item.productId}`)
            .then((res) => ({
              ...res.data,
              isAvailable: true, 
            }))
            .catch((error) => {
              if (error.response && error.response.status === 404) {
                console.warn(`Product ${item.productId} not found.`);
                return {
                  _id: item.productId,
                  name: "Product Not Found",
                  price: 0,
                  image: "/not-found.svg",
                  category: "Unavailable",
                  rating: 0,
                  isAvailable: false,
                };
              }

              console.warn(`Product ${item.productId} fetch error:`, error);
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
        setRecommendations(results.map((result) => result.value));
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        console.log("Final Recommendations state:", recommendations);

      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-neutral-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Recommended For You</h2>
          <p className="text-neutral-600">Unable to load recommendations. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recommended For You</h2>
          <Link to="/recommendations" className="text-primary hover:text-primary/80 font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
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

export default Recommendations;
