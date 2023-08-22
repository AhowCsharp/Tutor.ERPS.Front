import { useEffect,useRef  } from 'react';
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
import SentenceSearch from './SentenceSearch';
import Audio from '../audio/Audio';
import { apiUrl } from '../../apiUrl/ApiUrl';
import { token } from '../../token/Token'


import '@fontsource/roboto/700.css';



export default function Sentence() {
  const [rows,setRows] = React.useState([])
  const [filterRows,setFilterRows] = React.useState([])
  const [fileName, setFileName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editItem,setEditItem] = React.useState(null);
  const [typeOptions , setTypeOptions] = React.useState([])
  const [sentence,setSentence] = React.useState({
    mp3File:null,
    questionSentence:'',
    questionSentenceChinese:'',
    typeName:'',
    questionAnswer:''
  })
  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'questionSentence',
      headerName: '問題句子',
      width: 300,
      editable: false,
    },
    {
      field: 'questionAnswer',
      headerName: '問題答案',
      width: 150,
      editable: false,
    },
    {
      field: 'questionSentenceChinese',
      headerName: '句子中文',
      width: 150,
      editable: false,
    },
    {
      field: 'mp3FileUrl',
      headerName: 'mp3',
      width: 350,
      editable: false,
      renderCell: (params) => (
          <Audio mp3Url={params.row.mp3FileUrl}>mp3</Audio>
        ),
    },
    {
      field: 'typeName',
      headerName: '類型',
      width: 150,
      editable: false,
    },
    {
      field: 'destory',
      headerName: '刪除',
      width: 150,
      renderCell: (params) => (
        <Button variant='contained' startIcon={<DeleteIcon />} onClick={() => handleDestory(params.row.id)}>Delete</Button>
      ),
    },
    {
      field: 'edit',
      headerName: '修改',
      width: 150,
      renderCell: (params) => (
        <Button variant='contained' startIcon={<EditIcon />} onClick={() => handleEdit(params.row)}>Edit</Button>
      ),
    },
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
  const handleEdit = async (row) => {
    setEditItem(row);
    setOpen(true);
    console.log(row)
  }
  const sendSentenceAdd = async () => {

    if(editItem === null) {
      const formData = new FormData();
      formData.append('mp3File', sentence.mp3File);  // Assuming sentence.mp3File is a file object
      formData.append('questionSentence', sentence.questionSentence);
      formData.append('questionSentenceChinese', sentence.questionSentenceChinese);
      formData.append('typeName', sentence.typeName);
      formData.append('questionAnswer', sentence.questionAnswer);
      try {
        const response = await axios.post(`${apiUrl}/sentence/upload`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'X-Ap-Token':`${token}`
          }
      });
        if(response.status === 200) {
          alert('成功')
          const newData = await axios.get(`${apiUrl}/sentence/info`, {
            headers: {
              'X-Ap-Token':`${token}`
            }
          });
          const newType = await axios.get(`${apiUrl}/sentence/type`, {
            headers: {
              'X-Ap-Token':`${token}`
            }
          });
          setRows(newData.data.List);
          setFilterRows(newData.data.List);
          setTypeOptions(newType.data.List) 
        }     
      } catch (error) {
        console.error('Error:', error);
        alert('檔案類型不對、或是未選擇檔案')
      }
      handleClose();
      setEditItem(null)
      setFileName('');
    }else {
      const formData = new FormData();
      formData.append('mp3File', editItem.mp3File);  // Assuming sentence.mp3File is a file object
      formData.append('questionSentence', editItem.questionSentence);
      formData.append('questionSentenceChinese', editItem.questionSentenceChinese);
      formData.append('typeName', editItem.typeName);
      formData.append('questionAnswer', editItem.questionAnswer);
      formData.append('id', editItem.id);
      try {
        const response = await axios.post(`${apiUrl}/sentence/updatesentence`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'X-Ap-Token':`${token}`
          }
      });
        if(response.status === 200) {
          const newData = await axios.get(`${apiUrl}/sentence/info`, {
            headers: {
              'X-Ap-Token':`${token}`
            }
          });
          const newType = await axios.get(`${apiUrl}/sentence/type`, {
            headers: {
              'X-Ap-Token':`${token}`
            }
          });
          alert('成功')
          setRows(newData.data.List);
          setFilterRows(newData.data.List);
          setTypeOptions(newType.data.List) 
        }
        
      } catch (error) {
        console.error('Error:', error);
        alert('檔案類型不對、或是未選擇檔案')
      }
      handleClose();
      setEditItem(null)
      setFileName('');
    }

  };
  
  const fileInput = useRef(null);
  const handleButtonClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      if(editItem === null) {
        setFileName(event.target.files[0].name);
        setSentence((prevData) => ({
          ...prevData,
          mp3File: file,
        }));
      }else {
        setFileName(event.target.files[0].name);
        setEditItem((prevData) => ({
          ...prevData,
          mp3File: file,
          mp3FileName:event.target.files[0].name
        }));
      }
    }else {
      alert('請選擇檔案')
    }
  };

  const handleInputChange = (event, propertyName) => {
    const value = event.target.value;
    if(editItem === null) {
      setSentence((prevData) => ({
        ...prevData,
        [propertyName]: value,
      }));
    }else {
      setEditItem((prevData) => ({
        ...prevData,
        [propertyName]: value,
      }));
    }

  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null)
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

  return (
    <Box sx={{ height: 400, width: '100%' }}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        句子列表
        </Typography>
        <SentenceSearch rows={rows} setFilterRows={setFilterRows}/>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleClickOpen}>
            Single Add
          </Button>
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
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editItem!==null?'句子修改':'句子新增'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          請確認音檔、跟句子是否對應
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="questionSentence"
            label="英文問題句子"
            fullWidth
            value={editItem !== null?editItem.questionSentence:sentence.questionSentence}
            variant="standard"
            onChange={(e) => handleInputChange(e, 'questionSentence')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="questionSentenceChinese"
            label="句子中文"
            fullWidth
            variant="standard"
            value={editItem !== null?editItem.questionSentenceChinese:sentence.questionSentenceChinese}
            onChange={(e) => handleInputChange(e, 'questionSentenceChinese')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="questionAnswer"
            label="問題答案"
            fullWidth
            variant="standard"
            value={editItem !== null?editItem.questionAnswer:sentence.questionAnswer}
            onChange={(e) => handleInputChange(e, 'questionAnswer')}
          />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 , marginTop: '25px'}}>
            <InputLabel id="demo-simple-select-standard-label">類型</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={editItem !== null?editItem.typeName:sentence.typeName}
              onChange={(e) => handleInputChange(e, 'typeName')}
              label="類型"
            >
            {typeOptions.map(item => (
              <MenuItem key={item.id} value={item.type}>
                {item.type}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <input
            type="file"
            ref={fileInput}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {/* 使用 MUI 组件提供一个视觉上吸引人的按钮 */}
          <TextField
            variant="outlined"
            label="Attach a file"
            value={fileName}
            style={{ marginTop: '20px',marginLeft:'50px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleButtonClick}>
                    <AttachFileIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={sendSentenceAdd}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
