import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// @mui
import { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Iconify from '../../../components/iconify';
import { apiUrl } from '../../../apiUrl/ApiUrl';



export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [student,isStudent] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [openForm,setOpenForm]= useState(false);
  const currentDate = new Date().toLocaleDateString('en-CA');
  const nowDate = new Date();
  const yyyy = nowDate.getFullYear();
  const mm = String(nowDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1
  const dd = String(nowDate.getDate()+7).padStart(2, '0');
  const formatEndDate = `${yyyy}-${mm}-${dd}`;
  const [member,setMember] = React.useState({
    name:'',
    account:'',
    password:'',
    email:'',
    createDate:currentDate,
    endDate:formatEndDate,
    startDate:currentDate,
    studyLevel:0,
    creator:'ahow',
    editor:'ahow',
    beDeleted:0,
    status:1,
    id:0
  })

  const handleFormClickOpen = () => {
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
  };

  const handleValidate = async () => {
    // 驗證 CAPTCHA
    const uuid = sessionStorage.getItem('uuid');
    const response = await axios.post(`${apiUrl}/login/ValidateCaptcha`, { userInput,uuid })
    if(response.data.isPass) {
      handleLogin();
    }else {
      alert('圖形驗證失敗')     
    }   
  };

  const handleRegister = async () => {
    // 驗證 CAPTCHA
    console.log(member);
    handleFormClose();
    // const uuid = sessionStorage.getItem('uuid');
    // const response = await axios.post(`${apiUrl}/login/ValidateCaptcha`, { userInput,uuid })
    // if(response.data.isPass) {
    //   handleLogin();
    // }else {
    //   alert('圖形驗證失敗')     
    // }   
  };

  useEffect(() => {
    sessionStorage.setItem('uuid',uuidv4())
  }, []);
  const handleLogin = async () => {
    // handleValidate();
    let isStudentTemp = false;
    try {
      const response = await axios.post(`${apiUrl}/login/verify`, { account, password });
  
      if (response.status === 200) {
        if (response.data.adminManageDTO !== null) {
          sessionStorage.setItem('jwtToken', response.data.adminManageDTO.jwttoken);
          sessionStorage.setItem('userName', response.data.adminManageDTO.name);
          sessionStorage.setItem('level', response.data.adminManageDTO.adminLevel);
          isStudentTemp = false;
          setIsLogin(true);
          isStudent(isStudentTemp);
          setOpen(true);
        } else if(response.data.memberDTO.dateStatus) {
            sessionStorage.setItem('userName', response.data.memberDTO.name);
            sessionStorage.setItem('studentAccount', response.data.memberDTO.account);
            sessionStorage.setItem('level', response.data.memberDTO.studyLevel);
            sessionStorage.setItem('id', response.data.memberDTO.id);
            isStudentTemp = true;
            setIsLogin(true);
            isStudent(isStudentTemp);
            setOpen(true);
        } else
        {
          alert('帳號密碼已失效,請聯絡管理員開通')
          sessionStorage.clear();
          setIsLogin(false);
        }        
      } else {
        // Handle error
        sessionStorage.clear();
        setOpen(true);
        setIsLogin(false);
      }
    } catch (error) {
      sessionStorage.clear();
      setOpen(true);
      setIsLogin(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (isLogin) {
      if(student) {
        studentNav();
      }else {
        nav();
      }
    }
  };

  const nav = () => {
    navigate('/dashboard', { replace: true });  // Navigate after closing the dialog
  };
  const studentNav = () => {
    navigate('/student', { replace: true });  // Navigate after closing the dialog
  };
  const handleInputChange = (event, propertyName) => {
    let value = event.target.value;

    if (propertyName === 'studyLevel' && value) {
        value = Number(value);
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(value)) {
            console.warn('studyLevel requires a numeric value');
            return;
        }
    }

    setMember((prevData) => ({
      ...prevData,
      [propertyName]: value,
    }));
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="account" label="Account" 
        onChange={(e) => setAccount(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleValidate();  // 呼叫你的登錄函數
          }
        }}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleValidate();  // 呼叫你的登錄函數
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div style={{ display: 'flex', height: '100%' }}>
            <Box style={{ width: '20%', height: '100%'}}>
              {sessionStorage.getItem('uuid') !== ""?
                <img src={`${apiUrl}/login/imgverify?uuid=${sessionStorage.getItem('uuid')}`} alt="CAPTCHA" style={{ height: '100%', width: 'auto' }} />
                :null
              }
            </Box>
            <Box style={{ width: '70%', height: '100%', border: '1px',marginLeft:'25px' }}>
                <TextField name="verify" label="圖形驗證" size="small" 
                onChange={(e) => setUserInput(e.target.value)} 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleValidate();  // 呼叫你的登錄函數
                  }
                }}/>
            </Box>
        </div>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover" onClick={handleFormClickOpen}>
          註冊帳號試玩
        </Link>
      </Stack>

      <LoadingButton style={{marginTop:'20px'}} fullWidth size="large" type="submit" variant="contained" onClick={handleValidate}>
        Login
      </LoadingButton>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{isLogin ? `${sessionStorage.getItem('userName')}，您好！` : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          {isLogin ? "登入成功 按下OK轉導頁面" : "登入失敗，請再試一次"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>歐美多益學苑體驗</DialogTitle>
        <DialogContent>
          <DialogContentText>
                註冊試玩帳號
          </DialogContentText>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="姓名"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'name')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="account"
            label="帳號"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'account')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="信箱"
            type="email"
            variant="standard"
            onChange={(e) => handleInputChange(e, 'email')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="密碼"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, 'password')}
          />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleRegister}>註冊</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
