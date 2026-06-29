import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 

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
          
          {/* --- NEW: Tell the router that the live job search is a valid protected route --- */}
          <Route path="/dashboard/search" element={<Dashboard />} />
        </Route>

        {/* Catch-all Redirect */}
        {/* If a user goes to a random URL, send them to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;