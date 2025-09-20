const mongoose = require("mongoose");
const dontenv = require("dotenv")
dontenv.config();


const signupsDB = mongoose.createConnection("mongodb://localhost:27017/signups")
const questionDB = mongoose.createConnection("mongodb://localhost:27017/question")
const quizeDB = mongoose.createConnection("mongodb://localhost:27017/quize")
const learnDB = mongoose.createConnection("mongodb://localhost:27017/learn")

const signupsSchema = new mongoose.Schema({
    uname: String,

    age: Number,
    email: String,
    password: String,
    conformpass: String,


});
const learnSchema = new mongoose.Schema({
   question:String,
   answer:String





});




const quizeSchema = new mongoose.Schema(
  {
    email: String,
    quiz: [
      {
        question: { type: String, required: true },
        options: { type: String, required: true }, // "A|B|C|D"
        answer: { type: String, required: true },  // "A", "B", "C", or "D"
      },
    ],
  },
  { timestamps: true }
);

const questionschema =new mongoose.Schema({
    questions:String,
    email:String,
    aianswer:String,
},{ timestamps: true })

/* [
  {
    question: "What is ...?",
    options: ["A) ...", "B) ...", "C) ...", "D) ..."],
    answer: "A"
  },
  ...
]*/



const Signups = signupsDB.model("signups", signupsSchema)
const Question = questionDB.model("question",questionschema)
const Quize = quizeDB.model("quize",quizeSchema)
const Learn = learnDB.model("learn",learnSchema)


module.exports = { Signups,Question,Quize,Learn }