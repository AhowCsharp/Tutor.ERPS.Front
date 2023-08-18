import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';



export default function Audio({mp3Url}) {

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <audio controls>
      <source src={`/recordingfile/${mp3Url}`} type="audio/mpeg" />
        <track kind="captions" src="/path/to/captions.vtt" srcLang="en" label="English" default/>
            Your browser does not support the audio element.
      </audio>
    </Box>
  );
}
