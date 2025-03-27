package API.BookingPlane.Controller;


import API.BookingPlane.Config.VNPayConfig;
import API.BookingPlane.Model.Booking;
import API.BookingPlane.Model.Flight;
import API.BookingPlane.Model.Order;
import API.BookingPlane.Model.Seat;
import API.BookingPlane.Service.BookingService;
import API.BookingPlane.Service.CartService;
import API.BookingPlane.Service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/payment")
public class  VNPayController{

    @Autowired
    private OrderService orderService;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private CartService cartService;
    private static final Logger logger = LoggerFactory.getLogger(VNPayController.class);

    @PostMapping("/create-payment")
    public String createPayment(@RequestBody Order order) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = Math.round(order.getTotal() * 100);  // amount in cents
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;


        order.setVnpTxnRef(vnp_TxnRef);
        orderService.saveTemporaryOrder(order);

        return paymentUrl;
    }



    @GetMapping("/payment-callback")
    public void paymentCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> vnp_Params = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String paramName = params.nextElement();
            String paramValue = request.getParameter(paramName);
            if (paramValue != null && paramValue.length() > 0) {
                vnp_Params.put(paramName, paramValue);
            }
        }

        String vnp_SecureHash = vnp_Params.remove("vnp_SecureHash");
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();

        try {
            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                        hashData.append('&');
                    }
                }
            }
        } catch (UnsupportedEncodingException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Encoding error");
            return;
        }

        String secureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());

        if (secureHash.equals(vnp_SecureHash)) {
            String vnp_ResponseCode = vnp_Params.get("vnp_ResponseCode");
            if ("00".equals(vnp_ResponseCode)) {
                String vnp_TxnRef = vnp_Params.get("vnp_TxnRef");
                Order order = orderService.getOrderByTxnRef(vnp_TxnRef);
                if (order != null) {
                    Order createdOrder = orderService.createOrder(order);

                    // Lấy danh sách productId từ OrderDetails
                    List<Long> productIds = order.getOrderDetails()
                            .stream()
                            .map(orderDetail -> orderDetail.getProduct().getId())
                            .collect(Collectors.toList());

                    // Lấy accountId từ đơn hàng
                    UUID accountId = order.getAccount().getId();

                    // Xóa các sản phẩm đã được thanh toán khỏi giỏ hàng
                    cartService.removeItemsFromCart(accountId, productIds);

                    // Serialize orderData to JSON
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.registerModule(new JavaTimeModule());
                    String orderDataJson = objectMapper.writeValueAsString(order);

                    // Encode JSON to URL-safe format
                    String encodedOrderData = URLEncoder.encode(orderDataJson, StandardCharsets.UTF_8.toString());

                    // Redirect to the desired URL with orderData
                    response.sendRedirect("http://localhost:5173/account/information?orderData=" + encodedOrderData);
                } else {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Order not found");
                }
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Payment failed");
            }
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid checksum");
        }
    }

    @PostMapping("/create-flight-payment")
    public ResponseEntity<String> createFlightPayment(@RequestBody Booking booking) {
        logger.info("Received booking data: {}", booking);
        try {
            // Xác thực dữ liệu đầu vào
            if (booking.getTotalPrice() == null || booking.getCustomer() == null ||
                    booking.getFlight() == null || booking.getSeat() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thông tin đặt vé không đầy đủ.");
            }

            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String orderType = "airline";
            long amount = Math.round(booking.getTotalPrice() * 100); // amount in cents
            String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
            String vnp_IpAddr = "127.0.0.1";
            String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

            // Chuẩn bị tham số thanh toán VNPay
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toán vé máy bay: " + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrlBooking + "/" + booking.getFlight().getId() + "/" + booking.getCustomer().getId());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            // Thời gian tạo và hết hạn
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Ký tham số và tạo URL thanh toán
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            String queryUrl = query.toString();
            String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

            // Lưu thông tin Booking tạm thời
            booking.setVnpTxnRef(vnp_TxnRef);
            bookingService.saveTemporaryBooking(booking);

            return ResponseEntity.ok(paymentUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo thanh toán: " + e.getMessage());
        }
    }


    @GetMapping("/flight-payment-callback/{bookingId}/{userId}")
    public void flightPaymentCallback(@PathVariable Long bookingId, @PathVariable UUID userId,
                                      @RequestParam("vnp_Amount") String amount,
                                      @RequestParam("vnp_ResponseCode") String responseCode,
                                      @RequestParam("vnp_TransactionStatus") String transactionStatus,
            HttpServletRequest request, HttpServletResponse response
    ) throws Exception {

        if ("00".equals(responseCode)) {
            var booking = bookingService.createBooking(bookingId);

            if (booking != null) {
                Booking createdBooking = bookingService.createBooking(booking);
                // Sau khi lấy thông tin booking từ cơ sở dữ liệu

                    // Chuyển hướng tới frontend với dữ liệu đã mã hóa
                response.sendRedirect("http://localhost:5173/account/InformationSucces" );
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Booking not found");
            }

        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid booking data");
        }
    }
}
