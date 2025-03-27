import React, { useEffect, useState } from "react";
import { Card, CardMedia, CardContent, Typography, Grid, Box, Button, Divider, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KitchenIcon from "@mui/icons-material/Kitchen";
import BedIcon from "@mui/icons-material/Bed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BalconyIcon from "@mui/icons-material/Balcony";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import SpaIcon from "@mui/icons-material/Spa";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import HotelFilter from "./HotelFilter/HotelFilter";
import { fetchAllHotels, addToCartAPI, fetchCartItemsAPI} from "../../../apis";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchBar from "./SearchBar/SearchBar";
import PeopleIcon from "@mui/icons-material/People";
const amenitiesOptions = [
  { name: "Ăn sáng miễn phí", icon: <FreeBreakfastIcon /> },
  { name: "Gym/Fitness", icon: <FitnessCenterIcon /> },
  { name: "Ban công", icon: <BalconyIcon /> },
  { name: "Cảnh biển", icon: <BeachAccessIcon /> },
  { name: "Spa", icon: <SpaIcon /> },
  { name: "Quầy bar", icon: <LocalBarIcon /> },
];

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: "",
    checkInDate: new Date(), // Mặc định là ngày hiện tại
    checkOutDate: null, // Mặc định là null
    guestCount: 1, // Mặc định là 1 người
  });
  
  const navigate = useNavigate();  // Initialize navigate function
  const [filters, setFilters] = useState({
    location: "",
    districts: [],
    priceRange: [0, 50000000],
    categories: [],
    starRatings: [],
  });
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelData = await fetchAllHotels();
        console.log("Fetched Hotels:", hotelData);
  
        const today = new Date();
        const normalizedToday = normalizeDate(today);
  
        const filteredData = hotelData.filter((hotel) => {
          const hotelCheckInDate = hotel.standardCheckInTime
            ? normalizeDate(new Date(hotel.standardCheckInTime))
            : null;
  
          return hotelCheckInDate && hotelCheckInDate <= normalizedToday;
        });
  
        console.log("Filtered Hotels for today:", filteredData);
  
        setHotels(hotelData); // Lưu tất cả sản phẩm
        setFilteredHotels(filteredData); // Lưu sản phẩm đã lọc
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHotels();
  }, []);
  
  
  useEffect(() => {
    const applyFilters = () => {
      let filtered = hotels;


      // Lọc theo tỉnh thành
      if (filters.location) {
        filtered = filtered.filter(
          (hotel) => hotel.location.district.province.name === filters.location
        );
      }

      // Lọc theo quận
      if (filters.districts && filters.districts.length > 0) {
        filtered = filtered.filter((hotel) =>
          filters.districts.includes(hotel.location.district.name)
        );
      }

      // Lọc theo đánh giá sao
      if (filters.starRatings.length > 0) {
        filtered = filtered.filter((hotel) => {
          if (!hotel.rating) return false; // Loại bỏ nếu không có đánh giá
          return filters.starRatings.some((rating) => hotel.rating >= rating);
        });
      }

      // Lọc theo khoảng giá
      if (filters.priceRange) {
        filtered = filtered.filter(
          (hotel) =>
            hotel.price >= filters.priceRange[0] &&
            hotel.price <= filters.priceRange[1]
        );
      }

      // Lọc theo loại hình nơi ở
      if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter((hotel) =>
          filters.categories.includes(hotel.category.name)
        );
      }

      setFilteredHotels(filtered);
    };

    applyFilters();
  }, [filters, hotels]);



  const handleFilterChange = (newFilters) => {

    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      return updatedFilters;
    });
  };


  const filterByDateRange = (hotels, targetDate) => {
    const target = normalizeDate(targetDate);
    console.log("Target Date:", target);
  
    return hotels.filter((hotel) => {
      const checkInDate = hotel.standardCheckInTime
        ? normalizeDate(new Date(hotel.standardCheckInTime))
        : null;
      const checkOutDate = hotel.standardCheckOutTime
        ? normalizeDate(new Date(hotel.standardCheckOutTime))
        : null;
  
      console.log("Hotel:", hotel.name);
      console.log("Hotel Check-In Date:", checkInDate);
      console.log("Hotel Check-Out Date:", checkOutDate);
  
      if (checkInDate && checkOutDate) {
        const isInRange = checkInDate <= target && checkOutDate >= target;
        console.log("Is in Range:", isInRange);
        return isInRange;
      }
  
      console.log("Skipped Hotel:", hotel.name);
      return false;
    });
  };
  
  
  


  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
    return normalized;
  };
  console.log("Hotels before filtering:", hotels);

  const handleSearch = ({ name, checkInDate, checkOutDate, guestCount }) => {
    setSearchParams({ name, checkInDate, checkOutDate, guestCount });
  
    const normalizedCheckInDate = checkInDate ? normalizeDate(checkInDate) : null;
    const normalizedCheckOutDate = checkOutDate ? normalizeDate(checkOutDate) : null;
  
    console.log("Search Parameters:");
    console.log("Name:", name);
    console.log("Normalized Check-In Date:", normalizedCheckInDate);
    console.log("Normalized Check-Out Date:", normalizedCheckOutDate);
    console.log("Guest Count:", guestCount);
  
    const filtered = hotels.filter((hotel) => {
      const matchesName = hotel.name.toLowerCase().includes(name.toLowerCase());
      const hotelCheckInDate = hotel.standardCheckInTime
        ? normalizeDate(new Date(hotel.standardCheckInTime))
        : null;
      const hotelCheckOutDate = hotel.standardCheckOutTime
        ? normalizeDate(new Date(hotel.standardCheckOutTime))
        : null;
  
      console.log("Hotel:", hotel.name);
      console.log("Hotel Check-In Date:", hotelCheckInDate);
      console.log("Hotel Check-Out Date:", hotelCheckOutDate);
  
      const matchesDateRange =
        normalizedCheckInDate &&
        normalizedCheckOutDate &&
        hotelCheckInDate &&
        hotelCheckOutDate &&
        hotelCheckInDate <= normalizedCheckInDate &&
        hotelCheckOutDate >= normalizedCheckOutDate;
  
      console.log("Matches Date Range:", matchesDateRange);
  
      const matchesGuestCount = !guestCount || (hotel.maxGuests && hotel.maxGuests >= guestCount);
  
      console.log("Matches Guest Count:", matchesGuestCount);
  
      return matchesName && matchesDateRange && matchesGuestCount;
    });
  
    console.log("Filtered Hotels:", filtered);
    setFilteredHotels(filtered);
  };
  
  if (loading) {
    return <Typography variant="h6">Đang tải dữ liệu...</Typography>;
  }

  const handleViewDetails = (hotelId) => {
    navigate(`/account/HotelDetail/${hotelId}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      const accountId = localStorage.getItem("userId");
  
      if (!accountId) {
        console.log("User not logged in.");
        alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng.");
        return;
      }
  
      const { checkInDate, checkOutDate, guestCount } = searchParams;
  
      // Kiểm tra nếu checkInDate hoặc checkOutDate chưa được chọn
      if (!checkInDate || !checkOutDate || !guestCount) {
        console.log("Missing information.");
        toast.warn("Vui lòng chọn đầy đủ thông tin ngày và số lượng người trước khi đặt.");
        return;
      }
  
      let finalCheckInDate = checkInDate;
      let finalCheckOutDate = checkOutDate;
  
      // Kiểm tra xem checkInDate và checkOutDate có giống nhau không (ở trong ngày)
      if (checkInDate.toDateString() === checkOutDate.toDateString()) {
        console.log("Same day booking. Adjusting checkOutDate to checkInDate + 1.");
        // Đảm bảo checkOutDate là một ngày hợp lệ
        finalCheckOutDate = new Date(checkInDate);  
        finalCheckOutDate.setUTCDate(finalCheckOutDate.getUTCDate() + 1); // Thêm 1 ngày mà không bị ảnh hưởng múi giờ
      }
  
      // Định dạng ngày theo kiểu YYYY-MM-DD sử dụng toLocaleDateString thay vì toISOString
      const formattedCheckInDate = finalCheckInDate.toLocaleDateString("en-CA"); // Dùng en-CA để có định dạng YYYY-MM-DD
      const formattedCheckOutDate = finalCheckOutDate.toLocaleDateString("en-CA"); // Dùng en-CA để có định dạng YYYY-MM-DD
  
      // Gọi API để kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const res = await fetchCartItemsAPI(accountId); // Gọi API lấy các cart items của người dùng
  
      const cartItems = res || []; // Nếu res.data là undefined hoặc null, khởi tạo như một mảng rỗng
  
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const productExists = cartItems.some(
        (item) =>
          item.productId === productId &&
          item.checkInDate === formattedCheckInDate &&
          item.checkOutDate === formattedCheckOutDate
      );
  
      if (productExists) {
        console.log("Product already exists in the cart.");
        toast.info("Sản phẩm đã tồn tại trong giỏ hàng. Hãy vào giỏ hàng để cập nhật ngày nếu cần.");
        return;
      }
  
      console.log("Adding to cart with:", {
        productId,
        accountId,
        formattedCheckInDate,
        formattedCheckOutDate,
      });
  
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào giỏ hàng qua API
      await addToCartAPI(productId, accountId, formattedCheckInDate, formattedCheckOutDate);
  
      toast.success("Bạn đã thêm sản phẩm vào giỏ hàng");
      navigate("/account/shoppingcart");
    } catch (error) {
      console.error("Error when adding to cart:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };
  
  console.log("State filteredHotels after setting:", filteredHotels);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <HotelFilter onFilterChange={handleFilterChange} />
          </Grid>

          <Grid item xs={12} sm={8} md={9}>
            {filteredHotels.map((hotel) => (
              <Card key={hotel.id} sx={{ display: "flex", mb: 3 }}>
                <Box sx={{ width: "40%", position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="400px"
                    image={hotel.image}
                    alt={hotel.name}
                    onClick={() => handleViewDetails(hotel.id)}  // Navigate to details on image click
                  />
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                  }}>
                    {hotel.subImages.map((subImg, idx) => (
                      <CardMedia
                        key={idx}
                        component="img"
                        image={subImg}
                        sx={{
                          width: "30%",
                          height: "60px",
                          objectFit: "cover",
                          marginRight: idx < hotel.subImages.length - 1 ? "10px" : "0",
                        }}
                      />
                    ))}
                    <Button
                      sx={{
                        mt: 1,
                        color: "white",
                        whiteSpace: 'nowrap',
                        marginLeft: "10px",
                        marginRight: "5px",
                        fontWeight: "bold"
                      }}
                      onClick={() => handleViewDetails(hotel.id)}  // Navigate to details page
                    >
                      Xem tất cả
                    </Button>
                  </Box>
                </Box>
                <CardContent sx={{ width: "60%", marginTop: "20px" }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <LocationOnIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
                    {hotel.location.name}, {hotel.location?.district?.name}, {hotel.location.district?.province?.name}
                    <span> - {hotel.distance}</span>
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", fontFamily: "Times New Roman, serif" }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                        fontFamily: "Times New Roman, serif",
                      }}
                    >
                      {/* Diện tích */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.95rem",
                          fontFamily: "Times New Roman, serif",
                        }}
                      >
                        <SquareFootIcon sx={{ fontSize: "16px", marginRight: "10px" }} />
                        {hotel.squareFootage}m²
                      </Box>

                      {/* Dấu ngăn cách */}
                      <Typography sx={{ fontSize: "0.95rem", marginX: "5px" }}> | </Typography>

                      {/* Số lượng người */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.95rem",
                          fontFamily: "Times New Roman, serif",
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: "16px", marginRight: "10px" }} />
                        {hotel.maxGuests || "Không xác định"} người
                      </Box>

                      {/* Dấu ngăn cách */}
                      <Typography sx={{ fontSize: "0.95rem", marginX: "5px" }}> | </Typography>

                      {/* Số phòng ngủ */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.95rem",
                          fontFamily: "Times New Roman, serif",
                        }}
                      >
                        <BedIcon sx={{ fontSize: "16px", marginRight: "5px" }} />
                        {hotel.bedrooms}{hotel.maxGuests/2} Phòng ngủ
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      flexWrap: "wrap",
                      fontFamily: "Times New Roman, serif",
                    }}
                  >
                    {amenitiesOptions.map((amenity, index) => {
                      const visibleAmenities = amenitiesOptions.filter((option) =>
                        hotel.amenities.includes(option.name)
                      );
                      const isLastItem = visibleAmenities[visibleAmenities.length - 1] === amenity;

                      return (
                        hotel.amenities.includes(amenity.name) && (
                          <React.Fragment key={amenity.name}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.95rem",
                                fontFamily: "Times New Roman, serif",
                              }}
                            >
                              {React.cloneElement(amenity.icon, { style: { fontSize: "16px" } })}
                              <Typography
                                variant="body2"
                                sx={{
                                  ml: 0.2,
                                  fontSize: "0.95rem",
                                  marginRight: "10px",
                                  fontFamily: "Times New Roman, serif",
                                }}
                              >
                                {amenity.name}
                              </Typography>
                            </Box>
                            {/* Thêm dấu " | " nếu không phải là mục cuối */}
                            {!isLastItem && (
                              <Typography
                                sx={{
                                  fontSize: "0.95rem",
                                  marginX: "5px",
                                  fontFamily: "Times New Roman, serif",
                                }}
                              >
                                |
                              </Typography>
                            )}
                          </React.Fragment>
                        )
                      );
                    })}
                  </Box>



                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                    <Rating value={hotel.rating / 2} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {hotel.rating} ({hotel.reviews} nhận xét)
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "20px" }}>
                    <Box sx={{ textAlign: "right" }}>
                      {hotel.isDiscounted && (
                        <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                          {hotel.originalPrice} ₫
                        </Typography>
                      )}
                      <Typography variant="h6" sx={{ color: "#fd0100", fontWeight: "bold" }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price)}
                      </Typography>
                      <Typography sx={{ color: "#008b4b", fontWeight: "bold", mt: 1 }}>
                        + HỦY MIỄN PHÍ
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="contained" sx={{ width: "100%", mt: 3 }}
                    onClick={() => { handleAddToCart(hotel.id); }}>
                    Đặt ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Hotels;