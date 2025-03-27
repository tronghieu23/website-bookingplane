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
import { fetchAllCategoriesAPI, deleteCategoryAPI } from "../../../apis"; // API call
import CategoryEdit from "./edit";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCategoriesAPI();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategoryAPI(deleteCategoryId);
      const updatedCategories = categories.filter(
        (category) => category.id !== deleteCategoryId
      );
      setCategories(updatedCategories);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: "Xóa danh mục thành công!",
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

  const handleEdit = (category) => {
    setEditingCategory(category);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = (editedCategory) => {
    const updatedCategories = categories.map((category) =>
      category.id === editedCategory.id ? editedCategory : category
    );
    setCategories(updatedCategories);
    setEditingCategory(null);
    setOpenEditDialog(false);
    setSnackbar({
      open: true,
      message: "Cập nhật danh mục thành công!",
      severity: "success",
    });
  };

  return (
    <>
      <Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Quản Lý Danh Mục
          </Typography>
          <Button
            href="/admin/create-category"
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Thêm Danh Mục
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
                      <strong>Tên Danh Mục</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hành Động</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleEdit(category)}
                          >
                            <EditNoteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(category.id)}
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
      <CategoryEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        category={editingCategory}
        onSave={handleSaveEdit}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa Danh Mục</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn xóa danh mục này?
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

export default ManageCategories;
