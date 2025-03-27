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
import { createLocationAPI, fetchAllToDistrictAPI } from "../../../apis";

const LocationCreate = () => {
  const [name, setName] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLocation = {
        name,
        district: {
          id: districtId,
        },
      };

      await createLocationAPI(newLocation);

      setSnackbar({
        open: true,
        message: "Thêm địa điểm mới thành công!",
        severity: "success",
      });

      navigate("/admin/Locations");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create Location.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/Locations");
  };

  return (
    <>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Thêm địa điểm
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
                  label="Tên địa điểm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Chọn quận"
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  required
                >
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
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
                Thêm địa điểm
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

export default LocationCreate;
