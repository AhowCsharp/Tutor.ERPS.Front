import { useState, useRef, useEffect } from 'react';
import IconButton from "@mui/material/IconButton";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';

export default function AnswerMatch() {
    return (
        <Button variant="contained" color="success" endIcon={<CheckCircleIcon />} style={{marginTop:'10px'}}>
            Success
        </Button>
    );
}
