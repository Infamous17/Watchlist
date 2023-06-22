import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Watchlist from "./Components/Watchlist";
import Completed from "./Components/Completed";
import Home from "./Components/Home";
import Shows from "./Components/Shows";
import Search from "./Components/Search";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
