import { Routes,Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MembershipPage from "./pages/MembershipPage"
import ProductsPage from "./pages/ProductsPage"
import ServicePage from "./pages/ServicesPage"
import AboutPage from "./pages/About"
import PagesNotFound from "./pages/PagesNotFound"
import UserDashboard from "./pages/User/UserDashBoardPages/UserDashBoard"
import Register from "./pages/Auth/Register"
import Login from "./pages/Auth/Login"
import ProtectedRoutes from "./components/Routes/ProtectedRoutes"
import AdminProtectedRoutes from "./components/Routes/ProtectedAdminRoutes"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import CoachDashboard from "./pages/Coach/CoachDashboard"
import ForgetPassword from "./pages/Auth/ForgetPassword"
import ResetPassword from "./pages/Auth/ResetPassword"
import { AdminProductPageModeProvider } from "./Context/AdminProductPageModeContext"
import { AdminMembershipStateProvider } from "./Context/AdminMembershipStateContext"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import AddToCart from "./pages/User/UserDashBoardPages/AddToCart"
import EsewaPaymentForm from "./pages/User/EsewaPaymentForm"
import BuyMembership from "./pages/BuyMembership"
export default function App() {
  return (
      <AdminProductPageModeProvider>
      
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgetPassword" element={<ForgetPassword/>}/>
      <Route path="/resetPassword" element={<ResetPassword/>}/>
      <Route path="/dashboard" element={<ProtectedRoutes/>}>
      <Route path="" element={<UserDashboard/>}/>
      <Route path="/dashboard/MyCart" element={<AddToCart />}/>
      
      </Route>
      <Route path="/esewa" element={<EsewaPaymentForm/>}/>

        <Route path="/admindashboard" element={<AdminProtectedRoutes/>}>
        <Route
          path=""
          element={
            <AdminMembershipStateProvider>

            <AdminProductPageModeProvider>
              <AdminDashboard />
            </AdminProductPageModeProvider>
            </AdminMembershipStateProvider>
          }
        />
        </Route>
      <Route path="/coachdashboard" element={<ProtectedRoutes/>}>
      <Route path="" element={<CoachDashboard/>}/>
      </Route>

      
      <Route path="/Membership" element={<MembershipPage/>}/>
      <Route path="/Membership/:id" element={<BuyMembership/>}/>
      
     
      <Route path="/ProductsPage" element={<ProductsPage/>}/>
      <Route path="/product/:id" element={<ProductDetailsPage/>}/>

      <Route path="/ServicePage" element={<ServicePage/>}/>
      <Route path="/AboutPage" element={<AboutPage/>}/>
      <Route path="/*" element={<PagesNotFound/>}/>

    </Routes>
      </AdminProductPageModeProvider>
    
  )
}