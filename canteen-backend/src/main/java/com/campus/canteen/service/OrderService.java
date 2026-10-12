package com.campus.canteen.service;

import com.campus.canteen.dto.CreateOrderRequest;
import com.campus.canteen.dto.LiveDisplayResponse;
import com.campus.canteen.dto.OrderItemRequest;
import com.campus.canteen.model.*;
import com.campus.canteen.repository.MenuItemRepository;
import com.campus.canteen.repository.OrderRepository;
import com.campus.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public Order createOrder(String studentEmail, CreateOrderRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found!"));

        long nextNum = orderRepository.count() + 101;
        String tokenNumber;
        do {
            tokenNumber = String.format("#T-%03d", nextNum++);
        } while (orderRepository.existsByTokenNumber(tokenNumber));

        Order order = Order.builder()
                .tokenNumber(tokenNumber)
                .student(student)
                .status(OrderStatus.PLACED)
                .pickupSlot(request.getPickupSlot())
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + itemReq.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new RuntimeException("Item is currently sold out: " + menuItem.getName());
            }

            BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .priceAtOrder(menuItem.getPrice())
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found!"));
        return orderRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }

    public List<Order> getActiveOrdersForStaff() {
        return orderRepository.findByStatusInOrderByCreatedAtAsc(
                List.of(OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY)
        );
    }

    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public LiveDisplayResponse getLiveTokens() {
        List<Order> preparingOrders = orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.PREPARING);
        List<Order> readyOrders = orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.READY);

        List<String> preparing = preparingOrders.stream().map(Order::getTokenNumber).toList();
        List<String> ready = readyOrders.stream().map(Order::getTokenNumber).toList();

        return LiveDisplayResponse.builder()
                .preparingTokens(preparing)
                .readyTokens(ready)
                .build();
    }
}
