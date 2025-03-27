package API.BookingPlane.Repository;

import API.BookingPlane.Model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    @Query("SELECT od FROM OrderDetail od JOIN FETCH od.product WHERE od.id = :id")
    Optional<OrderDetail> findOrderDetailWithProduct(@Param("id") Long id);

}
