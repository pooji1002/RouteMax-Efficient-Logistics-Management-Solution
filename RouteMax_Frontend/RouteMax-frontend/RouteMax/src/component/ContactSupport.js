import React from "react";
import "./ContactSupport.css";
import { FaHeadset, FaEnvelope, FaUser } from "react-icons/fa";

const ContactSupport = () => {
  return (
    <div className="contact-container">
      <div className="contact-box">
        <div className="contact-header">
          <FaHeadset size={40} className="icon" />
          <h2>We're Here to Help!</h2>
          <p>Feel free to reach out to us with any questions or concerns.</p>
        </div>

        <form className="contact-form">
          <label>
            <FaUser className="input-icon" />
            <input type="text" placeholder="Your Name" required />
          </label>
          <label>
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Your Email" required />
          </label>
          <label>
            <textarea placeholder="Your message..." required></textarea>
          </label>

          <button type="submit">Send Message</button>
        </form>

        <div className="support-note">
          Our support team will get back to you within 24 hours. 🚀
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
