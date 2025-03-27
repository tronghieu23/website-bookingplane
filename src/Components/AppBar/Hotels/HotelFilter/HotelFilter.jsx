import React, { useEffect, useState } from "react";
import {
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Divider,
} from "@mui/material";
import { fetchAllToDistrictAPI, fetchAllCategoriesAPI } from "../../../../apis";
import renderStars from "../../../../utils/renderStars";

const HotelFilter = ({ onFilterChange }) => {
  const [locations, setLocations] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [starRatings, setStarRatings] = useState([
    { label: "Tốt nhất trong hạng mục Sang trọng", rating: 9.7, count: 290 },
    { rating: 9.5, count: 1596 },
    { rating: 8.9, count: 1093 },
    { rating: 6.0, count: 1269 },
    { rating: 4.5, count: 609 },
    { rating: 2.5, count: 295 },
    { label: "Chưa xếp hạng", count: 2988 },
  ]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedStarRatings, setSelectedStarRatings] = useState([]);

  useEffect(() => {
    const fetchLocationsAndCategories = async () => {
      try {
        const districtsData = await fetchAllToDistrictAPI();
        const groupedLocations = districtsData.reduce((acc, district) => {
          const provinceName = district.province.name;
          if (!acc[provinceName]) {
            acc[provinceName] = [];
          }
          acc[provinceName].push(district.name);
          return acc;
        }, {});
        setLocations(groupedLocations);

        const categoriesData = await fetchAllCategoriesAPI();
        setCategories(categoriesData.map((category) => category.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLocationsAndCategories();
  }, []);

  const handleLocationChange = (event) => {
    const selectedValue = event.target.value;

    setSelectedLocation(selectedValue);

    // Nếu người dùng chọn "Tất cả", không áp dụng bộ lọc tỉnh thành
    onFilterChange({
      location: selectedValue === "Tất cả" ? "" : selectedValue,
      priceRange,
      starRatings: selectedStarRatings,
    });
  };


  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange({ location: selectedLocation, priceRange: newValue, starRatings: selectedStarRatings });
  };

  const handleStarRatingChange = (rating) => {
    const updatedRatings = selectedStarRatings.includes(rating)
      ? selectedStarRatings.filter((r) => r !== rating) // Xóa nếu đã chọn
      : [...selectedStarRatings, rating]; // Thêm nếu chưa chọn
    setSelectedStarRatings(updatedRatings);

    onFilterChange({
      location: selectedLocation,
      districts: selectedDistricts,
      priceRange,
      starRatings: updatedRatings,
      categories: selectedCategories,
    });
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);

    onFilterChange({
      location: selectedLocation,
      priceRange,
      starRatings: selectedStarRatings,
      categories: updatedCategories,
    });
  };
  const handleDistrictChange = (district) => {
    const updatedDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter((d) => d !== district) // Xóa nếu đã chọn
      : [...selectedDistricts, district]; // Thêm nếu chưa chọn
    setSelectedDistricts(updatedDistricts);

    // Cập nhật bộ lọc
    onFilterChange({
      location: selectedLocation,
      districts: updatedDistricts,
      priceRange,
      starRatings: selectedStarRatings,
      categories: selectedCategories,
    });
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Bộ lọc phổ biến
      </Typography>

      <TextField fullWidth label="Tìm kiếm văn bản" variant="outlined" sx={{ mb: 2 }} />

      <Divider sx={{ my: 2 }} />

      <Typography gutterBottom fontWeight="bold">
        Giá mỗi đêm
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value.toLocaleString()} VND`}
        min={0}
        max={50000000}
        step={1000}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Chọn tỉnh thành
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Chọn tỉnh thành</InputLabel>
        <Select value={selectedLocation} onChange={handleLocationChange} label="Chọn tỉnh thành">
          <MenuItem value="Tất cả">Tất cả</MenuItem> {/* Thêm lựa chọn Tất cả */}
          {Object.keys(locations).map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLocation && selectedLocation !== "Tất cả" && (
        <>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Bộ lọc phổ biến cho {selectedLocation}
          </Typography>
          <Grid container spacing={1}>
            {locations[selectedLocation].map((district) => (
              <Grid item xs={12} sm={6} key={district}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedDistricts.includes(district)}
                      onChange={() => handleDistrictChange(district)}
                    />
                  }
                  label={district}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}


      <Divider sx={{ my: 2 }} />



      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Loại hình nơi ở
      </Typography>
      <Grid container spacing={1}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} key={category}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              }
              label={category}
            />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Xếp hạng sao
      </Typography>
      {starRatings.map((item, index) => (
        <Grid container key={index} alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedStarRatings.includes(item.rating)}
                  onChange={() => handleStarRatingChange(item.rating)}
                />
              }
              label={item.label ? item.label : renderStars(item.rating)}
            />
          </Grid>
          
        </Grid>
      ))}

    </div>
  );
};

export default HotelFilter;
