import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import MainUserPage from "./components/mainUserPage/MainUserPage";
import Profile from "./profile/Profile";
import Article from "./components/Article/Article";
import Writing from "./components/writing/Writing";

function App() {
  return (
    <>
     
     
      <Routes>
        <Route path="/blog-react-app" element={<Home />} />
        <Route path="/blog-react-app/login" element={<Login />} />
        <Route path="/blog-react-app/register" element={<Register />} />
        <Route path="/blog-react-app/main" element={<MainUserPage />} />
        <Route path="/blog-react-app/profile" element={<Profile />} />
        <Route path="/blog-react-app/article" element={<Article />} />
        <Route path="/blog-react-app/write" element={<Writing />} />
      </Routes>
   
      
    </>
  );
}

export default App;
