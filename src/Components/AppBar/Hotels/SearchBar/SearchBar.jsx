import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import DateDialog from './DateDialog/DateDialog';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';

const SearchBar = ({ onSearch }) => {
  const [selectedTab, setSelectedTab] = useState('overnight');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const formatDate = (date) =>
    date
      ? new Date(date.getTime() + 7 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';
      const normalizeDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
        return normalized;
      };
      
  const formatDay = (date) =>
    date
      ? new Date(date.getTime() + 7 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
          weekday: 'long',
        })
      : '';

      const handleSearch = () => {
        // Chuẩn hóa ngày check-in và check-out
        const normalizedCheckInDate = checkInDate ? normalizeDate(checkInDate) : null;
        const normalizedCheckOutDate = checkOutDate ? normalizeDate(checkOutDate) : null;
      
        console.log("Search Parameters:", {
          name: productSearch,
          checkInDate: normalizedCheckInDate,
          checkOutDate: normalizedCheckOutDate,
          guestCount,
        });
      
        onSearch({
          name: productSearch,
          checkInDate: normalizedCheckInDate,
          checkOutDate: normalizedCheckOutDate,
          guestCount,
        });
      };
      
  return (
    <Box sx={{ backgroundColor: '#1f274c', padding: 0.7 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          padding: 2,
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder="Tìm kiếm homestay"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 2,
            height: '56px',
          }}
        />
        <Box sx={{ display: 'flex', gap: selectedTab === 'overnight' ? 2 : 0, flex: 1 }}>
          <Button
            onClick={handleDialogOpen}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textTransform: 'none',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px 16px',
              height: '56px',
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', color: '#000', fontSize: '16px' }}
            >
              {checkInDate ? formatDate(checkInDate) : 'Check-in'}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontSize: '14px' }}
            >
              {checkInDate ? formatDay(checkInDate) : 'Chọn ngày'}
            </Typography>
          </Button>
          <Button
            onClick={handleDialogOpen}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textTransform: 'none',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px 16px',
              height: '56px',
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', color: '#000', fontSize: '16px' }}
            >
              {checkOutDate ? formatDate(checkOutDate) : 'Check-out'}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontSize: '14px' }}
            >
              {checkOutDate ? formatDay(checkOutDate) : 'Chọn ngày'}
            </Typography>
          </Button>
        </Box>
        <TextField
          type="number"
          variant="outlined"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          inputProps={{
            min: 1,
            max: 20,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleOutlineOutlinedIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '300px',
            backgroundColor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              height: '56px',
              alignItems: 'center',
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            flex: 0.5,
            backgroundColor: '#1976d2',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            height: '56px',
          }}
          onClick={handleSearch}
        >
          CẬP NHẬT
        </Button>
      </Box>
      <DateDialog
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        setCheckInDate={setCheckInDate}
        setCheckOutDate={setCheckOutDate}
      />
    </Box>
  );
};

export default SearchBar;
