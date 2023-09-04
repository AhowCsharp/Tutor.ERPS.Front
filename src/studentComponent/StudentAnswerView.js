import * as React from 'react';
import Box from '@mui/material/Box';
import { useState,useRef,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import GameMp3Player from './GameMp3Player';
import { apiUrl } from '../apiUrl/ApiUrl';
import { token } from '../token/Token'




export default function StudentAnswerView() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    const [testInfo,setTestInfo] = useState(null)
    const [types,setTypes] = React.useState([])
    const [questionNum,setQuestionNum] = React.useState(0)
    const [audioName, setAudioName] = React.useState('');
    const [answer, setAnswer] = React.useState('');
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [showTipOne, setShowTipOne] = useState(false);
    const [showTipTwo, setShowTipTwo] = useState(false);
    const [showTipButtuon, setShowTipButtuon] = useState(false);
    const [errorCount,setErrorCount] = useState(0);
    let timer = null;

    const startTimer = () => {
        setIsActive(true);
    };
    const pauseTimer = () => {
        setIsActive(false);
    };
    useEffect(() => {
        if (isActive) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          timer = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
          }, 1000);
        } else {
          clearInterval(timer);
        }
    
        return () => {
          clearInterval(timer);
        };
      }, [isActive]);
      useEffect(() => {
        if (errorCount >= 4) {
            setShowTipButtuon(true)
        } 
      }, [errorCount]);

      const verify = async () => {            
          const answerLog = {
            account: sessionStorage.getItem('studentAccount'),
            name: sessionStorage.getItem('userName'),
            level: testInfo.studyLevel.toString(),
            answer,
            timeCost: seconds,  // 你可以根据需要设置这个值
            questionType: testInfo.typeName,
            questionNum,  // 你可以根据需要设置这个值
            id: sessionStorage.getItem('id'),
            model:'phone'
          };
          pauseTimer();
          try {       
          const response = await axios.post(`${apiUrl}/answerLog/verify`, answerLog, {
            headers: {
              'X-Ap-Token': `${token}`
            }
          });
          console.log(response)
          if(response.status === 200) {
            setTestInfo(response.data.SentenceManageDTO)
          }
          if (!response.isPass) {
            setErrorCount(errorCount+1);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const fetchTestData = async (typeId,isPlus) => {
        const userId = parseInt(sessionStorage.getItem('id'),10);
        let qid = questionNum;
        if(isPlus && isPlus !== null) {
            if(qid+1 <= testInfo.maxQum) {            
                qid +=1;
            }else{
                alert('已到達最大題數');
                return;
            }
        }
        if(!isPlus && isPlus !== null) {
            if(qid-1 > 0 ) {
                qid -=1;
            }else{
                alert('已到達最小題數');
                return;
            }
        }
        
        try {
            if(questionNum === 0) {
                const response = await axios.get(`${apiUrl}/sentence/phonetest?typeId=${typeId}&userId=${userId}`, {
                    headers: {
                        'X-Ap-Token':`${token}`
                    }
                    });
                    // 檢查響應的結果，並設置到 state
                    if (response.status === 200) {
                    setTestInfo(response.data.SentenceManageDTO)
                    const QId = parseInt(response.data.SentenceManageDTO.questionNum,10);
                    setQuestionNum(QId) 
                    setAnswer(response.data.SentenceManageDTO.answerLog)
                    setErrorCount(0)
                    setShowTipButtuon(false)
                    setShowTipOne(false)
                    setShowTipTwo(false)
                    }
            }else {
                const response = await axios.get(`${apiUrl}/sentence/phonetest?typeId=${typeId}&questionNum=${qid}&userId=${userId}`, {
                    headers: {
                        'X-Ap-Token':`${token}`
                    }
                    });
                    // 檢查響應的結果，並設置到 state
                    if (response.status === 200) {
                    setTestInfo(response.data.SentenceManageDTO)
                    const QId = parseInt(response.data.SentenceManageDTO.questionNum,10);
                    setQuestionNum(QId) 
                    setAnswer(response.data.SentenceManageDTO.answerLog)
                    setErrorCount(0)
                    setShowTipButtuon(false)
                    setShowTipOne(false)
                    setShowTipTwo(false)
                    }
            }          
        } catch (error) {
            console.error('Error fetching data:', error);          
        }
    };
        useEffect(() => {
            if(testInfo !== null) {
            const QId = parseInt(testInfo.questionNum,10);
            setQuestionNum(QId) ;
            }
        }, [testInfo]);
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
      
  return (
    <>
    {testInfo !== null &&(
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
        <Box sx={{width: '100%', height:`${windowDimensions.height+100}px`,backgroundColor:'black'}}>
            <Box sx={{ width: '100%', height: `${windowDimensions.height*0.5+70}px` }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} 
                        alignItems="center" // 垂直居中
                        justifyContent="center" // 水平居中
                    >
                        <Grid item xs={12}/>
                        <Grid item xs={12}/>
                        <Grid item xs={12}/>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',color:'white' }}>      
                            <Typography variant="h3" gutterBottom>
                                {testInfo.typeName}
                            </Typography>
                        </Grid> 
                        <Grid item xs={12}/>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>                   
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ display: 'flex',color:'white', 
                                alignItems: 'center', justifyContent: 'center' }}>
                                    題號:{testInfo.questionNum}
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center',color:'white',  
                                justifyContent: 'center' }}>
                                    {testInfo.questionChineseName}
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center',color:'white', 
                                 justifyContent: 'center' }}>
                                    {testInfo.mp3FileName}
                                </Grid>
                            </Grid>                        
                        </Grid>
                        
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GameMp3Player mp3Url={`${apiUrl}${testInfo.mp3FileUrl}`} fileName={`${testInfo.mp3FileName}`} 
                            setAudioName={setAudioName} startTimer={startTimer}/>                           
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',color:'white' }}>
                            {testInfo.isPass === -1 ?"未作答":null}
                            {testInfo.isPass === 0 ?"未通過":null}
                            {testInfo.isPass === 1?"已通過":null}
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',color:'white',marginLeft:'15px',marginRight:'10px' }}>
                            {testInfo.isPass === 1?testInfo.questionSentenceChinese:null}
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',color:'white',marginLeft:'15px',marginRight:'10px' }}>
                            {testInfo.isPass === 1?testInfo.questionAnswer:null}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box sx={{width: '100%', height:`${windowDimensions.height*0.5+30}px`}}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                            <TextField
                            id="outlined-multiline-flexible"
                            placeholder='作答區'
                            multiline
                            color="warning" 
                            rows={5}
                            value={answer} 
                            style={{backgroundColor:'white',borderRadius: '8px',width:'90%',color:'white' }}
                            onChange={(e)=>setAnswer(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center',color:'white',marginLeft:'15px',marginRight:'10px' }}>
                            {showTipButtuon?
                            <>
                            <Button variant="contained" size="small" style={{background:'lightblue',color:'white'}} onClick={()=>setShowTipOne(true)}>
                                提示1
                            </Button>
                                {showTipOne?
                                <Alert severity="info" style={{background:'transparent',color:'white'}}>{testInfo.questionSentenceChinese}</Alert>
                                :null}
                            </>:null}
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center',color:'white',marginLeft:'15px',marginRight:'10px' }}>
                            {showTipButtuon?
                            <>
                            <Button variant="contained" size="small" style={{background:'lightblue',color:'white'}} onClick={()=>setShowTipTwo(true)}>
                                提示2
                            </Button>
                                {showTipTwo?
                                <Alert severity="info" style={{background:'transparent',color:'white'}}>{testInfo.questionHint}</Alert>
                                :null}
                            </>:null}
                        </Grid>
                        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button variant="contained" size='medium' style={{backgroundColor:'transparent'}}
                            onClick={()=>fetchTestData(testInfo.questionTypeId,false)}>                                
                                上一題
                            </Button>
                        </Grid>
                        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button variant="contained" size='large' endIcon={<SendIcon />} style={{backgroundColor:'orange'}}
                            onClick={() => verify()}>
                                送出答案
                            </Button>
                        </Grid>
                        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button variant="contained" size='medium' style={{backgroundColor:'transparent'}}
                            onClick={()=>fetchTestData(testInfo.questionTypeId,true)}>
                                下一題
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    </Box>)}
    {testInfo === null && (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', position: 'relative' }}>
            <Box sx={{ width: '100%', height: `${windowDimensions.height}px`, backgroundColor: 'black' }}>
                <Box sx={{ width: '100%', height: `${windowDimensions.height / 2 - 50}px` }}>
                    <Box sx={{ flexGrow: 1,padding:'30px' }}>
                        <Grid container spacing={2}
                            alignItems="center" // 垂直居中
                            justifyContent="center" // 水平居中
                            sx={{ flexWrap: 'wrap' }} // 自动换行
                        >
                            {types.map((type, index) => (
                                <Button key={index}
                                    disabled={type.studyLevel > parseInt(sessionStorage.getItem('level'), 10)}
                                    style={{
                                        color: 'white',
                                        borderColor: 'white', // 白色边框
                                        margin: '10px', // 距离四周有10px
                                    }}
                                    variant="outlined"
                                    size='large'
                                    onClick={()=>fetchTestData(type.id,null)}
                                >
                                    {type.type}
                                </Button>
                            ))}
                            <Grid item xs={12}/>
                            <Grid item xs={12}/>
                            <Grid item xs={12}/>
                            <Grid item xs={12}/>
                            <Grid item xs={12}/>
                            <Grid item xs={12}/>
                            <Grid item xs={12}/>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>   
                                {!isMobile ?                                 
                                <Typography variant="h1" gutterBottom style={{color:'orange'}}>
                                    請選擇聽力類型
                                </Typography>:null}  
                            </Grid>
                        </Grid>                       
                    </Box>
                </Box>
                <Box sx={{ width: '100%', height: `${windowDimensions.height / 2 + 50}px` }} />
            </Box>
        </Box>
    )}
    </>
  );
}