package API.BookingPlane.Repository;

import API.BookingPlane.Model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // Tìm chuyến bay theo điều kiện
    List<Flight> findByDepartureAirportIdAndArrivalAirportIdAndDepartureTimeBetween(
            Long departureAirportId,
            Long arrivalAirportId,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    );

    // Tìm chuyến bay quá hạn
    List<Flight> findByDepartureTimeBefore(LocalDateTime dateTime);
    //tìm danh sách ghế khi tìm Flight
        @Query("SELECT f FROM Flight f LEFT JOIN FETCH f.seats WHERE f.id = :id")
        Flight findByIdWithSeats(Long id);
}
