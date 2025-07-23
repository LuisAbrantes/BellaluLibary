import type { Book } from '../../lib/supabaseClient';

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    const { title, author, cover_url, is_available } = book;

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Book Cover */}
            <div className="aspect-[3/4] bg-gray-100 relative">
                {cover_url ? (
                    <img
                        src={cover_url}
                        alt={`Capa do livro ${title}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    // Generic placeholder when no cover is available
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <div className="text-center p-4">
                            <svg
                                className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            <p className="text-xs text-gray-500 font-medium">
                                Sem Capa
                            </p>
                        </div>
                    </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-2 right-2">
                    <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                            is_available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {is_available ? 'Disponível' : 'Indisponível'}
                    </span>
                </div>
            </div>

            {/* Book Information */}
            <div className="p-4">
                {/* Book Title */}
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
                    {title}
                </h3>

                {/* Book Author */}
                {author && (
                    <p className="text-gray-600 text-sm truncate">{author}</p>
                )}
            </div>
        </div>
    );
}
