import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
import { motion } from "framer-motion";

const EditFAQ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    question: "",
    answer: "",
    answered_by: "",
    status: "Pending",
    category: ""
  });

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/faqs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch FAQ");

        const result = await res.json();
        const data = result.data || {}; // ✅ Make sure we extract actual FAQ data

        setFormData({
          full_name: data.full_name || "",
          question: data.question || "",
          answer: data.answer || "",
          answered_by: data.answered_by || "",
          status: data.status || "Pending",
          category: data.category || ""
        });

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error loading FAQ");
        setLoading(false);
      }
    };

    fetchFAQ();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/faqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("FAQ updated successfully!");
      navigate("/admin/manage-faqs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update FAQ");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="text-gray-600">Loading FAQ...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto px-6 py-8 bg-white shadow rounded">
        <h1 className="text-2xl font-semibold mb-6">Edit FAQ</h1>
        <form onSubmit={handleUpdate} className="space-y-4">

          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Question</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows={3}
              required
              className="w-full mt-1 px-3 py-2 border rounded resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Answer</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 px-3 py-2 border rounded resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Answered By</label>
            <input
              type="text"
              name="answered_by"
              value={formData.answered_by}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Skin-Care">Skin-Care</option>
              <option value="System">System</option>
              <option value="Payment">Payment</option>
              <option value="Account">Account</option>
              <option value="Returns & Exchanges">Returns & Exchanges</option>
              <option value="Orders">Orders</option>
              <option value="Promotions & Discounts">Promotions & Discounts</option>
              <option value="Product Care">Product Care</option>
              <option value="General Information">General Information</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate("/admin/manage-faqs")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden px-5 py-2 font-semibold rounded bg-red-800 text-white border-2 border-red-800 cursor-pointer transition-all duration-300 group"
            >
              <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
              <span className="relative z-10 group-hover:text-red-800">
                Cancel
              </span>
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden px-5 py-2 font-semibold rounded bg-blue-600 text-white border-2 border-blue-600 cursor-pointer transition-all duration-300 group"
            >
              <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
              <span className="relative z-10 group-hover:text-blue-600">
                Update
              </span>
            </motion.button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditFAQ;
