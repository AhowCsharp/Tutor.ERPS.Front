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

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'QuestionSentence',
    headerName: '句子',
    width: 150,
    editable: true,
  },
  {
    field: 'Mp3FileUrl',
    headerName: 'mp3',
    width: 400,
    // renderCell: (params) => (
    //     <Audio mp3Url={params.rows.mp3_FileUrl}>mp3</Audio>
    //   ),
  },
  {
    field: 'TypeName',
    headerName: '類型',
    width: 150,
    editable: true,
  },
  {
    field: 'Destory',
    headerName: '刪除',
    width: 150,
    renderCell: (params) => (
      <Button variant='contained' startIcon={<DeleteIcon />}>Delete</Button>
    ),
  },
];

// const rows = [
//   { id: 1, name: 'Snow', account: 'Jon'}
// ];

export default function Sentence() {
  const [rows,setRows] = React.useState([])
  const [filterRows,setFilterRows] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [typeOptions , setTypeOptions] = React.useState([])

  const fileInput = useRef(null);
  const handleButtonClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (event) => {
    const fileName = event.target.files[0]?.name;
    if (fileName) {
      // 这里您可以处理文件，例如将其上传到服务器或读取其内容
      console.log(fileName);
    }
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          setRows(response.data.Datas);
          setFilterRows(response.data.Datas);
          setTypeOptions(responseType.data.Datas)
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
        <DialogTitle>句子新增</DialogTitle>
        <DialogContent>
          <DialogContentText>
          請確認音檔、跟句子是否對應
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="questionSentence"
            label="句子"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="questionSentenceChinese"
            label="句子中文"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="questionAnswer"
            label="單字中文"
            fullWidth
            variant="standard"
          />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 , marginTop: '25px'}}>
            <InputLabel id="demo-simple-select-standard-label">類型</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={50}
              // onChange={handleChange}
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
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
