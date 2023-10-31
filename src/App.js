import logo from './logo.svg';
import './App.css';

import Login from './pages/authentication/Login';
import Navbar from './components/navbar/Navbar';
import Analytics from './pages/analytics/Analytics';
import Dashboard from './pages/dashboard/Dashboard';
import QuizCreation from './pages/quizCreation/QuizCreation';
import Modal from './components/modal/Modal';
import QuizAnalysis from './pages/quizAnalysis/QuizAnalysis';
import QuizTest from './pages/quizTest/QuizTest';
import Signup from './pages/authentication/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Analytics />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/analytics"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/quiz-creation"
            element={<Modal children={<QuizCreation />} />}
          />
          <Route
            path="/quiz-analysis/:id"
            element={
              <>
                <Navbar />
                <QuizAnalysis />
              </>
            }
          />
          <Route path="/quiz/:id" element={<QuizTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
