import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateCategoryAPI } from "../../../apis";

const ProductCategoryEdit = ({ open, onClose, category, onSave }) => {
  const [editedCategory, setEditedCategory] = useState({ ...category });

  useEffect(() => {
    setEditedCategory({ ...category });
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFields = {};
      if (editedCategory.name !== category.name) {
        updatedFields.name = editedCategory.name;
      }

      if (Object.keys(updatedFields).length) {
        const updatedCategory = await updateCategoryAPI(editedCategory.id, updatedFields);
        onSave(updatedCategory);
      }
      onClose();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <Box p={3} width="450px" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Chỉnh sửa danh mục sản phẩm
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin danh mục sản phẩm từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên danh mục"
          name="name"
          value={editedCategory.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            onClick={handleCancel}
            variant="outlined"
            style={{
              borderColor: "#ff4d4f",
              color: "#ff4d4f",
              padding: "10px 20px",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            style={{ padding: "10px 20px" }}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProductCategoryEdit;
