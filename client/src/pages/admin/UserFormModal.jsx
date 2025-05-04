import React, { useState, useEffect } from "react"

const UserFormModal = ({ user, onClose, onSave }) => {
  const isEditMode = !!user

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
        status: user.status || "active",
      })
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const validationErrors = {}
    if (!formData.username) validationErrors.username = "Username is required"
    if (!formData.email) validationErrors.email = "Email is required"
    if (!isEditMode && !formData.password)
      validationErrors.password = "Password is required"
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white max-w-md w-full mx-4 p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">
            {isEditMode ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.username ? "border-red-500" : "border-neutral-300"
              } rounded-md p-2`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.email ? "border-red-500" : "border-neutral-300"
              } rounded-md p-2`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.password ? "border-red-500" : "border-neutral-300"
                } rounded-md p-2`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-neutral-300 rounded-md p-2"
            >
              <option value="user">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-black rounded-md text-sm hover:bg-primary/90"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserFormModal