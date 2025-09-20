import React from "react";
import "../allcss/footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h2>Snap Scholar</h2>
          <p>
            Snap Scholar is your learning companion. <br />
            Snap it, Learn it, Master it 🚀
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h3>About Us </h3>
        <span>
        <p>
          HI! This is the web where u can snapit or take a pic of your boks or resders and uploade it and itr gets u a where good result of the questions or taken pics 
          now learn it by clicking the go option it navigates to youtube with the sanp uhave give and master your readings
          using SNAP-SCHOLOR 
        </p>


        </span>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: support@snapscholar.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

        {/* Social Media */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Snap Scholar | All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
