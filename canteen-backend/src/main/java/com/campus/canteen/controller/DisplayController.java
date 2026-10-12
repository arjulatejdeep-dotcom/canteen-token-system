package com.campus.canteen.controller;

import com.campus.canteen.dto.LiveDisplayResponse;
import com.campus.canteen.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/display")
@RequiredArgsConstructor
public class DisplayController {

    private final OrderService orderService;

    @GetMapping("/live-tokens")
    public ResponseEntity<LiveDisplayResponse> getLiveTokens() {
        return ResponseEntity.ok(orderService.getLiveTokens());
    }
}
