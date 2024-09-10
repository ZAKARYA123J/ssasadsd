"use client";
import React, { useState, ChangeEvent, useContext } from 'react';
import { Button, Stack, Box, Pagination } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { DataContext } from '@/contexts/post';
import { CompaniesFilters } from '@/components/dashboard/integrations/integrations-filters';
import AddOrderDialog from '../OrderDialog';

interface Item {
  id: number;
  title: string;
  status: string;
  category: { name: string };
}

interface Order {
  id: number;
  fullName: string;
  dateDebut: string;
  dateFine: string;
  price: string;
  CIN: string;
  postId: string;
}

export default function Page(): React.ReactElement {
  const { order, createOrder, updateOrder, loading, error } = useContext(DataContext);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (order: Order | null) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveOrder = async (updatedOrder: Order) => {
    if (selectedOrder) {
      // Update existing order
      await updateOrder(selectedOrder.id, updatedOrder);
    } else {
      // Create new order
      await createOrder(updatedOrder);
    }
    handleCloseDialog();
  };

  return (
    <Stack spacing={3}>
      <Button
        startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        onClick={() => handleOpenDialog(null)} // Passing null to indicate new ord
        style={{width:'100px'}}
      >
        Add
      </Button>
      
      <AddOrderDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />

      <CompaniesFilters />

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box>
    </Stack>
  );
}
