package API.BookingPlane.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // Sản phẩm được đánh giá

    @NotBlank(message = "Nội dung bình luận không được để trống")
    private String comment; // Nội dung bình luận

    private Double rating; // Điểm đánh giá (1 - 5)

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account; // Tài khoản của người đánh giá

    private LocalDateTime reviewDate; // Ngày đánh giá
}
