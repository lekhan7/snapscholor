import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import "../allcss/main.css"
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaArrowUp } from "react-icons/fa"; // arrow icon
function Mainpage() {

    const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
      const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  

      
      window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
    }, [])
      const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll
    });
  };
    
  return (
    <>

      <Navbar />
 <div className="maincontainers">
  <div className="topSection">
    <div className="container">
      <p className="welcom">Welcome to <span>Snap Scholor</span></p>
      <p className='slogantext'>Snap it, Learn it, Master it</p>
    </div>
    <div className="sceondcontainer"><img src='main.png' className='mainimg' /></div>
    
  </div>
  <div className="learn-quize-wrapper">
<div className="learn">
      <h2>Learn</h2>
      <p>
        Snap your books and just learn it — you’re a master now!  
        <span> Snap Scholor </span> makes it easy to master your subject...
      </p>
    </div>
    <div className="quize">
      <h2>Quize</h2>
      <p>
        Based on your search history, Snap Scholor generates quizzes to help 
        you prepare smarter and master topics before exams.
      </p>
    </div></div>
 <div className="containertwo">
      <h2>Why Snap Scholor?</h2>
      <p>
        Snap Scholor transforms the way you learn. Simply <strong>snap a photo</strong>
        of your notes or upload study material, and our AI instantly turns it into
        clear, easy-to-understand explanations.
      </p>
      <p>
        Want to dive deeper? Just say <strong>"OK"</strong> and Snap Scholor
        will smartly guide you to the best <strong>YouTube tutorials</strong>
        related to your topic — no searching needed.
      </p>
      <p>
        From quick revisions to mastering complex concepts, Snap Scholor is your
        one-stop companion to <strong>study smarter, not harder.</strong>
   <p> Snap Scholor transforms the way you learn.
Simply snap a photo of your notes or upload study material, and our AI instantly turns it into clear, easy-to-understand explanations.
</p> 
Want to dive deeper? Just say "OK" and Snap Scholor will smartly guide you to the best YouTube tutorials related to your topic — no searching needed.

From quick revisions to mastering complex concepts, Snap Scholor is your one-stop companion to study smarter, not harder.
<li>
  <ul>
✨ Why learners love Snap Scholor:</ul>

<ul>📸 Instant AI explanations for your notes & textbooks</ul>

<ul>🎥 Curated video lessons from trusted sources</ul>

<ul>⏱️ Save hours of searching — get the right answer, fast</ul>

<ul>📚 Perfect for quick revision or deep learning</ul>

<ul>🤖 Always improving with AI-powered updates</ul></li>

With Snap Scholor by your side, you’re not just studying — you’re upgrading the way you learn.
      </p>
    </div>
      <div className="ratings-container">
      {/* Ratings */}
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="star" />
        ))}
      </div>

      <p className="ratings-text">
        ⭐ <span className="highlight">7 out of 10 people</span> prefer this app
      </p>

      {/* App Description */}
      <h2 className="title">Snap Scholor transforms the way you learn</h2>
      <p className="description">
        Simply <strong className="highlight">snap a photo</strong> of your notes
        or upload study material, and our AI instantly turns it into clear,
        easy-to-understand explanations.
      </p>
    </div>
    <Link to="/snap" className="start-btn">Start Your Journey With Us</Link>
  
</div>

    <button
      className={`scroll-to-top ${isVisible ? "show" : ""}`}
      onClick={scrollToTop}
    >
      <FaArrowUp />
    </button> 
       <Footer />
      </>
      )
}

      export default Mainpage