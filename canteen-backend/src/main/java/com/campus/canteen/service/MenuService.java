package com.campus.canteen.service;

import com.campus.canteen.dto.MenuItemRequest;
import com.campus.canteen.model.MenuItem;
import com.campus.canteen.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItem> getAvailableMenu(String category) {
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            return menuItemRepository.findByCategoryAndIsAvailableTrue(category);
        }
        return menuItemRepository.findByIsAvailableTrue();
    }

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem createMenuItem(MenuItemRequest request) {
        MenuItem item = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .isAvailable(true)
                .imageUrl(request.getImageUrl())
                .build();
        return menuItemRepository.save(item);
    }

    public MenuItem toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + id));
        item.setAvailable(!item.isAvailable());
        return menuItemRepository.save(item);
    }
}
