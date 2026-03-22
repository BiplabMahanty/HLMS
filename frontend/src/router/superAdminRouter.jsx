import { Route } from "react-router-dom";
import SuperAdminDashboard from '../pages/SuperAdminDashboard';
import AdminCreate from '../pages/AdminCreate';
import Dashboard from '../pages/Dashboard';
import AddLotteryType from '../pages/AddLotteryType';
import SellerSuspend from '../pages/SellerSuspend';

export const SuperAdminRouter = (
  <>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="old-dashboard" element={<SuperAdminDashboard />} />
    <Route path="admin-create" element={<AdminCreate />} />
    <Route path="add-lottery-type" element={<AddLotteryType />} />
    <Route path="seller-suspend" element={<SellerSuspend />} />
  </>
);
