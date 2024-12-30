import { Routes,Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MembershipPage from "./pages/MembershipPage"
import ProductsPage from "./pages/ProductsPage"
import ServicePage from "./pages/ServicesPage"
import AboutPage from "./pages/About"
import PagesNotFound from "./pages/PagesNotFound"
import UserDashboard from "./pages/User/UserDashBoard"
import Register from "./pages/Auth/Register"
import Login from "./pages/Auth/Login"
import ProtectedRoutes from "./components/Routes/ProtectedRoutes"
import ProtectedCoachRoutes from "./components/Routes/ProtectedCoachRoutes"
import ProtectedAdminRoutes from "./components/Routes/ProtectedAdminRoutes"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import CoachDashboard from "./pages/Coach/CoachDashboard"
import ForgetPassword from "./pages/Auth/ForgetPassword"
import ResetPassword from "./pages/Auth/ResetPassword"
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgetPassword" element={<ForgetPassword/>}/>
      <Route path="/resetPassword" element={<ResetPassword/>}/>
      <Route path="/dashboard" element={<ProtectedRoutes/>}>
      <Route path="" element={<UserDashboard/>}/>
      </Route>
      <Route path="/admindashboard" element={<ProtectedAdminRoutes/>}>
      <Route path="" element={<AdminDashboard/>}/>
      </Route>
      <Route path="/coachdashboard" element={<ProtectedCoachRoutes/>}>
      <Route path="" element={<CoachDashboard/>}/>
      </Route>
      <Route path="/Membership" element={<MembershipPage/>}/>
      <Route path="/ProductsPage" element={<ProductsPage/>}/>
      <Route path="/ServicePage" element={<ServicePage/>}/>
      <Route path="/AboutPage" element={<AboutPage/>}/>
      <Route path="/*" element={<PagesNotFound/>}/>

    </Routes>
    
  )
}