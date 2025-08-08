-- Insert default admin user (password: admin123)
-- BCrypt hash for 'admin123': $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
INSERT INTO users (username, email, password, role, enabled, created_at, updated_at) 
VALUES ('admin', 'admin@routemax.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- Insert default regular user (password: user123)
-- BCrypt hash for 'user123': $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFVMLVZqpjBWNOyYnNdHm1e
INSERT INTO users (username, email, password, role, enabled, created_at, updated_at) 
VALUES ('user', 'user@routemax.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFVMLVZqpjBWNOyYnNdHm1e', 'USER', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;
