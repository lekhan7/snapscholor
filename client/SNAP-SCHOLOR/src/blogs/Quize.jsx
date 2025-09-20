import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import "../allcss/quize.css"

function QuizPage({ email }) {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const QUESTIONS_PER_PAGE = 5;

  // Timer logic
  useEffect(() => {
    let timer;
    if (!showResults && quizzes.length > 0) {
      timer = setInterval(() => setTimeTaken(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [quizzes, showResults]);

  // Fetch quiz from backend
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/getquize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (Array.isArray(data.quiz)) {
        setQuizzes(data.quiz);
      } else {
        alert("No quiz data found!");
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save selected option
  const handleChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  // Submit quiz & calculate score
  const handleSubmit = () => {
    let correctCount = 0;
    quizzes.forEach((q, index) => {
      if (answers[index] && answers[index].trim().startsWith(q.answer)) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  // Pagination
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuizzes = quizzes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(quizzes.length / QUESTIONS_PER_PAGE);

  return (


    <>
  <Navbar />

   <div className="quiz-container">
  <h1>📘 Quiz Generator</h1>

  {!quizzes.length && (
    <button className="quiz-button quiz-button-next" onClick={fetchQuiz} disabled={loading}>
      {loading ? <Loading /> : "Generate Quiz"}
    </button>
  )}

  {quizzes.length > 0 && !showResults && (
    <>
      <p className="quiz-timer">⏱ Timer: {timeTaken}s</p>
      <form onSubmit={(e) => e.preventDefault()}>
        {currentQuizzes.map((q, index) => {
          const globalIndex = startIndex + index;
          return (
            <div key={globalIndex} className="quiz-card">
              <p>
                <strong>
                  {globalIndex + 1}. {q.question}
                </strong>
              </p>
              {q.options.split("|").map((opt, i) => (
                <label key={i} className="quiz-option">
                  <input
                    type="radio"
                    name={`q-${globalIndex}`}
                    value={opt.trim()}
                    checked={answers[globalIndex] === opt.trim()}
                    onChange={() => handleChange(globalIndex, opt.trim())}
                  />
                  {opt.trim()}
                </label>
              ))}
            </div>
          );
        })}

        <div className="quiz-pagination">
          <button
            type="button"
            className="quiz-button quiz-button-prev"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {currentPage < totalPages - 1 ? (
            <button
              type="button"
              className="quiz-button quiz-button-next"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="quiz-button quiz-button-next"
              onClick={handleSubmit}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </form>
    </>
  )}

  {showResults && (
    <div className="quiz-results">
      <h2>✅ You scored {score} / {quizzes.length}</h2>
      <p>⏱ Total time: {timeTaken}s</p>
      <h3>Correct Answers:</h3>
      {quizzes.map((q, index) => (
        <p key={index}>
          <strong>{index + 1}. {q.question}</strong><br />
          Your answer: <span className="user-answer">{answers[index] || "Not answered"}</span><br />
          Correct answer: <span className="correct-answer">{q.answer}</span>
        </p>
      ))}
    </div>
  )}
</div>

    <Footer />
    </>
  );
}

export default QuizPage;
