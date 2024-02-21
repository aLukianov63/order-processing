package com.alukianov.server.basket.basketItem;

import com.alukianov.server.utils.ServerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "api/v1/basketItems")
@RequiredArgsConstructor
public class BasketItemController {

    private final BasketItemService basketItemService;

    @PostMapping
    private ResponseEntity<ServerResponse> saveBasketItem(@RequestBody BasketItemRequest basketItemRequest) {
        try {
            basketItemService.save(basketItemRequest);
        } catch (RuntimeException exception) {
            return new ResponseEntity<>(ServerResponse.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(exception.getMessage())
                    .build(),
                    HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Basket item added!")
                .build());
    }

    @DeleteMapping(value = "/{id}")
    private ResponseEntity<ServerResponse> deleteBasketItemById(@PathVariable Long id) {
        basketItemService.deleteById(id);
        return ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Basket item deleted!")
                .build());
    }

}
