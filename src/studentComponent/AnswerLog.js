import { useLocation,useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import LogSearch from '../erps/studentLogList/LogSearch';
import { apiUrl } from '../apiUrl/ApiUrl';
import { token } from '../token/Token'


const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'questionType',
      headerName: '類型',
      width: 150,
      editable: false,
    },
    {
      field: 'questionNumber',
      headerName: '題號',
      width: 100,
      editable: false,
    },
    {
      field: 'answerLog',
      headerName: '回答紀錄',
      width: 600,
      editable: false,
    },
    {
        field: 'costTime',
        headerName: '耗時',
        width: 100,
        editable: false,
    },
    {
        field: 'answerDate',
        headerName: '作答日期',
        width: 150,
        editable: true,
        renderCell: (params) => {
          const date = new Date(params.value);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
    },
    {
        field: 'status',
        headerName: '狀態',
        description: 'This column has a value formatter and is not sortable.',
        width: 80,
        valueFormatter: (params) => params.value === 0 ? '未完成' : '完成',
      },
     
  ];
   
  export default function AnswerLog() {
    const [rows,setRows] = React.useState([])
    const [filterRows,setFilterRows] = React.useState([])


    
    useEffect(() => {
        // 定義非同步 function 來獲取數據
        const fetchData = async () => {
          try {
            
            const response = await axios.get(`${apiUrl}/member/studentLog?id=${sessionStorage.getItem('id')}`, {
              headers: {
                'X-Ap-Token':`${token}`
              }
            });
            // 檢查響應的結果，並設置到 state
            if (response.status === 200) {
              setRows(response.data.List);
              setFilterRows(response.data.List);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []); 

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <LogSearch rows={rows} setFilterRows={setFilterRows}/>
        <DataGrid
          rows={filterRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    );
  }