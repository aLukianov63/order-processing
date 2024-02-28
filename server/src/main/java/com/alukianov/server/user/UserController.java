package com.alukianov.server.user;

import com.alukianov.server.basket.BasketService;
import com.alukianov.server.utils.ServerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final BasketService basketService;

    @GetMapping
    private ResponseEntity<ServerResponse> findAllUsers() {
        return ResponseEntity.ok(ServerResponse.builder()
                        .status(HttpStatus.OK.value())
                        .message("All users list")
                        .payload(userService.findAll())
                        .build());

    }

    @GetMapping(value = "/{id}")
    private ResponseEntity<ServerResponse> findUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok(ServerResponse.builder()
                    .status(HttpStatus.OK.value())
                    .message("User with id: " + id)
                    .payload(user)
                    .build());
        }
        return new ResponseEntity<>(ServerResponse.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("User with id " + id + " not found")
                    .build(),
                    HttpStatus.NOT_FOUND);
    }

    // TODO Principal is not User class request
    @GetMapping(value = "/me")
    private ResponseEntity<ServerResponse> findMe(Principal principal) {
        return ResponseEntity.ok(ServerResponse.builder()
                        .status(HttpStatus.OK.value())
                        .message("Current user")
                        .payload(principal)
                        .build());
    }

    @GetMapping(value = "/{id}/basket")
    private ResponseEntity<ServerResponse> findUserBasket(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);

        return user.map(value -> ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("User with id: " + id)
                .payload(basketService.findBasketByUser(value))
                .build())).orElseGet(() -> new ResponseEntity<>(ServerResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message("User with id " + id + " not found")
                .build(),
                HttpStatus.NOT_FOUND));
    }

}