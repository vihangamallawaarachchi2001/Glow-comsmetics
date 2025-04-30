import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "../../components/admin/AdminLayout";

const ManageFAQ = () => {
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 10;
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchFAQs = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/faqs");
      const result = await res.json();
      const data = result.data; 
      setFaqs(data);
      setFilteredFaqs(data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch FAQs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    let updated = faqs;
    if (searchTerm) {
      updated = updated.filter((faq) =>
        Object.values(faq)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      updated = updated.filter((faq) => faq.status === statusFilter);
    }

    if (categoryFilter) {
      updated = updated.filter((faq) => faq.category === categoryFilter);
    }

    setFilteredFaqs(updated);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, faqs]);

  const indexOfLast = currentPage * faqsPerPage;
  const indexOfFirst = indexOfLast - faqsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);

  const handleDelete = async () => {
    if (!selectedFAQ) return;

    try {
      await fetch(`http://localhost:3000/api/faqs/${selectedFAQ._id}`, {
        method: "DELETE",
      });
      toast.success("FAQ deleted");
      setFaqs(faqs.filter((faq) => faq._id !== selectedFAQ._id));
      closeModal();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openDeleteModal = (faq) => {
    setSelectedFAQ(faq);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedFAQ(null);
  };

  const downloadCSV = () => {
    if (!filteredFaqs.length) {
      toast.error("No FAQs to download");
      return;
    }

    const headers = ["Full Name", "Question", "Answer", "Answered By", "Status", "Category", "Date"];
    const rows = filteredFaqs.map((faq) => [
      faq.full_name,
      faq.question,
      faq.answer || "",
      faq.answered_by || "",
      faq.status,
      faq.category,
      new Date(faq.createdAt).toLocaleDateString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "faqs_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!filteredFaqs.length) {
      toast.error("No FAQs to download");
      return;
    }

    const doc = new jsPDF();
    doc.text("FAQs Report", 14, 15);

    const columns = ["Full Name", "Question", "Answer", "Answered By", "Status", "Category", "Date"];
    const rows = filteredFaqs.map((faq) => [
      faq.full_name,
      faq.question,
      faq.answer || "-",
      faq.answered_by || "-",
      faq.status,
      faq.category,
      new Date(faq.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
      styles: { fontSize: 9 },
    });

    doc.save("faqs_report.pdf");
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="px-6 py-4 bg-white min-h-screen w-full">
        <h1 className="text-2xl font-bold mb-6">Manage FAQs</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search..."
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Solved">Solved</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download CSV
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading FAQs...</div>
        ) : (
          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Full Name", "Question", "Answer", "Answered By", "Status", "Category", "Date", "Actions"].map(
                    (head) => (
                      <th
                        key={head}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentFaqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{faq.full_name}</td>
                    <td className="px-6 py-4 text-sm">{faq.question}</td>
                    <td className="px-6 py-4 text-sm">{faq.answer || "-"}</td>
                    <td className="px-6 py-4 text-sm">{faq.answered_by || "-"}</td>
                    <td className="px-6 py-4 text-sm">{faq.status}</td>
                    <td className="px-6 py-4 text-sm">{faq.category}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(faq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-4">
                      <button
                        onClick={() => navigate(`/admin/answer-faq/${faq._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(faq)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-gray-200 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-200 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          onClose={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
        >
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-semibold mb-4">Confirm Delete</Dialog.Title>
            <p className="text-gray-600">Are you sure you want to delete this FAQ?</p>
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

export default ManageFAQ;
