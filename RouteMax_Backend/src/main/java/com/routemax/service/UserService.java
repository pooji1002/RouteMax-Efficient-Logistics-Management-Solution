package com.routemax.service;

import com.routemax.model.*;
import com.routemax.repository.UserRepository;
import com.routemax.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // User Registration
    public User registerUser(RegisterRequest request) {
        if (repo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        if (repo.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER); // Default role
        user.setEnabled(true);

        return repo.save(user);
    }

    // User Login
    public AuthResponse loginUser(AuthRequest request) {
        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getEmail(), user.getRole());
        return new AuthResponse(token, "✅ Login successful");
    }

    // Get user by username
    public Optional<User> findByUsername(String username) {
        return repo.findByUsername(username);
    }

    // Get user by email
    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    // Admin Operations
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return repo.findById(id);
    }

    public User createUser(UserManagementRequest request) {
        if (repo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        if (repo.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEnabled(request.isEnabled());

        return repo.save(user);
    }

    public User updateUser(Long id, UserManagementRequest request) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(request.getEmail()) && repo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // Check if username is being changed and if it already exists
        if (!user.getUsername().equals(request.getUsername()) && repo.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        user.setRole(request.getRole());
        user.setEnabled(request.isEnabled());

        return repo.save(user);
    }

    public void deleteUser(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        repo.deleteById(id);
    }

    public User changeUserRole(Long id, Role role) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole(role);
        return repo.save(user);
    }

    public User toggleUserStatus(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(!user.isEnabled());
        return repo.save(user);
    }
}
