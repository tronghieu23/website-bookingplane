import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllToFlightAPI, createSeatAPI } from "../../../apis";

const SeatCreate = () => {
  const [flightId, setFlightId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [seatClass, setSeatClass] = useState("");
  const [passengerType, setPassengerType] = useState("");
  const [flights, setFlights] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const data = await fetchAllToFlightAPI();
        setFlights(data);
      } catch (error) {
        console.error("Failed to fetch flights:", error);
      }
    };
    fetchFlights();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSeat = {
        flight: {
          id: flightId,
        },
        seatNumber,
        seatClass,
        passengerType,
        isBooked: false, // Luôn đặt trạng thái là chưa đặt
      };

      await createSeatAPI(newSeat);

      setSnackbar({
        open: true,
        message: "Thêm ghế mới thành công!",
        severity: "success",
      });

      navigate("/admin/seats");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create seat.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/seats");
  };

  return (
    <>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Thêm ghế
              </Typography>
            </Toolbar>
          </AppBar>
          <form onSubmit={handleSubmit} style={{ padding: 16 }}>
            <Tabs value={0}>
              <Tab label="Thông tin cơ bản" />
            </Tabs>
            <Grid container spacing={3} style={{ marginTop: 16 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Chọn chuyến bay"
                  value={flightId}
                  onChange={(e) => setFlightId(e.target.value)}
                  required
                >
                  {flights.map((flight) => (
                    <MenuItem key={flight.id} value={flight.id}>
                      {`Mã chuyến bay: ${flight.flightCode} - Từ: ${flight.departureAirport.name} (${flight.departureAirport.code}) - Đến: ${flight.arrivalAirport.name} (${flight.arrivalAirport.code})`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số ghế"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Hạng ghế"
                  value={seatClass}
                  onChange={(e) => setSeatClass(e.target.value)}
                  required
                >
                  <MenuItem value="ECONOMY">Phổ thông</MenuItem>
                  <MenuItem value="PREMIUM_ECONOMY">Phổ thông cao cấp</MenuItem>
                  <MenuItem value="BUSINESS">Thương gia</MenuItem>
                  <MenuItem value="FIRST_CLASS">Hạng nhất</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Loại hành khách"
                  value={passengerType}
                  onChange={(e) => setPassengerType(e.target.value)}
                  required
                >
                  <MenuItem value="ADULT">Người lớn</MenuItem>
                  <MenuItem value="CHILD">Trẻ em</MenuItem>
                  <MenuItem value="INFANT">Trẻ sơ sinh</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
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
                type="submit"
                variant="contained"
                style={{
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                Thêm ghế
              </Button>
            </div>
          </form>
        </Paper>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SeatCreate;
