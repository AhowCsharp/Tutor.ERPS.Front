import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { apiUrl } from '../../apiUrl/ApiUrl';
import { token } from '../../token/Token';

export default function PointManage() {
    const [pointThreshold, setPointThreshold] = useState(0); // 初始化分數門檻的狀態


    useEffect(() => {
        // 這個 function 會在組件 mount 和 update 時運行
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiUrl}/sentence/point`, {
                headers: {
                  'X-Ap-Token':`${token}`
                }
              });
              setPointThreshold(response.data.Point.PassPoint)
          } catch (error) {
            console.error('無法取得資料:', error);
          }
        };
    
        fetchData();
      }, []); 

    const handleSend = async () => {
        try {
            const response = await axios.get(`${apiUrl}/sentence/editpoint?point=${pointThreshold}`, {
                headers: {
                    'X-Ap-Token': `${token}`
                }
            });
            // 處理回應，例如設置新的狀態或顯示成功訊息
            alert('修改成功')
            setPointThreshold(response.data.Point.PassPoint)
            console.log(response.data);
        } catch (error) {
            alert('修改失敗')
        }
    };
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="outlined-required"
            label="分數門檻"
            value={pointThreshold}
            onChange={(e)=>setPointThreshold(e.target.value)}
          />

        </div>
        <Button variant="contained" endIcon={<SendIcon />} onClick={handleSend}>
            Send
        </Button>
      </Box>
    );
  }