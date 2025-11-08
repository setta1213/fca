import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/login/Login";
import Register from "./component/register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
