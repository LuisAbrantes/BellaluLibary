import { useState, useEffect } from 'react'
import { supabase, type User } from '../lib/supabaseClient'
import { Users, Plus, Edit2, Trash2, BookOpen } from 'lucide-react'

interface UserWithStats extends User {
  book_count: number
  active_loans: number
}

export default function FamilyMembersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch users with their book counts and active loan counts
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          books!owner_id(count),
          loans!borrower_id(count)
        `)
        .eq('is_active', true)
        .order('name')

      if (usersError) throw usersError

      // Process the data to get proper counts
      const usersWithStats = await Promise.all(
        (usersData || []).map(async (user) => {
          // Get book count
          const { count: bookCount } = await supabase
            .from('books')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id)
            .eq('is_active', true)

          // Get active loans count
          const { count: loansCount } = await supabase
            .from('loans')
            .select('*', { count: 'exact', head: true })
            .eq('borrower_id', user.id)
            .is('returned_date', null)

          return {
            ...user,
            book_count: bookCount || 0,
            active_loans: loansCount || 0
          }
        })
      )

      setUsers(usersWithStats)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar membros')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          name: formData.name.trim(),
          is_active: true
        })

      if (error) throw error

      setShowAddForm(false)
      setFormData({ name: '' })
      fetchUsers()
    } catch (err) {
      console.error('Error adding user:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar membro')
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ name: formData.name.trim() })
        .eq('id', editingUser.id)

      if (error) throw error

      setEditingUser(null)
      setFormData({ name: '' })
      fetchUsers()
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar membro')
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Tem certeza que deseja remover ${user.name}? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      // Instead of deleting, we mark as inactive
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', user.id)

      if (error) throw error

      fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err instanceof Error ? err.message : 'Erro ao remover membro')
    }
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name })
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setFormData({ name: '' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        <span className="ml-3 text-gray-600">Carregando membros...</span>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Membros da Família
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie os membros da biblioteca familiar
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Membro
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingUser) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Editar Membro' : 'Adicionar Novo Membro'}
          </h2>
          
          <form onSubmit={editingUser ? handleEditUser : handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do membro da família"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                {editingUser ? 'Salvar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={editingUser ? cancelEdit : () => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Membros ({users.length})
          </h2>
        </div>
        
        {users.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum membro cadastrado
            </h3>
            <p className="text-gray-600">
              Adicione membros da família para começar a usar a biblioteca
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map(user => (
              <div key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {user.book_count} livro{user.book_count !== 1 ? 's' : ''}
                        </div>
                        {user.active_loans > 0 && (
                          <div className="text-orange-600">
                            {user.active_loans} empréstimo{user.active_loans !== 1 ? 's' : ''} ativo{user.active_loans !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar membro"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remover membro"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      {users.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Total de Membros
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Total de Livros
                </p>
                <p className="text-lg font-bold text-green-900">
                  {users.reduce((sum, user) => sum + user.book_count, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-800">
                  Empréstimos Ativos
                </p>
                <p className="text-lg font-bold text-orange-900">
                  {users.reduce((sum, user) => sum + user.active_loans, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
