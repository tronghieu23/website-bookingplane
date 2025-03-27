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
import { fetchAllToProvinceAPI, updateDistrictAPI } from "../../../apis";

const DistrictEdit = ({ open, onClose, district, onSave }) => {
  const [editedDistrict, setEditedDistrict] = useState({ ...district });
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

    if (district) {
      setEditedDistrict({ ...district });
      fetchProvinces();
    }
  }, [district]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDistrict((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setEditedDistrict((prev) => ({
      ...prev,
      province: { id: provinceId },
    }));
  };

  const handleSave = async () => {
    try {
      if (!editedDistrict.province?.id) {
        console.error("Province ID is required!");
        return;
      }
  
      const updatedFields = {
        name: editedDistrict.name,
        province: { id: editedDistrict.province.id,
         },
      };
  
      const updatedDistrict = await updateDistrictAPI(editedDistrict.id, updatedFields);
      onSave(updatedDistrict);
      onClose();
    } catch (error) {
      console.error("Failed to update district:", error);
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
            Chỉnh sửa Quận/Huyện
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin quận/huyện từ đây
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Tên Quận/Huyện"
          name="name"
          value={editedDistrict.name || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Chọn Tỉnh"
          value={editedDistrict.province?.id || ""}
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

export default DistrictEdit;
