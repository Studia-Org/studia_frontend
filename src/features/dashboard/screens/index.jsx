import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import CourseDashboard from "./CourseDashboard.jsx";
export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/:id" element={<CourseDashboard />} />
    </Routes>
  );
};
