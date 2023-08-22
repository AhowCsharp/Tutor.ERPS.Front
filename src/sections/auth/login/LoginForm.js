import * as React from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useState,useContext } from 'react';
import axios from 'axios';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Button from '@mui/material/Button';
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

  const handleClose = () => {
    setOpen(false);
    if (isLogin) {
        nav();
    }
  };
  const nav = () => {
    navigate('/dashboard', { replace: true });  // Navigate after closing the dialog
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/login/verify`, { account, password });
  
      if (response.status === 200) {
          console.log(response.data)
          if(response.data.adminManageDTO !== null) {
            setOpen(true)
            sessionStorage.setItem('jwtToken', response.data.adminManageDTO.jwttoken);
            sessionStorage.setItem('userName', response.data.adminManageDTO.name);
            sessionStorage.setItem('level', response.data.adminManageDTO.adminLevel);
          }else {
            setOpen(true)
            sessionStorage.setItem('userName', response.data.memberDTO.name);
            sessionStorage.setItem('studentAccount', response.data.memberDTO.account);
            sessionStorage.setItem('level', response.data.memberDTO.studyLevel);
            sessionStorage.setItem('id', response.data.memberDTO.id);
          }         
          setIsLogin(true);
      } else {
        // Handle error
        sessionStorage.clear(); // Clear sessionStorage
        setOpen(true)
        setIsLogin(false);
      }
    } catch (error) {
      sessionStorage.clear(); // Clear sessionStorage
      setOpen(true)
      setIsLogin(false);
    }
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
