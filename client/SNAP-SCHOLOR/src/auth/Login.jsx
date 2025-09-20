import React, { useState } from 'react'
import Navbar from "../components/Navbar.jsx"
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import "../allcss/login.css"
import { useNavigate } from 'react-router-dom'
function Login() {
const goto = useNavigate()
    const [login, setLogin] = useState({
        email:"",
        password:"",
    })

    const hnadelonchange =(e)=>{
          const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
    }

const handellogin = async (e)=>{
  e.preventDefault();

  if (!login.email||
    !login.password
  ) {
    alert("all field required")
  }
  try{
  const finduser = await fetch('http://localhost:5000/api/login',{
    method:"POST",
      credentials: "include",
    headers:{ "Content-Type": "application/json"},
    body :JSON.stringify(login)

  })
 const userfound = await finduser.json();
 
    if (!finduser.ok) {
      alert( "Login failed Please signup your page ");
      goto("/signup")

      return;
    }

    sessionStorage.setItem("userEmail", login.email);


 alert("Login successful ✅");
 goto("/snapscholor")
  }catch(err){
 console.log(err)
  }

}

  return (
    <>
    
    <Navbar />
   <div className="main">
<label  className="labels">Email</label>
    <input type="text"className="email" name='email' value={login.email} onChange={hnadelonchange} placeholder='Enter your email' />
    <label  className="labels">Password</label>
    
    <input className="password" type="password" name="password" value={login.password} onChange={hnadelonchange} placeholder='Enter your password' />

    <button className="submits" onClick={handellogin} >
        Login
    </button>


   <p className="navigate">I Don't have an account<Link className="link" to="/signup"> Signup</Link></p>
   </div>
   <Footer />
    </>
  )
}

export default Login