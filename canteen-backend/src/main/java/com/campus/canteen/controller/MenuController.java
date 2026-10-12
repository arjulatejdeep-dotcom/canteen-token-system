package com.campus.canteen.controller;

import com.campus.canteen.dto.MenuItemRequest;
import com.campus.canteen.model.MenuItem;
import com.campus.canteen.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenu(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(menuService.getAvailableMenu(category));
    }

    @GetMapping("/all")
    public ResponseEntity<List<MenuItem>> getAllItems() {
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<MenuItem> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuService.createMenuItem(request));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.toggleAvailability(id));
    }
}
