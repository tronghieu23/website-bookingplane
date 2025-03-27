package API.BookingPlane.Service;

import API.BookingPlane.Controller.VNPayController;
import API.BookingPlane.Model.Booking;
import API.BookingPlane.Model.Flight;
import API.BookingPlane.Model.Order;
import API.BookingPlane.Model.Seat;
import API.BookingPlane.Repository.BookingRepository;
import API.BookingPlane.Repository.FlightRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private FlightRepository flightRepository;
    private Map<String, Booking> temporaryBookings = new HashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(VNPayController.class);

    // Tạo đặt vé
    public Booking createBooking(Booking booking) throws Exception {
        // Lấy thông tin chuyến bay cùng danh sách seats
        logger.info("Creating booking with data: {}", booking);
        Flight flight = flightRepository.findByIdWithSeats(booking.getFlight().getId());
        if (flight == null) {
            throw new Exception("Chuyến bay không tồn tại.");
        }

        // Kiểm tra mã ghế tồn tại và trạng thái đã đặt hay chưa
        Optional<Seat> seatOptional = flight.getSeats()
                .stream()
                .filter(seat -> seat.getId().equals(booking.getSeat().getId()))
                .findFirst();

        if (seatOptional.isEmpty()) {
            throw new Exception("Mã ghế không tồn tại trong chuyến bay này.");
        }

        Seat seatToBook = seatOptional.get();
        if (Boolean.TRUE.equals(seatToBook.getIsBooked())) {
            throw new Exception("Ghế " + seatToBook.getSeatNumber() + " đã được đặt.");
        }

        // Đánh dấu ghế là đã đặt
        seatToBook.setIsBooked(true);

        // Lưu đặt vé
        return bookingRepository.save(booking);
    }

    public Booking createBooking(Long bookingId) throws Exception {
        // Lấy thông tin chuyến bay cùng danh sách seats
        var booking = bookingRepository.findById(bookingId).orElseThrow(() -> new EntityNotFoundException("Booking not found"));


        return createBooking(booking);
    }
    // Lấy danh sách đặt vé
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Lấy đặt vé theo ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    // Cập nhật đặt vé
    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = getBookingById(id);
        if (booking != null) {
            booking.setFlight(bookingDetails.getFlight());
            booking.setCustomer(bookingDetails.getCustomer());
            booking.setBookingDate(bookingDetails.getBookingDate());
            booking.setSeat(bookingDetails.getSeat());
            booking.setTotalPrice(bookingDetails.getTotalPrice());
            return bookingRepository.save(booking);
        }
        return null;
    }

    // Xóa đặt vé
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public Booking getBookingByTxnRef(String vnpTxnRef) {
        return temporaryBookings.get(vnpTxnRef);
    }
    public void saveTemporaryBooking(Booking booking) {
        temporaryBookings.put(booking.getVnpTxnRef(), booking);
    }
    public Booking findBookingWithDetails(Long bookingId) {
        return bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
