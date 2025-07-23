import BookList from '../features/books/BookList';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
                        Biblioteca da Família
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 text-center max-w-2xl mx-auto">
                        Descubra, compartilhe e gerencie os livros da família
                    </p>
                </div>

                {/* Books Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <BookList />
                </div>
            </div>
        </div>
    );
}
