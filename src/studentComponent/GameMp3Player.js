import { useState,useRef,useEffect} from 'react';
import IconButton from "@mui/material/IconButton";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

export default function GameMp3Player({ mp3Url,fileName,setAudioName }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
  
    const playAudio = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
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
      audioRef.current = new Audio(mp3Url);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
          audioRef.current.removeEventListener('ended', handleAudioEnd);
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
  
