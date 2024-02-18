package com.alukianov.server.product.inventory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public Inventory save(Integer quantity) {
        Inventory inventory = Inventory.builder()
                .quantity(quantity)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return inventoryRepository.save(inventory);
    }

    public Optional<Inventory> findById(Long id) {
        return inventoryRepository.findById(id);
    }

    public void deleteById(Long id) {
        inventoryRepository.deleteById(id);
    }

}
