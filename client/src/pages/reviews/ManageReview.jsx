import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


const ManageReviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const downloadCSVReport = () => {
    if (!filteredReviews.length) {
      toast.error("No reviews to download.");
      return;
    }

    const headers = ["Product Name", "Category", "Title", "Rating", "Status", "Date"];
    const rows = filteredReviews.map((review) => [
      `"${review.product_name}"`,
      `"${review.product_type}"`,
      `"${review.title}"`,
      review.rating,
      review.status,
      new Date(review.date).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reviews_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDFReport = () => {
    if (!filteredReviews.length) {
      toast.error("No reviews to download.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Reviews Report", 14, 15);

    const tableColumn = ["Product", "Category", "Title", "Rating", "Status", "Date"];
    const tableRows = filteredReviews.map((review) => [
      review.product_name,
      review.product_type,
      review.title,
      review.rating,
      review.status,
      new Date(review.date).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
    });

    doc.save("reviews_report.pdf");
  };

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/reviews/all");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews.");
        }
        const data = await response.json();
        setReviews(data);
        setFilteredReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviewsData();
  }, []);

  useEffect(() => {
    let updated = reviews;

    if (searchTerm) {
      updated = updated.filter((review) =>
        Object.values({
          title: review.title,
          product_name: review.product_name,
          product_type: review.product_type,
          status: review.status,
          rating: review.rating,
        })
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      updated = updated.filter((review) => review.status === statusFilter);
    }

    if (categoryFilter) {
      updated = updated.filter((review) => review.product_type === categoryFilter);
    }

    if (ratingFilter) {
      updated = updated.filter((review) => String(review.rating) === ratingFilter);
    }

    setFilteredReviews(updated);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, ratingFilter, reviews]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedReview(null);
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/reviews/delete/${selectedReview._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete review.");

      setReviews(reviews.filter((review) => review._id !== selectedReview._id));
      toast.success("Review deleted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review.");
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="px-6 py-4 bg-white min-h-screen w-full">
        <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-64"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Sports">Sports</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="solved">Solved</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5].map((rate) => (
              <option key={rate} value={rate}>
                {rate} ★
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={downloadCSVReport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Download CSV
            </button>
            <button
              onClick={downloadPDFReport}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : (
          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">Recent Reviews</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReviews.length > 0 ? (
                    currentReviews.map((review) => (
                      <tr key={review._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{review.product_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{review.product_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{review.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{review.rating} ★</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              review.status === "solved"
                                ? "bg-green-100 text-green-800"
                                : review.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {review.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-4">
                          <button
                            onClick={() => navigate(`/admin/edit-review/${review._id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <AiOutlineEdit size={20} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(review)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <AiOutlineDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No reviews found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-gray-200 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-200 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          onClose={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
        >
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-semibold mb-4">Confirm Delete</Dialog.Title>
            <p className="text-gray-600">Are you sure you want to delete this review?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </AdminLayout>
  );
};

export default ManageReviews;
