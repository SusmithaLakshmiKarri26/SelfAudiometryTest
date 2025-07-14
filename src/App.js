import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import EarSelection from "./EarSelection";
import MainTest from "./MainTest";
import Audiogram from "./Audiogram";
import About from "./About";
import Navbar from "./components/Navbar";
import AudiometryTest from "./Audiometry";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/earselection" element={<EarSelection />} />
        <Route path="/test" element={<MainTest />} />
        <Route path="/audiogram" element={<Audiogram />} />
        <Route path="/about" element={<About />} />
        <Route path="/audiometry" element={<AudiometryTest />} />
      </Routes>
    </>
  );
};

export default App;
