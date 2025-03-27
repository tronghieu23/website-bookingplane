import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAllToProvinceAPI, updateAirportAPI } from "../../../apis";

const AirportEdit = ({ open, onClose, airport, onSave }) => {
  const [editedAirport, setEditedAirport] = useState({ ...airport });
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provinceData = await fetchAllToProvinceAPI();
        setProvinces(provinceData);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    if (airport) {
      setEditedAirport({ ...airport });
      fetchProvinces();
    }
  }, [airport]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAirport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setEditedAirport((prev) => ({
      ...prev,
      province: { id: provinceId },
    }));
  };

  const handleSave = async () => {
    try {
      if (!editedAirport.province?.id) {
        console.error("Province ID is required!");
        return;
      }

      const updatedFields = {
        name: editedAirport.name,
        code: editedAirport.code,
        province: { id: editedAirport.province.id },
        address: editedAirport.address,
      };

      const updatedAirport = await updateAirportAPI(
        editedAirport.id,
        updatedFields
      );
      onSave(updatedAirport);
      onClose();
    } catch (error) {
      console.error("Failed to update airport:", error);
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
            Chỉnh sửa Sân bay
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin sân bay từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên Sân bay"
          name="name"
          value={editedAirport.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mã Sân bay"
          name="code"
          value={editedAirport.code || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Địa chỉ"
          name="address"
          value={editedAirport.address || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Chọn Tỉnh"
          value={editedAirport.province?.id || ""}
          onChange={handleProvinceChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        >
          {provinces.map((province) => (
            <MenuItem key={province.id} value={province.id}>
              {province.name}
            </MenuItem>
          ))}
        </TextField>
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

export default AirportEdit;
