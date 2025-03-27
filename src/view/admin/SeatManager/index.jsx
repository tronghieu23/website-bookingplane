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
    TextField,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    MenuItem,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { fetchAllToFlightAPI, fetchAllToSeatAPI, deleteSeatAPI } from "../../../apis";
import SeatEdit from "./edit";

const ManageSeats = () => {
    const [seats, setSeats] = useState([]);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSeat, setEditingSeat] = useState(null);
    const [deleteSeatId, setDeleteSeatId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [flightSearchTerm, setFlightSearchTerm] = useState("");

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const data = await fetchAllToFlightAPI();
                setFlights(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu chuyến bay:", error);
            }
        };

        const fetchSeats = async () => {
            try {
                setLoading(true);
                const data = await fetchAllToSeatAPI();
                setSeats(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu ghế:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
        fetchSeats();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFlightSearchChange = (e) => {
        setFlightSearchTerm(e.target.value);
    };

    const filteredSeats = seats.filter((seat) => {
        const seatNumberMatches = seat.seatNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const flightMatches = seat.flight?.id.toString() === flightSearchTerm || flightSearchTerm === "";
        return seatNumberMatches && flightMatches;
    });

    const handleDeleteClick = (id) => {
        setDeleteSeatId(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteSeatAPI(deleteSeatId);
            const updatedSeats = seats.filter((seat) => seat.id !== deleteSeatId);
            setSeats(updatedSeats);
            setOpenDeleteDialog(false);
            setSnackbar({
                open: true,
                message: "Xóa ghế thành công!",
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleEdit = (seat) => {
        setEditingSeat(seat);
        setOpenEditDialog(true);
    };

    const handleSaveEdit = (editedSeat) => {
        const updatedSeats = seats.map((seat) =>
            seat.id === editedSeat.id ? editedSeat : seat
        );

        setSeats(updatedSeats);
        setEditingSeat(null);
        setOpenEditDialog(false);
        setSnackbar({
            open: true,
            message: "Cập nhật ghế thành công!",
            severity: "success",
        });
    };

    return (
        <>
            <Box>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Quản Lý Ghế
                    </Typography>
                    <Button
                        href="/admin/create-seat"
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2 }}
                    >
                        Thêm Ghế
                    </Button>
                    <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Tìm kiếm số ghế..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <TextField
                            sx={{ width: 200 }}
                            select
                            label="Chọn chuyến bay..."
                            variant="outlined"
                            value={flightSearchTerm}
                            onChange={handleFlightSearchChange}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {flights.map((flight) => (
                                <MenuItem key={flight.id} value={flight.id}>
                                    {`Mã chuyến bay: ${flight.flightCode}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    {loading ? (
                        <Typography>Đang tải dữ liệu...</Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                        <TableCell>
                                            <strong>ID</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Số Ghế</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Hạng Ghế</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Loại Hành Khách</strong>
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
                                    {filteredSeats.map((seat) => (
                                        <TableRow key={seat.id} hover>
                                            <TableCell>{seat.id}</TableCell>
                                            <TableCell>{seat.seatNumber}</TableCell>
                                            <TableCell>
                                                {seat.seatClass === "ECONOMY" && "Phổ thông"}
                                                {seat.seatClass === "PREMIUM_ECONOMY" && "Phổ thông cao cấp"}
                                                {seat.seatClass === "BUSINESS" && "Thương gia"}
                                                {seat.seatClass === "FIRST_CLASS" && "Hạng nhất"}
                                            </TableCell>
                                            <TableCell>
                                                {seat.passengerType === "ADULT" && "Người lớn"}
                                                {seat.passengerType === "CHILD" && "Trẻ em"}
                                                {seat.passengerType === "INFANT" && "Trẻ sơ sinh"}
                                            </TableCell>
                                            <TableCell>{seat.isBooked ? "Đã đặt" : "Chưa đặt"}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        color="info"
                                                        size="small"
                                                        onClick={() => handleEdit(seat)}
                                                    >
                                                        <EditNoteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDeleteClick(seat.id)}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Box>
            <SeatEdit
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                seat={editingSeat}
                onSave={handleSaveEdit}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xóa Ghế</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn chắc chắn muốn xóa ghế này?
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

export default ManageSeats;
