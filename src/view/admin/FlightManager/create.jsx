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
import { fetchAllToAirportAPI, fetchAllToAirlinesAPI, createFlightAPI } from "../../../apis";

const FlightCreate = () => {
  const [flightCode, setFlightCode] = useState("");
  const [departureAirportId, setDepartureAirportId] = useState("");
  const [arrivalAirportId, setArrivalAirportId] = useState("");
  const [airlineId, setAirlineId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [price, setPrice] = useState("");
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const data = await fetchAllToAirportAPI();
        setAirports(data);
      } catch (error) {
        console.error("Failed to fetch airports:", error);
      }
    };

    const fetchAirlines = async () => {
      try {
        const data = await fetchAllToAirlinesAPI();
        setAirlines(data);
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };

    fetchAirports();
    fetchAirlines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFlight = {
        flightCode,
        departureAirport: { id: departureAirportId },
        arrivalAirport: { id: arrivalAirportId },
        airline: { id: airlineId },
        departureTime,
        arrivalTime,
        price,
      };

      await createFlightAPI(newFlight);

      setSnackbar({
        open: true,
        message: "Thêm chuyến bay mới thành công!",
        severity: "success",
      });

      navigate("/admin/Flights");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create flight.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/Flights");
  };

  const filterArrivalAirports = () =>
    airports.filter((airport) => airport.id !== parseInt(departureAirportId));

  const currentDateTime = new Date().toISOString().slice(0, 16);

  return (
    <>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography
                variant="h6"
                style={{ flexGrow: 1, fontFamily: "Arial, sans-serif" }}
              >
                Thêm Chuyến Bay
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
                  label="Mã chuyến bay"
                  value={flightCode}
                  onChange={(e) => setFlightCode(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Sân bay đi"
                  value={departureAirportId}
                  onChange={(e) => setDepartureAirportId(e.target.value)}
                  required
                >
                  {airports.map((airport) => (
                    <MenuItem key={airport.id} value={airport.id}>
                      {airport.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Sân bay đến"
                  value={arrivalAirportId}
                  onChange={(e) => setArrivalAirportId(e.target.value)}
                  disabled={!departureAirportId}
                  required
                >
                  {filterArrivalAirports().map((airport) => (
                    <MenuItem key={airport.id} value={airport.id}>
                      {airport.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Hãng hàng không"
                  value={airlineId}
                  onChange={(e) => setAirlineId(e.target.value)}
                  required
                >
                  {airlines.map((airline) => (
                    <MenuItem key={airline.id} value={airline.id}>
                      {airline.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thời gian khởi hành"
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  InputProps={{
                    inputProps: { min: currentDateTime },
                  }}
                  InputLabelProps={{
                    shrink: true, // Đảm bảo nhãn thu nhỏ
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thời gian hạ cánh"
                  type="datetime-local"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  InputProps={{
                    inputProps: { min: departureTime || currentDateTime },
                  }}
                  InputLabelProps={{
                    shrink: true, // Đảm bảo nhãn thu nhỏ
                  }}
                  required
                />
              </Grid>

             
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Giá vé"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
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
                Thêm chuyến bay
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

export default FlightCreate;
