package com.roammates.roammates.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "checklist_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String text;

    private boolean packed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by", nullable = false)
    private User addedBy;
}
