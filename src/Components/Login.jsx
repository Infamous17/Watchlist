import { MDBBtn, MDBInput, MDBIcon } from "mdb-react-ui-kit";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    const name = event.target.name;
    if(name === "email"){
      setEmailId(event.target.value);
    } else{
      setPassword(event.target.value);
    }
  }

  async function login(){
    try {
      await signInWithEmailAndPassword(auth, emailId, password);
      navigate("/");
    } catch (error) {
      console.log(error);
      setErr("Incorrect ID or password");
    }
  }

  return (
    <div className="home-container">
      <div className="login-container">
        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
        <p className="text-white-50 mb-5">
          Please enter your login and password!
        </p>

        <MDBInput
          wrapperClass="mb-4 w-100"
          labelClass="text-white"
          label="Email address"
          id="formControlLg"
          type="email"
          size="lg"
          onChange={handleChange}
          value={emailId}
          name="email"
        />
        <MDBInput
          wrapperClass="mb-4 w-100"
          labelClass="text-white"
          label="Password"
          id="formControlLg"
          type="password"
          size="lg"
          onChange={handleChange}
          value={password}
          name="password"
        />

        <label className="err-label">{err}</label>

        <button
          className="btn"
          size="lg"
          style={{ width: "130px", height: "50px", margin: "25px 0px" }}
          onClick={login}
        >
          Login
        </button>
        
        <p className="small mb-3 pb-lg-2">
          <a class="text-white-50" href="#!">
            Forgot password?
          </a>
        </p>

        <div className="d-flex flex-row mt-3 mb-4">
          <MDBBtn tag="a" color="none" className="m-2 fab-icon-width-height">
            <MDBIcon fab icon="facebook-f" size="lg" />
          </MDBBtn>

          <MDBBtn tag="a" color="none" className="m-2 fab-icon-width-height">
            <MDBIcon fab icon="twitter" size="lg" />
          </MDBBtn>

          <MDBBtn tag="a" color="none" className="m-2 fab-icon-width-height">
            <MDBIcon fab icon="google" size="lg" />
          </MDBBtn>
        </div>

        <div>
          <p className="mb-0">
            Don't have an account?{" "}
            <a href="/signup" class="text-white-50 fw-bold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
