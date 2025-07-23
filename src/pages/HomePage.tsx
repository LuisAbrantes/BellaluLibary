import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import BookList from '../features/books/BookList'

export default function HomePage() {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Todos os Livros
          </h1>
          <p className="mt-2 text-gray-600">
            Explore a coleção de livros da família
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link
            to="/add-book"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Livro
          </Link>
        </div>
      </div>

      {/* Books Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <BookList />
      </div>
    </>
  )
}
