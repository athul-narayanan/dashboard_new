import './App.css';
import Chat from './components/chat/Chat';
import DashBoard from "./components/Dashboard"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="" element={<DashBoard />} />
      </Routes>
    </Router>
  )
}

export default App;
