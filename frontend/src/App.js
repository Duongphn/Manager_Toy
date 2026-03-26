import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import MyToys from "./pages/MyToys";
import AddToy from "./pages/AddToy";
import EditToy from "./pages/EditToy";
import BrowseToys from "./pages/BrowseToys";
import MyBorrows from "./pages/MyBorrows";
import "./index.css";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/my-toys" element={<PrivateRoute><MyToys /></PrivateRoute>} />
      <Route path="/toys/add" element={<PrivateRoute><AddToy /></PrivateRoute>} />
      <Route path="/toys/edit/:id" element={<PrivateRoute><EditToy /></PrivateRoute>} />
      <Route path="/browse" element={<PrivateRoute><BrowseToys /></PrivateRoute>} />
      <Route path="/borrows" element={<PrivateRoute><MyBorrows /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
