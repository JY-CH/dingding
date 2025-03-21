import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/dashboard/DashboardPage';
import DetailPage from './pages/DetailPage';
import EditPage from './pages/EditPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
