import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
import { motion } from "framer-motion";

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    product_name: "",
    product_type: "",
    rating: 0,
    status: "pending",
    images_path: [],
    date: "",
    user_id: "",
  });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/reviews/${id}`);
        if (!res.ok) throw new Error("Failed to fetch review");
        const data = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          product_name: data.product_name,
          product_type: data.product_type,
          rating: data.rating,
          status: data.status,
          images_path: data.images_path || [],
          date: data.date || "",
          user_id: data.user_id || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error loading review");
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Review updated successfully!");
      navigate("/admin/manage-reviews");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update review");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="text-gray-600">Loading review...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto px-6 py-8 bg-white shadow rounded">
        <h1 className="text-2xl font-semibold mb-6">Edit Review</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full mt-1 px-3 py-2 border rounded resize-none"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="product_type"
              value={formData.product_type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              required
            >
              <option value="">Select category</option>
              <option value="Serum">Serum</option>
              <option value="Moisturizer">Moisturizer</option>
              <option value="Cleanser">Cleanser</option>
              <option value="Toner">Toner</option>
              <option value="Sunscreen">Sunscreen</option>
              <option value="Mask">Mask</option>
              <option value="Mascara">Mascara</option>
              <option value="Ampoules">Ampoules</option>
              <option value="Facewash">Facewash</option>
              <option value="Lipcare">Lipcare</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              required
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              required
            >
              <option value="pending">Pending</option>
              <option value="onprogress">On Progress</option>
              <option value="solved">Solved</option>
            </select>
          </div>

          {/* Images Preview */}
          {formData.images_path.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Attached Images</label>
              <div className="flex flex-wrap gap-2">
                {formData.images_path.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`review-img-${index}`}
                    className="w-24 h-24 object-cover border rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Read-only Fields 
          <div className="">
              <label className="block text-sm font-medium">Submitted On</label>
              <input
                type="text"
                value={new Date(formData.date).toLocaleString()}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
              />
          </div>
          */}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate("/admin/manage-reviews")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden px-5 py-2 font-semibold rounded bg-red-800 text-white border-2 border-red-800 cursor-pointer transition-all duration-300 group"
            >
              <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-red-800">
                Cancel
              </span>
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden px-5 py-2 font-semibold rounded bg-blue-600 text-white border-2 cursor-pointer border-blue-600 transition-all duration-300 group"
            >
              <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-blue-600">
                Update
              </span>
            </motion.button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditReview;