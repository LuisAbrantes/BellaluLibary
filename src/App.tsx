import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AddBookPage from './pages/AddBookPage'
import ManageLoansPage from './pages/ManageLoansPage'
import FamilyMembersPage from './pages/FamilyMembersPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-book" element={<AddBookPage />} />
          <Route path="/loans" element={<ManageLoansPage />} />
          <Route path="/family" element={<FamilyMembersPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
