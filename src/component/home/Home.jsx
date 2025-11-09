
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import HomeNav from "./component/homeNav/HomeNav";
import Hero from "./component/hero/Hero";


function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Check state first (from login redirect)
  // 2. If no state, check localStorage (for page refresh)
  const userFromState = location.state?.user;
  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  const user = userFromState || userFromStorage;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    
    return <Navigate to="/" replace />;
  }


  if (userFromState && !userFromStorage) {
    localStorage.setItem("user", JSON.stringify(userFromState));
  }

  return (

    <div>
      <HomeNav user={user} onLogout={handleLogout}/>
      <Hero/>
 
    </div>
  );
}

export default Home;
