import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateReview = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: "65f0b6d2c4f5b84111111111",
        product_name: "",
        product_type: "",
        title: "",
        description: "",
        rating: 0,
        images_path: ["", ""]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const productTypes = ["Serum", "Moisturizer", "Cleanser", "Toner", "Sunscreen", "Mask", "Mascara", "Ampoules", "Facewash", "Lipcare", "Other"];

    // Regular expressions for validation
    const productNameRegex = /^[a-zA-Z\s]+$/; // Only letters & spaces allowed
    const titleRegex = /^[a-zA-Z0-9\s]+$/; // Only letters, numbers & spaces allowed
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/; // Validate URLs

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "product_name" && !productNameRegex.test(value) && value !== "") {
            alert("❌ Product Name can only contain letters and spaces!");
            return;
        }

        if (name === "title" && !titleRegex.test(value) && value !== "") {
            alert("❌ Title can only contain letters, numbers, and spaces!");
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    // Handle image URL changes
    const handleImageChange = (index, value) => {
        if (value && !urlRegex.test(value)) {
            alert("❌ Please enter a valid image URL!");
            return;
        }

        const updatedImages = [...formData.images_path];
        updatedImages[index] = value;
        setFormData({ ...formData, images_path: updatedImages });
    };

    // Handle rating selection
    const handleRating = (value) => {
        setFormData({ ...formData, rating: value });
    };

    // Validate form before submission
    const validateForm = () => {
        if (!formData.product_name || !formData.product_type || !formData.title || !formData.description) {
            alert("❌ All fields are required!");
            return false;
        }
        if (formData.rating === 0) {
            alert("❌ Please select a rating!");
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/reviews/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to submit review");

            alert("✅ Review submitted successfully!");
            navigate("/reviews");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Write a Review ✍️</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. The Ordinary Serum"
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>

                {/* Product Type */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Product Type</label>
                    <select
                        name="product_type"
                        value={formData.product_type}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <option value="">Select type</option>
                        {productTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Review Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Best serum for hydration!"
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Review Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Tell us what you think..."
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    ></textarea>
                </div>

                {/* Rating */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Rating</label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <FaStar
                                key={value}
                                onClick={() => handleRating(value)}
                                className={`cursor-pointer text-2xl transition ${
                                    formData.rating >= value ? "text-yellow-400" : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Image URLs */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Image URLs</label>
                    {formData.images_path.map((img, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Image URL ${index + 1}`}
                            value={img}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6 mt-8">
                    <motion.button
                        onClick={() => navigate("/reviews")}
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

export default CreateReview;
