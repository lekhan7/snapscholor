import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tesseract from "tesseract.js";
import "../allcss/starter.css";
import { Link } from "react-router-dom";

function Starter() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  // handle file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const findemail = async () => {
    try {
      const data = await fetch("http://localhost:5000/api/get/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const usersdatas = await data.json();
      if (usersdatas.email) {
        setEmail(usersdatas.email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  useEffect(() => {
    findemail();
  }, []);

  // ✅ Preprocess image before OCR
  const preprocessImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Convert to grayscale + increase contrast
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

          // Grayscale
          data[i] = data[i + 1] = data[i + 2] = avg > 128 ? 255 : 0; // Thresholding

          // Optional: increase contrast
          data[i] = data[i] > 128 ? 255 : 0;
          data[i + 1] = data[i + 1] > 128 ? 255 : 0;
          data[i + 2] = data[i + 2] > 128 ? 255 : 0;
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => resolve(blob));
      };
    });

  // extract text from uploaded image
const extractTextFromImg = async () => {
  if (!image) return alert("Upload image first!");
  setLoading(true);

  const formData = new FormData();
  formData.append("file", image);

  try {
    const res = await fetch("http://localhost:5000/api/ocr-space", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.text) {
      setText(data.text);

      // Save to backend Questions collection
      await fetch("http://localhost:5000/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: data.text, email }),
      });

      alert("Text extracted! You can now ask AI.");
    } else {
      alert("No text detected");
    }
  } catch (err) {
    console.error(err);
    alert("OCR failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Navbar />

      <div className="upload">
        <h2 className="hedlines">Upload a pic of your question</h2>
        <input type="hidden" value={email} readOnly />

        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
        />

        <button className="extarct" onClick={extractTextFromImg}>
          {loading ? "Extracting..." : "Extract Text"}
        </button>

        <h2>Extracted text</h2>
        <h3 className="extractedtext">{text}</h3>
        <Link to="/aianswer" className="aians">
          Ask Ai
        </Link>
      </div>

      {/* Hidden canvas for preprocessing */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <Footer />
    </>
  );
}

export default Starter;
