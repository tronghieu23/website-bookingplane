import React, { useEffect, useState } from "react";
import { fetchAllOrdersCustomerAPI } from "../../../../apis";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";

const OrderCustomer = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const id = localStorage.getItem("userId");
        const response = await fetchAllOrdersCustomerAPI(id);
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Thông Tin Hóa Đơn Của Khách Hàng
      </Typography>
      {orders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            {/* Header */}
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Hình Ảnh</TableCell>
                <TableCell>Tên Sản Phẩm</TableCell>
                <TableCell>Thông Tin</TableCell>
                <TableCell>Thời Gian</TableCell>
                <TableCell>Tổng Tiền</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {orders.map((order) =>
                order.orderDetails.map((detail) => (
                  <TableRow key={detail.id}>
                    {/* Hình ảnh sản phẩm */}
                    <TableCell>
                      <Avatar
                        variant="square"
                        src={detail.product.image}
                        alt={detail.product.name}
                        sx={{ width: 60, height: 60, borderRadius: 2 }}
                      />
                    </TableCell>

                    {/* Tên sản phẩm */}
                    <TableCell>
                      <Typography variant="subtitle1">
                        {detail.product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {detail.product.category.name}
                      </Typography>
                    </TableCell>

                    {/* Thông tin sản phẩm */}
                    <TableCell>
                      <Typography variant="body2">
                        Địa chỉ: {detail.product.location.name},{" "}
                        {detail.product.location.district.name},{" "}
                        {detail.product.location.district.province.name}
                      </Typography>
                      <Typography variant="body2">
                        Giá: {detail.price.toLocaleString("vi-VN")} VNĐ
                      </Typography>
                      <Typography variant="body2">
                        Số đêm: {detail.night}
                      </Typography>
                    </TableCell>

                    {/* Thời gian */}
                    <TableCell>
                      <Typography variant="body2">
                        Nhận phòng:{" "}
                        {new Date(detail.checkInDateTime).toLocaleString(
                          "vi-VN"
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Trả phòng:{" "}
                        {new Date(detail.checkOutDateTime).toLocaleString(
                          "vi-VN"
                        )}
                      </Typography>
                    </TableCell>

                    {/* Tổng tiền */}
                    <TableCell>
                      <Typography variant="h6" color="primary">
                        {order.total.toLocaleString("vi-VN")} VNĐ
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {order.paymentMethod === "CASH"
                          ? "Thanh toán tiền mặt"
                          : "Thanh toán online"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center" }}>
          Không có hóa đơn nào được tìm thấy.
        </Typography>
      )}
    </Box>
  );
};

export default OrderCustomer;
