import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import StudentSearch from './StudentSearch';
import '@fontsource/roboto/700.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'account',
    headerName: '帳號',
    width: 150,
    editable: true,
  },
  {
    field: 'name',
    headerName: '姓名',
    width: 150,
    editable: true,
  },
  {
    field: 'log',
    headerName: '查看紀錄',
    width: 150,
    renderCell: (params) => (
      <Button variant='contained' startIcon={<SearchIcon />}>log</Button>
    ),
  },

];

// const rows = [
//   { id: 1, name: 'Snow', account: 'Jon'}
// ];

export default function StudentLog() {
  const [rows,setRows] = React.useState([{ id: 1, name: 'Snow', account: 'Jon'}])
  const [filterRows,setFilterRows] = React.useState(rows)

  return (
    <Box sx={{ height: 400, width: '100%' }}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        學員列表
        </Typography>
        <StudentSearch rows={rows} setFilterRows={setFilterRows}/>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<PlaylistAddIcon />}>
            Multiple Add
          </Button>
          <Button variant="outlined" startIcon={<AddCircleIcon />}>
            Single Add
          </Button>
        </Stack>
        <DataGrid
            rows={filterRows}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 15,
                },
            },
            }}
            pageSizeOptions={[10,15,20]}            
            disableRowSelectionOnClick
        />
    </Box>
  );
}
