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
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { fetchAllToAirlinesAPI, deleteAirlinesAPI } from "../../../apis"; // API calls
import AirlineEdit from "./edit";
const ManageAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteAirlineId, setDeleteAirlineId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingAirline, setEditingAirline] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        setLoading(true);
        const data = await fetchAllToAirlinesAPI();
        setAirlines(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu hãng hàng không:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAirlines();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAirlines = airlines.filter((airline) =>
    airline.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id) => {
    setDeleteAirlineId(id);
    setOpenDeleteDialog(true);
  };
  const handleEdit = (airline) => {
    setEditingAirline(airline);
    setOpenEditDialog(true);
  };
  const handleSaveEdit = (editedAirline) => {
    const updatedCategories = airlines.map((airline) =>
      airline.id === editedAirline.id ? editedAirline : airline
    );
    setAirlines(updatedCategories);
    setEditingAirline(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật hãng hàng không thành công!",
      severity: "success",
    });
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteAirlinesAPI(deleteAirlineId);
      const updatedAirlines = airlines.filter(
        (airline) => airline.id !== deleteAirlineId
      );
      setAirlines(updatedAirlines);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa hãng hàng không thành công!",
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

  return (
    <>
      <Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Quản Lý Hãng Hàng Không
          </Typography>
          <Button
            href="/admin/create-airline"
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Thêm Hãng Hàng Không
          </Button>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Tìm kiếm..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
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
                      <strong>Tên Hãng</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Logo</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Mô Tả</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hành Động</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAirlines.map((airline) => (
                    <TableRow key={airline.id} hover>
                      <TableCell>{airline.id}</TableCell>
                      <TableCell>{airline.name}</TableCell>
                      <TableCell>
                        <img
                          src={airline.logo}
                          alt={airline.name}
                          style={{ height: 50, borderRadius: 4 }}
                        />
                      </TableCell>
                      <TableCell>{airline.description}</TableCell>
                      <TableCell align="center">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => handleEdit(airline)}
                        >
                          <EditNoteIcon />
                        </IconButton>
                      </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(airline.id)}
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
      <AirlineEdit
     open={openEditDialog}
     onClose={() => setOpenEditDialog(false)}
     airline={editingAirline}
     onSave={handleSaveEdit}
   />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa Hãng Hàng Không</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa hãng hàng không này?
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

export default ManageAirlines;
