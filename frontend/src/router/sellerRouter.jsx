import { Route } from "react-router-dom";
import Home from '../pages/Home';
import Delete from "../pages/delete";
import Payment from '../pages/Payment';
import PaymentView from '../pages/PaymentView';
import AddSeller from '../pages/AddSeller';
import Client from '../pages/client';
import Dashboard from '../pages/Dashboard';



export const SellerRouter = (
  <>
        <Route path="/" element={<Dashboard />} />
        <Route path="home" element={<Home />} />
        <Route path="delete" element={<Delete />} />
        <Route path="payment" element={<Payment />} />
        <Route path="paymentView" element={<PaymentView />} />
        <Route path="addSeller" element={<AddSeller />} />
        <Route path="client" element={<Client />} />
  </>
);

