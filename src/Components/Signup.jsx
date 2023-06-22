import { useState } from "react";
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Signup() {

  const [emailId, setEmailId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function handleChange(event){
    const name = event.target.name;
    if(name === "email"){
      setEmailId(event.target.value);
    } else if(name === "password"){
      setPassword(event.target.value);
    } else if(name === "repeatPassword"){
      setRepeatPassword(event.target.value);
    } else{
      setUserName(event.target.value);
    }
  }

  async function register() {
    if (password === repeatPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailId,
          password
        );
        
        await updateProfile(userCredential.user, {
          displayName: userName,
        });
  
        navigate("/");
      } catch (error) {
        console.log(error);
        const fullErrorMessage = error.message;
        const errorMessage = fullErrorMessage.replace("Firebase: ", "");
        setErr(errorMessage);
      }
    } else {
      setErr("Password does not match");
    }
  }  

  return (
    <div className="home-container">
      <div className="login-container">
        <p class="text-center h1 fw-bold mb-4 mx-1 mx-md-4 mt-4">Sign up</p>

        <form style={{width: "80%"}}>
          <div class="d-flex flex-row align-items-center mb-4">
            <i class="fas fa-user fa-lg me-3 fa-fw" style={{paddingBottom: "35px", backgroundColor: "#313131"}}></i>
            <div class="form-outline flex-fill mb-0" >
              <input type="text" class="form-control" name="userName" value={userName} onChange={handleChange} />
              <label class="form-label">Your Name</label>
            </div>
          </div>

          <div class="d-flex flex-row align-items-center mb-4">
            <i class="fas fa-envelope fa-lg me-3 fa-fw" style={{paddingBottom: "35px", backgroundColor: "#313131"}}></i>
            <div class="form-outline flex-fill mb-0">
              <input type="email" class="form-control" name="email" value={emailId} onChange={handleChange}/>
              <label class="form-label">Your Email</label>
            </div>
          </div>

          <div class="d-flex flex-row align-items-center mb-4">
            <i class="fas fa-lock fa-lg me-3 fa-fw" style={{paddingBottom: "35px", backgroundColor: "#313131"}}></i>
            <div class="form-outline flex-fill mb-0">
              <input type="password" class="form-control" name="password" value={password} onChange={handleChange}/>
              <label class="form-label">Password</label>
            </div>
          </div>

          <div class="d-flex flex-row align-items-center mb-4">
            <i class="fas fa-key fa-lg me-3 fa-fw" style={{paddingBottom: "35px", backgroundColor: "#313131"}}></i>
            <div class="form-outline flex-fill mb-0">
              <input type="password" class="form-control" name="repeatPassword" value={repeatPassword} onChange={handleChange} />
              <label class="form-label">Repeat your password</label>
            </div>
          </div>
          <label className="err-label">{err}</label>

          <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
            <button
              type="button"
              class="btn"
              style={{ width: "130px", height: "50px", margin: "25px 0px" }}
              onClick={register}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
