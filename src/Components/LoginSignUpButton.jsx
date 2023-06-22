function LoginButton() {
  return (
    <div class="button-container">
      <a href="/signup">
        <button className="btn">SignUp</button>
      </a>
      <a href="/login">
        <button className="btn">Login</button>
      </a>
    </div>
  );
}

export default LoginButton;
