const express = require("express");
const router = express.Router();
const { Signups, Question,Quize,Learn} = require("../modules/db.js");
const jwts = require("jsonwebtoken");
const bcrypts = require("bcryptjs");
const dotenv = require("dotenv");
const multer = require("multer");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");
const authMiddleware = require("../midelwares/authMiddleware.js");




dotenv.config();

const upload = multer();

router.post("/ocr-space", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { apikey: process.env.OCRSPACE_API_KEY },
      body: formData,
    });

    const data = await response.json();
    const extractedText =
      data.ParsedResults?.[0]?.ParsedText || "No text detected";

    res.json({ text: extractedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OCR failed" });
  }
});

/* ===================== SIGNUP ===================== */
router.post("/signups", async (req, res) => {
  try {
    const signupsdata = new Signups(req.body);
    const salt = await bcrypts.genSalt(10);
    signupsdata.password = await bcrypts.hash(signupsdata.password, salt);
    await signupsdata.save();
    console.log("Document saved successfully");
    res.send(signupsdata);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving example");
  }
});

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const finduser = await Signups.findOne({ email });
    if (!finduser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const userfound = await bcrypts.compare(password, finduser.password);
    if (!userfound) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const settoken = jwts.sign(
      { userID: finduser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("settoken", settoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.json({ message: "Login successful", settoken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== LOGOUT ===================== */
router.post("/logout", async (req, res) => {
  try {
    res.cookie("settoken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0),
    });
    res.json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
  }
});

/* ===================== SAFEROUTE ===================== */
router.post("/saferoute", async (req, res) => {
  try {
    const token = req.cookies?.settoken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwts.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await Signups.findById(decoded.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== SAVE QUESTION ===================== */
router.post("/question", async (req, res) => {
  try {
    const questiondata = new Question(req.body);
    await questiondata.save();
    console.log("Question saved successfully");
    res.send(questiondata);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving question" });
  }
});

/* ===================== ASK AI (OpenRouter) ===================== */
/* ===================== ASK AI (OpenRouter) ===================== */
router.post("/askai", async (req, res) => {
  const { question, email } = req.body;

  if (!question || !email) {
    return res.status(400).json({ error: "Question and email are required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
         max_tokens: 1000// ✅ limit response length
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const aiAnswer =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "No response from AI";

    const questionData = new Question({
      email,
      questions: question,
      aianswer: aiAnswer,
    });

    await questionData.save();

    res.json({ answer: aiAnswer });
  } catch (err) {
    console.error("Error calling AI:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});


router.post("/learnai",async(req,res)=>{
const question = req.body.question;  // ✅ not req.body

  try{
   
const ask = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          { role: "system", content: `You are an AI tutor for students only.
- Only answer academic or study-related questions appropriate for school/college/university level.
- NEVER respond to questions about sex, nudity, violence, politics, or anything adult.
- If the question is off-topic or inappropriate, reply with: "I can only answer study-related questions."
- Use simple, student-friendly language.` },
          { role: "user", content: question },
        ],
        
      }),
    });

const answer = await ask.json();
    console.log("OpenRouter response:", JSON.stringify(answer, null, 2));
const textAnswer = answer?.choices?.[0]?.message?.content || "No response";

    const learndata = new Learn({
     
      question: question,
      answer: textAnswer,
    });
     await learndata.save()
     res.json({ answer: answer });
  }catch(error){

console.log("this is eror in backend",error)
  }
})


router.post("/getquize", async (req, res) => {
  const { email } = req.body;

  try {
    const allAnswers = await Question.find({ email }).sort({ createdAt: -1 });
    const combinedAnswers = allAnswers.map((q) => q.aianswer).join("\n");

    const prompt = `
Create 40 multiple-choice quiz questions only from and dont add any extara questions:
${combinedAnswers}

Format each as:
Q: <question>
A) <option 1>
B) <option 2>
C) <option 3>
D) <option 4>
Answer: <correct option letter>
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          { role: "system", content: "You are a quiz generator assistant." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const quizText =
      data?.choices?.[0]?.message?.content || "No quiz generated.";

    // 🔹 Parse each Q, Options, Answer
    const quizArray = [];
    const blocks = quizText.split(/\n\n/).filter(Boolean);

    blocks.forEach((block) => {
      const qMatch = block.match(/Q:\s*(.*)/i);
      const aMatch = block.match(/A\)\s*(.*)/i);
      const bMatch = block.match(/B\)\s*(.*)/i);
      const cMatch = block.match(/C\)\s*(.*)/i);
      const dMatch = block.match(/D\)\s*(.*)/i);
      const ansMatch = block.match(/Answer:\s*([A-D])/i);

      if (qMatch && aMatch && bMatch && cMatch && dMatch && ansMatch) {
        quizArray.push({
          question: qMatch[1].trim(),
          options: `A) ${aMatch[1].trim()} | B) ${bMatch[1].trim()} | C) ${cMatch[1].trim()} | D) ${dMatch[1].trim()}`,
          answer: ansMatch[1].trim(),
        });
      }
    });

    // 🔹 Save into DB
   const quizedata = new Quize({
  email,
  quiz: quizArray, // array of {question, options, answer}
});
await quizedata.save();

    
    console.log("Quiz saved successfully");

    res.json({ quiz: quizArray, saved: true });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});





/* ===================== GET LOGGED USER ===================== */
/* ===================== GET USER DETAILS ===================== */
router.get("/getuserdetails", async (req, res) => {
  try {
    const token = req.cookies?.settoken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwts.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await Signups.findById(decoded.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("Backend error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== PROTECTED ROUTE USING MIDDLEWARE ===================== */
router.get("/get/users", authMiddleware, async (req, res) => {
  try {
    res.json({ email: req.user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
/* ===================== GET LOGGED USER ===================== */

/* ===================== GET QUESTIONS BY EMAIL ===================== */
router.get("/questions/:email", async (req, res) => {
  try {
    const questions = await Question.find({ email: req.params.email }).sort({
      createdAt: -1,
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
