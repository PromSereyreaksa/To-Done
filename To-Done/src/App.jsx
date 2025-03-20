import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/landing-page";
import Login from "./Components/Login";
import SignUp from "./Components/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
