import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { useContext } from 'react';
import { DataContext } from '@/contexts/post'; // Make sure this is the correct path to your DataContext
import Link from 'next/link';
import dayjs from 'dayjs';


const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  refunded: { label: 'Refunded', color: 'error' },
} as const;

export interface Order {
  id: string;
  customer: { name: string };
  amount: number;
  status: 'pending' | 'delivered' | 'refunded';
  createdAt: Date;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestOrders({ sx }: LatestOrdersProps): React.JSX.Element {
  const { order, loading, error } = useContext(DataContext); // Accessing order, loading, and error from context

  if (loading) {
    return <p>Loading...</p>; // Display a loading state if the data is being fetched
  }

  if (error) {
    return <p>Error: {error.message}</p>; // Display an error message if there is an error
  }

  if (!order || order.length === 0) {
    return <p>No orders available.</p>; // Display a message if no orders are found
  }

  return (
    <Card sx={sx}>
      <CardHeader title="Latest orders" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.map((order: Order) => { // Assuming `order` is an array of Order objects
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order.id}>
                  <TableCell>ORD-{order.id}</TableCell>
                  <TableCell>{order.fullName}</TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>
  {order.post && (
    <>
      {order.post.typeId === 1 ? (
        <Chip label="Vente" color="primary" />
      ) : order.post.typeId === 2 ? (
        <Chip label="Location" color="secondary" />
      ) : (
        <Chip label="Unknown" color="default" />
      )}
    </>
  )}
</TableCell>



                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
<Link href={"/dashboard/orders"}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
