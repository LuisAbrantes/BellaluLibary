import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function AddBookPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_url: '',
    owner_name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // First, check if user exists or create new user
      let userId: string

      if (formData.owner_name.trim()) {
        // Try to find existing user
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('name', formData.owner_name.trim())
          .eq('is_active', true)
          .single()

        if (existingUser) {
          userId = existingUser.id
        } else {
          // Create new user
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              name: formData.owner_name.trim(),
              is_active: true
            })
            .select('id')
            .single()

          if (userError) throw userError
          userId = newUser.id
        }
      } else {
        throw new Error('Nome do proprietário é obrigatório')
      }

      // Insert the book
      const { error: bookError } = await supabase
        .from('books')
        .insert({
          title: formData.title.trim(),
          author: formData.author.trim() || null,
          cover_url: formData.cover_url.trim() || null,
          owner_id: userId,
          is_available: true,
          is_active: true
        })

      if (bookError) throw bookError

      // Success! Navigate back to home
      navigate('/')
    } catch (err) {
      console.error('Error adding book:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar livro')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Adicionar Novo Livro
          </h1>
          <p className="mt-1 text-gray-600">
            Adicione um livro à biblioteca da família
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Informações do Livro
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título do Livro *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o título do livro"
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Autor
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome do autor (opcional)"
              />
            </div>

            {/* Cover URL */}
            <div>
              <label htmlFor="cover_url" className="block text-sm font-medium text-gray-700 mb-2">
                URL da Capa
              </label>
              <input
                type="url"
                id="cover_url"
                name="cover_url"
                value={formData.cover_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemplo.com/capa.jpg (opcional)"
              />
            </div>

            {/* Owner */}
            <div>
              <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700 mb-2">
                Proprietário *
              </label>
              <input
                type="text"
                id="owner_name"
                name="owner_name"
                required
                value={formData.owner_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome do membro da família"
              />
              <p className="mt-1 text-sm text-gray-500">
                Se o nome não existir, um novo membro será criado automaticamente
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isLoading ? 'Adicionando...' : 'Adicionar Livro'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
