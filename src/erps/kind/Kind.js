import * as React from 'react';
import { useEffect,useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import KindSearch from './KindSearch';
import { apiUrl } from '../../apiUrl/ApiUrl';
import { token } from '../../token/Token'
import '../../css/datagrid.css'
import '@fontsource/roboto/700.css';




export default function Kind() {
  const [rows,setRows] = React.useState([])
  const [filterRows,setFilterRows] = React.useState(rows)
  const [editedRows, setEditedRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newType,setNewType] = React.useState({
    type:'',
    studyLevel:null,
  })
  const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);

  const handleDestory = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/sentence/removeType?id=${id}`, {
        headers: {
            'X-Ap-Token':`${token}`
        }
      });
      if(response.status === 200) {
      alert('成功')
      const newData = await axios.get(`${apiUrl}/sentence/type`, {
        headers: {
          'X-Ap-Token':`${token}`
        }
      });
      setRows(newData.data.List);
      setFilterRows(newData.data.List);
      }else {
        alert('資料格式錯誤')
      }

    } catch (error) {
      console.error('Error:', error);
      alert('資料格式錯誤')
    }
  }
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'type',
      headerName: '類型',
      width: 150,
      headerClassName: 'datagrid-header',
      editable: true,
    },
    {
      field: 'studyLevel',
      headerName: '權限',
      type:'number',
      width: 200,
      headerClassName: 'datagrid-header',
      editable: true,
    },
    {
      field: 'empty',
      headerName: '',
      width: 200,
      editable: false,
    },
    {
      field: 'destory',
      headerName: '刪除',
      headerClassName: 'datagrid-delete-header',
      width: 200,
      renderCell: (params) => (
        <Button variant='contained' startIcon={<DeleteIcon/>} onClick={() => handleDestory(params.id)} >Delete</Button>
      ),
    },
  
  ];

  const sendTypeAdd = async () => {
    try {
      const response = await axios.post(`${apiUrl}/sentence/addType`, newType, {
        headers: {
            'X-Ap-Token':`${token}`
        }
    });
      if(response.status === 200) {
      alert('成功')
      const newData = await axios.get(`${apiUrl}/sentence/type`, {
        headers: {
          'X-Ap-Token':`${token}`
        }
      });
      setRows(newData.data.List);
      setFilterRows(newData.data.List);
      }else {
        alert('資料格式錯誤')
      }

    } catch (error) {
      console.error('Error:', error);
      alert('資料格式錯誤')
    }
    handleClose();

  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleInputChange = (event, propertyName) => {
    const value = event.target.value;
    setNewType((prevData) => ({
      ...prevData,
      [propertyName]: value,
    }));
  };
  useEffect(() => {
    // 定義非同步 function 來獲取數據
    const fetchData = async () => {
      try {
        
        const response = await axios.get(`${apiUrl}/sentence/type`, {
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
  const handleSave = async () => {
    const modifiedRows = editedRows.map(item => ({
      ...item,
    }));
    console.log(modifiedRows)
    try {
      const response = await axios.post(`${apiUrl}/sentence/edittype`, modifiedRows, {
        headers: {
            'X-Ap-Token':`${token}`,  // 
            'Content-Type': 'application/json'
        }
    });
      if(response.status === 200) {     
        const newData = await axios.get(`${apiUrl}/sentence/type`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        alert('修改成功');
        setRows(newData.data.List);
        setFilterRows(newData.data.List);
        setEditedRows([]);
      }else {
        alert('修改失敗');
      }

    } catch (error) {
      console.error('Failed to fetch user data:', error);
      alert('修改失敗');
    }
  };
  const processRowUpdate = (newRow, oldRow) => {
    // 透過 newRow 的 id 找到 editedRows 陣列中的索引
    const index = editedRows.findIndex(row => row.id === newRow.id);
  
    // 若找到相同的 id，則先刪除
    if (index > -1) {
      editedRows.splice(index, 1);
    }
  
    // 將 newRow 加入 editedRows 陣列
    setEditedRows([...editedRows, newRow]);
    return newRow;
  };
  const isDisabled = editedRows.length === 0;
  return (
    <Box sx={{ height: 400, width: '100%' }}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        類型列表
        </Typography>
        <KindSearch rows={rows} setFilterRows={setFilterRows}/>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleClickOpen}>
            Single Add
          </Button>
          <Button variant="outlined" disabled={isDisabled} onClick={handleSave}  startIcon={<SaveIcon />}> 
            Save Update
          </Button>
          <Button variant="outlined" disabled={isDisabled} onClick={()=>setEditedRows([])}  startIcon={<ClearIcon />}> 
            Cancel Update
          </Button>
        </Stack>
        <DataGrid
            style={{ width: '90%',margin:'auto' }}
            rows={filterRows}
            columns={columns}
            editMode='row'
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 15,
                },
            },
            }}
            pageSizeOptions={[10,15,20]}            
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={error=>alert(error)}
            onRowEditCommit={(rowId, e) => {
              handleSave(rowId,e);
            }}
        />
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>類型新增</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="type"
            label="類型"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, 'type')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="studyLevel"
            label="學習權限"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, 'studyLevel')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={sendTypeAdd}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
