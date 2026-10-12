package com.campus.canteen.controller;

import com.campus.canteen.dto.CreateOrderRequest;
import com.campus.canteen.model.Order;
import com.campus.canteen.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(Authentication authentication,
                                           @Valid @RequestBody CreateOrderRequest request) {
        String studentEmail = authentication.getName();
        return ResponseEntity.ok(orderService.createOrder(studentEmail, request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        String studentEmail = authentication.getName();
        return ResponseEntity.ok(orderService.getMyOrders(studentEmail));
    }
}
