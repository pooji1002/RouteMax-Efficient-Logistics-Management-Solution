package com.routemax.repository;

import com.routemax.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

// This interface gives us all the standard database methods for notifications.
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}