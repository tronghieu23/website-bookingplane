import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchCartItemsAPI, updateCartItemAPI, deleteCartItemAPI } from "../../../../apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import PeopleIcon from "@mui/icons-material/People";
import BedIcon from "@mui/icons-material/Bed";

import "react-day-picker/dist/style.css";
import { parseISO, format, differenceInDays } from "date-fns";

const ShoppingCart = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({ from: null, to: null });
  const navigate = useNavigate();
  const today = new Date();

  // Hàm định dạng ngày
  const formatDate = (date) => format(date, "dd/MM/yyyy");

  // Fetch cart items
  useEffect(() => {
    const accountId = localStorage.getItem("userId");
    if (!accountId) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng.");
      return;
    }
    fetchCartItemsAPI(accountId)
      .then((data) => {
        setProducts(data);
        setSelectedProducts(new Array(data.length).fill(false)); // Tạo danh sách trạng thái checkbox
      })
      .catch((error) => {
        toast.error("Không thể tải giỏ hàng.");
        console.error(error);
      });
  }, []);

  // Cập nhật tổng giá dựa trên sản phẩm được chọn
  useEffect(() => {
    const newTotalPrice = products.reduce((sum, product, index) => {
      return selectedProducts[index] ? sum + (product.price || 0) : sum;
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [selectedProducts, products]);

  // Handle checkbox change
  const handleCheckboxChange = (index) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = !updatedSelectedProducts[index];
    setSelectedProducts(updatedSelectedProducts);
  };

  // Handle delete product
  const handleDeleteProduct = async (index) => {
    const productId = products[index].id;

    try {
      await deleteCartItemAPI(productId);
      const updatedProducts = products.filter((_, i) => i !== index);
      const updatedSelectedProducts = selectedProducts.filter((_, i) => i !== index);

      setProducts(updatedProducts);
      setSelectedProducts(updatedSelectedProducts);

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm.");
    }
  };

  // Handle date range change
  const handleDateChange = () => {
    const { from, to } = tempDateRange;

    if (!from || !to || from > to) {
      toast.error("Vui lòng chọn ngày hợp lệ.");
      return;
    }

    const updatedProducts = [...products];
    updatedProducts[editingIndex].checkInDate = format(from, "yyyy-MM-dd");
    updatedProducts[editingIndex].checkOutDate = format(to, "yyyy-MM-dd");

    updateCartItemAPI(
      updatedProducts[editingIndex].id,
      updatedProducts[editingIndex].checkInDate,
      updatedProducts[editingIndex].checkOutDate
    )
      .then((updatedCartItem) => {
        updatedProducts[editingIndex] = updatedCartItem;

        setProducts(updatedProducts);
        setDialogOpen(false);
        toast.success("Cập nhật ngày thành công.");
      })
      .catch((error) => {
        toast.error("Không thể cập nhật ngày.");
        console.error(error);
      });
  };

  // Handle 'Tiếp theo' button click
  const handleNext = () => {
    const selectedItems = products.filter((_, index) => selectedProducts[index]);
    const cartData = {
      items: selectedItems,
      totalPrice,
    };
    navigate("/account/checkout", { state: cartData });
  };

  // Check if any product is selected
  const isAnyProductSelected = selectedProducts.some((selected) => selected);

  return (
    <Box sx={{ p: 4, maxWidth: 1400, margin: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Giỏ hàng của quý khách
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {products.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Giỏ hàng trống.
            </Typography>
          ) : (
            products.map((product, index) => (
              <Card key={product.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1 }}>
                  <Button
                    startIcon={<DeleteIcon />}
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() => handleDeleteProduct(index)}
                  >
                    Xóa
                  </Button>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={<Checkbox checked={selectedProducts[index]} onChange={() => handleCheckboxChange(index)} />}
                    sx={{ mr: 1 }}
                  />
                  <CardMedia
                    component="img"
                    image={product.product.image}
                    alt={product.product.name}
                    sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <PeopleIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
                      {product?.product.maxGuests} người và <BedIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
                      {product?.product.maxGuests / 2} phòng ngủ
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <LocationOnIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
                      {product.product.location.name}, {product.product.location.district.name},{" "}
                      {product.product.location.district.province.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <StarIcon fontSize="small" sx={{ color: "#FFD700", verticalAlign: "middle" }} />{" "}
                      {product.product.rating || "Chưa có đánh giá"} · {product.product.reviews || 0} nhận xét
                    </Typography>

                    <TextField
                      value={
                        product?.checkInDate && product?.checkOutDate
                          ? `${formatDate(parseISO(product.checkInDate))} - ${formatDate(parseISO(product.checkOutDate))}`
                          : "Chưa chọn ngày"
                      }
                      onClick={() => {
                        setEditingIndex(index);
                        setTempDateRange({
                          from: product.checkInDate ? parseISO(product.checkInDate) : null,
                          to: product.checkOutDate ? parseISO(product.checkOutDate) : null,
                        });
                        setDialogOpen(true);
                      }}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </CardContent>
                </Box>

                <Divider />
                <Typography variant="h6" fontWeight="bold" align="right" color="error.main">
                  {(product.price).toLocaleString()} ₫
                </Typography>
              </Card>
            ))
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Tổng giá
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="error.main" mb={2}>
              {totalPrice.toLocaleString()} ₫
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: "bold", textTransform: "none" }}
              onClick={handleNext}
              disabled={!isAnyProductSelected}
            >
              Tiếp theo
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShoppingCart;
