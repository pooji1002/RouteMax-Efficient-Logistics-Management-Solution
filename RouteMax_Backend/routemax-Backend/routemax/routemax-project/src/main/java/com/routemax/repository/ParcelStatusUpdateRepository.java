package com.routemax.repository;

import com.routemax.model.ParcelStatusUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

// This interface gives us all the standard database methods like save(), findById(), etc.
// for our ParcelStatusUpdate entity, without us having to write any code.
public interface ParcelStatusUpdateRepository extends JpaRepository<ParcelStatusUpdate, Long> {
}
