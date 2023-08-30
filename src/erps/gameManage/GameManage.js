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
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import GameSearch from './GameSearch';
import { apiUrl } from '../../apiUrl/ApiUrl';
import { token } from '../../token/Token'
import '@fontsource/roboto/700.css';



// const rows = [
//   { id: 1, name: 'Snow', account: 'Jon', email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' },
// ];

export default function GameManage() {
  const [rows,setRows] = React.useState([])
  const [filterRows,setFilterRows] = React.useState([])
  const [editedRows, setEditedRows] = React.useState([]);
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
      field: 'word',
      headerName: '英文單字',
      width: 150,
      editable: true,
    },
    {
        field: 'wordChinese',
        headerName: '中文',
        width: 100,
        editable: true,
    },
    {
      field: 'hardLevel',
      headerName: '難度',
      type:'number',
      width: 100,
      editable: true,
    },
    {
        field: '',
        headerName: '',
        width: 50,
        editable: true,
    },
    {
        field: 'mp3Url',
        headerName: '路徑',
        width: 150,
        editable: true,
        valueGetter: (params) => {
            const mp3Url = params.value;
            return mp3Url || '未配對到音檔';
        },
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
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  
  const handleMp3Upload = () => {
    inputRef.current.click();
  };
  const handleFilesSelected = async (event) => {
    const files = event.target.files;
    if (files.length === 0) {
        alert("請選擇一個檔案！");
        return;
      }
    // 驗證每個選定檔案是否為 MP3
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'audio/mp3' && file.type !== 'audio/mpeg') {
        alert(`${file.name} 不是一個 MP3 檔案`);
        return;
      }
    }

    // 創建一個 FormData 物件來存儲選定的檔案
    const formData = new FormData();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      formData.append('mp3Files', files[i]);
    }

    try {
      // 使用 Axios 發送檔案到後端
      const response = await axios.post(`${apiUrl}/game/upload`, formData, {
        headers: {
          'X-Ap-Token':`${token}`,  // 
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('檔案上傳成功');
        const newData = await axios.get(`${apiUrl}/game/words`, {
            headers: {
              'X-Ap-Token':`${token}`
            }
          });
          setRows(newData.data.Words);
          setFilterRows(newData.data.Words);
      } else {
        alert('檔案上傳失敗');
      }
    } catch (error) {
      console.error('錯誤:', error);
    }
    // ... (保持之前的代碼不變)
  };
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
    formData.append('excelFile', file);
  
    try {
      const response = await axios.post(`${apiUrl}/game/words`, formData, {
        headers: {
          'X-Ap-Token':`${token}`,  // 
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200) {
        alert('批次新增成功')
        const newData = await axios.get(`${apiUrl}/game/words`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        setRows(newData.data.Words);
        setFilterRows(newData.data.Words);
      }else {
        alert('批次新增失敗')
      }     
    } catch (error) {
      alert('批次新增失敗,請確認EXCEL資料是否正確')
    }
  };

  const handleDestroy = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/game/deleteword?id=${id}`, {
        headers: {
          // 這裡添加你需要的 headers，比如授權
          'X-Ap-Token':`${token}`// 如果你使用的是 Bearer token
        }
      });
  
      if (response.status === 200) {
        alert('刪除成功');
        const newData = await axios.get(`${apiUrl}/game/words`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        setRows(newData.data.Words);
        setFilterRows(newData.data.Words);
      } else {
        alert('刪除失敗')
        // 這裡添加失敗後的處理代碼
      }
    } catch (error) {
      console.error("An error occurred while deleting:", error);
      // 這裡添加錯誤處理代碼
    }
  };

  const isDisabled = editedRows.length === 0;
  

  
  const handleSave = async () => {
    const modifiedRows = editedRows.map(item => ({
      ...item,
    }));

    try {
      const response = await axios.patch(`${apiUrl}/game/editword`, modifiedRows, {
        headers: {
            'X-Ap-Token':`${token}`,  // 
            'Content-Type': 'application/json'
        }
    });
      if(response.status === 200) {     
        const newData = await axios.get(`${apiUrl}/game/words`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        alert('修改成功');
        setRows(newData.data.Words);
        setFilterRows(newData.data.Words);
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
        
        const response = await axios.get(`${apiUrl}/game/words`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data.Words);
          setFilterRows(response.data.Words);
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



  return (
    <Box sx={{ height: 700, width: '100%' }}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        學員列表
        </Typography>
        <GameSearch rows={rows} setFilterRows={setFilterRows}/>
        <Stack direction="row" spacing={2}>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button variant="outlined" startIcon={<PlaylistAddIcon />} onClick={handleFileSelect}>
            Excel Add
          </Button>
          <input
            type="file"
            ref={inputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFilesSelected}
        />
          <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleMp3Upload}>
            Mp3 Add
          </Button>
          <Button variant="outlined" disabled={isDisabled} onClick={handleSave}  startIcon={<SaveIcon />}> 
            Save Update
          </Button>
          <Button variant="outlined" disabled={isDisabled} onClick={()=>setEditedRows([])}  startIcon={<ClearIcon />}> 
            Cancel Update
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
            pageSizeOptions={[1000,1500,2000]}            
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={error=>alert(error)}
            onRowEditCommit={(rowId, e) => {
              handleSave(rowId,e);
            }}
        />
    </Box>
  );
}
