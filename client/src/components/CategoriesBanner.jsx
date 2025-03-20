import { Link } from "react-router-dom"

const categories = [
  {
    id: 1,
    name: "Skincare",
    image: "/placeholder.svg?height=200&width=200",
    count: 124,
    color: "bg-pink-100",
  },
  {
    id: 2,
    name: "Makeup",
    image: "/placeholder.svg?height=200&width=200",
    count: 86,
    color: "bg-purple-100",
  },
  {
    id: 3,
    name: "Haircare",
    image: "/placeholder.svg?height=200&width=200",
    count: 53,
    color: "bg-blue-100",
  },
  {
    id: 4,
    name: "Fragrance",
    image: "/placeholder.svg?height=200&width=200",
    count: 42,
    color: "bg-amber-100",
  },
  {
    id: 5,
    name: "Bath & Body",
    image: "/placeholder.svg?height=200&width=200",
    count: 78,
    color: "bg-green-100",
  },
]

const CategoriesBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`group relative rounded-xl overflow-hidden ${category.color} hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center p-6 text-center h-48`}
            >
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <img src={category.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">{category.name}</h3>
              <p className="text-sm text-neutral-600 relative z-10">{category.count} Products</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesBanner

