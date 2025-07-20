// src/components/AuthPage.js
import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import "./AuthPage.css";

function AuthPage() {
  const [showLogin, setShowLogin] = useState(false); // false = show Register, true = show Login

  return (
    <div className="auth-wrapper">
      {/* LEFT PANEL */}
      <div className="auth-left">
        {showLogin ? (
          <>
            <h2>Hello!</h2>
            <p>Enter your details and start your journey with us</p>
            <button onClick={() => setShowLogin(false)}>Register</button>
          </>
        ) : (
          <>
            <h2>Welcome Back!</h2>
            <p>To keep connected with us please login with your personal info</p>
            <button onClick={() => setShowLogin(true)}>Login</button>
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        {showLogin ? <LoginForm /> : <RegistrationForm />}
      </div>
    </div>
  );
}

export default AuthPage;
