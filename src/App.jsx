import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/login";
import RegisterForm from "./components/register";
import KaryawanDashboard from "./components/karyawandashboard";
import AdminDashboard from "./components/admindashboard";
import ManageAccounts from "./components/manageaccounts";
import Capex from "./components/capex";
import Performance from "./components/performance";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard/karyawan" element={<KaryawanDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/manage-accounts" element={<ManageAccounts />} />
        <Route path="/capex" element={<Capex />} />
        <Route path="/performance" element={<Performance />} />
      </Routes>
    </>
  );
}

export default App;
