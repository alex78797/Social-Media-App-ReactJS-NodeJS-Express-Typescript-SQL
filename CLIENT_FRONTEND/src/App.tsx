import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./authPages/Login";
import Register from "./authPages/Register";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import DeleteAccount from "./authPages/DeleteAccount";
import ResetPassword from "./authPages/ResetPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddPost from "./pages/AddPost";
import PersistLogin from "./authComponents/PersistLogin";
import { PrivateOutlet } from "./authComponents/PrivateOutlet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route element={<PrivateOutlet />}>
              <Route index element={<Home />} />
              <Route path="deleteAccount" element={<DeleteAccount />} />
              <Route path="resetPassword" element={<ResetPassword />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="addPost" element={<AddPost />} />
            </Route>
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
