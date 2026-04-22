import "./App.css";
import Landing from "./components/Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./features/userSlice";
import api from "./utils/api";
import { useEffect } from "react";

function App() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    };

    useEffect(() => {
      if(user) return; 
      const getUser = async () => {
        const userData = await fetchUser();
        if (userData) {
          dispatch(setUser(userData));
        }
      };
      getUser();
    }, []);
    

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
