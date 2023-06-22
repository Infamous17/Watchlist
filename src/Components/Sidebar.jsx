import { useState } from "react";
import LoginButton from "./LoginSignUpButton";
import { auth as Auth, useAuth } from "../firebase-config";
import { signOut } from "firebase/auth";
import Login from "../photos/login.png";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [addClass, setAddClass] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  function handleMouseEnter(event) {
    const h = event.target.name;
    setAddClass(h);
  }

  function handleMouseLeave(event) {
    setAddClass(false);
  }

  async function handleLogout() {
    try {
      await signOut(Auth);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="sidebar">
      {auth.user ? (
        <div className="user-profile">
          <div className="user-avatar">
            <img src={Login} alt="Avatar" width={"60px"} />
          </div>
          <h6 style={{marginTop: "10px"}}>{auth.user.displayName}</h6>
        </div>
      ) : (
        <LoginButton />
      )}
      <ul>
        <li className="sidebar-items">
          <i
            class={
              addClass === "Home"
                ? "fa-solid fa-film fa-xl fa-bounce"
                : "fa-solid fa-film fa-xl"
            }
          ></i>
          <a
            href="/"
            name="Home"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Movies
          </a>
        </li>

        <li className="sidebar-items">
          <i
            class={
              addClass === "Shows"
                ? "fa-solid fa-tv fa-lg fa-bounce"
                : "fa-solid fa-tv fa-lg"
            }
          ></i>
          <a
            href="/shows"
            name="Shows"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            TV Shows
          </a>
        </li>

        <li className="sidebar-items">
          <i
            class={
              addClass === "Watchlist"
                ? "fa-solid fa-list fa-xl fa-bounce"
                : "fa-solid fa-list fa-xl"
            }
          ></i>
          <a
            href="/watchlist"
            name="Watchlist"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Watchlist
          </a>
        </li>

        <li className="sidebar-items">
          <i
            class={
              addClass === "Completed"
                ? "fa-solid fa-circle-check fa-xl fa-bounce"
                : "fa-solid fa-circle-check fa-xl"
            }
          ></i>
          <a
            href="/completed"
            name="Completed"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Completed
          </a>
        </li>
      </ul>
      {auth.user && (
        <div className="user-profile">
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
