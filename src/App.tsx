import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import StrategyPage from './pages/StrategyPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/strategy" element={<StrategyPage />} />
            </Routes>
        </Router>
    );
}

export default App;