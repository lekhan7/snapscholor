import React from 'react'
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../allcss/learn.css"
import { useState } from 'react'
function Learn() {
    const [question, setQuestion] = useState("")
    const [dispalyq, setDispalyq]= useState([])
    const [answer, setAnswer] = useState([])
     const [loading, setLoading] = useState(false)
    const handelonchange = (e)=>{
        setQuestion(e.target.value)
    }

    const handelaskai = async()=>{
        setLoading(true)
        setDispalyq(question)
        setQuestion("")
        try {
            const askai = await fetch("http://localhost:5000/api/learnai",{
                 method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({question}),
            })
            const gotanswer = await askai.json()
            
    const textAnswer = gotanswer?.answer?.choices?.[0]?.message?.content || "No response received.";

    // store as array
    setAnswer(prev => [...prev, textAnswer]);
setLoading(false)
        } catch (error) {
            console.log("error in frountend",error)
        }
    }
  return (
    <>
    <Navbar />


<div className="learncontainers">
    <h1 className="learnheadings"></h1>

    <div className="learncompartment">
        
        
        <h1 className="learnheadings">Welcome Increase Your Knlowedge By asking Ur AI</h1>
        <div className="displayedquestion">

        {dispalyq}
        </div>
            <div className="answer">

        {loading ?  "Loading....." :"  "}
               {answer.map((answers,i)=>(
                    <p key={i}>{answers}</p>

            ))}  
        
            </div>

           
    </div>


    <div className="askquestion">
        <input type="text"  onChange={handelonchange} placeholder="Ask and learn " value={question} name='question' className="inqp" />
        <button onClick={handelaskai}>Ask</button>
        </div>
</div>

    <Footer/>
    
    
    </>
  )
}

export default Learn