import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../allcss/askai.css";
import { FaRegCopy, FaCheck } from "react-icons/fa";

function Askai() {
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState([]); // all questions
  const [displayQP, setDisplayQP] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);

  // Get user email
  const getUserEmail = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/get/users", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email);
     }
    } catch (err) {
      console.error("Error getting user from token:", err);
    }
  };

  // Fetch all questions
  const fetchHistory = async (userEmail) => {
    try {
      const res = await fetch(`http://localhost:5000/api/questions/${userEmail}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setHistory(data);
          if (data.length > 0) {
            displayQuestion(data[0]); // display most recent by default
          }
        }
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  useEffect(() => {
    if (!email) getUserEmail();
    else fetchHistory(email);
  }, [email]);

  // Display question + answer
  const displayQuestion = (questionObj) => {
    setDisplayQP(questionObj.questions);
    setAiAnswer(questionObj.answer || "");
    setTypedAnswer(questionObj.answer || "");
  };

  const handleAskAI = async () => {
    if (!displayQP) return;

    setAiAnswer("");
    setTypedAnswer("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/askai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: displayQP, email }),
      });
      const data = await response.json();
      setLoading(false);
      setAiAnswer(data.answer);
      typeAnswer(data.answer);
    } catch (err) {
      console.error("Error fetching AI answer:", err);
      setLoading(false);
      setAiAnswer("Error getting AI answer.");
      setTypedAnswer("Error getting AI answer.");
    }
  };

  const typeAnswer = (text) => {
    setTypedAnswer("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypedAnswer((prev) => prev + text.charAt(i));
        i++;
      } else clearInterval(interval);
    }, 20);
  };

  const handleYoutube = () => {
    if (!displayQP) return;
    const n = 40
    const cropendqp =displayQP.split(" ").slice(0, n).join(" ");
    window.open(`https://www.youtube.com/results?search_query=${cropendqp}`, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="allcontainer">
        <h1>Welcome to SnapAI — Find your answer now {email}</h1>
        <div className="content">
          {/* History Sidebar */}
          <div className="history">
            <h2 className="hhead">History</h2>
            {history.length === 0 && <p>No previous questions</p>}
            {history.map((q, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => displayQuestion(q)}
              >
                <small>Q: {q.questions.slice(0, 40)}{q.questions.length > 40 ? "..." : ""}</small>
              </div>
            ))}
          </div>

          {/* Main Area */}
          <div className="main-area">
            <div className="screen">{displayQP}</div>

            <div className="answer">
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>⏳ Wait for the answer please...</p>
                </div>
              ) : (
                <>
                  <pre className="answer-text">{typedAnswer}</pre>
                  {aiAnswer && (
                    <button
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(aiAnswer);
                        setCopy(true);
                        setTimeout(() => setCopy(false), 3000);
                      }}
                    >
                      {copy ? <FaCheck className="text-green-600" /> : <FaRegCopy />}
                      {copy ? "Copied!" : "Copy"}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="questions">
              <button onClick={handleAskAI} className="ask">ASK</button>
              <button onClick={handleYoutube} className="gotoyoutube">Ask YouTube</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Askai;
