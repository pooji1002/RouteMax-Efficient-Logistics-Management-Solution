package com.routemax.security;

import com.routemax.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String userEmail = null;
        String jwt = null;

        // Check if the Authorization header is present and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                // Extract the username (email) from the JWT token
                userEmail = jwtUtil.extractEmail(jwt);
            } catch (Exception e) {
                // Log a more descriptive error if token extraction fails
                logger.error("JWT token extraction failed, check if token is valid or expired: " + e.getMessage());
            }
        }

        // If a user email was successfully extracted AND the user is not already authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Load user details from the database using the extracted email
                UserDetails userDetails = this.userService.loadUserByUsername(userEmail);

                // ✅ CORRECTED: Validate the token against the user details object
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.info("Token validated successfully for user: " + userEmail);
                    // Create an authentication token and set it in the SecurityContext
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("JWT token validation failed for user: " + userEmail);
                }
            } catch (Exception e) {
                // Log an error if user details cannot be loaded or validation fails
                logger.error("User authentication failed: " + e.getMessage());
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
