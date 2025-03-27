package API.BookingPlane.Service;

import API.BookingPlane.Model.Account;
import API.BookingPlane.Model.Order;
import API.BookingPlane.Model.OrderDetail;
import API.BookingPlane.Model.Product;
import API.BookingPlane.Repository.AccountRepository;
import API.BookingPlane.Repository.CartItemRepository;
import API.BookingPlane.Repository.OrderRepository;
import API.BookingPlane.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ProductRepository productRepository;

    private Map<String, Order> temporaryOrders = new HashMap<>();

    public Order createOrder(Order order) {
        // Log dữ liệu nhận vào
        System.out.println("Received order: " + order);

        Optional<Account> accountOptional = accountRepository.findById(order.getAccount().getId());

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            order.setAccount(account);

            System.out.println("Account found: " + account);

            // Lặp qua từng chi tiết đơn hàng
            for (OrderDetail orderDetail : order.getOrderDetails()) {
                Product product = orderDetail.getProduct();

                // Chuẩn hóa thời gian để chỉ so sánh ngày
                LocalDate orderCheckInDate = orderDetail.getCheckInDateTime().toLocalDate();
                LocalDate orderCheckOutDate = orderDetail.getCheckOutDateTime().toLocalDate();
                LocalDate productCheckInDate = product.getStandardCheckInTime().toLocalDate();
                LocalDate productCheckOutDate = product.getStandardCheckOutTime().toLocalDate();

                // Kiểm tra thời gian có phù hợp với khoảng thời gian trống của sản phẩm
                if (orderCheckInDate.isBefore(productCheckInDate) || orderCheckOutDate.isAfter(productCheckOutDate)) {
                    throw new RuntimeException("Thời gian đặt không hợp lệ cho sản phẩm: " + product.getName());
                }

                // Cập nhật lại thời gian trống của sản phẩm (tăng thêm 1 ngày)
                product.setStandardCheckInTime(orderDetail.getCheckOutDateTime().plusDays(1));
                productRepository.save(product);
            }

            Order savedOrder = orderRepository.save(order);
            System.out.println("Order saved successfully: " + savedOrder);
            return savedOrder;
        } else {
            System.err.println("Tài khoản không tìm thấy với id: " + order.getAccount().getId());
            throw new RuntimeException("Tài khoản không tìm thấy với id: " + order.getAccount().getId());
        }
    }



    private void updateProductAvailability(Product product, LocalDateTime checkIn, LocalDateTime checkOut) {
        if (product.getStandardCheckInTime() != null && product.getStandardCheckInTime().isEqual(checkIn)) {
            // Cập nhật thời gian mới
            product.setStandardCheckInTime(checkOut.plusDays(1));

            if (product.getStandardCheckOutTime() != null) {
                product.setStandardCheckOutTime(product.getStandardCheckOutTime().minusDays(1));
            }

            try {
                productRepository.save(product);
                System.out.println("Cập nhật thành công thời gian trống cho sản phẩm: " + product.getId());
            } catch (Exception e) {
                System.err.println("Lỗi khi lưu sản phẩm: " + e.getMessage());
            }
        } else {
            // Thêm thông báo chi tiết khi không thỏa mãn điều kiện
            if (product.getStandardCheckInTime() == null) {
                System.out.println("StandardCheckInTime của sản phẩm bị null.");
            } else {
                System.out.println("Thời gian nhận phòng không khớp. StandardCheckInTime: "
                        + product.getStandardCheckInTime() + ", CheckIn: " + checkIn);
            }
        }
    }

    // Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Lấy đơn hàng theo ID
    public Order getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.orElseThrow(() -> new RuntimeException("Order not found"));
    }
    // Lấy đơn hàng theo ID Khách Hàng
    public List<Order> getOrdersByAccountId(UUID accountId) {
        return orderRepository.findByAccountId(accountId);
    }


    // Cập nhật thông tin đơn hàng
    public Order updateOrder(Long id, Order orderDetails) {
        Order existingOrder = getOrderById(id);
        existingOrder.setFirstName(orderDetails.getFirstName());
        existingOrder.setLastName(orderDetails.getLastName());
        existingOrder.setPhoneNumber(orderDetails.getPhoneNumber());
        existingOrder.setEmail(orderDetails.getEmail());
        existingOrder.setPaymentMethod(orderDetails.getPaymentMethod());
        existingOrder.setOrderDetails(orderDetails.getOrderDetails());
        return orderRepository.save(existingOrder);
    }

    // Xóa đơn hàng theo ID
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order getOrderByTxnRef(String vnpTxnRef) {
        return temporaryOrders.get(vnpTxnRef);
    }
    public void saveTemporaryOrder(Order order) {
        temporaryOrders.put(order.getVnpTxnRef(), order);
    }
    public String calculateTotalRevenue() {
        List<Order> allOrders = orderRepository.findAll();
        double totalRevenue = 0;

        for (Order order : allOrders) {
            totalRevenue += order.getTotal();
        }

        // Định dạng tổng doanh thu theo VND
        Locale localeVN = new Locale("vi", "VN");
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(localeVN);
        return currencyFormatter.format(totalRevenue);
    }


}
