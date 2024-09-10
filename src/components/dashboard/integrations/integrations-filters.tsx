import React, { useContext, useState } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DataContext } from '@/contexts/post'; // Adjust the path accordingly
import OrderDetails from './OrderDetails'; // Adjust the path accordingly
import { useRouter } from 'next/navigation'

interface Post {
  id: number;
  img: string[];
  datePost: string;
  lat: number;
  lon: number;
  prix: number;
  adress: string;
  ville: string;
  status: string;
  title: string;
  categoryId: number;
  typeId: number;
}

interface Order {
  id: number;
  fullName: string;
  dateDebut: string;
  dateFine: string | null;
  CIN: string;
  price: string;
  postId: number;
  post: Post;
}

export function CompaniesFilters(): React.JSX.Element {
  const { order, loading, error } = useContext(DataContext);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Add state for confirmation dialog
  const router = useRouter(); // Initialize useRouter

  const handleView = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrderId(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/DateReserve/${selectedOrderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful delete, e.g., updating the UI
      console.log('Item deleted successfully');
      // Optionally refresh the orders list
      // You might want to update the state to reflect the deletion
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false); // Close confirmation dialog
    }
  };

  const handleDeleteClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setConfirmDeleteOpen(true); // Open confirmation dialog
  };

  const handleCloseConfirmation = () => {
    setConfirmDeleteOpen(false); // Close confirmation dialog
    setSelectedOrderId(null);
  };

  const handleUpdate = (orderId: number) => {
    router.push(`/dashboard/updateorder/${orderId}`); // Redirect to the update page
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell align="right">Customer Name</TableCell>
                <TableCell align="right">Date Debut</TableCell>
                <TableCell align="right">Date Fin</TableCell>
                <TableCell align="right">CIN</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right"></TableCell> {/* Add Action column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {order.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell component="th" scope="row">
                    ORD-{order.id}
                  </TableCell>
                  <TableCell align="right">{order.fullName}</TableCell>
                  <TableCell align="right">{new Date(order.dateDebut).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{order.dateFine}</TableCell>
                  <TableCell align="right">{order.CIN}</TableCell>
                  <TableCell align="right">{order.price} DH</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="primary" onClick={() => handleView(order.id)}>
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteClick(order.id)} // Trigger confirmation dialog
                      style={{ marginLeft: '10px' }}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleUpdate(order.id)}
                      style={{ marginLeft: '10px' }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {selectedOrderId !== null && (
            <OrderDetails orderId={selectedOrderId} onClose={handleClose} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteOpen} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
