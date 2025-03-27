import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Line, Bar } from "react-chartjs-2";
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Visibility as VisibilityIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import "chart.js/auto";
import { fetchAllTotal,fetchAllFlight,fetchAllProduct ,fetchAllUser} from "../../../apis";

// Styled Card cho thông tin tóm tắt
const SummaryCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const AdminDashboard = () => {
  const [flight, setFlight] = useState(0); // State lưu doanh thu
  const [product, setProduct] = useState(0); // State lưu doanh thu
  const [revenue, setRevenue] = useState(0); // State lưu doanh thu
  const [user, setUser] = useState(0); // State lưu doanh thu

  // Gọi API fetchAllTotal
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchAllUser();
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API fetchAllTotal:", error);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetchAllTotal();
        if (response) {
          setRevenue(response);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API fetchAllTotal:", error);
      }
    };

    fetchRevenue();
  }, []);
  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const response = await fetchAllProduct();
        if (response) {
          setProduct(response);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API fetchAllTotal:", error);
      }
    };

    fetchproduct();
  }, []);useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await fetchAllFlight();
        if (response) {
          setFlight(response);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API fetchAllTotal:", error);
      }
    };

    fetchFlight();
  }, []);
  // Dữ liệu ảo cho biểu đồ và thông số
  const barData = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Vé Máy Bay",
        data: [120, 150, 170, 200, 130, 180, 210],
        backgroundColor: "#1E88E5",
      },
      {
        label: "Cho Thuê Khu Nghỉ Dưỡng",
        data: [80, 95, 110, 120, 90, 130, 140],
        backgroundColor: "#00BCD4",
      },
    ],
  };

  const lineData = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Vé Máy Bay",
        data: [25, 50, 75, 100, 150],
        borderColor: "#1E88E5",
        fill: false,
      },
      {
        label: "Cho Thuê Khu Nghỉ Dưỡng",
        data: [20, 40, 70, 85, 130],
        borderColor: "#00BCD4",
        fill: false,
      },
    ],
  };

  return (
    <Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bảng Điều Khiển
        </Typography>

        {/* Thông tin tóm tắt */}
        <Grid container spacing={3}>
          {/* Vé Máy Bay */}
          <Grid item xs={12} md={3}>
            <SummaryCard>
              <Box>
                <Typography variant="h6">Vé Máy Bay</Typography>
                <Typography variant="h4">{flight}</Typography>
                <Typography color="text.secondary">+12% So với tháng trước</Typography>
              </Box>
              <FlightIcon color="primary" sx={{ fontSize: 48 }} />
            </SummaryCard>
          </Grid>

          {/* Khu Nghỉ Dưỡng */}
          <Grid item xs={12} md={3}>
            <SummaryCard>
              <Box>
                <Typography variant="h6">Khu Nghỉ Dưỡng</Typography>
                <Typography variant="h4">{product}</Typography>
                <Typography color="text.secondary">+8% So với tháng trước</Typography>
              </Box>
              <HotelIcon color="success" sx={{ fontSize: 48 }} />
            </SummaryCard>
          </Grid>

          {/* Khách Hàng */}
          <Grid item xs={12} md={3}>
            <SummaryCard>
              <Box>
                <Typography variant="h6">Khách Hàng</Typography>
                <Typography variant="h4">{user}</Typography>
                <Typography color="text.secondary">+5.2% So với tháng trước</Typography>
              </Box>
              <PeopleIcon color="secondary" sx={{ fontSize: 48 }} />
            </SummaryCard>
          </Grid>

          {/* Doanh Thu */}
          <Grid item xs={12} md={3}>
            <SummaryCard>
              <Box>
                <Typography variant="h6">Doanh Thu</Typography>
                <Typography variant="h4">{revenue}</Typography>
                <Typography color="text.secondary">+15% So với tháng trước</Typography>
              </Box>
              <MoneyIcon color="warning" sx={{ fontSize: 48 }} />
            </SummaryCard>
          </Grid>
        </Grid>

        {/* Biểu đồ */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Báo Cáo Tuần - Vé Máy Bay và Khu Nghỉ Dưỡng
              </Typography>
              <Bar data={barData} options={{ responsive: true }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Báo Cáo Năm
              </Typography>
              <Line data={lineData} options={{ responsive: true }} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
