package com.alukianov.server.user;

import com.alukianov.server.utils.ServerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    private ResponseEntity<ServerResponse> findAllUsers() {
        return ResponseEntity.ok(ServerResponse.builder()
                        .status(HttpStatus.OK.value())
                        .message("All users list")
                        .payload(userService.findAll())
                        .build());

    }

}