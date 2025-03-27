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
import { updateAirlinesAPI } from "../../../apis";

const AirlineEdit = ({ open, onClose, airline, onSave }) => {
  const [editedAirline, setEditedAirline] = useState({ ...airline });

  useEffect(() => {
    setEditedAirline({ ...airline });
  }, [airline]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAirline((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedAirline((prev) => ({
          ...prev,
          logo: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Lấy toàn bộ dữ liệu cũ làm cơ sở
      const updatedAirline = {
        ...airline, // Dữ liệu hiện tại
        ...editedAirline, // Dữ liệu đã chỉnh sửa
      };
  
      // Gọi API để cập nhật
      const result = await updateAirlinesAPI(editedAirline.id, updatedAirline);
      onSave(result);
      onClose();
    } catch (error) {
      console.error("Failed to update airline:", error);
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
            Chỉnh sửa Hãng Hàng Không
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin hãng hàng không từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên Hãng"
          name="name"
          value={editedAirline.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mô Tả"
          name="description"
          value={editedAirline.description || ""}
          onChange={handleChange}
          variant="filled"
          multiline
          rows={3}
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <Button
          variant="contained"
          component="label"
          style={{ marginTop: "16px" }}
        >
          Thêm/Sửa Logo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleLogoChange}
          />
        </Button>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <img
            src={editedAirline.logo || "https://via.placeholder.com/150"}
            alt="Airline Logo"
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        </Box>
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

export default AirlineEdit;
