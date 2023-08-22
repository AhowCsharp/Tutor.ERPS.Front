import * as React from 'react';
import { useEffect,useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import StudentSearch from './StudentSearch';
import { apiUrl } from '../../apiUrl/ApiUrl';
import { token } from '../../token/Token'
import '@fontsource/roboto/700.css';


// const rows = [
//   { id: 1, name: 'Snow', account: 'Jon'}
// ];

export default function StudentLog() {
  const [rows,setRows] = React.useState([])
  const [filterRows,setFilterRows] = React.useState([])
  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'account',
      headerName: '帳號',
      width: 250,
      editable: false,
    },
    {
      field: 'name',
      headerName: '姓名',
      width: 150,
      editable: false,
    },
    {
      field: 'hihi',
      headerName: '',
      width: 150,
      editable: false,
    },
    {
      field: 'log',
      headerName: '查看紀錄',
      width: 150,
      renderCell: (params) => (
        <Button variant='contained' startIcon={<SearchIcon />} onClick={() => handleOpenLogList(params.row.id)}>log</Button>
      ),
    },
  
  ];

  useEffect(() => {
    // 定義非同步 function 來獲取數據
    const fetchData = async () => {
      try {
        
        const response = await axios.get(`${apiUrl}/member/student`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data.List);
          setFilterRows(response.data.List);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); 
  const handleOpenLogList = (id) => {
    navigate('/dashboard/loglist', {
      state: { studentId: id },
      replace: true 
    });
  };
  return (
    <Box sx={{ height: 700, width: '100%',paddingLeft:'100px',paddingRight:'100px'}}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        學員列表
        </Typography>
        <StudentSearch rows={rows} setFilterRows={setFilterRows}/>
        <Stack direction="row" spacing={2}>
          {/* <Button variant="outlined" startIcon={<PlaylistAddIcon />}>
            Multiple Add
          </Button>
          <Button variant="outlined" startIcon={<AddCircleIcon />}>
            Single Add
          </Button> */}
        </Stack>
        <DataGrid
            rows={filterRows}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 15,
                },
            },
            }}
            pageSizeOptions={[10,15,20]}            
            disableRowSelectionOnClick
        />
    </Box>
  );
}
