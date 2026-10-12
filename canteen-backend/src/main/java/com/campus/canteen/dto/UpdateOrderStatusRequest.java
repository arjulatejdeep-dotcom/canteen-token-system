package com.campus.canteen.dto;

import com.campus.canteen.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotNull(message = "New order status is required")
    private OrderStatus status;
}
