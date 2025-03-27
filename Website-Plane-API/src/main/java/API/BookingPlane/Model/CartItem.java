package API.BookingPlane.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account; // Liên kết giỏ hàng với tài khoản

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Sản phẩm không được để trống.")
    private Product product;

    @NotNull(message = "Ngày nhận phòng không được để trống.")
    private LocalDate checkInDate; // Ngày nhận phòng

    @NotNull(message = "Ngày trả phòng không được để trống.")
    private LocalDate checkOutDate; // Ngày trả phòng

    private int night; // Số đêm (tính toán dựa trên checkInDate và checkOutDate)

    @Column(nullable = false)
    @PositiveOrZero(message = "Giá phải lớn hơn hoặc bằng 0.")
    private Double price; // Tổng giá cho số đêm

    // Constructor tiện ích để khởi tạo CartItem
    public CartItem(Product product, Account account, LocalDate checkInDate, LocalDate checkOutDate) {
        this.product = product;
        this.account = account;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.night = calculateNights();
        this.price = calculatePrice();
    }

    // Tính số đêm dựa trên checkInDate và checkOutDate
    public int calculateNights() {
        if (checkInDate != null && checkOutDate != null) {
            return (int) java.time.temporal.ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        }
        return 1; // Mặc định là 1 đêm nếu không có thông tin
    }

    // Tính giá dựa trên số đêm và giá sản phẩm
    public double calculatePrice() {
        if (checkInDate.equals(checkOutDate)) {
            return product.getPrice(); // Giá mặc định của sản phẩm (nếu là ở trong ngày)
        } else {
            double basePrice = product.getPrice();
            double serviceChargePercentage = 0.1; // 10% phí dịch vụ

            // Giá tính theo số đêm và dịch vụ
            double totalPrice = basePrice * night * (1 + serviceChargePercentage);
            return totalPrice;
        }
    }

}
