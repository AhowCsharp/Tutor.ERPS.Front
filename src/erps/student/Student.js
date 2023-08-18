import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import StudentSearch from './StudentSearch';
import '@fontsource/roboto/700.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: '姓名',
    width: 150,
    editable: true,
  },
  {
    field: 'account',
    headerName: '帳號',
    width: 150,
    editable: true,
  },
  {
    field: 'email',
    headerName: '信箱',
    width: 150,
    editable: true,
  },
  {
    field: 'password',
    headerName: '密碼',
    width: 150,
    editable: true,
  },
  {
    field: 'createDate',
    headerName: '創建日期',
    width: 150,
    editable: true,
  },
  {
    field: 'startDate',
    headerName: '生效日期',
    width: 150,
    editable: true,
  },
  {
    field: 'endDate',
    headerName: '失效日期',
    width: 150,
    editable: true,
  },
  {
    field: 'studyLevel',
    headerName: '學習權限',
    type:'number',
    width: 150,
    editable: true,
  },
];

// const rows = [
//   { id: 1, name: 'Snow', account: 'Jon', email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' , email: 'Jon' },
// ];

export default function Student() {
  const [rows,setRows] = React.useState([])
  return (
    <Box sx={{ height: 400, width: '100%' }}>
        <Typography style={{ textAlign: 'center' }} variant="h1" gutterBottom>
        學員列表
        </Typography>
        <StudentSearch />
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<PlaylistAddIcon />}>
            Multiple Add
          </Button>
          <Button variant="outlined" startIcon={<AddCircleIcon />}>
            Single Add
          </Button>
        </Stack>
        <DataGrid
            rows={rows}
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
