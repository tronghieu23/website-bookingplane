package API.BookingPlane.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 2000)
    private String description;

    private Double price;
    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location; // Vị trí (thành phố, quận)

    private Double rating; // Điểm trung bình từ đánh giá (tính toán từ bảng Review)
    private Integer totalReviews; // Tổng số lượng bình luận (tính toán từ bảng Review)

    private String image; // Hình ảnh đại diện
    @ElementCollection
    private List<String> subImages; // Danh sách hình ảnh phụ

    private Integer squareFootage; // Diện tích phòng
    private Integer maxGuests; // Số lượng khách tối đa

    @ElementCollection
    private List<String> amenities; // Tiện ích (máy lạnh, hồ bơi, v.v.)

    private Boolean isAvailable; // Trạng thái (trống/đã đặt)

    private LocalDateTime standardCheckInTime; // Giờ nhận phòng tiêu chuẩn
    private LocalDateTime standardCheckOutTime; // Giờ trả phòng tiêu chuẩn

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // Loại phòng (Deluxe, Standard)

}
