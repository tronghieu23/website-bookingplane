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
import { fetchAllToAirportAPI, deleteAirportAPI, fetchAllToProvinceAPI } from "../../../apis"; // API calls
import AirportEdit from "./edit";

const ManageAirports = () => {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAirport, setEditingAirport] = useState(null);
    const [deleteAirportId, setDeleteAirportId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [provinces, setProvinces] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [provinceSearchTerm, setProvinceSearchTerm] = useState("");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await fetchAllToProvinceAPI();
                setProvinces(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tỉnh thành:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                setLoading(true);
                const data = await fetchAllToAirportAPI();
                setAirports(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sân bay:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAirports();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleProvinceSearchChange = (e) => {
        setProvinceSearchTerm(e.target.value);
    };

    const filteredAirports = airports.filter((airport) => {
        const airportNameMatches = airport.name.toLowerCase().includes(searchTerm.toLowerCase());
        const provinceMatches = airport.province?.id === provinceSearchTerm || provinceSearchTerm === "";
        return airportNameMatches && provinceMatches;
    });

    const handleDeleteClick = (id) => {
        setDeleteAirportId(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteAirportAPI(deleteAirportId);
            const updatedAirports = airports.filter((airport) => airport.id !== deleteAirportId);
            setAirports(updatedAirports);
            setOpenDeleteDialog(false);
            setSnackbar({
                open: true,
                message: "Xóa sân bay thành công!",
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

    const handleEdit = (airport) => {
        setEditingAirport(airport);
        setOpenEditDialog(true);
    };

    const handleSaveEdit = (editedAirport) => {
        const updatedAirports = airports.map((airport) =>
            airport.id === editedAirport.id
                ? {
                    ...editedAirport,
                    province: provinces.find((province) => province.id === editedAirport.province.id),
                }
                : airport
        );

        setAirports(updatedAirports);
        setEditingAirport(null);
        setOpenEditDialog(false);
        setSnackbar({
            open: true,
            message: "Cập nhật sân bay thành công!",
            severity: "success",
        });
    };

    return (
        <>
            <Box>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Quản Lý Sân Bay
                    </Typography>
                    <Button
                        href="/admin/create-airport"
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2 }}
                    >
                        Thêm Sân Bay
                    </Button>
                    <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Tìm kiếm sân bay..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <TextField
                            sx={{ width: 200 }}
                            select
                            label="Chọn tỉnh thành..."
                            variant="outlined"
                            value={provinceSearchTerm}
                            onChange={handleProvinceSearchChange}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {provinces.map((province) => (
                                <MenuItem key={province.id} value={province.id}>
                                    {province.name}
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
                                            <strong>Tên Sân Bay</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Mã</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Tỉnh Thành</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Địa Chỉ</strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <strong>Hành Động</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAirports.map((airport) => (
                                        <TableRow key={airport.id} hover>
                                            <TableCell>{airport.id}</TableCell>
                                            <TableCell>{airport.name}</TableCell>
                                            <TableCell>{airport.code}</TableCell>
                                            <TableCell>{airport.province?.name || ""}</TableCell>
                                            <TableCell>{airport.address}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        color="info"
                                                        size="small"
                                                        onClick={() => handleEdit(airport)}
                                                    >
                                                        <EditNoteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDeleteClick(airport.id)}
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
            <AirportEdit
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                airport={editingAirport}
                onSave={handleSaveEdit}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xóa Sân Bay</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn chắc chắn muốn xóa Sân Bay này?
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

export default ManageAirports;