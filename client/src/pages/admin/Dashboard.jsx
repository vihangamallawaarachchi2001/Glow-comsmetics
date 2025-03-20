import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Package, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"
import TrendingProductsTable from "../../components/admin/TrendingProductsTable"
import AdminTopSellingItems from "../../components/admin/AdminTopSellingItems"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [salesData, setSalesData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is admin
    // const checkAdminStatus = async () => {
    //   try {
    //     const token = localStorage.getItem("token")
    //     if (!token) {
    //       navigate("/login")
    //       return
    //     }

    //     const response = await fetch("http://localhost:3000/api/admin/check", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })

    //     if (!response.ok) {
    //       // Not admin, redirect to home
    //       navigate("/")
    //       return
    //     }
    //   } catch (error) {
    //     console.error("Error checking admin status:", error)
    //     navigate("/")
    //   }
    // }

    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be separate API calls
        // Simulating API calls with timeout
        setTimeout(() => {
          // Mock stats data
          const mockStats = {
            totalSales: 24895.65,
            salesGrowth: 12.5,
            totalOrders: 342,
            ordersGrowth: 8.2,
            totalUsers: 1254,
            usersGrowth: 15.3,
            totalProducts: 86,
            productsGrowth: 5.7,
          }
          setStats(mockStats)

          // Mock recent orders
          const mockRecentOrders = [
            {
              id: "ORD-789012",
              customer: "Emily Johnson",
              date: "2023-11-15",
              total: 129.99,
              status: "Delivered",
              items: 3,
            },
            {
              id: "ORD-789011",
              customer: "Michael Chen",
              date: "2023-11-15",
              total: 79.98,
              status: "Processing",
              items: 2,
            },
            {
              id: "ORD-789010",
              customer: "Sarah Williams",
              date: "2023-11-14",
              total: 199.95,
              status: "Shipped",
              items: 4,
            },
            {
              id: "ORD-789009",
              customer: "David Rodriguez",
              date: "2023-11-14",
              total: 59.99,
              status: "Delivered",
              items: 1,
            },
            {
              id: "ORD-789008",
              customer: "Jessica Lee",
              date: "2023-11-13",
              total: 149.97,
              status: "Processing",
              items: 3,
            },
          ]
          setRecentOrders(mockRecentOrders)

          // Mock top products
          const mockTopProducts = [
            {
              id: 1,
              name: "Hydrating Facial Serum",
              category: "Skincare",
              price: 39.99,
              sold: 128,
              stock: 42,
            },
            {
              id: 2,
              name: "Vitamin C Brightening Cream",
              category: "Skincare",
              price: 49.99,
              sold: 112,
              stock: 35,
            },
            {
              id: 3,
              name: "Matte Lipstick Collection",
              category: "Makeup",
              price: 29.99,
              sold: 98,
              stock: 27,
            },
            {
              id: 4,
              name: "Exfoliating Face Scrub",
              category: "Skincare",
              price: 19.99,
              sold: 87,
              stock: 53,
            },
            {
              id: 5,
              name: "Volumizing Mascara",
              category: "Makeup",
              price: 24.99,
              sold: 76,
              stock: 61,
            },
          ]
          setTopProducts(mockTopProducts)

          const mockSalesData = [
            { month: "Jan", sales: 12500 },
            { month: "Feb", sales: 14200 },
            { month: "Mar", sales: 16800 },
            { month: "Apr", sales: 15300 },
            { month: "May", sales: 17500 },
            { month: "Jun", sales: 19200 },
            { month: "Jul", sales: 18100 },
            { month: "Aug", sales: 20500 },
            { month: "Sep", sales: 22300 },
            { month: "Oct", sales: 23100 },
            { month: "Nov", sales: 24900 },
            { month: "Dec", sales: null },           ]
          setSalesData(mockSalesData)

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    //checkAdminStatus()
    fetchDashboardData()
  }, [navigate])

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="h-8 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-medium ${stats.salesGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stats.salesGrowth >= 0 ? "+" : ""}
                      {stats.salesGrowth}%
                    </span>
                    {stats.salesGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">${stats.totalSales.toLocaleString()}</h3>
                <p className="text-neutral-500 text-sm">Total Sales</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-medium ${stats.ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stats.ordersGrowth >= 0 ? "+" : ""}
                      {stats.ordersGrowth}%
                    </span>
                    {stats.ordersGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stats.totalOrders.toLocaleString()}</h3>
                <p className="text-neutral-500 text-sm">Total Orders</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-medium ${stats.usersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stats.usersGrowth >= 0 ? "+" : ""}
                      {stats.usersGrowth}%
                    </span>
                    {stats.usersGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-4 and-4 text-red-600 ml-1" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-neutral-500 text-sm">Total Users</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-medium ${stats.productsGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stats.productsGrowth >= 0 ? "+" : ""}
                      {stats.productsGrowth}%
                    </span>
                    {stats.productsGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stats.totalProducts.toLocaleString()}</h3>
                <p className="text-neutral-500 text-sm">Total Products</p>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Sales Overview</h2>
                  <div className="flex items-center space-x-2">
                    <select className="text-sm border border-neutral-300 rounded-md px-2 py-1">
                      <option value="year">This Year</option>
                      <option value="month">This Month</option>
                      <option value="week">This Week</option>
                    </select>
                  </div>
                </div>
                <div className="h-80">
                  {/* Chart would go here - using a placeholder */}
                  <div className="w-full h-full flex items-end justify-between">
                    {salesData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-12 ${data.sales ? "bg-primary/80 hover:bg-primary" : "bg-neutral-200"} rounded-t-sm transition-all duration-200`}
                          style={{
                            height: data.sales ? `${(data.sales / 25000) * 100}%` : "10%",
                            opacity: data.sales ? 1 : 0.5,
                          }}
                        ></div>
                        <span className="text-xs mt-2 text-neutral-500">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6">Top Selling Products</h2>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-neutral-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h3>
                        <p className="text-xs text-neutral-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{product.sold} sold</p>
                        <p className="text-xs text-neutral-500">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 text-sm text-primary font-medium hover:text-primary/80">
                  View All Products
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-lg font-bold">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{order.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-primary/80">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-neutral-200 text-center">
                <button className="text-sm text-primary font-medium hover:text-primary/80">View All Orders</button>
              </div>
            </div>
          </>

          
        )}

<TrendingProductsTable />
<AdminTopSellingItems />
      </div>
    </AdminLayout>
  )
}

export default Dashboard

