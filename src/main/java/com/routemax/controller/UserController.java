package com.routemax.controller;

import com.routemax.model.User;
import com.routemax.model.AuthRequest;
import com.routemax.model.AuthResponse;
import com.routemax.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService service;

    @Autowired
    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public User registerUser(@Valid @RequestBody User user) {
        return service.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(service.loginUser(request));
    }
}
