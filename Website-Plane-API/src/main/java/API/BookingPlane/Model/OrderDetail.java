package API.BookingPlane.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_booking", nullable = false)
    @JsonBackReference // Tránh vòng lặp khi tuần tự hóa
    @ToString.Exclude  // Tránh vòng lặp khi gọi toString()
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Sản phẩm không được để trống.")
    private Product product;

    private int night;

    @NotNull(message = "Giá không được để trống.")
    @Positive(message = "Giá phải lớn hơn 0.")
    private Double price;

    private LocalDateTime checkInDateTime; // Ngày và giờ nhận phòng
    private LocalDateTime checkOutDateTime; // Ngày và giờ trả phòng
}
