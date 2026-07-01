import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Settings from "./components/Settings";
// Note: You can remove the SavedJobs import here since Dashboard.tsx handles it directly now!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        {/* Anything inside this Route element requires a valid token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/jobs" element={<Dashboard />} />
          <Route path="/dashboard/resumes" element={<Dashboard />} />
          <Route path="/dashboard/search" element={<Dashboard />} />
          
          {/* --- NEW: Tell the router that saved-jobs is a valid protected dashboard route --- */}
          <Route path="/dashboard/saved-jobs" element={<Dashboard />} />
        </Route>

        {/* Catch-all Redirect */}
        {/* If a user goes to a random URL, send them to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;