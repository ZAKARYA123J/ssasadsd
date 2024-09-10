"use client";
import React, { useContext, useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { FaPlus } from "react-icons/fa";
import Link from 'next/link';
import { DataContext } from '@/contexts/post';
import { useRouter } from 'next/navigation';
import { MdAddCard } from "react-icons/md";
import AddOrderDialog from '../OrderDialog';
import SearchPost from "./SearchPost"
const DataTable = () => {
  const { data, loading, error } = useContext(DataContext);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for AddOrderDialog
  const [selectedPostId, setSelectedPostId] = useState(""); // State for selected postId

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleClickOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${selectedId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      console.log('Delete successful');
      // Update the UI after deletion
      setData((prevData) => prevData.filter(item => item.id !== selectedId));
      handleClose(); // Close the dialog after deletion
  
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };
  const handleUpdate = (id) => {
    router.push(`/dashboard/update/${id}`);
  };

  const handleDetail = (id, Detail) => {
    if (Detail) {
      // If the detail exists, redirect to the show page
      router.push(`/dashboard/show/${id}`);
    } else {
      // If the detail does not exist, redirect to the create page
      router.push(`/dashboard/detail/${id}`);
    }
  };
  


  const handleAddOrder = (postId) => {
    setSelectedPostId(postId);
    setDialogOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon style={{ color: 'green', marginRight: '5px' }} />
            <span>Available</span>
          </div>
        );
      case 'unavailable':
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HourglassEmptyIcon style={{ color: 'orange', marginRight: '5px' }} />
            <span>Unavailable</span>
          </div>
        );
      case 'taken':
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon style={{ color: 'red', marginRight: '5px' }} />
            <span>Taken</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <SearchPost/>
      <div style={{ textAlign: 'right', marginBottom: "10px" }}>
        <Link href="/dashboard/insert" passHref>
          <Button variant="contained">Add <FaPlus style={{ marginLeft: "2px" }} /></Button>
        </Link>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.adress}</TableCell>
                  <TableCell>{row.ville}</TableCell>
                  <TableCell>{row.category?.name || 'N/A'}</TableCell>
                  <TableCell>{getStatusIcon(row.status)}</TableCell>
                  <TableCell >
  {row.DateReserve ? (
    <span style={{ color: 'black' }}>ordered</span>
  ) : (
    <IconButton onClick={() => handleAddOrder(row.id)}>
      <MdAddCard fontSize={25} style={{color:"#1e90ff"}} />
    </IconButton>
  )}
</TableCell>

                  <TableCell >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => handleDetail(row.id, row.Detail)}>
  <InfoIcon />
</IconButton>

                      <IconButton onClick={() => handleUpdate(row.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleClickOpen(row.id)} style={{ color: 'red' }}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddOrderDialog 
  open={dialogOpen} 
  onClose={() => setDialogOpen(false)} 
  selectedPostId={selectedPostId || undefined} 
/>

    </>
  );
};

export default DataTable;
