package com.campus.canteen.config;

import com.campus.canteen.model.*;
import com.campus.canteen.repository.MenuItemRepository;
import com.campus.canteen.repository.OrderRepository;
import com.campus.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        if (userRepository.count() == 0) {
            User student = User.builder()
                    .name("Tejdeep (Student)")
                    .email("student@campus.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ROLE_STUDENT)
                    .build();

            User staff = User.builder()
                    .name("Canteen Head Chef")
                    .email("staff@campus.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ROLE_STAFF)
                    .build();

            userRepository.saveAll(List.of(student, staff));
        }

        if (menuItemRepository.count() == 0) {
            List<MenuItem> items = List.of(
                    MenuItem.builder()
                            .name("Crispy Veg Burger")
                            .category("Snacks")
                            .description("Crispy herb patty with lettuce, tomatoes, and secret mayo")
                            .price(new BigDecimal("60.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Grilled Cheese Sandwich")
                            .category("Snacks")
                            .description("Golden toasted butter bread loaded with gooey cheddar cheese")
                            .price(new BigDecimal("50.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Hot Samosa (2 pcs)")
                            .category("Snacks")
                            .description("Crispy flaky crust with spiced potato-pea filling & mint chutney")
                            .price(new BigDecimal("25.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Paneer Tikka Roll")
                            .category("Snacks")
                            .description("Charcoal grilled paneer cubes wrapped in layered paratha with onions")
                            .price(new BigDecimal("75.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Veg Fried Rice with Manchurian")
                            .category("Lunch")
                            .description("Wok-tossed basmati rice served with savory veggie dumplings in gravy")
                            .price(new BigDecimal("90.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Paneer Butter Masala Thali")
                            .category("Lunch")
                            .description("Rich butter gravy paneer, 2 butter rotis, jeera rice, salad & dal")
                            .price(new BigDecimal("110.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Masala Dosa")
                            .category("Breakfast")
                            .description("Crispy fermented crepe filled with spiced potatoes & coconut chutney")
                            .price(new BigDecimal("50.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Idli Vada Combo")
                            .category("Breakfast")
                            .description("2 steamed rice cakes & 1 crispy lentil donut with piping hot sambar")
                            .price(new BigDecimal("40.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Thick Cold Coffee")
                            .category("Beverages")
                            .description("Creamy blended espresso milkshake topped with chocolate drizzle")
                            .price(new BigDecimal("45.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80")
                            .build(),
                    MenuItem.builder()
                            .name("Hot Masala Chai")
                            .category("Beverages")
                            .description("Brewed black tea infused with fresh crushed ginger and cardamom")
                            .price(new BigDecimal("15.00"))
                            .isAvailable(true)
                            .imageUrl("https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80")
                            .build()
            );

            menuItemRepository.saveAll(items);
        }

        if (orderRepository.count() == 0) {
            User student = userRepository.findByEmail("student@campus.edu").orElse(null);
            MenuItem burger = menuItemRepository.findAll().stream().filter(m -> m.getName().contains("Burger")).findFirst().orElse(null);
            MenuItem coffee = menuItemRepository.findAll().stream().filter(m -> m.getName().contains("Coffee")).findFirst().orElse(null);

            if (student != null && burger != null && coffee != null) {
                
                Order readyOrder = Order.builder()
                        .tokenNumber("#T-100")
                        .student(student)
                        .status(OrderStatus.READY)
                        .pickupSlot("1:00 PM - 1:15 PM")
                        .totalAmount(new BigDecimal("105.00"))
                        .items(new ArrayList<>())
                        .build();

                readyOrder.getItems().add(OrderItem.builder().order(readyOrder).menuItem(burger).quantity(1).priceAtOrder(burger.getPrice()).build());
                readyOrder.getItems().add(OrderItem.builder().order(readyOrder).menuItem(coffee).quantity(1).priceAtOrder(coffee.getPrice()).build());

                Order prepOrder = Order.builder()
                        .tokenNumber("#T-101")
                        .student(student)
                        .status(OrderStatus.PREPARING)
                        .pickupSlot("1:15 PM - 1:30 PM")
                        .totalAmount(new BigDecimal("60.00"))
                        .items(new ArrayList<>())
                        .build();

                prepOrder.getItems().add(OrderItem.builder().order(prepOrder).menuItem(burger).quantity(1).priceAtOrder(burger.getPrice()).build());

                orderRepository.saveAll(List.of(readyOrder, prepOrder));
            }
        }
    }
}
