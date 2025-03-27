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
import { fetchAllToDistrictAPI, deleteDistrictAPI, fetchAllToProvinceAPI } from "../../../apis"; // API call
import DistrictEdit from "./edit";

const ManageDistricts = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [deleteDistrictId, setDeleteDistrictId] = useState(null);
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
        setProvinces(data); // Lưu danh sách các tỉnh
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const data = await fetchAllToDistrictAPI();
        setDistricts(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Quận/Thành phố:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProvinceSearchChange = (e) => {
    setProvinceSearchTerm(e.target.value);
  };

  const filteredDistricts = districts.filter((district) => {
    const districtNameMatches = district.name.toLowerCase().includes(searchTerm.toLowerCase());
    const provinceNameMatches = district.province?.id === provinceSearchTerm || provinceSearchTerm === "";
    return districtNameMatches && provinceNameMatches;
  });

  const handleDeleteClick = (id) => {
    setDeleteDistrictId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDistrictAPI(deleteDistrictId); // Replace with your delete API call
      const updatedDistricts = districts.filter(
        (district) => district.id !== deleteDistrictId
      );
      setDistricts(updatedDistricts);
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEdit = (district) => {
    setEditingDistrict(district);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = (editedDistrict) => {
    const updatedDistricts = districts.map((district) =>
      district.id === editedDistrict.id
        ? {
            ...editedDistrict,
            province: provinces.find(
              (province) => province.id === editedDistrict.province.id
            ), // Cập nhật thông tin tỉnh
          }
        : district
    );

    setDistricts(updatedDistricts); // Cập nhật trạng thái với dữ liệu mới
    setEditingDistrict(null);
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
            Quản Lý Quận/Thành phố
          </Typography>
          <Button
            href="/admin/create-district"
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Thêm Quận/Thành phố
          </Button>
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tìm kiếm Quận/Thành phố..."
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
              InputProps={{
                endAdornment: <Typography variant="caption">↴</Typography>,
              }}
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
                      <strong>Tên Quận/Thành phố</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tỉnh Thành</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hành Động</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDistricts.map((district) => (
                    <TableRow key={district.id} hover>
                      <TableCell>{district.id}</TableCell>
                      <TableCell>{district.name}</TableCell>
                      <TableCell>{district.province?.name || ""}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleEdit(district)}
                          >
                            <EditNoteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(district.id)}
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
      <DistrictEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        district={editingDistrict}
        onSave={handleSaveEdit}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa Quận/Thành phố</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa Quận/Thành phố này?
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

export default ManageDistricts;