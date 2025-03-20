import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react"
import axios from "axios"

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        const userResponse = await axios.get(`http://localhost:3000/api/users/${localStorage.getItem('id')}`)

        if (userResponse.status === 200) {
          const userData = await userResponse.data
          setUser(userData)
        }
        if ( userResponse.data.role !== 'admin') navigate('/')
      } catch (error) {
        console.error("Error checking admin status:", error)
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkAdminStatus()
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">GLOW</span>
            <span className="ml-2 text-sm font-medium text-neutral-500">Admin</span>
          </Link>
          <div className="relative">
            <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">GLOW</span>
              <span className="ml-2 text-sm font-medium text-neutral-500">Admin</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {user?.firstName?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="text-sm font-medium text-neutral-900 truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-neutral-500 truncate">Admin</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 p-1 rounded-full text-neutral-400 hover:text-neutral-600"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-0"} pt-16 md:pt-0`}>
        {/* Desktop header */}
        <header className="hidden md:flex h-16 items-center justify-between bg-white border-b border-neutral-200 px-6">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
            >
              <Menu size={20} />
            </button>
            <div className="ml-4 relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center text-sm text-neutral-700 hover:text-neutral-900">
                <span className="mr-2">
                  {user?.firstName} {user?.lastName}
                </span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default AdminLayout

