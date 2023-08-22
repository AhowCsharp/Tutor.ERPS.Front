import * as React from 'react';
import { useState,useRef,useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useSpring, animated } from '@react-spring/web'
import Button from '@mui/material/Button';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AnswerDrag from './AnswerDrag';

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

    

  return (
    <>
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
    </>
  );
}


// const DraggableButton = ({ word,initX,initY }) => {
//     const [isDragging, setIsDragging] = useState(false);
//     const [initialX, setInitialX] = useState(0);
//     const [initialY, setInitialY] = useState(0);
//     const [buttonPosition, setButtonPosition] = useState({ left: initX, top: initY });
//     const [currentX, setCurrentX] = useState(0);
//     const [currentY, setCurrentY] = useState(0);
  
//     const handleMouseDown = (event) => {
//       setIsDragging(true);
//       setInitialX(event.clientX);
//       setInitialY(event.clientY);
//     };

//     useEffect(() => {
//         if (initX !== null && initY !== null) {
//           setButtonPosition({ left: initX, top: initY });
//         }
//     }, [initX, initY]);
  
//     const handleMouseMove = (event) => {
//       if (!isDragging) return;
  
//       const offsetX = event.clientX - initialX;
//       const offsetY = event.clientY - initialY;
  
//       setButtonPosition((prevPosition) => ({
//         left: prevPosition.left + offsetX,
//         top: prevPosition.top + offsetY,
//       }));
//       setCurrentX(prevX => prevX + offsetX);
//       setCurrentY(prevY => prevY + offsetY);
//       setInitialX(event.clientX);
//       setInitialY(event.clientY);
//     };
  
//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', height: '100%' }}>
//         <button
//           type="button"
//           id="draggableButton"
//           style={{
//             backgroundColor: 'rgba(255, 255, 255, 1)',
//             border: '3px solid black',
//             color: 'black',
//             cursor: 'pointer',
//             fontSize:'20px',
//             width: 'auto', // 定义按钮宽度
//             height: 'auto', // 定义按钮高度
//             marginLeft: `${buttonPosition.left}px`, // 调整 left 和 top 属性
//             marginTop: `${buttonPosition.top}px`, // 调整 left 和 top 属性
//           }}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//         >
//           {word}
//         </button>
//       </div>
//     );
//   };