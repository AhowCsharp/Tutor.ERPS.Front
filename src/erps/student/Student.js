import * as React from 'react';
import { useEffect,useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import StudentSearch from './StudentSearch';
import { apiUrl } from '../../apiUrl/ApiUrl';
import { token } from '../../token/Token'
import '@fontsource/roboto/700.css';



// const rows = [
//   { id: 1, name: 'Snow', account: 'Jon', email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' },
// ];

export default function Student() {
  const [rows,setRows] = React.useState([])
  const [filterRows,setFilterRows] = React.useState([])
  const [editedRows, setEditedRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toLocaleDateString('en-CA');
  const [member,setMember] = React.useState({
    name:'',
    account:'',
    password:'',
    email:'',
    createDate:currentDate,
    endDate:'',
    startDate:'',
    studyLevel:0,
    creator:'ahow',
    editor:'ahow',
    beDeleted:0,
    status:1,
    id:0
  })
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: '姓名',
      width: 150,
      editable: true,
    },
    {
      field: 'account',
      headerName: '帳號',
      width: 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: '信箱',
      width: 150,
      editable: true,
    },
    {
      field: 'password',
      headerName: '密碼',
      width: 150,
      editable: true,
    },
    {
      field: 'createDate',
      headerName: '創建日期',
      width: 150,
      editable: true,
      renderCell: (params) => {
        const date = new Date(params.value);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      },
    },
    {
      field: 'startDate',
      headerName: '生效日期',
      width: 150,
      editable: true,
      renderCell: (params) => {
        const date = new Date(params.value);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      },
    },
    {
      field: 'endDate',
      headerName: '失效日期',
      width: 150,
      editable: true,
      renderCell: (params) => {
        const date = new Date(params.value);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      },
    },
    {
      field: 'studyLevel',
      headerName: '學習權限',
      type:'number',
      width: 60,
      editable: true,
    },
    {
      field: 'destory',
      headerName: '刪除',
      width: 150,
      renderCell: (params) => (
        <Button variant='contained' startIcon={<DeleteIcon />} onClick={()=>handleDestroy(params.row.id)}>Delete</Button>
      ),
    },
  ];

  const handleDestroy = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/member/studentStatus?studentId=${id}`, {
        headers: {
          // 這裡添加你需要的 headers，比如授權
          'X-Ap-Token':`${token}`// 如果你使用的是 Bearer token
        }
      });
  
      if (response.status === 200) {
        alert('刪除成功');
        const newData = await axios.get(`${apiUrl}/member/student`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        setRows(newData.data.List);
      } else {
        alert('刪除失敗')
        // 這裡添加失敗後的處理代碼
      }
    } catch (error) {
      console.error("An error occurred while deleting:", error);
      // 這裡添加錯誤處理代碼
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const isDisabled = editedRows.length === 0;
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("請選擇一個檔案！");
      return;
    }
  
    const validMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
  
    if (!validMimeTypes.includes(file.type)) {
      alert("請上傳一個有效的Excel檔！");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`${apiUrl}/member/addInfos`, formData, {
        headers: {
          'X-Ap-Token':`${token}`,  // 
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200) {
        alert('批次新增成功')
        const newData = await axios.get(`${apiUrl}/member/student`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        setRows(newData.data.List);
        setFilterRows(newData.data.List);
      }else {
        alert('批次新增失敗')
      }     
    } catch (error) {
      alert('批次新增失敗,請確認EXCEL資料是否正確')
    }
  };


  const handleSave = async () => {
    const modifiedRows = editedRows.map(item => ({
      ...item,
      editor:'ahow'
    }));
    console.log(modifiedRows)
    try {
      const response = await axios.patch(`${apiUrl}/member/updateinfo`, modifiedRows, {
        headers: {
            'X-Ap-Token':`${token}`,  // 
            'Content-Type': 'application/json'
        }
    });
      if(response.status === 200) {     
        const newData = await axios.get(`${apiUrl}/member/student`, {
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
  const handleInputChange = (event, propertyName) => {
    let value = event.target.value;

    if (propertyName === 'studyLevel' && value) {
        value = Number(value);
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(value)) {
            console.warn('studyLevel requires a numeric value');
            return;
        }
    }

    setMember((prevData) => ({
      ...prevData,
      [propertyName]: value,
    }));
};


  const sendMemberAdd = async () => {
    console.log(member)
    try {
      const response = await axios.post(`${apiUrl}/member/addinfo`, member, {
        headers: {
            'X-Ap-Token':`${token}`
        }
    });
      if(response.status === 200)
      alert('成功')
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      alert('失敗')
    }  
  };
  return (
    <Box sx={{ height: 700, width: '100%' }}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        學員列表
        </Typography>
        <StudentSearch rows={rows} setFilterRows={setFilterRows}/>
        <Stack direction="row" spacing={2}>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button variant="outlined" startIcon={<PlaylistAddIcon />} onClick={handleFileSelect}>
            Multiple Add
          </Button>
          <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleClickOpen}>
            Single Add
          </Button>
          <Button variant="outlined" disabled={isDisabled} onClick={handleSave}  startIcon={<SaveIcon />}> 
            Save Update
          </Button>
        </Stack>
        <DataGrid
            rows={filterRows}
            editMode="row"
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 100,
                },
            },
            }}
            pageSizeOptions={[100,200,300]}            
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={error=>alert(error)}
            onRowEditCommit={(rowId, e) => {
              handleSave(rowId,e);
            }}
        />
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>學生新增</DialogTitle>
        <DialogContent>
          <DialogContentText>
            請確保資料格式正確
          </DialogContentText>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="姓名"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'name')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="account"
            label="帳號"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'account')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="信箱"
            type="email"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'email')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="密碼"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, 'password')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="createDate"
            label="創建日期"
            defaultValue={currentDate}     
            variant="standard"
            onChange={(e) => handleInputChange(e, 'createDate')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="startDate"
            label="生效日期"
            placeholder='yyyy-mm-dd'
            variant="standard"
            onChange={(e) => handleInputChange(e, 'startDate')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="endDate"
            label="失效日期"
            placeholder='yyyy-mm-dd'
            variant="standard"
            onChange={(e) => handleInputChange(e, 'endDate')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="studyLevel"
            label="學習權限"
            type="number"
            placeholder='請輸入整數數字'
            variant="standard"
            onChange={(e) => handleInputChange(e, 'studyLevel')}
          />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={sendMemberAdd}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
