package com.roammates.roammates.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "task_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id", nullable = false)
    private User assignee;

    private LocalDate deadline;

    @Column(nullable = false)
    private String status; // Todo, In Progress, Done
}
