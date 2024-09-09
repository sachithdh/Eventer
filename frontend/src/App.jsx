import { About } from "./components/AboutPage/About";
import { Contact } from "./components/contactPage/Contact";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { NavBar } from "./components/NavBar";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Signup } from "./components/Signup";
import { AddEvent } from "./components/AddEvent";
import { AdminDashboard } from "./components/AdminDashboard";
import { Footer } from "./components/Footer";
import Dashboard from "./components/Dashboard";
import "./App.css";
import EventData from "./components/Event/EventData";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Event } from "./components/Event/Event";
import { EventEdit } from "./components/Event/EventEdit";

function App() {
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const jwtToken = jwtDecode(user.token);
      setUserId(jwtToken._id);
      setUserRole(jwtToken.role);
      setToken(user.token);
    }
    setLoading(false);
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  const logout = () => {
    localStorage.removeItem("user");
    setUserId("");
    setUserRole("");
    navigate("/login");
  };
  const showNavBarAndFooter = !["/signup"].includes(location.pathname);
  return (
    <>
      {/* <NavBar logout={logout} userId={userId} userRole={userRole} /> */}
      {showNavBarAndFooter && (
        <NavBar
          logout={logout}
          userId={userId}
          userRole={userRole}
          token={token}
        />
      )}
      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route
          path="login"
          element={!userId ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="signup"
          element={!userId ? <Signup /> : <Navigate to="/" />}
        />
        <Route path="create-event" element={<AddEvent />} />
        <Route path="edit-event/:eventId" element={<EventEdit />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="Event" element={<Event />} />
        <Route path="event/:eventId" element={<EventData />} />
        <Route path="event/category" element={<Event />} />
        <Route path="About" element={<About />} />
        <Route path="Contact" element={<Contact />} />
        <Route
          path="dashboard"
          element={
            userId ? (
              userRole === "user" ? (
                <Dashboard />
              ) : (
                <AdminDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      {showNavBarAndFooter && <Footer />}
    </>
  );
}

export default App;
