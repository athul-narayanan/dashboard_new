import { useEffect, useState } from 'react';
import TableauReport from 'tableau-react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


const DashBoardItem = (props) => {
  const {path, navigation } = props
  const [dashBoards, setDashBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)
  const handleClick = (dashBoard) => {
    setSelectedBoard(dashBoard)
  };

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
      <Chip variant='outlines' style={{background: board.name == selectedBoard.name ? "#1976d2" : "",color: board.name == selectedBoard.name ? "#FFFFFF" : ""}} label={board.name} onClick={()=>handleClick(board)} />
    ))}
    </Stack>
    {selectedBoard && <TableauReport
      url={selectedBoard?.link}
    />
    }
    </>
  );
}

export default DashBoardItem