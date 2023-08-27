import React, { useState } from 'react';
import 'animate.css/animate.min.css';

function GameOverView() {
    return (
        <h1 className="animate__animated animate__rotateIn" 
                    style={{color:'red',                        
                        position: 'absolute',  // 绝对定位
                        top: '35%',  // 从顶部偏移50%
                        left: '18%',  // 从左侧偏移50%
                        transform: 'translate(-50%, -50%)',  // 使用 transform 进行微调
                        zIndex: 2 , // 设置 z-index 以确保按钮出现在其他元素之上
                        fontSize:'50px'}}>
          Game Over
        </h1>
    ); 
}
export default GameOverView;