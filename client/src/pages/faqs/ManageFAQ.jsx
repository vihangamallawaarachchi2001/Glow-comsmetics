import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaSearch } from "react-icons/fa"

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"


const ManageFAQ = () => {
  const [faqs, setFaqs] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetch("http://localhost:3000/api/faqs/")
      .then(res => res.json())
      .then(data => setFaqs(data.data))
      .catch(error => {
        console.error("Error fetching FAQs:", error)
      })
  }, [])

  // Handling the deletion process of questions
  const handleDelete = async _id => {
    try {
      const response = await fetch(`http://localhost:3000/faqs/${_id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const textResponse = await response.text()
        if (textResponse.startsWith("<!DOCTYPE html>")) {
          console.error("Received an HTML error page instead of JSON.")
          console.error(textResponse)
          return
        }
        throw new Error(`Failed to delete FAQ, status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Delete response:", data)

      if (data.message === "FAQ Deleted") {
        setFaqs(prevFaqs => prevFaqs.filter(faq => faq._id !== _id))
      } else {
        console.error("Unexpected delete response:", data)
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error)
    }
  }

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    faq =>
      faq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage)

  // Get the FAQs for the current page
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Pagination controls
  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
  }

  return (
    <div className="px-4 my-6">
      

      <div className="main-content">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-bold">Manage Your FAQs</h2>

          {/* Search bar */}
          <div className="relative w-96 mb-4">
            <input
              type="text"
              placeholder="Search FAQs"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-10 pl-10 pr-10 rounded-full shadow-sm w-full border border-gray-300 focus:border-sky-500 focus:outline-none"
            />
            <div className="absolute top-0 left-0 mt-2.5 ml-4 text-gray-500">
              <FaSearch size="20px" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex justify-center items-center">
          <table className="w-full table-auto bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
            <thead className="bg-sky-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Full Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Question
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  <span>Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedFaqs.map((faq, index) => (
                <tr
                  key={faq._id}
                  className="bg-white hover:bg-gray-100 transition duration-300"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {faq.full_name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{faq.question}</td>
                  <td className="px-6 py-4 text-gray-700">{faq.category}</td>
                  <td className="px-6 py-4 text-gray-700">{faq.status}</td>
                  <td className="px-6 py-4 flex gap-4">
                    <Link to={`/admin/answer-faq/${faq._id}`}>
                      <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-1 rounded transition duration-300">
                        <AiOutlineEdit />
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded transition duration-300"
                      onClick={() => handleDelete(faq._id)}
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <p className="mx-auto text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-700 text-white"
              }`}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <button
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-700 text-white"
              }`}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageFAQ
