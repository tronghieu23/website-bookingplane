import { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    TextField,
    Button,
    IconButton,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAllCategoriesAPI, fetchAllLocationsAPI, updateProductAPI } from "../../../apis";

const amenitiesOptions = [
    "Ăn sáng miễn phí",
    "Gym/Fitness",
    "Ban công",
    "Cảnh biển",
    "Spa",
    "Quầy bar",
];

const ProductEdit = ({ open, onClose, product, onSave }) => {
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await fetchAllCategoriesAPI();
                setCategories(categoryData);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        const fetchLocations = async () => {
            try {
                const locationData = await fetchAllLocationsAPI();
                setLocations(locationData);
            } catch (error) {
                console.error("Failed to fetch locations:", error);
            }
        };

        if (product) {
            setEditedProduct({ ...product });
            fetchCategories();
            fetchLocations();
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setEditedProduct((prev) => ({
            ...prev,
            category: { id: categoryId },
        }));
    };

    const handleLocationChange = (e) => {
        const locationId = e.target.value;
        setEditedProduct((prev) => ({
            ...prev,
            location: { id: locationId },
        }));
    };

    const handleAmenitiesChange = (event) => {
        const {
            target: { value },
        } = event;
        setEditedProduct((prev) => ({
            ...prev,
            amenities: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedProduct((prev) => ({
                    ...prev,
                    image: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubImageChange = (index) => (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSubImages = [...editedProduct.subImages];
                newSubImages[index] = e.target.result;
                setEditedProduct((prev) => ({
                    ...prev,
                    subImages: newSubImages,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const updatedFields = {
                name: editedProduct.name,
                description: editedProduct.description,
                price: editedProduct.price,
                category: { id: editedProduct.category.id },
                location: { id: editedProduct.location.id },
                amenities: editedProduct.amenities,
                squareFootage: editedProduct.squareFootage,
                maxGuests: editedProduct.maxGuests,
                standardCheckInTime: editedProduct.standardCheckInTime,
                standardCheckOutTime: editedProduct.standardCheckOutTime,
                image: editedProduct.image,
                subImages: editedProduct.subImages.filter((img) => img !== ""),
            };

            const updatedProduct = await updateProductAPI(editedProduct.id, updatedFields);
            onSave(updatedProduct);
            onClose();
        } catch (error) {
            console.error("Failed to update product:", error);
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
                        Chỉnh sửa Sản Phẩm
                    </Typography>
                    <IconButton onClick={handleCancel}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    Cập nhật thông tin sản phẩm từ đây
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Tên sản phẩm"
                    name="name"
                    value={editedProduct.name || ""}
                    onChange={handleChange}
                    variant="filled"
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                />
                <Button variant="contained"
                    component="label"
                    style={{ marginTop: "16px" }}>
                    Chọn hình ảnh đại diện
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Button>

                {editedProduct.image && (
                    <Box display="flex" justifyContent="center" mt={2} mb={2}>
                        <img
                            src={editedProduct.image}
                            alt="Main"
                            style={{ width: "200px", maxHeight: 200, objectFit: "cover" }}
                        />
                    </Box>
                )}
                <Box mt={2} display="flex" gap={2}>
                    {editedProduct.subImages?.map((subImage, index) => (
                        <Box key={index}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ fontSize: '10.2px' }} // Điều chỉnh kích thước chữ
                            >
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
                                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                    />
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Mô tả"
                    name="description"
                    value={editedProduct.description || ""}
                    onChange={handleChange}
                    variant="filled"
                    multiline
                    rows={4}
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Giá"
                    name="price"
                    type="number"
                    value={editedProduct.price || ""}
                    onChange={handleChange}
                    variant="filled"
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                />
                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Loại sản phẩm"
                    value={editedProduct.category?.id || ""}
                    onChange={handleCategoryChange}
                    variant="filled"
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Địa điểm"
                    value={editedProduct.location?.id || ""}
                    onChange={handleLocationChange}
                    variant="filled"
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                >
                    {locations.map((location) => (
                        <MenuItem key={location.id} value={location.id}>
                            {location.name}
                        </MenuItem>
                    ))}
                </TextField>
                <FormControl fullWidth margin="normal" variant="filled">
                    <InputLabel>Tiện ích</InputLabel>
                    <Select
                        multiple
                        value={editedProduct.amenities || []}
                        onChange={handleAmenitiesChange}
                        renderValue={(selected) => selected.join(", ")}
                        InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                    >
                        {amenitiesOptions.map((amenity) => (
                            <MenuItem key={amenity} value={amenity}>
                                <Checkbox checked={editedProduct.amenities?.indexOf(amenity) > -1} />
                                <ListItemText primary={amenity} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Diện tích (m²)"
                    name="squareFootage"
                    type="number"
                    value={editedProduct.squareFootage || ""}
                    onChange={handleChange}
                    variant="filled"
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Số khách tối đa"
                    name="maxGuests"
                    type="number"
                    value={editedProduct.maxGuests || ""}
                    onChange={handleChange}
                    variant="filled"
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Giờ nhận phòng"
                    name="standardCheckInTime"
                    type="datetime-local"
                    value={editedProduct.standardCheckInTime || ""}
                    onChange={handleChange}
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Giờ trả phòng"
                    name="standardCheckOutTime"
                    type="datetime-local"
                    value={editedProduct.standardCheckOutTime || ""}
                    onChange={handleChange}
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
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

export default ProductEdit;