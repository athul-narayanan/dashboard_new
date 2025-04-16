import React, {useState, useEffect} from "react"
import "./Chat.css"
import { triggerGemini } from "../../services/dashboard";
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



const Chat = (props) => {
  const [question, setQuestion] = useState('')
  const [path, setPath] = useState('')
  const [dashBoard, setDashBoard] = useState("")
  const [qnsList, setQnsList] = useState([])
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    setPath(localStorage.getItem("path"))
    setDashBoard(localStorage.getItem("dashboard" ))
  },[])

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  const askGemini = (event)=>{
    if (event.key === 'Enter') {
        handleSubmit(question);
      }
  }

  const handleSubmit = async()=>{
     try{
        setIsLoading(true)
        const result = await triggerGemini(question, path)
        let list = [...qnsList]
        list.push({question, answer: result.answer})
        setQnsList(list)
        setQuestion('')
        setIsLoading(false)
     }  catch(error){
        setIsLoading(false)
        console.log(error)
     }
     
  }

  return(
    <>
    {isLoading && <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
    </Backdrop>}
    <div className="container">
        <header className="header">
            <h1 className="heading">File Q&A Center</h1>
            <h2 className="dashboard">{dashBoard}</h2>
            <button onClick={()=>{navigate('/')}} className="move-back">Go to dashboard</button>
        </header>
        <div className="output">
            {qnsList.map(qns=> (
            <div className="qns-item">
                <p className="question">{qns.question}</p>
                <p className="answer">{qns.answer}</p>
            </div>))}
        </div>
        <div className="input">
            <input placeholder="ask me anything" 
                value={question} 
                onKeyDown={(event)=>askGemini(event)}
                onChange={(event)=> handleChange(event)}
            />
        </div>
    </div>
    </>
  )
}

export default Chat