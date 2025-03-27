import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert  
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote"; // Icon thay thế cho Edit
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from "@mui/icons-material/Info";
import { fetchAllPlaneAPI , deleteFlightAPI} from "../../../apis"; // API call
import { useNavigate } from "react-router-dom";
import FlightEdit from "./edit";

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });
  const navigate = useNavigate();
const [editingFlight, setEditingFlight] = useState(null);
  const [deleteFlightId, setDeleteFlightId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const data = await fetchAllPlaneAPI();
        setFlights(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chuyến bay:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);
  const handleDeleteClick = (id) => {
    setDeleteFlightId(id);
    setOpenDeleteDialog(true);
  };
  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setOpenEditDialog(true);
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  }
const handleDeleteConfirm = async () => {
    try {
      await deleteFlightAPI(deleteFlightId); // Replace with your delete API call
      const updatedFlights = flights.filter(
        (flight) => flight.id !== deleteFlightId
      );
      setFlights(updatedFlights);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa Quận/Thành phố thành công!",
        severity: "success",
      });
    } catch (error) {
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: error.response?.data || "Có lỗi xảy ra!",
        severity: "error",
      });
    }
  };
  const handleSaveEdit = (editedFlight) => {
    const updatedFlights = flights.map((flight) =>
      flight.id === editedFlight.id
        ? {
            ...editedFlight,
            province: provinces.find(
              (province) => province.id === editedFlight.province.id
            ), // Cập nhật thông tin tỉnh
          }
        : flight
    );

    setFlights(updatedFlights); // Cập nhật trạng thái với dữ liệu mới
    setEditingFlight(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật Quận/Thành phố thành công!",
      severity: "success",
    });
  };

  return (
    <>
      <Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Quản Lý Chuyến Bay
          </Typography>
          <Button href="/admin/create-flight" variant="contained" color="primary" sx={{ mb: 2 }}>
            Thêm Chuyến Bay
          </Button>
          {loading ? (
            <Typography>Đang tải dữ liệu...</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Mã Chuyến Bay</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Sân Bay Khởi Hành</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Sân Bay Đến</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Hãng Hàng Không</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Thời Gian</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Giá Vé</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Trạng Thái</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hành Động</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flights.map((flight) => {
                    const bookedSeats = flight.seats.filter(
                      (seat) => seat.isBooked
                    ).length;
                    const totalSeats = flight.seats.length;

                    return (
                      <TableRow key={flight.id} hover>
                        <TableCell>{flight.flightCode}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {flight.departureAirport.name} (
                            {flight.departureAirport.code})
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {flight.departureAirport.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {flight.arrivalAirport.name} (
                            {flight.arrivalAirport.code})
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {flight.arrivalAirport.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={flight.airline.logo}
                              alt={flight.airline.name}
                              style={{ height: 20, marginRight: 8 }}
                            />
                            {flight.airline.name}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(flight.departureTime).toLocaleString()}
                          </Typography>
                          <Typography variant="body2">
                            {new Date(flight.arrivalTime).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {flight.price.toLocaleString()} VND
                        </TableCell>
                        {/* Trạng thái ghế */}
                        <TableCell>
                          <Chip
                            label={`${bookedSeats}/${totalSeats} Đã đặt`}
                            color="success"
                            size="small"
                          />
                          {bookedSeats < totalSeats && (
                            <Tooltip title="Ghế còn trống">
                              <Chip
                                icon={<InfoIcon />}
                                label={`Còn ${totalSeats - bookedSeats} ghế`}
                                color="info"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Tooltip>
                          )}
                        </TableCell>

                        {/* Hành động */}
                        <TableCell align="center">
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() => handleEdit(flight)}
                            >
                              <EditNoteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton color="error" size="small"  onClick={() => handleDeleteClick(flight.id)}>
                              <DeleteForeverIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      <FlightEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        flight={editingFlight}
        onSave={handleSaveEdit}
      />
        <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa Vé máy bay</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa Vé máy bay này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageFlights;
