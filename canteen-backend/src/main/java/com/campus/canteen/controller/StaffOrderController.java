package com.campus.canteen.controller;

import com.campus.canteen.dto.UpdateOrderStatusRequest;
import com.campus.canteen.model.Order;
import com.campus.canteen.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")
public class StaffOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getActiveOrdersForStaff());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                             @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }
}
