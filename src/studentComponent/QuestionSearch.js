import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, OutlinedInput, InputAdornment } from '@mui/material';
import Iconify from '../components/iconify/Iconify';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

export default function QuestionSearch({ rows, setFilterRows }) {
  const [filterValue, setFilterValue] = useState('');


  
  const handleFilter = (event) => {
    const searchValue = event.target.value;
    setFilterValue(searchValue);
    if (searchValue === '') {
      // 如果搜索值為空，返回原始行
      setFilterRows(rows);
    } else {
      // 過濾學生列表
      const filteredStudents = rows.filter((item) => {
        // 如果搜索值是"NULL"，仅返回isPassing字段为null的项
        if (searchValue === "n") {
          return item.isPassing === null;
        }
        
        // 对于questionNum字段
        const matchQuestionNum = item.questionNum.toString().includes(searchValue);
      
        // 对于isPassing字段
        const matchIsPassing = item.isPassing !== null ? item.isPassing.toString().includes(searchValue) : false;
      
        // 如果任一匹配项为真，则返回true
        return matchQuestionNum || matchIsPassing;
      });
      
      // 將過濾後的學生列表返回給父組件
      setFilterRows(filteredStudents);
    }
  };

  return (
    <StyledRoot>
      <StyledSearch
        value={filterValue}
        onChange={handleFilter}
        placeholder="Search Question..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
      <Tooltip title="Filter list">
        <IconButton>
          <Iconify icon="ic:round-filter-list" />
        </IconButton>
      </Tooltip>
    </StyledRoot>
  );
}
