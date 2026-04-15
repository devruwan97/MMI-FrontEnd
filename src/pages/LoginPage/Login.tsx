import "./Login.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <div className="left-container"></div>

      <div className="right-container">
        <div className="right-container__box">

          <div>
            <h2 className="right-container__h2">Nice to see you!</h2>
            <p className="right-container__p">
              Enter your email and password to sign in
            </p>
          </div>

          <div className="input-container">
            <label className="right-container__label">Email</label>
            <input
              type="text"
              className="right-container__input"
              placeholder="Your email address"
            />

            <label className="right-container__label">Password</label>

            {/* 👇 PASSWORD WITH ICON */}
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="right-container__input"
                placeholder="Your password"
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="toggle-container">
            <input type="checkbox" className="toggle-box" />
            <label>Remember me</label>
          </div>

          <button className="btn">SIGN IN</button>

          <p className="right-container__bottom-text">
            Need help? Contact admin.
          </p>

          <p className="right-container__bottom-text">
            <a href="/forgot-password">Forgot password?</a>
        </p>

        </div>
      </div>
    </div>
  );
}

export default Login;