package com.roammates.roammates.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paid_by_id", nullable = false)
    private User paidBy;

    @Column(nullable = false)
    private String category;

    @CreationTimestamp
    private LocalDate date;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
