import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import HomeNav from "./component/homeNav/HomeNav";
import Hero from "./component/hero/Hero";
import Manage from "./component/manage/Manage";
import ManageClassRoom from "./component/manageClassRoom/ManageClassRoom";
import Attendance from "./component/attendance/Attendance";
import AttendanceDashboard from "./component/attendance/AttendanceDashboard";
import AttendanceReport from "./component/attendance/AttendanceReport";
import ExamsHome from "./component/exams/ExamsHome";
import AdminUsers from "./component/admin/AdminUsers";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("checkin"); // Default view

  const userFromState = location.state?.user;
  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  const user = userFromState || userFromStorage;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (userFromState && !userFromStorage) {
    localStorage.setItem("user", JSON.stringify(userFromState));
  }

  return (
    <div>
      <HomeNav user={user} onLogout={handleLogout} />
      <Hero user={user} onViewChange={handleViewChange} />

      <main className="p-4 md:p-8">
        {/* Conditional Rendering based on activeView */}
        {activeView === "checkin" && <Attendance user={user} />}
        {activeView === "stats" && <AttendanceDashboard user={user} />}
        {activeView === "records" && <AttendanceReport user={user} />}
        {activeView === "manage" && <Manage user={user} />}
        {activeView === "manageClassRoom" && <ManageClassRoom user={user} />}
        {activeView === "exams" && <ExamsHome user={user} />}
        {activeView === "admin" && <AdminUsers user={user} />}
      </main>
    </div>
  );
}

export default Home;
