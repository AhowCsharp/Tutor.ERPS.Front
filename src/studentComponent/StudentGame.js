import * as React from 'react';
import { useState,useRef,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { isMobile,isTablet } from 'react-device-detect';
import { useSpring, animated } from '@react-spring/web'
import Button from '@mui/material/Button';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AnswerDrag from './AnswerDrag';
import AnswerMatch from './AnswerMatch'
import GameMp3Player from './GameMp3Player';
import Combo from '../animate/Combo';
import Error from '../animate/Error';
import Correct from '../animate/Correct';
import GameOverView from '../animate/GameOverView';
import { apiUrl } from '../apiUrl/ApiUrl';
import { token } from '../token/Token'


const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  });

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

export default function StudentGame() {
    const gifRef = useRef(null);  
    const tetrisRefs = useRef([]);
    const containerRef = useRef(null);
    const [numImages, setNumImages] = useState(0);
    const [tetrisY,setTetrisY] = useState(0);
    const [show,setShow] = useState(true);
    const [gifY,setGifY] = useState(0);
    const [initialPositions, setInitialPositions] = useState([]);
    const [springs1, api1] = useSpring(() => ({ y: 30 }));
    const [words,setWords] = useState(['apple','bed','cat','desk','eat','fat','gary','hi','hi','hi']);
    const [answer,setAnswer] = useState(''); 
    const imageNames = ['I', 'L', 'T', 'Z'];
    const [gameWords,setGameWords] = useState([])
    const [boxWords,setBoxWords] = useState([])
    const [gameLevel,setGameLevel] = useState('')
    const [userId, setUserId] = useState('')
    const [isGameOver,setGameOver] = useState(null);
    const [isPass,setIsPass] = useState(false);
    const [passCount,setPassCount] = useState(0);
    const [dialogOpen,setDialogOpen] = useState(false);



    const [ballYPosition, setBallYPosition] = useState(0);
    const [initialBallPosition, setInitialBallPosition] = useState(0);
    const [hoopPosition, setHoopPosition] = useState(0);
    const [wordsCount,setWordsCount] = useState(0);
    const ballRef = useRef(null);
    const hoopRef = useRef(null);
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
    const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem('studentAccount');
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);

    useEffect(() => {
        // Add event listener for beforeunload event
        const handleBeforeUnload = (e) => {
          // Show an alert when the page is about to be reloaded
          e.preventDefault();
          e.returnValue = ''; // Required for Chrome
          sessionStorage.setItem('gameLevel','1');
          handleClearError();
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // Cleanup the event listener when the component unmounts
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    const fetchDataAndUpdate = async (level) => {
        setDialogOpen(false);
        setIsPass(false)
        if(!isGameOver) {
            if (sessionStorage.getItem('gameLevel') === null) {
                sessionStorage.setItem('gameLevel', '1');
                setGameLevel(sessionStorage.getItem('gameLevel'));
                setUserId(sessionStorage.getItem('id'));
            } else {
                setGameLevel(sessionStorage.getItem('gameLevel'));
                setUserId(sessionStorage.getItem('id'));
            }
        if(level === null || level === undefined) {
            try {
                const response = await axios.get(`${apiUrl}/game/words?gamer=${sessionStorage.getItem('id')}&level=${sessionStorage.getItem('gameLevel')}`, {
                    headers: {
                        'X-Ap-Token': `${token}`
                    }
                });
        
                if (response.status === 200) {
                    setGameWords(response.data.Words);
                    setBoxWords(shuffleArray([...response.data.Words]));
                    setWordsCount(response.data.Words.length);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }else {
            try {
                const response = await axios.get(`${apiUrl}/game/words?gamer=${sessionStorage.getItem('id')}&level=${level}`, {
                    headers: {
                        'X-Ap-Token': `${token}`
                    }
                });
        
                if (response.status === 200) {
                    setGameWords(response.data.Words);
                    setBoxWords(shuffleArray([...response.data.Words]));
                    setWordsCount(response.data.Words.length);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
           
        }
    };
    
    useEffect(() => {
        if(isGameOver === false) {
            fetchDataAndUpdate();
        }else {
            sessionStorage.setItem('gameLevel','1');
            setScore(0);
            setPassCount(0);
            setGameLevel('1');
            setbigLevel('1');
        }
    }, [isGameOver]); // 将 isGameOver 添加到依赖数组中，确保在其变化时执行
    
    // 初次渲染时也执行
    useEffect(() => {
        sessionStorage.setItem('gameLevel','1');
        handleClearError();
        fetchDataAndUpdate();
        setScore(0);
    }, []);


    useEffect(() => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const imagesNeeded = Math.floor(containerWidth / 64); // 假设每个图像的宽度为 64px
          setNumImages(imagesNeeded);
        }
      }, []); // 添加其他依赖项，如果需要
    useEffect(() => {
        if (gifRef.current) {
            const rect = gifRef.current.getBoundingClientRect();
            setGifY(rect.y);
            sessionStorage.setItem('gifY',rect.y);
        }
        // 防呆：确保 tetrisRefs.current 是一个非空数组
        if (Array.isArray(tetrisRefs.current) && tetrisRefs.current.length > 0) {
            // Collect the initial positions of each animated.div
            const positions = tetrisRefs.current.map((ref) => {
                // 防呆：确保 ref 不是 null
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    setTetrisY(rect.y);
                    sessionStorage.setItem('tetrisY',rect.y);
                    return { left: rect.left, top: rect.top };
                }
                return null; // 或者返回一个默认的对象
            }).filter(position => position !== null);  // 过滤掉 null 值
    
            setInitialPositions(positions);
        }
    }, []);
    
    // 第二个 useEffect
    useEffect(() => {
        // 防呆：确保 ballRef.current 和 hoopRef.current 都不是 null
        if (ballRef.current && hoopRef.current) {
            setInitialBallPosition(0);  // 这里为什么设置为0？不应该是ballRef.current.getBoundingClientRect().top吗？
            setHoopPosition(hoopRef.current.getBoundingClientRect().top);
            // console.log(hoopRef.current.getBoundingClientRect().top);
        }
    }, []);

    const dropBall = () => {
        const interval = setInterval(() => {
            setBallYPosition(prevY => {
            const newY = prevY + 20;  // 改為每秒下降 20px
            if ((initialBallPosition + newY+300) >= hoopPosition) {
                clearInterval(interval);
                setAnswer('');
                alert("碰到了!");
                return 0;  // 返回到初始位置
            }
            return newY;
            });         
        }, 250); // 每 50 毫秒更新一次，這會使球每秒下降 400px，你可能需要調整這個數值
    };
    const sendAnswer = (value) => {
        setAnswer(value);
        setShow(false);
        dropBall();
    }

    const startGameClick = () => {
        setShow(true);
        const GifY = sessionStorage.getItem('gifY');
        const TetrisY = sessionStorage.getItem('tetrisY');
        const roundedGifY = Math.round(parseFloat(GifY));
        const roundedTetrisY = Math.round(parseFloat(TetrisY));       
        const distance = (roundedGifY-roundedTetrisY-40);
        api1.start({
            from: { y: 0},
            to: { y: distance },
            config: { duration: 6000 },  
            onStart: () => {  },
            onRest: () => {setShow(false) },
        });
    };

    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
      });
    const [mobileGameStart,setMobileGameStart] = useState(false);
    const [timer, setTimer] = useState(0);
    const [audioName, setAudioName] = useState('');
    const [gameAns, setGameAns] = useState('');
    const [life, setLife] = useState(3);
    const [score,setScore] = useState(0);
    const [combo,setCombo] = useState(0);
    const [showCombo,setShowCombo] = useState(false);
    const [showError,setshowError] = useState(false);
    const [showCorrect,setshowCorrect] = useState(false);
    const [bigLevel,setbigLevel] = useState(1);
    const [matchItems,setMatchItems] = useState([]);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (audioName && gameAns) {
          if(audioName === gameAns) {
            setScore(score+30);
            setCombo(combo+1);
            setAudioName(null);setGameAns(null);
            setPassCount(passCount+1);
            setMatchItems([...matchItems, audioName]);
            if(!isPass) {
                setshowCorrect(true);
            }          
          }else {
            setLife(life-1)
            handleErrorPost(audioName);
            setCombo(0);
            setAudioName(null);setGameAns(null);
            setshowError(true)
          }
        }
      }, [audioName, gameAns]);

      const handleErrorPost = async (errorWord) => {
        try {
            const errorLogData = {
            errWord: errorWord,
            level: parseInt(gameLevel, 10), // Convert gameLevel to number
            id: sessionStorage.getItem('id')
            };
            const response = await axios.post(`${apiUrl}/game/errorlog`, errorLogData, {
                headers: {
                  'X-Ap-Token': token // Add Token to headers
                }
              });
    
          if (response.status === 200) {
            console.log('POST request was successful:', response.data);
          } else {
            console.log('POST request failed with status:', response.status);
          }
        } catch (error) {
          console.error('Error sending POST request:', error);
        }
    };
    
    const handleClearError= async () => {
        try {
            const response = await axios.get(`${apiUrl}/game/errclear?gamer=${sessionStorage.getItem('id')}`,{
                headers: {
                  'X-Ap-Token': token // Add Token to headers
                }
              });
    
          if (response.status === 200) {
            console.log('get request was successful:', response.data);
          } else {
            console.log('get request failed with status:', response.status);
          }
        } catch (error) {
          console.error('Error sending get request:', error);
        }
    };

      // eslint-disable-next-line consistent-return
      useEffect(() => {
        if (showCorrect) {
            const corout = setTimeout(() => {
                setshowCorrect(false);
            }, 1000);
    
            return () => {
                clearTimeout(corout);
            };
        }
      }, [showCorrect]);

      useEffect(() => {
        if (passCount%wordsCount === 0) {
            setIsPass(true);
            setPassCount(0);
        }
      }, [passCount]);

      useEffect(() => {
        if(isPass) {
            console.log('已通關')
            const currentGameLevel = parseInt(sessionStorage.getItem('gameLevel'), 10); // 将获取的字符串转换为数字
            sessionStorage.setItem('gameLevel',(currentGameLevel+1).toString());
            setGameLevel(currentGameLevel+1); 
            setDialogOpen(true);   
            setMatchItems([])
            if((currentGameLevel+1)%30 === 0) {
                setbigLevel(bigLevel+1);
            }       
        }

      }, [isPass]);

      // eslint-disable-next-line consistent-return
      useEffect(() => {
        const errorout = setTimeout(() => {
            setshowError(false);
        }, 1000);

        return () => {
            clearTimeout(errorout);
        };
      }, [showError]);

      useEffect(() => {
        if(life === 0 || life < 0) {
            setGameOver(true)
        }
      }, [life]);
      
      // eslint-disable-next-line consistent-return
      useEffect(() => {
        if (combo % 3 === 0 && combo !== 0) {
            setShowCombo(true);
            setScore(score+30);
          const timeout = setTimeout(() => {
            setShowCombo(false);
          }, 2000);
    
          return () => {
            clearTimeout(timeout);
          };
        }
      }, [combo]);

    useEffect(() => {
        let interval;
    
        if (mobileGameStart) {
          interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
          }, 1000);
        }
    
        return () => {
          clearInterval(interval);
        };
      }, [mobileGameStart]);

    
  return (
    <>
        {isMobile && !isTablet && !isGameOver ? (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`${windowDimensions.height}px`,backgroundColor:'black'}}>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/2-50}px`}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                padding: '20px', 
                                height: 'auto', 
                                color: 'white', 
                                fontSize: '32px' // 或者使用像 '24px' 这样的具体值
                            }}>
                                {mobileGameStart === true?
                                <>
                                    <Typography component="legend" style={{ display: 'block',marginRight:'10px'}}>
                                        Level {bigLevel}-{gameLevel}
                                    </Typography>
                                    <Typography component="legend" style={{ display: 'block'}}>
                                        {sessionStorage.getItem('userName')}生命值:
                                    </Typography>
                                    <StyledRating
                                        name="customized-color"
                                        value={life}
                                        max={3}
                                        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                        precision={0.5}
                                        icon={<FavoriteIcon fontSize="inherit" />}
                                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                    /> 
                                </>: 
                                    <Typography variant="h4" gutterBottom>
                                            準備作答
                                    </Typography>}
                            </Grid>
                            {mobileGameStart === true && (
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h6" gutterBottom style={{ color: 'white'}}>
                                                SCORE:   {score}
                                            </Typography>
                                        </Grid>
                            )}
                                {gameWords.map((item, index) => (
                                    mobileGameStart ? (  
                                        <Grid key={item.id} item xs={4} style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <Grid container direction="column" alignItems="center" style={{ color: 'white' }}>
                                            <Grid item xs={3}>
                                            <div>題目{index+1}</div>
                                            </Grid>
                                            <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {!matchItems.includes(item.word) ? (
                                                    <GameMp3Player mp3Url={apiUrl + item.mp3Url} fileName={item.word} setAudioName={setAudioName} />
                                                ) : (
                                                    <AnswerMatch/> // 替代的組件，當條件不滿足時渲染
                                                )}
                                            </Grid>
                                        </Grid>
                                        </Grid>
                                    ) : null
                                ))}
                        </Grid>
                    </Box>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/2+50}px`}}>
                        <Grid container>
                            {boxWords.map((item, index) => (
                            <Grid item xs={4} key={item.id}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                <img
                                    src={mobileGameStart === true ? '/images/openbox.png' : '/images/box.png'}
                                    alt={`fire`}
                                    style={{ width: '80%', height: 'auto' }}
                                />
                                {mobileGameStart === true && (
                                    <Button
                                    variant="outlined"
                                    color="primary"
                                    style={{
                                        position: 'absolute', 
                                        top: '50%',  
                                        left: '50%', 
                                        transform: 'translate(-50%, -50%)', 
                                        zIndex: 1,  
                                        color: 'white',
                                        fontSize: '18px',
                                        width:'90%'
                                    }}
                                    onClick={() => setGameAns(item.word)}
                                    >
                                    {item.word} <br/>
                                    {item.wordChinese}
                                    </Button>
                                )}
                                </div>
                            </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
                {mobileGameStart === false && (
                <Button 
                    variant="outlined"                  
                    style={{
                        position: 'absolute',  // 绝对定位
                        top: '50%',  // 从顶部偏移50%
                        left: '50%',  // 从左侧偏移50%
                        transform: 'translate(-50%, -50%)',  // 使用 transform 进行微调
                        zIndex: 2 , // 设置 z-index 以确保按钮出现在其他元素之上
                        fontSize:'24px',
                        color:'white',
                        border: '2px solid white',  // 设置边框
                        borderWidth: '2px',         // 设置边框宽度
                        borderColor: 'white',      // 设置边框颜色
                        }}
                    endIcon={<SportsMmaIcon style={{ fontSize: '40px' }}/>}
                    onClick={()=>setMobileGameStart(true)}
                >
                    Game Start
                </Button>
                )}
                {showCombo === true && (
                    <Combo comboValue={combo/3}/>
                )}   
                {showError === true && (
                    <Error/>
                )}
                {showCorrect === true && (
                    <Correct/>
                )}
                <Dialog
                    open={dialogOpen}
                    onClose={() =>setDialogOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`恭喜${sessionStorage.getItem('userName')}，準備進入下一關`}                        
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() =>fetchDataAndUpdate(gameLevel)}>OK</Button>
                    </DialogActions>
                </Dialog>                         
            </Box>
        ) : isMobile && !isTablet && isGameOver ? (
            <Box sx={{width: '100%', height:`${windowDimensions.height}px`,backgroundColor:'black',position: 'relative'}}>
                <GameOverView/>
                <Button 
                    variant="outlined"                  
                    style={{
                        position: 'absolute',  // 绝对定位
                        top: '55%',  // 从顶部偏移50%
                        left: '50%',  // 从左侧偏移50%
                        transform: 'translate(-50%, -50%)',  // 使用 transform 进行微调
                        zIndex: 2 , // 设置 z-index 以确保按钮出现在其他元素之上
                        fontSize:'24px',
                        color:'white',
                        border: '2px solid white',  // 设置边框
                        borderWidth: '2px',         // 设置边框宽度
                        borderColor: 'white',      // 设置边框颜色
                        }}
                    endIcon={<SportsMmaIcon style={{ fontSize: '40px' }}/>}
                    onClick={() => {
                        setMobileGameStart(true);
                        setGameOver(false);
                        setLife(3);
                    }}
                >
                    Game Restart
                </Button>
            </Box>
        ) : 
        isTablet ? (
        <div>你正在使用平板设备。</div>
        ) : (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>      
            <Box sx={{
                    width: '20%',
                    height: '800px', 
                }}>
                <Box sx={{ 
                    width: '20%',
                    height: '200px', 
                }}/>
                <Box sx={{ 
                    width: '100%',
                    height: '100px', 
                    display: 'flex',             // 使用 Flex 布局
                    justifyContent: 'center',    // 在水平方向上居中
                    alignItems: 'center',
                }}>
                    <Button variant="contained" endIcon={<NotStartedIcon />} onClick={startGameClick}>
                        {show === true? 'start':'restart'}
                    </Button>
                </Box>
                <Box sx={{ 
                    width: '100%',
                    height: '100px', 
                    display: 'flex',             // 使用 Flex 布局
                    justifyContent: 'center',    // 在水平方向上居中
                    alignItems: 'center', 
                    position: 'relative'
                }}>
                    <img
                        ref={ballRef}
                        src='/images/ball.png'
                        alt='answer'
                        style={{position: 'absolute', top: `${initialBallPosition + ballYPosition}px`, width:70 , height:70}}
                    />
                    {answer && (
                        <span style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor:'white',
                            zIndex: 1,
                            border: '2px solid black',
                            padding:'2px',    // 添加边框
                            borderRadius: '8px',
                            top: `${initialBallPosition + ballYPosition+30}px`, 
                        }}>
                            {answer}
                        </span>
                    )}
                </Box>
                <Box sx={{ 
                    width: '20%',
                    height: '300px', 
                }}/>
                <Box sx={{ 
                    width: '100%',
                    height: '100px', 
                    display: 'flex',             // 使用 Flex 布局
                    justifyContent: 'center',    // 在水平方向上居中
                    alignItems: 'center', 
                    position: 'relative'
                }}>
                    <img
                        ref={hoopRef}
                        src='/images/hoop.png'
                        alt='answer'
                        style={{ position: 'absolute', top: '0px',width:100 , height:100}}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    width: '80%',
                    height: '800px',
                    backgroundColor: 'white',
                    borderLeft: '3px solid black',
                    borderRight: '3px solid black',
                    borderBottom: '3px solid black',
                    borderRadius: '0 0 8px 8px',
                    marginLeft: 'auto',
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${process.env.PUBLIC_URL}/images/gameBack.png)`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', 
                    position: 'relative',
                    
                }}  
            > 
                { !show && (
                    <img
                        src="/images/alarm.gif"
                        alt="your_alt_text_here"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1  // 如果需要让图片显示在其他元素之上
                        }}
                    />
                )}
                            { !show && (
                                <Alert severity="warning">作答時間已結束 Time Up</Alert>
                )}           
                <Grid container spacing={2}>
                {words.map((word, index) => {
                    const imageName = imageNames[index % imageNames.length];
                    const initPos = initialPositions[index];
                    return (
                        show && (
                        <Grid item xs={1} key={index} sx={{marginRight:'1%'}}>
                            <animated.div
                                // eslint-disable-next-line no-return-assign
                                ref={(el) => tetrisRefs.current[index] = el}
                                style={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: 8,
                                    ...springs1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/${imageName}.png)`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            >                                              
                                        <Button variant="contained" size="medium" style={{backgroundColor:'white',color:'black'}} onClick={()=>sendAnswer(word)}>
                                            {word}
                                        </Button>
                            </animated.div>
                        </Grid>)
                    );
                })}                 
                </Grid>
                
                <div ref={containerRef} style={{ display: 'flex', justifyContent: 'space-around', alignSelf: 'flex-end',width:'100%' }}>
                {Array.from({ length: numImages }).map((_, index) => (
                    <img
                    ref={gifRef}
                    key={index}
                    src='/images/campfire.gif'
                    alt={`fire`}
                    style={{ width: 64, height: 64 }}
                    />
                ))}
                </div>
            </Box>
            </Box>
        )}
    </>
  );
}

