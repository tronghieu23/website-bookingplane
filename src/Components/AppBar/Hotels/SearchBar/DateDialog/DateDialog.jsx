import React from "react";
import { Dialog, DialogContent, DialogTitle, Tabs, Tab, Box } from "@mui/material";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DateDialog = ({
  isDialogOpen,
  handleDialogClose,
  selectedTab,
  setSelectedTab,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}) => {
  // Đảm bảo ngày hiện tại
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          marginBottom: "200px",
          width: selectedTab === "overnight" ? "700px" : "500px",
          maxWidth: "90%",
          height: selectedTab === "overnight" ? "500px" : "400px",
        },
      }}
    >
      <DialogTitle>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          centered
        >
          <Tab label="Chỗ Ở Nhiều Ngày" value="overnight" />
          <Tab label="Chỗ Ở Qua Đêm" value="day-use" />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        <Box>
          {/* Chế độ Qua Đêm */}
          {selectedTab === "overnight" && (
            <DayPicker
              mode="range"
              selected={{ from: checkInDate, to: checkOutDate }}
              onSelect={({ from, to }) => {
                // Đảm bảo ngày chọn hợp lệ
                if (from && from < today) {
                  alert("Ngày check-in không được trước ngày hôm nay.");
                  return;
                }
                if (to && to < from) {
                  alert("Ngày check-out phải sau ngày check-in.");
                  return;
                }
                setCheckInDate(from);
                setCheckOutDate(to);
              }}
              numberOfMonths={2}
              disabled={{ before: today }} // Không cho phép chọn trước ngày hiện tại
            />
          )}

          {/* Chế độ Trong Ngày */}
          {selectedTab === "day-use" && (
            <DayPicker
              mode="single"
              selected={checkInDate}
              onSelect={(date) => {
                // Đảm bảo ngày chọn hợp lệ
                if (date && date < today) {
                  alert("Ngày check-in không được trước ngày hôm nay.");
                  return;
                }
                setCheckInDate(date);
                setCheckOutDate(date); // Check-in và Check-out là cùng ngày
              }}
              numberOfMonths={1}
              disabled={{ before: today }} // Không cho phép chọn trước ngày hiện tại
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DateDialog;
