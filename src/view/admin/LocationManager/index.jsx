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
import { fetchAllToDistrictAPI,fetchAllToLocationAPI, deleteLocationAPI } from "../../../apis"; // API call
import LocationEdit from "./edit";
const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await fetchAllToDistrictAPI();
        setDistricts(data); // Lưu danh sách các quận
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu quận:", error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await fetchAllToLocationAPI();
        setLocations(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu địa điểm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDistrictSearchChange = (e) => {
    setDistrictSearchTerm(e.target.value);
  };

  const filteredLocations = locations.filter((location) => {
    const locationNameMatches = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const districtMatches = location.district?.id === districtSearchTerm || districtSearchTerm === "";
    return locationNameMatches && districtMatches;
  });

  const handleDeleteClick = (id) => {
    setDeleteLocationId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLocationAPI(deleteLocationId); // Replace with your delete API call
      const updatedLocations = locations.filter(
        (location) => location.id !== deleteLocationId
      );
      setLocations(updatedLocations);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa địa điểm thành công!",
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

  const handleEdit = (location) => {
    setEditingLocation(location);
    setOpenEditDialog(true);
  };
  const handleSaveEdit = (editedLocation) => {
    const updatedLocations = locations.map((location) =>
        location.id === editedLocation.id
        ? {
            ...editedLocation,
            district: districts.find(
              (province) => province.id === editedLocation.district.id
            ), // Cập nhật thông tin tỉnh
          }
        : location
    );

    setLocations(updatedLocations); // Cập nhật trạng thái với dữ liệu mới
    setEditingLocation(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật địa điểm thành công!",
      severity: "success",
    });
  };
  return (
    <>
      <Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Quản Lý Địa Điểm
          </Typography>
          <Button
            href="/admin/create-location"
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Thêm Địa Điểm
          </Button>
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tìm kiếm địa điểm..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <TextField
              sx={{ width: 200 }}
              select
              label="Chọn quận..."
              variant="outlined"
              value={districtSearchTerm}
              onChange={handleDistrictSearchChange}
              InputProps={{
                endAdornment: <Typography variant="caption">↴</Typography>,
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {districts.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
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
                      <strong>Tên Địa Điểm</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Quận</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hành Động</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id} hover>
                      <TableCell>{location.id}</TableCell>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>{location.district?.name || ""}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleEdit(location)}
                          >
                            <EditNoteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(location.id)}
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
      <LocationEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        location={editingLocation}
        onSave={handleSaveEdit}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa Địa Điểm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa địa điểm này?
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

export default ManageLocations;
