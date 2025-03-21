import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateFAQ = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        question: "",
        category: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        "Skin-Care", "System", "Payment", "Account", "Returns & Exchanges",
        "Orders", "Promotions & Discounts", "Product Care", "General Information"
    ];

    const validateForm = () => {
        if (!formData.full_name || !formData.question || !formData.category) {
            alert("❌ All fields are required!");
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/faqs/createfaq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to submit FAQ");

            alert("✅ Your question has been submitted!");
            navigate("/faqs");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Ask a Question ❓</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Jane Doe"
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Question */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Your Question</label>
                    <textarea
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Type your question here..."
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6 mt-8">
                    <motion.button
                        type="button"
                        onClick={() => navigate("/faq")}
                        className="relative overflow-hidden px-6 py-3 font-semibold rounded bg-red-600 text-white border-2 border-red-600 transition-all duration-300 group cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-red-600">
                            Cancel
                        </span>
                    </motion.button>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="relative overflow-hidden px-6 py-3 font-semibold rounded bg-green-600 text-white border-2 border-green-600 transition-all duration-300 group cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-green-600">
                            {loading ? "Submitting..." : "Submit"}
                        </span>
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default CreateFAQ;
