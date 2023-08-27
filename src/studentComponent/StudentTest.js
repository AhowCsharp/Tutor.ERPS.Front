import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect,useRef  } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import AudioHasTimer from '../erps/audio/AudioHasTimer';
import QuestionSearch from './QuestionSearch';
import { apiUrl } from '../apiUrl/ApiUrl';
import { token } from '../token/Token'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function StudentTest() {
    const [types,setTypes] = React.useState([])
    const [chooseType,setChooseType] = React.useState('');
    const [questions,setQuestions] =  React.useState([])
    const [filterRows,setFilterRows] = React.useState([])
    const [timerId, setTimerId] = React.useState(null);
    const [seconds, setSeconds] = React.useState(0);
    const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem('studentAccount');
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);

    const handlePlay = () => {
        // 初始化秒數
        setSeconds(0);
    
        // 開始計時
        const id = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);
    
        setTimerId(id);
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
                setTypes(response.data.List) 
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []); 

    const handleGetTest = async (type) => {
        setChooseType(type);
        const id = sessionStorage.getItem('id');
        try {
            const response = await axios.get(`${apiUrl}/sentence/testinfo?type=${type}&id=${id}`, 
            {
            headers: {
                // 這裡添加你需要的 headers，比如授權
                'X-Ap-Token':`${token}`// 如果你使用的是 Bearer token
            }
            });
            if(response.status === 200) {
                setQuestions(response.data.List);
                setFilterRows(response.data.List);
            }

        } catch (error) {
            console.error("An error occurred while deleting:", error);
            // 這裡添加錯誤處理代碼
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'questionNum', headerName: '題號', width: 80 },
        {
            field: 'subject',
            headerName: '考試',
            width: 1150,
            editable: false,
            renderCell: (params) => (
                <Test mp3FileName={params.row.subject.mp3FileName} 
                questionSentence={params.row.subject.questionSentence}
                 mp3FileUrl={params.row.subject.mp3FileUrl}
                 typeName={params.row.subject.typeName}
                 questionNum={params.row.subject.questionNum}
                 preAnswer={params.row.subject.preAnswer}/>
              ),
        },
        {   
            field: 'isPassing', 
            headerName: '通關狀態',
            width: 80 ,
            type:'text'
        },
    ];
    return (
        <>
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& > *': {
                    m: 1,
                },
                }}
            >
                <ButtonGroup size="large" aria-label="large button group">
                {types.map((type, index) => (
                <Button key={index} onClick={() =>handleGetTest(type.type)} 
                disabled={type.studyLevel > parseInt(sessionStorage.getItem('level'), 10)}
                >
                    {type.type}
                </Button>
                ))}
                </ButtonGroup>
                <Alert severity="info">
                    <AlertTitle>測驗類型</AlertTitle>
                    目前 - <strong>{chooseType}</strong> <br/>
                    <strong>若要搜尋1.未通關請輸入:f 2.已通關:t 3.尚未作答:n</strong>
                </Alert>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
                <QuestionSearch rows={questions} setFilterRows={setFilterRows}/>
                <DataGrid
                    rows={filterRows}
                    columns={columns}
                    rowHeight={150}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />            
            </Box>
        </>
    );
  }

  const Test = ({mp3FileName,questionSentence,mp3FileUrl,questionNum,typeName,preAnswer}) => {
    const [answer,setAnswer] = React.useState(preAnswer);
    const [timerId, setTimerId] = React.useState(null);
    const [seconds, setSeconds] = React.useState(0);

    const handlePlay = () => {
      // 初始化秒數
      setSeconds(0);
  
      // 開始計時
      const id = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
  
      setTimerId(id);
    };

    const sendAnswer = async() => {
        const Data = {
            timeCost: seconds.toString(),
            account:sessionStorage.getItem('studentAccount'),
            name:sessionStorage.getItem('userName'),
            level:sessionStorage.getItem('level'),
            answer,
            questionType:typeName,
            questionNum,
            id:sessionStorage.getItem('id')
        };
        console.log(Data)
        clearInterval(timerId);
    // 發送秒數到後端
    try {
        const response = await axios.post(`${apiUrl}/answerLog/verify`, Data, {
            headers: {
                'X-Ap-Token':`${token}`
            }
        });
            if(response.status ===200) {
                alert('答案送出成功')
            }else {
                alert('答案送出失敗')
            }       
        } catch (error) {
        console.error('Error sending data:', error);
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ height: '100px' }}>
            <Box>
              <div style={{marginLeft:'20px'}}>{mp3FileName}</div>
              <div style={{marginLeft:'20px'}}>{questionSentence}</div>
              <AudioHasTimer mp3Url={mp3FileUrl} 
              handlePlay={handlePlay}>mp3</AudioHasTimer>
            </Box>
          </Grid>
          <Grid item xs={7} sx={{ height: '100px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TextField
              required
              id="standard-required"
              label="您的答案"
              type="text"
              value={answer == null? '':answer}
              onChange={(e)=>setAnswer(e.target.value)}
              variant="standard"
              sx={{ marginTop: 'auto' }}
            />
          </Box>
          </Grid>
          <Grid item xs={1} sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',padding:'10px' }}>
            <Button variant="contained" endIcon={<SendIcon />} style={{marginTop:'30px'}} onClick={sendAnswer}>
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
}
