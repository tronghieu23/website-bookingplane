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
import {
  fetchAllToAirportAPI,
  fetchAllToAirlinesAPI,
  updateFlightAPI,
} from "../../../apis";

const FlightEdit = ({ open, onClose, flight, onSave }) => {
  const [editedFlight, setEditedFlight] = useState({ ...flight });
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const airportData = await fetchAllToAirportAPI();
        setAirports(airportData);
      } catch (error) {
        console.error("Failed to fetch airports:", error);
      }
    };

    const fetchAirlines = async () => {
      try {
        const airlineData = await fetchAllToAirlinesAPI();
        setAirlines(airlineData);
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };

    if (flight) {
      setEditedFlight({ ...flight });
      fetchAirports();
      fetchAirlines();
    }
  }, [flight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFlight((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAirportChange = (e, type) => {
    const airportId = e.target.value;
    setEditedFlight((prev) => ({
      ...prev,
      [type]: { id: airportId },
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFields = {
        flightCode: editedFlight.flightCode,
        departureAirport: { id: editedFlight.departureAirport.id },
        arrivalAirport: { id: editedFlight.arrivalAirport.id },
        airline: { id: editedFlight.airline.id },
        departureTime: editedFlight.departureTime,
        arrivalTime: editedFlight.arrivalTime,
        price: editedFlight.price,
      };

      const updatedFlight = await updateFlightAPI(editedFlight.id, updatedFields);
      onSave(updatedFlight);
      onClose();
    } catch (error) {
      console.error("Failed to update flight:", error);
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
            Chỉnh sửa Chuyến bay
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label="Mã chuyến bay"
          name="flightCode"
          value={editedFlight.flightCode || ""}
          onChange={handleChange}
          variant="filled"
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Sân bay đi"
          value={editedFlight.departureAirport?.id || ""}
          onChange={(e) => handleAirportChange(e, "departureAirport")}
          variant="filled"
        >
          {airports.map((airport) => (
            <MenuItem
              key={airport.id}
              value={airport.id}
              disabled={airport.id === editedFlight.arrivalAirport?.id}
            >
              {`${airport.name} (${airport.code})`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          select
          margin="normal"
          label="Sân bay đến"
          value={editedFlight.arrivalAirport?.id || ""}
          onChange={(e) => handleAirportChange(e, "arrivalAirport")}
          variant="filled"
        >
          {airports.map((airport) => (
            <MenuItem
              key={airport.id}
              value={airport.id}
              disabled={airport.id === editedFlight.departureAirport?.id}
            >
              {`${airport.name} (${airport.code})`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          select
          margin="normal"
          label="Hãng hàng không"
          value={editedFlight.airline?.id || ""}
          onChange={(e) => handleAirportChange(e, "airline")}
          variant="filled"
        >
          {airlines.map((airline) => (
            <MenuItem key={airline.id} value={airline.id}>
              {airline.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          margin="normal"
          label="Thời gian khởi hành"
          type="datetime-local"
          name="departureTime"
          value={editedFlight.departureTime || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Thời gian hạ cánh"
          type="datetime-local"
          name="arrivalTime"
          value={editedFlight.arrivalTime || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Giá vé"
          type="number"
          name="price"
          value={editedFlight.price || ""}
          onChange={handleChange}
          variant="filled"
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

export default FlightEdit;