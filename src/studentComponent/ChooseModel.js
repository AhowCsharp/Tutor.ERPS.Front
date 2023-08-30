import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { isMobile,isTablet,deviceType  } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

// style={{height:'50%'}}
export default function ChooseModel() {
    const navigate = useNavigate();

    const hardNav = () => {
        navigate('/student/test');  // Navigate after closing the dialog
      };
    const easyNav = () => {
    navigate('/student/game');  // Navigate after closing the dialog
    };
    const logNav = () => {
        navigate('/student/log');  // Navigate after closing the dialog
    };

    return (
      <>
      <div style={{
        position: 'relative', 
                            width: '100%',
                            height: deviceType === 'mobile' ? '80px' : '130px',
                            backgroundColor: 'lightblue',
                        }}/>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: deviceType === 'mobile' ? '100%' : '800px',
          backgroundColor: 'transparent',
        //   '&:hover': {
        //     backgroundColor: 'primary.main',
        //     opacity: [0.9, 0.8, 0.7],
        //   },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: '1',
          }}
        >
          <Box
            sx={{
              flex: '1',
              backgroundColor: 'lightblue', 
              display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',// 僅為了清楚看到這個 Box
            }}
          >
                <div
                    style={{
                    width: '50%',
                    paddingTop: '50%', // 設定高度為父容器寬度的一半
                    backgroundColor: 'lightblue',
                    borderRadius: '10%',
                    position: 'relative', // 為了讓內部內容能夠正確地定位
                    }}
                >
                    <button
                    onClick={easyNav}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: deviceType === 'mobile' ? '#58c1ff' : '#58c1ff', // 手機和其他設備的不同背景顏色
                        borderTopLeftRadius: deviceType === 'tablet' ? '10px' : '20px', // 平板和其他設備的不同圓角
                        borderTopRightRadius: deviceType === 'tablet' ? '10px' : '20px',
                        borderBottomLeftRadius: deviceType === 'tablet' ? '10px' : '20px',
                        borderBottomRightRadius: deviceType === 'tablet' ? '10px' : '20px',
                        border: 'none',
                        fontSize: deviceType === 'mobile' ? '20px' : deviceType === 'tablet' ? '40px' : '60px',
                        fontWeight: 'bold'
                    }}
                    >
                    初學者<br/>
                    選這邊
                    </button>
                    <div
                        style={{
                            position: 'absolute',
                            top: deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            right: deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            width: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            height: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: deviceType === 'mobile' ? '20px' : deviceType === 'tablet' ? '27px' : '35px'
                        }}
                        >
                        單字
                        </div>
                        <div
                        style={{
                            position: 'absolute',
                            bottom:  deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            left: deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            width: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            height: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            fontSize: deviceType === 'mobile' ? '20px' : deviceType === 'tablet' ? '27px' : '35px',
                            fontWeight: 'bold'
                        }}
                        >
                        遊戲
                        </div>
                </div>
          </Box>
          <Box
            sx={{
              flex: '1',
              backgroundColor: 'lightblue', 
              display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',// 僅為了清楚看到這個 Box
            }}
          >
                <div
                    style={{
                    width: '50%',
                    paddingTop: '50%', // 設定高度為父容器寬度的一半
                    backgroundColor: 'lightblue',
                    borderRadius: '10%',
                    position: 'relative', // 為了讓內部內容能夠正確地定位
                    }}
                >
                    <button
                    onClick={hardNav}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: deviceType === 'mobile' ? '#58c1ff' : '#58c1ff', // 手機和其他設備的不同背景顏色
                        borderTopLeftRadius: deviceType === 'tablet' ? '10px' : '20px', // 平板和其他設備的不同圓角
                        borderTopRightRadius: deviceType === 'tablet' ? '10px' : '20px',
                        borderBottomLeftRadius: deviceType === 'tablet' ? '10px' : '20px',
                        borderBottomRightRadius: deviceType === 'tablet' ? '10px' : '20px',
                        border: 'none' ,
                        fontSize:deviceType === 'mobile' ? '20px' : deviceType === 'tablet' ? '40px' : '60px',
                        fontWeight: 'bold'
                    }}
                    >
                    進階者<br/>
                    選這邊
                    </button>
                    <div
                        style={{
                            position: 'absolute',
                            top: deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            right: deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            width: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            height: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            fontSize: deviceType === 'mobile' ? '20px' : deviceType === 'tablet' ? '27px' : '35px',
                            fontWeight: 'bold'
                        }}
                        >
                        聽力
                        </div>
                        <div
                        style={{
                            position: 'absolute',
                            bottom:  deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            left: deviceType === 'mobile' ? '-30px' : deviceType === 'tablet' ? '-40px' : '-50px',
                            width: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            height: deviceType === 'mobile' ? '60px' : deviceType === 'tablet' ? '80px' : '100px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            fontSize:deviceType === 'mobile' ? '20px' : deviceType === 'tablet' ? '27px' : '35px',
                            fontWeight: 'bold'
                        }}
                        >
                        練習
                        </div>
                </div>
          </Box>
        </Box>
        <Box
          sx={{
            flex: '1',
            backgroundColor: 'lightblue', 
            display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',// 僅為了清楚看到這個 Box
          }}
        >
            <Button variant="contained" size="large" style={{width:'70%',backgroundColor:'#58c1ff'}} onClick={logNav}>
                學習紀錄
            </Button>
        </Box>
      </Box>
      </>
    );
  }