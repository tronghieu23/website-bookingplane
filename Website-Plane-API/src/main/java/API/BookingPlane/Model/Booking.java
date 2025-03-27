package API.BookingPlane.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên không được để trống.")
    private String firstName;

    @NotBlank(message = "Họ không được để trống.")
    private String lastName;

    @NotBlank(message = "Số điện thoại không được để trống.")
    @Pattern(regexp = "^\\d{10,15}$", message = "Số điện thoại không hợp lệ.")
    private String phoneNumber;

    @NotBlank(message = "Email không được để trống.")
    @Email(message = "Email không hợp lệ.")
    private String email;
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account customer; // Liên kết tới khách hàng

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight; // Liên kết tới chuyến bay

    @ManyToOne
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat; // Liên kết tới ghế đã chọn

    @NotNull(message = "Ngày đặt vé bắt buộc điền")
    private LocalDateTime bookingDate;

    private Double totalPrice; // Tổng tiền vé

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Order.PaymentMethod paymentMethod; // Enum cho phương thức thanh toán

    public enum PaymentMethod {
        CASH, VNPAY,MOMO
    }
    private String vnpTxnRef;
}
