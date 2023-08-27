import React, { useState } from 'react';
import 'animate.css/animate.min.css';

function Correct() {
    return (
        <img
        src='/images/okay.gif'
        alt='answer'
        style={{color:'red',
        width:'20%',                        
        height:'auto',                        
        position: 'absolute',  // 绝对定位
        top: '35%',  // 从顶部偏移50%
        left: '50%',  // 从左侧偏移50%
        transform: 'translate(-50%, -50%)',  // 使用 transform 进行微调
        zIndex: 2 }}
    />
    ); 
}
export default Correct;