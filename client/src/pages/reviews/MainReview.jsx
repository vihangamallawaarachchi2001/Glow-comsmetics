import { Card } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaStar, FaRegStar } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import reviewpic from '../../assets/coverimages/reviewpic.jpg';
import NewsLetter from '../../components/Newsletter';
import Title from '../../components/homecomp/Title';
import { motion } from "framer-motion";

const MainReview = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [filterOption, setFilterOption] = useState(null);
    const [dateSortOption, setDateSortOption] = useState("latest");
    const [categoryFilter, setCategoryFilter] = useState("none");
    
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 9; 

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/reviews/all');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setReviews(data);
                setFilteredReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        if (!Array.isArray(reviews)) {
            console.error("Expected reviews to be an array, received:", reviews);
            setFilteredReviews([]);
            return;
        }

        let results = reviews.filter(review =>
            review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filterOption) {
            results = results.filter(review => review.rating === filterOption);
        }

        if (categoryFilter !== "none") {
            results = results.filter(review => review.product_type === categoryFilter);
        }

        if (dateSortOption === "latest") {
            results.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        } else if (dateSortOption === "oldest") {
            results.sort((a, b) => new Date(a.date) - new Date(b.date)); 
        }

        setFilteredReviews(results);
        setCurrentPage(1); // reset to page 1 on filter/search
    }, [searchQuery, reviews, filterOption, dateSortOption, categoryFilter]);    

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-500" />);
            }
        }
        return stars;
    };

    return (
        <div className='mt-4 px-4 pt-10'>
            <div className='flex justify-between items-start mb-8'>
                <h2 className='text-4xl font-bold'>What People Think About Us!</h2>
            </div>

            <div className='w-full mt-16 py-12 bg-white px-4 lg:px-24 relative'>
                <div className='absolute inset-0'>
                    <img src={reviewpic} alt="background" className='w-full h-full object-cover' />
                </div>
                <div className='relative z-10 bg-[rgba(0,0,0,0.7)] p-8 md:p-12 lg:p-16 text-white'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-12'>
                        <div>
                            <h2 className='text-4xl font-bold mb-6 leading-snug text-white'>
                                Have Feedback on Your Recent Purchase? <br /> Let Us Know!
                            </h2>
                            <p className='md:w-1/2 text-white text-semibold'>
                                We value your opinion and strive to provide the best shopping experience possible.
                            </p>
                            <Link to="/create-review" className='mt-5 block'>
                                <motion.button
                                    className="relative overflow-hidden px-5 py-2 font-semibold rounded bg-black text-white border-2 border-black transition-all duration-300 group mb-8 cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                                        Add Review
                                    </span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 px-4">
                {/* Title & Filter Section */}
                <div className='flex flex-col md:flex-row justify-between items-center mb-10 gap-4'>
                    <div className='text-3xl font-extrabold text-gray-800 py-4 text-center md:text-left'>
                        <Title text1={'CUSTOMER'} text2={' REVIEWS'} />
                    </div>

                    <div className='flex items-center gap-3 w-full md:w-auto'>
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search reviews..."
                                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-gray-400 transition"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <select
                            value={filterOption ?? "none"}
                            onChange={(e) => setFilterOption(e.target.value === "none" ? null : parseInt(e.target.value))}
                            className="h-12 pl-4 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-gray-400 transition"
                        >
                            <option value="none">Filter by Rating</option>
                            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                            <option value="3">⭐⭐⭐ (3 Stars)</option>
                            <option value="2">⭐⭐ (2 Stars)</option>
                            <option value="1">⭐ (1 Star)</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="h-12 pl-4 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-gray-400 transition"
                        >
                            <option value="none">Filter by Category</option>
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
                </div>

                {/* Reviews Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {currentReviews.length > 0 ? (
                        currentReviews.map((review) => (
                            <motion.div 
                                key={review._id}
                                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-transform transform hover:-translate-y-2 duration-300"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                {review.images_path && review.images_path.length > 0 && (
                                    <div className={`grid gap-2 ${review.images_path.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        {review.images_path.slice(0, 2).map((img, index) => (
                                            <img 
                                                key={index}
                                                src={img} 
                                                alt={`Review Image ${index + 1}`} 
                                                className="w-full h-88 object-cover rounded-lg border border-gray-300"
                                                onError={(e) => e.target.style.display = 'none'} 
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <h4 className="text-xl font-bold text-gray-800 mt-2">{review.title}</h4>
                                    <p className="text-gray-600 mt-2">{review.description}</p>
                                    <h3 className="mt-4 text-0.5xl font-semibold text-gray-900">Product: {review.product_name}</h3>
                                    <p className="text-sm text-gray-600">Category: {review.product_type}</p>
                                    <div className="flex items-center mt-3 space-x-1">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center text-lg col-span-3">No reviews found</p>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center space-x-2">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded border text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded border text-sm font-medium ${
                                    currentPage === index + 1
                                        ? 'bg-black text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded border text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
                <div className='mt-4'>
                    <NewsLetter />
                </div>
            </div>
        </div>
    );
};

export default MainReview;
