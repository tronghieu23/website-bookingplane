import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    TextField,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    MenuItem,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { fetchAllCategoriesAPI, fetchAllLocationsAPI, deleteProductAPI, fetchAllProductsAPI } from "../../../apis"; // API call
import ProductEdit from "./edit";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [locationSearchTerm, setLocationSearchTerm] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await fetchAllCategoriesAPI();
                setCategories(data); // Lưu danh sách các loại sản phẩm
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu loại sản phẩm:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await fetchAllLocationsAPI();
                setLocations(data); // Lưu danh sách các địa điểm
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu địa điểm:", error);
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchAllProductsAPI();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategorySearchChange = (e) => {
        setCategorySearchTerm(e.target.value);
    };

    const handleLocationSearchChange = (e) => {
        setLocationSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter((product) => {
        const productNameMatches = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatches = product.category?.id === categorySearchTerm || categorySearchTerm === "";
        const locationMatches = product.location?.id === locationSearchTerm || locationSearchTerm === "";
        return productNameMatches && categoryMatches && locationMatches;
    });

    const handleDeleteClick = (id) => {
        setDeleteProductId(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteProductAPI(deleteProductId); // Replace with your delete API call
            const updatedProducts = products.filter(
                (product) => product.id !== deleteProductId
            );
            setProducts(updatedProducts);
            setOpenDeleteDialog(false);
            setSnackbar({
                open: true,
                message: "Xóa sản phẩm thành công!",
                severity: "success",
            });
        } catch (error) {
            setOpenDeleteDialog(false);
            setSnackbar({
                open: true,
                message: error.response?.data || "Có lỗi xảy ra!",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setOpenEditDialog(true);
    };

    const handleSaveEdit = (editedProduct) => {
       
        const updatedProducts = products.map((product) =>
            product.id === editedProduct.id 
                ? {
                    ...editedProduct,
                    category: categories.find(
                        (category) => category.id === editedProduct.category.id
                    ), // Cập nhật thông tin loại sản phẩm
                    location: locations.find(
                        (location) => location.id === editedProduct.location.id
                    ), // Cập nhật thông tin địa điểm
                }
                : product
        );

        setProducts(updatedProducts); // Cập nhật trạng thái với dữ liệu mới
        setEditingProduct(null);
        setOpenEditDialog(false);
        setSnackbar({
            open: true,
            message: "Cập nhật sản phẩm thành công!",
            severity: "success",
        });
    };

    return (
        <>
            <Box>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Quản Lý Sản Phẩm
                    </Typography>
                    <Button
                        href="/admin/create-product"
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2 }}
                    >
                        Thêm Sản Phẩm
                    </Button>
                    <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Tìm kiếm sản phẩm..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <TextField
                            sx={{ width: 200 }}
                            select
                            label="Chọn loại sản phẩm..."
                            variant="outlined"
                            value={categorySearchTerm}
                            onChange={handleCategorySearchChange}
                            InputProps={{
                                endAdornment: <Typography variant="caption">↴</Typography>,
                            }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            sx={{ width: 200 }}
                            select
                            label="Chọn địa điểm..."
                            variant="outlined"
                            value={locationSearchTerm}
                            onChange={handleLocationSearchChange}
                            InputProps={{
                                endAdornment: <Typography variant="caption">↴</Typography>,
                            }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {locations.map((location) => (
                                <MenuItem key={location.id} value={location.id}>
                                    {location.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    {loading ? (
                        <Typography>Đang tải dữ liệu...</Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                        <TableCell>
                                            <strong>ID</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Tên Sản Phẩm</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Ảnh</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Chú Thích</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Giá</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Địa Điểm</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>Loại Sản Phẩm</strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <strong>Hành Động</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id} hover>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "200px",
                                                    }}
                                                >
                                                    {product.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </TableCell>

                                            <TableCell>{product.location?.name || ""}</TableCell>
                                            <TableCell>{product.category?.name || ""}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        color="info"
                                                        size="small"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <EditNoteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDeleteClick(product.id)}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Box>
            <ProductEdit
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                product={editingProduct}
                onSave={handleSaveEdit}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xóa Sản Phẩm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn chắc chắn muốn xóa sản phẩm này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ManageProducts;