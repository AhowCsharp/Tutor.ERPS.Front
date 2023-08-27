import * as React from 'react';
import { useState,useRef,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { apiUrl } from '../apiUrl/ApiUrl';
import { token } from '../token/Token';

export default function StudentProfile() {
    const [studentData, setStudentData] = useState(null);
    const [prePass,setPrePass] = useState('');
    const [check , checkpass] = useState('');
    const [formData, setFormData] = useState({
        account: '',
        email: '',
        password: '',
        name: '',
        id:0,
        editor:sessionStorage.getItem('userName')
      });
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('studentAccount');
        if (!token) {
        navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        setFormData({
          account: studentData !== null? studentData.account: '',
          email: studentData !== null? studentData.email: '',
          password: '',
          name: studentData !== null? studentData.name: '',
          id: studentData !== null? studentData.id: 0,
          editor:sessionStorage.getItem('userName')
        });
        checkpass(studentData !== null? studentData.password: '');
      }, [studentData]);

    useEffect(() => {
        const id = parseInt(sessionStorage.getItem('id'), 10);

        const fetchData = async () => {
          try {
            const response = await axios.post(
                `${apiUrl}/member/studentprofile`,
                id, // 直接傳遞 id 到 body
                {
                  headers: {
                    'X-Ap-Token': token,
                    'Content-Type': 'application/json'
                  }
                }
              );
            
    
            if (response.status === 200) {
              setStudentData(response.data.Member);
            } else {
              console.error('An error occurred while fetching data.');
            }
          } catch (error) {
            console.error('An exception occurred while fetching data: ', error);
          }
        };
    
        fetchData();
      }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

      const handleUpdate = async () => {
        console.log(formData)
        if(check === prePass)   {
            try {
                const response = await axios.post(
                  `${apiUrl}/member/editInfo`, // 假設這是你的更新 API endpoint
                  formData,
                  {
                    headers: {
                      'X-Ap-Token': token,
                      'Content-Type': 'application/json'
                    }
                  }
                );
                if (response.status === 200) {
                  alert('資料更新成功');
                  // 可以這裡更新 studentData
                } else {
                  console.log('資料更新失敗');
                }
              } catch (error) {
                console.error('資料更新過程中出錯', error);
              }
        }else{
            alert('請輸入之前的密碼才能更改')
        }
        
      };

  return (
    <>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '60%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          label="Account"
          name="account"
          value={formData.account} // 設定 value
          onChange={handleInputChange} // 新增 onChange handler
        />
        <TextField
        
          label="Email"
          name="email"
          value={formData.email} // 設定 value
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          name="password"
          value={formData.password} // 設定 value
          onChange={handleInputChange}
        />
        <TextField
          label="PrePassword"
          placeholder='請輸入之前的密碼'
          value={prePass}
          onChange={(e) => setPrePass(e.target.value)}
        />
        <TextField
          label="Name"
          name="name"
          value={formData.name} // 設定 value
          onChange={handleInputChange}
        />
      </div>
    </Box>
    <Button variant="contained" endIcon={<SendIcon />} style={{marginLeft:'30%'}} onClick={handleUpdate}>
    Send
    </Button>
    </>
  );
}