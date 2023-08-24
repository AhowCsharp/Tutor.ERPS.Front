import * as React from 'react';
import { useState,useRef,useEffect} from 'react';
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
import AnswerDrag from './AnswerDrag';
import GameMp3Player from './GameMp3Player';


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
    const imageAltArray = [
        "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"
    ];
    const imageNames = ['I', 'L', 'T', 'Z'];

    const [ballYPosition, setBallYPosition] = useState(0);
    const [initialBallPosition, setInitialBallPosition] = useState(0);
    const [hoopPosition, setHoopPosition] = useState(0);
    const ballRef = useRef(null);
    const hoopRef = useRef(null);

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

    useEffect(() => {
        if (audioName && gameAns) {
            console.log(audioName,gameAns)
          if(audioName === gameAns) {
            alert('100分')
            setAudioName(null);setGameAns(null);
          }else {
            alert('0分');
            setLife(life-1)
            // try {
            //     response = await axios.post('')
            // }
            setAudioName(null);setGameAns(null);
          }
        }
      }, [audioName, gameAns]);

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
        {isMobile && !isTablet ? (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`${windowDimensions.height}px`,backgroundColor:'black'}}>
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
                                    Level 1-1
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
                                <Typography variant="h6" gutterBottom style={{color:'white',marginLeft:'15px',marginTop:'8px'}}>
                                        SCORE:
                                </Typography>
                            </>: 
                                <Typography variant="h4" gutterBottom>
                                        準備作答
                                </Typography>}
                        </Grid>
                        <Grid item xs={4} style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Grid container direction="column" alignItems="center" style={{ color: 'white' }}>
                                <Grid item  xs={3}>
                                    <div>666</div>
                                </Grid>
                                <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <GameMp3Player mp3Url={'/recordingfile/abroad.mp3'} fileName={'666'} setAudioName={setAudioName}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4} style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Grid container direction="column" alignItems="center"style={{ color: 'white' }}>
                                <Grid item  xs={3} >
                                    <div>abroad</div>
                                </Grid>
                                <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {mobileGameStart === true?<GameMp3Player mp3Url={'/recordingfile/abroad.mp3'} fileName={'abroad'} setAudioName={setAudioName}/>:null}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={4}>
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
                                onClick={() => setGameAns('abroad')}
                                >
                                abroad
                                </Button>
                            )}
                            </div>
                        </Grid>
                        <Grid item xs={4}>
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
                                onClick={() => setGameAns('按钮6666')}
                                >
                                按钮6666
                                </Button>
                            )}
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                {mobileGameStart === false && (
                <Button 
                    variant="outlined"
                    color="error"
                    style={{
                        position: 'absolute',  // 绝对定位
                        top: '50%',  // 从顶部偏移50%
                        left: '50%',  // 从左侧偏移50%
                        transform: 'translate(-50%, -50%)',  // 使用 transform 进行微调
                        zIndex: 2 , // 设置 z-index 以确保按钮出现在其他元素之上
                        fontSize:'24px'
                    }}
                    endIcon={<SportsMmaIcon style={{ fontSize: '40px' }}/>}
                    onClick={()=>setMobileGameStart(true)}
                >
                    Game Start
                </Button>
                )}
            </Box>
        ) : isTablet ? (
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

