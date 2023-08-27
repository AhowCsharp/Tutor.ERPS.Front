import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [captchaSrc, setCaptchaSrc] = useState('');
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // 獲取 CAPTCHA 圖像
    axios.get(`${apiUrl}/login/imgverify`, { responseType: 'arraybuffer' })
      .then(response => {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        setCaptchaSrc(`data:image/png;base64,${base64}`);
      });
  }, []);



  const handleValidate = () => {
    // 驗證 CAPTCHA
    axios.post(`${apiUrl}/login/ValidateCaptcha`, { userInput })
      .then(response => {
        if (response.data.success) {
          alert('CAPTCHA 驗證成功');
        } else {
          alert('CAPTCHA 驗證失敗');
        }
      });
  };
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
        } else {
          sessionStorage.setItem('userName', response.data.memberDTO.name);
          sessionStorage.setItem('studentAccount', response.data.memberDTO.account);
          sessionStorage.setItem('level', response.data.memberDTO.studyLevel);
          sessionStorage.setItem('id', response.data.memberDTO.id);
          isStudentTemp = true;
        }
        
        setIsLogin(true);
        isStudent(isStudentTemp);
        setOpen(true);
        
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

  return (
    <>
      <Stack spacing={3}>
        <TextField name="account" label="Account" onChange={(e) => setAccount(e.target.value)}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
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
                <img src={captchaSrc} alt="CAPTCHA" style={{ height: '100%', width: 'auto' }} />
            </Box>
            <Box style={{ width: '70%', height: '100%', border: '1px',marginLeft:'25px' }}>
                <TextField name="verify" label="圖形驗證" size="small" onChange={(e) => setUserInput(e.target.value)} />
            </Box>
        </div>
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      <LoadingButton style={{marginTop:'20px'}} fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
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
    </>
  );
}
