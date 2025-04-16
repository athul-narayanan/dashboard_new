import { useEffect, useState } from 'react';
import TableauReport from 'tableau-react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css"


const DashBoardItem = (props) => {
  const {path, navigation } = props
  const [dashBoards, setDashBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)
  const navigate = useNavigate();
  const handleClick = (dashBoard) => {
    setSelectedBoard(dashBoard)
  };

  const navigateToChat = ()=>{
    const [_,mainPath, childPath] = path.split("/")
    localStorage.setItem("path", childPath )
    localStorage.setItem("dashboard", selectedBoard?.title )
    navigate("/chat")
  }

  useEffect(()=>{
    const [_,mainPath, childPath] = path.split("/")
    if (mainPath && childPath) {
      const dashboardlist = navigation?.filter(nav=> nav.segment == mainPath)[0]
      const currentDashBoard = dashboardlist?.children?.filter(dashBoard=> dashBoard.segment == childPath)
      setDashBoards(currentDashBoard?.[0]?.dashboards)
      setSelectedBoard(currentDashBoard[0]?.dashboards[0])
    }
  },[path])
  return (
    <>
     <Stack direction="row" spacing={1}>
    {dashBoards?.map((board, index)=> (
      <Chip key={index} variant='outlines' style={{background: board.name == selectedBoard.name ? "#1976d2" : "",color: board.name == selectedBoard.name ? "#FFFFFF" : ""}} label={board.name} onClick={()=>handleClick(board)} />
    ))}
    </Stack>
    {selectedBoard && <TableauReport
      url={selectedBoard?.link}
    />
    }
    {selectedBoard && <div className="chat-app">
       <img onClick={()=> navigateToChat()} src="/askme.jpg" alt="Ask me" />
    </div>}
    </>
  );
}

export default DashBoardItem