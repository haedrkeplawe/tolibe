import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./Page/Home";
import Section from "./Page/Section";
import Single from "./Page/Single";
import Admin from "./Page/Admin";
import Login from "./Page/Login";
import AddSection from "./Page/AddSection";
import AddProduct from "./Page/AddProduct";
import EditProduct from "./Page/EditProduct";
import AboutUs from "./Page/AboutUs";
import EditSection from "./Page/EditSection";

axios.defaults.baseURL = "https://tolibe.onrender.com/";

function App() {
  return (
    <div className={"App "}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/section/:id" element={<Section />} />
        <Route path="/single/:id" element={<Single />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="user/login" element={<Login />} />
        <Route path="user/add-section" element={<AddSection />} />
        <Route path="user/add-product" element={<AddProduct />} />
        <Route path="user/edit-product/:id" element={<EditProduct />} />
        <Route path="user/edit-section" element={<EditSection />} />
      </Routes>
    </div>
  );
}

export default App;
