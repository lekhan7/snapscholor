import  { Route, Routes } from "react-router-dom"
import Example from './Example'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Login from "./auth/Login"
import Signups from "./auth/Signups"
import Mainpage from "./blogs/Mainpage"
import ProtectedRoute from "../Protectroute"
import Starter from "./blogs/Starter"
import Askai from "./blogs/Askai"
import Quize from "./blogs/Quize"
import Learn from "./blogs/Learn"
import Userdetails from "./auth/Userdetails"
function App() {


  return (
    <>
<Routes>

  <Route  path="/" element={<Login /> } />
    <Route  path="/signup" element={<Signups/> } />
        <Route  path="/snap" element={<ProtectedRoute ><Starter/></ProtectedRoute> } />
          <Route  path="/quiz" element={<ProtectedRoute ><Quize/></ProtectedRoute> } />
        <Route path="/aianswer" element={<ProtectedRoute > <Askai /></ProtectedRoute>} />
     <Route  path="/snapscholor" element={ <ProtectedRoute ><Mainpage /></ProtectedRoute>  } />
     <Route  path="/learn" element={ <ProtectedRoute ><Learn /></ProtectedRoute>  } /> 
      <Route  path="/user" element={ <ProtectedRoute ><Userdetails /></ProtectedRoute>  } />
    

</Routes>
    </>
  )
}

export default App
