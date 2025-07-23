import { useState, useEffect } from 'react'
import { supabase, type Book, type User, type Loan } from '../lib/supabaseClient'
import { ArrowLeftRight, Calendar, User as UserIcon, BookOpen, CheckCircle } from 'lucide-react'

interface LoanWithDetails extends Loan {
  book: Book
  borrower: User
}

export default function ManageLoansPage() {
  const [loans, setLoans] = useState<LoanWithDetails[]>([])
  const [availableBooks, setAvailableBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [formData, setFormData] = useState({
    book_id: '',
    borrower_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch active loans with book and borrower details
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select(`
          *,
          book:books(*),
          borrower:users(*)
        `)
        .is('returned_date', null)
        .order('loan_date', { ascending: false })

      if (loansError) throw loansError

      // Fetch available books for lending
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .eq('is_available', true)
        .order('title')

      if (booksError) throw booksError

      // Fetch active users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (usersError) throw usersError

      setLoans(loansData || [])
      setAvailableBooks(booksData || [])
      setUsers(usersData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Create the loan
      const { error: loanError } = await supabase
        .from('loans')
        .insert({
          book_id: formData.book_id,
          borrower_id: formData.borrower_id,
          loan_date: new Date().toISOString().split('T')[0]
        })

      if (loanError) throw loanError

      // Update book availability
      const { error: bookError } = await supabase
        .from('books')
        .update({ is_available: false })
        .eq('id', formData.book_id)

      if (bookError) throw bookError

      setShowLoanForm(false)
      setFormData({ book_id: '', borrower_id: '' })
      fetchData()
    } catch (err) {
      console.error('Error creating loan:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar empréstimo')
    }
  }

  const handleReturnBook = async (loan: LoanWithDetails) => {
    try {
      // Update loan with return date
      const { error: loanError } = await supabase
        .from('loans')
        .update({ returned_date: new Date().toISOString().split('T')[0] })
        .eq('book_id', loan.book_id)
        .eq('borrower_id', loan.borrower_id)
        .is('returned_date', null)

      if (loanError) throw loanError

      // Update book availability
      const { error: bookError } = await supabase
        .from('books')
        .update({ is_available: true })
        .eq('id', loan.book_id)

      if (bookError) throw bookError

      fetchData()
    } catch (err) {
      console.error('Error returning book:', err)
      setError(err instanceof Error ? err.message : 'Erro ao devolver livro')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        <span className="ml-3 text-gray-600">Carregando empréstimos...</span>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Empréstimos
          </h1>
          <p className="mt-2 text-gray-600">
            Controle os livros emprestados na família
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowLoanForm(true)}
            disabled={availableBooks.length === 0 || users.length === 0}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Novo Empréstimo
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* New Loan Form */}
      {showLoanForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Criar Novo Empréstimo
          </h2>
          
          <form onSubmit={handleCreateLoan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Livro
                </label>
                <select
                  title="Selecionar livro para empréstimo"
                  value={formData.book_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, book_id: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um livro</option>
                  {availableBooks.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} {book.author && `- ${book.author}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quem vai pegar emprestado
                </label>
                <select
                  title="Selecionar pessoa para emprestar o livro"
                  value={formData.borrower_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, borrower_id: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma pessoa</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Criar Empréstimo
              </button>
              <button
                type="button"
                onClick={() => setShowLoanForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Loans */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Empréstimos Ativos ({loans.length})
          </h2>
        </div>
        
        {loans.length === 0 ? (
          <div className="p-6 text-center">
            <ArrowLeftRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum empréstimo ativo
            </h3>
            <p className="text-gray-600">
              Todos os livros estão disponíveis para empréstimo
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {loans.map(loan => (
              <div key={`${loan.book_id}-${loan.borrower_id}`} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {loan.book.cover_url ? (
                          <img
                            src={loan.book.cover_url}
                            alt={loan.book.title}
                            className="h-16 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {loan.book.title}
                        </h3>
                        {loan.book.author && (
                          <p className="text-sm text-gray-600">
                            por {loan.book.author}
                          </p>
                        )}
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            {loan.borrower.name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(loan.loan_date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleReturnBook(loan)}
                    className="ml-4 flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Devolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                Livros Disponíveis
              </p>
              <p className="text-lg font-bold text-blue-900">
                {availableBooks.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <ArrowLeftRight className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-800">
                Empréstimos Ativos
              </p>
              <p className="text-lg font-bold text-orange-900">
                {loans.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <UserIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Membros Ativos
              </p>
              <p className="text-lg font-bold text-green-900">
                {users.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
