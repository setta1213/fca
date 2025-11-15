import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/login/Login";
import Register from "./component/register/Register";
import Home from "./component/home/Home";

function App() {
  return (
    <BrowserRouter basename="/fca/main/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
