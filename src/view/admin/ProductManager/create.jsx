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
  Box,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllCategoriesAPI, createProductAPI, fetchAllLocationsAPI } from "../../../apis";

const amenitiesOptions = [
  "Ăn sáng miễn phí",
  "Gym/Fitness",
  "Ban công",
  "Cảnh biển",
  "Spa",
  "Quầy bar",
];

const ProductCreate = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [subImages, setSubImages] = useState(["", "", ""]);
  const [squareFootage, setSquareFootage] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategoriesAPI();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const data = await fetchAllLocationsAPI();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImageChange = (index) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newSubImages = [...subImages];
        newSubImages[index] = e.target.result;
        setSubImages(newSubImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProduct = {
        name,
        description,
        category: { id: categoryId },
        image,
        subImages: subImages.filter((img) => img !== ""),
        squareFootage: parseInt(squareFootage, 10),
        maxGuests: parseInt(maxGuests, 10),
        amenities,
        isAvailable,
        standardCheckInTime: checkInTime,
        standardCheckOutTime: checkOutTime,
        location: { id: locationId },
      };

      await createProductAPI(newProduct);

      setSnackbar({
        open: true,
        message: "Thêm sản phẩm mới thành công!",
        severity: "success",
      });

      navigate("/admin/Products");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Thêm sản phẩm thất bại.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/Products");
  };

  const handleAmenitiesChange = (event) => {
    const {
      target: { value },
    } = event;
    setAmenities(
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <>
      <Container>
        <Paper elevation={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Thêm Sản Phẩm
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
                  label="Tên sản phẩm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Loại sản phẩm"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Địa điểm"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  required
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Chọn hình ảnh đại diện
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {image && (
                  <Box mt={2}>
                    <img
                      src={image}
                      alt="Main"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  {subImages.map((subImage, index) => (
                    <Box key={index}>
                      <Button variant="contained" component="label">
                        {`Chọn hình ảnh phụ ${index + 1}`}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleSubImageChange(index)}
                        />
                      </Button>
                      {subImage && (
                        <Box mt={2}>
                          <img
                            src={subImage}
                            alt={`Sub ${index + 1}`}
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Diện tích (m²)"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số khách tối đa"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tiện ích</InputLabel>
                  <Select
                    multiple
                    value={amenities}
                    onChange={handleAmenitiesChange}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {amenitiesOptions.map((amenity) => (
                      <MenuItem key={amenity} value={amenity}>
                        <Checkbox checked={amenities.indexOf(amenity) > -1} />
                        <ListItemText primary={amenity} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Giờ nhận phòng"
                  InputLabelProps={{ shrink: true }}
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Giờ trả phòng"
                  InputLabelProps={{ shrink: true }}
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
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
                type="submit"
                variant="contained"
                style={{
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                Thêm Sản Phẩm
              </Button>
            </Box>
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
      <Dialog open={loading}>
        <DialogContent style={{ textAlign: "center" }}>
          <CircularProgress />
          <DialogContentText>
            Vui lòng chờ xíu quá trình đẩy dữ liệu lên Cloud tốn nhiều thời gian
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCreate;