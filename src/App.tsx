import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage';
import StrategyPage from './pages/StrategyPage';

function App() {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false}></Toaster>
            <Router>
                <Routes>
                    <Route path="/" element={<DashboardPage/>}/>
                    <Route path="/strategy" element={<StrategyPage/>}/>
                </Routes>
            </Router>
        </>
    );
}

export default App;