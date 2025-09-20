import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useEffect } from 'react'
import "../allcss/userdetails.css"
import { useNavigate } from 'react-router-dom'

function Userdetails() {


const [user, setUser] = useState([])
const [snapCount, setSnapCount] = useState(0);




const handeluseremail = async ()=>{
try {
     const ask = await fetch("http://localhost:5000/api/getuserdetails", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },

      });


      if (!ask.ok) {
        navigate("/"); // invalid user → go back to login
        return;
      }
       const data = await ask.json();
       setUser([data]);
        const snapsRes = await fetch(`http://localhost:5000/api/questions/${data.email}`);
    if (snapsRes.ok) {
      const snaps = await snapsRes.json();
      setSnapCount(snaps.length);  // count snaps
    } else {
      setSnapCount(0);
    }
  }
      




catch (error) {
          console.log(error);
      alert("Error fetching user from server");
}

}


useEffect(() => {
handeluseremail()
}, [])
const navigate = useNavigate();

const logout = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include", // important to send cookies
    });

    if (response.ok) {
      alert("Logged out successfully!");
      navigate("/"); // redirect to login/home
    } else {
      alert("Logout failed");
    }
  } catch (error) {
    console.log(error);
    alert("Error contacting server");
  }
};

  return (
<>


<Navbar />

<div className="usermaincontain">
    
    <h1 className='welcome'> {user.map((use,i)=>(
<p key={i}> HI  {use.uname}</p>
        ))}</h1>
    <div className="userdetails">

        
{user.map((use,i)=>(
    
      <p key={i}>Email {use.email}</p>
        
))}

        
{user.map((use,i)=>(
    
      <p key={i}>Age {use.age}</p>
        
))}
<p>Total Snaps Taken: {snapCount}</p>


    </div>
    <button className="logout" onClick={logout} >Logout</button>
</div>
<Footer/>
</>
  )
}

export default Userdetails