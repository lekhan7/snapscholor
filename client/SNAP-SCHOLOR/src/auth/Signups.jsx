import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import "../allcss/signup.css"

function Signups() {
const goto = useNavigate()
  const [signups, setSignups] = useState(
    {
      uname:"",
      age:"",
      email:"",
      password:"",
      conformpass:""
    }
  )
   const handelonchange =(e)=>{
          const { name, value } = e.target;
    setSignups((prev) => ({ ...prev, [name]: value }));
    }
   const handelsubmit = async (e)=>{
  e.preventDefault();

  if (
    !signups.uname||
    !signups.age||
    !signups.email||
    !signups.password||
    !signups.conformpass
  ) {
    alert("Fill The form details")
    return;

  }
  if (signups.password !== signups.conformpass) {
      alert("Passwords do not match ❌");
      return;
    }
  try {
    await fetch("http://localhost:5000/api/signups",{
      method:"POST",
      headers:{ "Content-Type": "application/json" },
      body:JSON.stringify(signups)
    })
    alert("Signup Done ✅ Please log in");
    goto("/")
  } catch (error) {
    console.log(error)
    alert("server down! try after some time")
  }
   }
  return (
    <>
    <Navbar />



   <div className="signup-container">
  <label >Name</label><input type="text" name="uname" value={signups.uname} onChange={handelonchange} />
  <label >Age</label><input type="number" name="age" value={signups.age} onChange={handelonchange} />
  <label >Email</label><input type="email" name="email" value={signups.email} onChange={handelonchange} />
  <label >Password</label><input type="password" name="password" value={signups.password} onChange={handelonchange} />
  <label >ConformPassword</label><input type="password" name="conformpass" value={signups.conformpass} onChange={handelonchange} />
  <button className="sigup" onClick={handelsubmit}>Sign Up</button>
  <p>I have an account <Link to="/">Login</Link></p>
</div>

    <Footer />
    </>
  )
}

export default Signups