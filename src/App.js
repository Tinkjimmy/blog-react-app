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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element ={<MainUserPage/>}/>
        <Route path ="/profile" element ={<Profile/>}/>
        <Route path ="/article" element ={<Article/>}/>
        <Route path ="/write" element ={<Writing/>}/>
        
              </Routes>
      
    </>
  );
}

export default App;
