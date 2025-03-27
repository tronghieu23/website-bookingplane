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
import { fetchAllToFlightAPI, updateSeatAPI } from "../../../apis";

const SeatEdit = ({ open, onClose, seat, onSave }) => {
  const [editedSeat, setEditedSeat] = useState({ ...seat });
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const flightData = await fetchAllToFlightAPI();
        setFlights(flightData);
      } catch (error) {
        console.error("Failed to fetch flights:", error);
      }
    };

    if (seat) {
      setEditedSeat({ ...seat });
      fetchFlights();
    }
  }, [seat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSeat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFlightChange = (e) => {
    const flightId = e.target.value;
    setEditedSeat((prev) => ({
      ...prev,
      flight: { id: flightId },
    }));
  };

  const handleSave = async () => {
    try {
      if (!editedSeat.flight?.id) {
        console.error("Flight ID is required!");
        return;
      }

      const updatedFields = {
        flight: { id: editedSeat.flight.id },
        seatNumber: editedSeat.seatNumber,
        seatClass: editedSeat.seatClass,
        passengerType: editedSeat.passengerType,
        isBooked: editedSeat.isBooked,
      };

      const updatedSeat = await updateSeatAPI(editedSeat.id, updatedFields);
      onSave(updatedSeat);
      onClose();
    } catch (error) {
      console.error("Failed to update seat:", error);
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
            Chỉnh sửa ghế
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Cập nhật thông tin ghế từ đây
        </Typography>
        <TextField
          fullWidth
          select
          margin="normal"
          label="Chọn chuyến bay"
          value={editedSeat.flight?.id || ""}
          onChange={handleFlightChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        >
          {flights.map((flight) => (
            <MenuItem key={flight.id} value={flight.id}>
              {`Mã chuyến bay: ${flight.flightCode} - Từ: ${flight.departureAirport.name} (${flight.departureAirport.code}) - Đến: ${flight.arrivalAirport.name} (${flight.arrivalAirport.code})`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          margin="normal"
          label="Số ghế"
          name="seatNumber"
          value={editedSeat.seatNumber || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Hạng ghế"
          name="seatClass"
          value={editedSeat.seatClass || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        >
          <MenuItem value="ECONOMY">Phổ thông</MenuItem>
          <MenuItem value="PREMIUM_ECONOMY">Phổ thông cao cấp</MenuItem>
          <MenuItem value="BUSINESS">Thương gia</MenuItem>
          <MenuItem value="FIRST_CLASS">Hạng nhất</MenuItem>
        </TextField>
        <TextField
          fullWidth
          select
          margin="normal"
          label="Loại hành khách"
          name="passengerType"
          value={editedSeat.passengerType || ""}
          onChange={handleChange}
          variant="filled"
          InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
        >
          <MenuItem value="ADULT">Người lớn</MenuItem>
          <MenuItem value="CHILD">Trẻ em</MenuItem>
          <MenuItem value="INFANT">Trẻ sơ sinh</MenuItem>
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

export default SeatEdit;
