package API.BookingPlane.Repository;

import API.BookingPlane.Model.Booking;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b " +
            "JOIN FETCH b.flight f " +
            "JOIN FETCH f.airline a " +
            "JOIN FETCH b.seat s " +
            "WHERE b.id = :id")
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);
}

