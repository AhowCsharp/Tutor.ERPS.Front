import React, { useState } from 'react';
import 'animate.css/animate.min.css';

function Combo({comboValue}) {
    return (
        <h1 className="animate__animated animate__bounce" 
                    style={{color:'red',                        
                        position: 'absolute',  // 绝对定位
                        top: '25%',  // 从顶部偏移50%
                        left: '30%',  // 从左侧偏移50%
                        transform: 'translate(-50%, -50%)',  // 使用 transform 进行微调
                        zIndex: 2 , // 设置 z-index 以确保按钮出现在其他元素之上
                        fontSize:'40px'}}>
          Combo {comboValue}
        </h1>
    ); 
}
export default Combo;