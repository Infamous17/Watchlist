import { useState } from "react";
import logo from "../photos/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const search = async (e) => {
    e.preventDefault();
    try {
      const url =
        "https://api.themoviedb.org/3/search/multi?api_key=" + process.env.REACT_APP_API_KEY + "&query=" +
        query;
      const res = await fetch(url);
      const data = await res.json();
      navigate("/search", {
        state: { output: data.results, fromHeader: true },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandler = (e) => setQuery(e.target.value);
  const showSearchBar =
    location.pathname !== "/login" && location.pathname !== "/signup";
  return (
    <div className="header">
      <a href="/">
        <img src={logo} className="logo" alt="Logo" />
      </a>
      <div class="mt-3 inputs">
        {showSearchBar && (
          <form className="search-form" onSubmit={search}>
            <input
              name="query"
              type="text"
              class="form-control"
              placeholder="Search"
              value={query}
              onChange={changeHandler}
              autoComplete="off"
            />
            <button type="submit" className="search">
              <a href="/search">
                <i class="fa-solid fa-magnifying-glass fa-xl search"></i>
              </a>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Header;
