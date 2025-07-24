import { NavLink } from 'react-router-dom'
import { Book, Users, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { signOut, userProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Book className="h-8 w-8 text-pink-400" />
              <h1 className="ml-2 text-xl font-bold text-pink-400">
                Biblioteca BellaLu
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border-pink-400'
                      : 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border-pink-500'
                  }`
                }
              >
                Livros
              </NavLink>
              
              <NavLink
                to="/familia"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border-pink-400'
                      : 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border-pink-500'
                  }`
                }
              >
                Família
              </NavLink>
              
              <NavLink
                to="/minha-conta"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border-pink-400'
                      : 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border-pink-500'
                  }`
                }
              >
                Minha conta
              </NavLink>

              {/* User Info & Sign Out */}
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-pink-500">
                {userProfile && (
                  <span className="text-pink-300 text-sm">
                    {userProfile.name}
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-pink-400 hover:text-pink-300 text-sm px-3 py-1 border border-pink-500 rounded hover:bg-pink-500/10 transition-colors"
                >
                  Sair
                </button>
              </div>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-pink-500 pt-4 pb-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border-pink-400'
                      : 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border-pink-500'
                  }`
                }
              >
                <Book className="h-4 w-4 mr-2" />
                Livros
              </NavLink>
              
              <NavLink
                to="/familia"
                className={({ isActive }) =>
                  `flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border-pink-400'
                      : 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border-pink-500'
                  }`
                }
              >
                <Users className="h-4 w-4 mr-2" />
                Família
              </NavLink>
              
              <NavLink
                to="/minha-conta"
                className={({ isActive }) =>
                  `flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border-pink-400'
                      : 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border-pink-500'
                  }`
                }
              >
                <User className="h-4 w-4 mr-2" />
                Conta
              </NavLink>
            </div>
            
            {/* Mobile User Info & Sign Out */}
            <div className="flex items-center justify-between pt-4 border-t border-pink-500">
              {userProfile && (
                <span className="text-pink-300 text-sm">
                  {userProfile.name}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="text-pink-400 hover:text-pink-300 text-sm px-3 py-1 border border-pink-500 rounded hover:bg-pink-500/10 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
