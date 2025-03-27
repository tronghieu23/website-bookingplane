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
import { updateLocationAPI, fetchAllToDistrictAPI } from "../../../apis";

const LocationEdit = ({ open, onClose, location, onSave }) => {
  const [editedLocation, setEditedLocation] = useState({ ...location });
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await fetchAllToDistrictAPI();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    setEditedLocation({ ...location });
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setEditedLocation((prev) => ({
      ...prev,
      district: { id: districtId },
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFields = {
        name: editedLocation.name,
        district: { id: editedLocation.district.id },
      };

      const updatedLocation = await updateLocationAPI(editedLocation.id, updatedFields);
      onSave(updatedLocation);
      onClose();
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <Box p={3} width="450px" display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Chỉnh sửa địa điểm
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin địa điểm của bạn từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên địa điểm"
          name="name"
          value={editedLocation.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Chọn quận"
          name="district"
          value={editedLocation.district?.id || ""}
          onChange={handleDistrictChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        >
          {districts.map((district) => (
            <MenuItem key={district.id} value={district.id}>
              {district.name}
            </MenuItem>
          ))}
        </TextField>
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            onClick={handleCancel}
            variant="outlined"
            style={{ borderColor: "#ff4d4f", color: "#ff4d4f", padding: "10px 20px" }}
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

export default LocationEdit;
