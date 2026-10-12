package com.campus.canteen.repository;

import com.campus.canteen.model.Order;
import com.campus.canteen.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);
    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);
    Optional<Order> findByTokenNumber(String tokenNumber);
    boolean existsByTokenNumber(String tokenNumber);
}
