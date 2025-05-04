import React, { useState, useEffect } from "react"
import axios from "axios"
import { Search, Filter, Edit, Trash2, UserPlus, Download } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import UserFormModal from "./UserFormModal"


const Users = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const usersPerPage = 10
  const navigate = useNavigate()

  // Fetch real users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users")
        setUsers(res.data)
        setFilteredUsers(res.data)
      } catch (err) {
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Apply filters & search
  useEffect(() => {
    let result = [...users]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      )
    }

    if (selectedRole !== "all") {
      result = result.filter((user) => user.role === selectedRole)
    }

    setFilteredUsers(result)
    setCurrentPage(1)
  }, [searchQuery, selectedRole, users])

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Handle Add New User
  const handleAddUser = () => {
    setSelectedUser(null)
    setIsUserModalOpen(true)
  }

  // Handle Edit User
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  // Handle Delete Confirmation
  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  // Confirm Delete from Modal
  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${selectedUser._id}`)
      setUsers(users.filter((u) => u._id !== selectedUser._id))
      setFilteredUsers(filteredUsers.filter((u) => u._id !== selectedUser._id))
    } catch (err) {
      alert("Failed to delete user.")
      console.error("Error deleting user:", err)
    }
    setIsDeleteModalOpen(false)
  }

  // Save User (Add or Update)
  const handleSaveUser = async (userData) => {
    try {
      let updatedUser
      if (selectedUser) {
        // Update existing user
        updatedUser = await axios.put(
          `http://localhost:3000/api/users/${selectedUser._id}`,
          userData
        )
      } else {
        // Create new user
        updatedUser = await axios.post("http://localhost:3000/api/register", userData)
      }

      // Update local state
      if (selectedUser) {
        setUsers(
          users.map((u) => (u._id === updatedUser.data._id ? updatedUser.data : u))
        )
      } else {
        setUsers([updatedUser.data, ...users])
      }

      setFilteredUsers([...users]) // Refresh filter
      setIsUserModalOpen(false)
    } catch (err) {
      alert("Failed to save user.")
      console.error("Error saving user:", err)
    }
  }

  // Generate CSV Report
  const downloadCSV = () => {
    const csvRows = [
      ["ID", "Username", "Email", "Role", "Status", "Created At"].join(","),
      ...filteredUsers.map((user) =>
        [
          user._id,
          user.username,
          user.email,
          user.role,
          user.status || "active",
          new Date(user.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "users-report.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={handleAddUser}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
            <button
              onClick={downloadCSV}
              className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-neutral-300 rounded-md py-2 px-3 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="user">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {currentUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">
                                {user.username}
                              </div>
                              <div className="text-sm text-neutral-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-neutral-400 hover:text-primary"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-neutral-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
                <div className="sm:flex-1"></div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-l-md hover:bg-neutral-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-primary text-white"
                            : "text-neutral-500 bg-white hover:bg-neutral-50"
                        } border border-neutral-300`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-r-md hover:bg-neutral-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {isUserModalOpen && (
          <UserFormModal
            user={selectedUser}
            onClose={() => setIsUserModalOpen(false)}
            onSave={handleSaveUser}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white max-w-md w-full mx-auto p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium">Confirm Delete</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Are you sure you want to delete{" "}
                <strong>{selectedUser?.username}</strong>?
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Users