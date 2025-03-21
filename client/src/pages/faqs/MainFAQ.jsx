import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import FAQpic from '../../assets/faqimg2.jpg';
import NewsLetter from '../../components/Newsletter';
import Title from '../../components/homecomp/Title';
import { motion } from "framer-motion";

const MainFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const faqsPerPage = 10;

    useEffect(() => {
        // Fetch FAQs from the backend
        fetch("http://localhost:3000/api/faqs")
            .then(res => res.json())
            .then(data => {
                setFaqs(data.data);
                const uniqueCategories = Array.from(new Set(data.data.map((faq) => faq.category)));
                setCategories(uniqueCategories);
            })
            .catch(error => console.error('Error fetching FAQs:', error));
    }, []);

    const filteredFaqs = faqs.filter(faq =>
        (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory === "" || faq.category === selectedCategory)
    );

    const indexOfLastFAQ = currentPage * faqsPerPage;
    const indexOfFirstFAQ = indexOfLastFAQ - faqsPerPage;
    const currentFaqs = filteredFaqs.slice(indexOfFirstFAQ, indexOfLastFAQ);

    const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);

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

    return (
        <div className='mt-4 px-4 pt-10'>
            <div className='flex justify-between items-start mb-8'>
                <h2 className='text-4xl font-bold'>Frequently Asked Questions</h2>
            </div>

            <div className='w-full mt-16 py-12 bg-white px-4 lg:px-24 relative'>
                <div className='absolute inset-0'>
                    <img src={FAQpic} alt="background" className='w-full h-full object-cover' />
                </div>

                <div className='relative z-10 bg-[rgba(0,0,0,0.7)] p-8 md:p-12 lg:p-16 text-white'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-12'>
                        <div>
                            <h2 className='text-4xl font-bold mb-6 leading-snug'>
                                Have a Question? We've Got Answers!
                            </h2>
                            <p className='md:w-1/2'>
                                Welcome to our Frequently Asked Questions (FAQ) section. Here, you'll find answers to the most common inquiries about our 
                                services, products, and policies. We're committed to providing you with all the information you need, so if you don't see your 
                                question answered here, feel free to ask! Simply submit your question in this section, and our team will get back to you as soon as possible.
                            </p>
                            <Link to="/create-faq" className='mt-5 block'>
                              <motion.button
                                    className="relative overflow-hidden px-5 py-2 font-semibold rounded bg-black text-white border-2 border-black transition-all duration-300 group mb-8 cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="absolute inset-0 bg-white transition-transform transform translate-y-full group-hover:translate-y-0 duration-300"></span>
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                                        Ask Questions
                                    </span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-12 flex justify-between items-start '>
                <div className='text-2xl py-4'>
                    <Title text1={'QESTIONS'} text2={' USER ASKED'}/>
                </div>
                <div className='flex items-center space-x-4'>
                    <select className='h-10 pl-4 pr-8 border border-gray-300 rounded-full'
                        id="category-filter"
                        name="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search FAQs"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='h-10 pl-10 pr-10 rounded-full shadow-sm w-full border border-gray-300'
                        />
                        <div className="absolute top-0 left-0 mt-2.5 ml-4 text-gray-500">
                            <FaSearch size="20px" />
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid gap-5 my-12 lg:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 grid-cols-1'>
                {currentFaqs.map(faq => (
                    <Card key={faq._id} className="h-auto relative transition-shadow duration-300 ease-in-out hover:shadow-xl">
                        <div className="px-6 py-4">
                            <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
                                {faq.question}
                            </h5>
                            <p className='text-sm text-black'>
                                Question By: {faq.full_name} &nbsp;  I  &nbsp; Category: {faq.category} &nbsp;  I  &nbsp; Status: {faq.status}
                            </p> 
                            {faq.answer && (
                                <p className="text-black mt-4">
                                    <span className='text-sm'><strong>Answer:</strong></span> {faq.answer}
                                </p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center items-center mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`mx-2 px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-black text-white'}`}
                >
                    Previous
                </button>
                <span className="mx-2 text-lg">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`mx-2 px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-black text-white'}`}
                >
                    Next
                </button>
            </div>

            <br/><br/><NewsLetter />
        </div>
    );
};

export default MainFAQ;
