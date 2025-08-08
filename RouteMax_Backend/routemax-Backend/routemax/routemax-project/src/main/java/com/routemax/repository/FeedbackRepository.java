package com.routemax.repository;

import com.routemax.model.Feedback;
import com.routemax.model.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByParcel(Parcel parcel);


}
