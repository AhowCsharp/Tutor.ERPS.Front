import { useEffect,useRef,useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Autocomplete from '@mui/material/Autocomplete';
import SentenceSearch from './SentenceSearch';
import Audio from '../audio/Audio';

import { apiUrl } from '../../apiUrl/ApiUrl';
import { token } from '../../token/Token'
import '@fontsource/roboto/700.css';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);



export default function Sentence() {
  const [rows,setRows] = React.useState([])
  const [filterRows,setFilterRows] = React.useState([])
  const [fileName, setFileName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editedRows, setEditedRows] = React.useState([]);
  const [openForm,setOpenForm]= useState(false);
  const [typeOptions , setTypeOptions] = React.useState([])
  const [sentence,setSentence] = React.useState({
    mp3File:null,
    questionSentence:'',
    questionSentenceChinese:'',
    typeName:'',
    questionAnswer:''
  })

  const [member,setMember] = React.useState({
    name:'',
    account:'',
    password:'',
    email:'',
    studyLevel:0,
    creator:'ahow',
    editor:'ahow',
    beDeleted:0,
    status:1,
    id:0
  })
  const handleFormClickOpen = () => {
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
  };
  const handleRegister = async () => {
    // 驗證 CAPTCHA
    console.log(member);
    handleFormClose();
    // const uuid = sessionStorage.getItem('uuid');
    // const response = await axios.post(`${apiUrl}/login/ValidateCaptcha`, { userInput,uuid })
    // if(response.data.isPass) {
    //   handleLogin();
    // }else {
    //   alert('圖形驗證失敗')     
    // }   
  };
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'questionEnglishName',
      headerName: '音檔英文',
      width: 100,
      editable: false,
    },
    {
      field: 'questionChineseName',
      headerName: '音檔中文',
      width: 100,
      editable: true,
    },
    {
      field: 'questionAnswer',
      headerName: '問題答案',
      width: 400,
      editable: true,
    },
    {
      field: 'questionSentenceChinese',
      headerName: '句子中文',
      width: 250,
      editable: true,
    },
    {
      field: 'mp3FileUrl',
      headerName: 'mp3',
      width: 150,
      editable: false,
      renderCell: (params) => {
        if (!params.row.mp3FileUrl || params.row.mp3FileUrl === '') {
          return "未匹配到音檔";
        } 
          return <Audio mp3Url={params.row.mp3FileUrl}>mp3</Audio>;       
      },
    },
    {
      field: 'typeName',
      headerName: '類型',
      width: 100,
      editable: false,
    },
    {
      field: 'questionTypeId',
      headerName: 'TypeId',
      type:'number',
      width: 80,
      editable: true,
    },
    {
      field: 'questionHint',
      headerName: '提示一',
      width: 250,
      editable: true,
    },
    {
      field: 'destory',
      headerName: '刪除',
      width: 150,
      renderCell: (params) => (
        <Button variant='contained' startIcon={<DeleteIcon />} onClick={() => handleDestory(params.row.id)}>Delete</Button>
      ),
    }
  ];
  const handleDestory = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/sentence/removesentence?id=${id}`, {
        headers: {
          // 這裡添加你需要的 headers，比如授權
          'X-Ap-Token':`${token}`// 如果你使用的是 Bearer token
        }
      });
  
      if (response.status === 200) {
        alert('刪除成功');
        const newData = await axios.get(`${apiUrl}/sentence/info`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        setRows(newData.data.List);
        setFilterRows(newData.data.List);
      } else {
        alert('刪除失敗')
        // 這裡添加失敗後的處理代碼
      }
    } catch (error) {
      console.error("An error occurred while deleting:", error);
      // 這裡添加錯誤處理代碼
    }
  };

  const mp3InputRef = useRef(null);
  const excelInputRef = useRef(null);
    
  const handleMp3Upload = () => {
    mp3InputRef.current.click();
  };

  const handleExcelFileSelect = () => {
    excelInputRef.current.click();
  };
  const handleExcel = async (event) => {
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
      const response = await axios.post(`${apiUrl}/sentence/uploadwordsExcel`, formData, {
        headers: {
          'X-Ap-Token':`${token}`,  // 
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200) {
        alert('批次新增成功')
        const newData = await axios.get(`${apiUrl}/sentence/info`, {
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
    } finally {
      // 清除文件输入的值，以便用户可以重新选择相同的文件
      excelInputRef.current.value = null;
    }
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
      const response = await axios.post(`${apiUrl}/sentence/uploadMp3`, formData, {
        headers: {
          'X-Ap-Token':`${token}`,  // 
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('檔案上傳成功');
        const newData = await axios.get(`${apiUrl}/sentence/info`, {
            headers: {
              'X-Ap-Token':`${token}`
            }
          });
          setRows(newData.data.List);
          setFilterRows(newData.data.List);
      } else {
        alert('檔案上傳失敗');
      }
    } catch (error) {
      console.error('錯誤:', error);
    }finally {
      // 清除文件输入的值，以便用户可以重新选择相同的文件
      mp3InputRef.current.value = null;
    }
    // ... (保持之前的代碼不變)
  };



  useEffect(() => {
    // 定義非同步 function 來獲取數據
    const fetchData = async () => {
      try {
        
        const response = await axios.get(`${apiUrl}/sentence/info`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        const responseType = await axios.get(`${apiUrl}/sentence/type`, {
          headers: {
            'X-Ap-Token':`${token}`
          }
        });
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data.List);
          setFilterRows(response.data.List);
          setTypeOptions(responseType.data.List) 
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
  const handleSave = async () => {
    const modifiedRows = editedRows.map(item => ({
      ...item,
    }));  
    console.log(modifiedRows);
    try {
      const response = await axios.post(`${apiUrl}/sentence/updatesentence`, modifiedRows, {
        headers: {
            'X-Ap-Token':`${token}`,  // 
            'Content-Type': 'application/json'
        }
    });
      if(response.status === 200) {     
        const newData = await axios.get(`${apiUrl}/sentence/info`, {
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

  const isDisabled = editedRows.length === 0;

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
  return (
    <Box sx={{ height: 600, width: '100%'}}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        句子列表
        </Typography>
        <SentenceSearch rows={rows} setFilterRows={setFilterRows}/>
        <Stack direction="row" spacing={2}>
        <input
            type="file"
            style={{ display: 'none' }}
            ref={excelInputRef}
            onChange={handleExcel}
          />
          <Button variant="outlined" startIcon={<PlaylistAddIcon />} onClick={handleExcelFileSelect}>
            Excel Add
          </Button>
          <input
            type="file"
            ref={mp3InputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFilesSelected}
        />
          <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleMp3Upload}>
            Mp3 Add
          </Button>
          <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleMp3Upload}>
            Single Add
          </Button>
          <Button variant="outlined" disabled={isDisabled} onClick={handleSave}  startIcon={<SaveIcon />}> 
            Save Update
          </Button>
          <Button variant="outlined" disabled={isDisabled} onClick={()=>setEditedRows([])}  startIcon={<ClearIcon />}> 
            Cancel Update
          </Button>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={typeOptions}
              sx={{ width: 350 }}
              renderInput={(params) => <TextField {...params} label="修改類別參考這" />}
            /> 
        </Stack>
          <DataGrid
              rows={filterRows}
              columns={columns}
              editMode="row"
              initialState={{
                  pagination: {
                      paginationModel: {
                          pageSize: 100,
                      },
                  },
              }}
              pageSizeOptions={[100,50,20]}            
              disableRowSelectionOnClick
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={error=>alert(error)}
              onRowEditCommit={(rowId, e) => {
                handleSave(rowId,e);
              }}
          />
          <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>歐美多益學苑體驗</DialogTitle>
        <DialogContent>
          <DialogContentText>
                註冊試玩帳號
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
            label="音檔英文"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'name')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="account"
            label="音檔中文"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'account')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="問題答案"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'email')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="句子"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, 'password')}
          />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>取消</Button>
          <Button onClick={handleRegister}>註冊</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
