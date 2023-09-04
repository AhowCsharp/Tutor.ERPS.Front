import { useState, useRef, useEffect } from 'react';
import IconButton from "@mui/material/IconButton";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

export default function GameMp3Player({ mp3Url, fileName, setAudioName, startTimer }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(mp3Url)); // Initialize the audio reference

    const playAudio = () => {
        startTimer()
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();                
                if(startTimer!== null)  {
                    startTimer();
                }
            } else {
                audioRef.current.play();
                setAudioName(fileName);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    useEffect(() => {
        audioRef.current.src = mp3Url; // 更新音频的 URL
        audioRef.current.addEventListener('ended', handleAudioEnd); // 添加监听器
        return () => {
            if (audioRef.current) {
                audioRef.current.pause(); // 暂停音频
                audioRef.current.removeEventListener('ended', handleAudioEnd); // 移除监听器
            }
        };
    }, [mp3Url]);

    return (
        <IconButton
            style={{ color: 'white' }}
            aria-label="Play audio"
            onClick={playAudio}
        >
            {isPlaying ? (
                <PauseCircleOutlineIcon fontSize="large" />
            ) : (
                <PlayCircleOutlineIcon fontSize="large" />
            )}
        </IconButton>
    );
}
