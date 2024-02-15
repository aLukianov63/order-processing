package com.alukianov.server.security;

import com.alukianov.server.user.Role;
import com.alukianov.server.user.User;
import com.alukianov.server.user.UserService;
import com.alukianov.server.utils.ServerResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @PostMapping(value = "/signup")
    private ResponseEntity<ServerResponse> register(
            @RequestBody RegisterRequest request, HttpServletResponse response
    ) {
        User user = userService.save(
                User.builder()
                        .username(request.username())
                        .password(new BCryptPasswordEncoder().encode(request.password()))
                        .email(request.email())
                        .role(Role.ROLE_USER)
                        .build()
        );

        Cookie tokenCookie = new Cookie("auth-token", Base64.getEncoder().encodeToString(
                (request.username() + ":" + request.password()).getBytes()));
        Cookie idCookie = new Cookie("user-id", user.getId().toString());

        idCookie.setSecure(false);
        idCookie.setHttpOnly(false);
        idCookie.setPath("/");
        tokenCookie.setSecure(false);
        tokenCookie.setHttpOnly(false);
        tokenCookie.setPath("/");

        response.addCookie(tokenCookie);
        response.addCookie(idCookie);

        return ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Success authentication!")
                .build()
        );
    }

    @PostMapping(value = "/signin")
    private ResponseEntity<ServerResponse> login(
            @RequestBody LoginRequest request, HttpServletResponse response
    ) {
        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(request.username(), request.password());
        Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);

        User user = (User) authenticationResponse.getPrincipal();

        if (authenticationResponse.isAuthenticated()) {
            Cookie tokenCookie = new Cookie("auth-token", Base64.getEncoder().encodeToString(
                    (request.username() + ":" + request.password()).getBytes()));
            Cookie idCookie = new Cookie("user-id", user.getId().toString());

            idCookie.setSecure(false);
            idCookie.setHttpOnly(false);
            idCookie.setPath("/");
            tokenCookie.setSecure(false);
            tokenCookie.setHttpOnly(false);
            tokenCookie.setPath("/");

            response.addCookie(tokenCookie);
            response.addCookie(idCookie);
        }

        return ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Success authentication!")
                .build()
        );
    }

}