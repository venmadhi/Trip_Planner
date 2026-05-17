package com.roammates.roammates.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "polls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private String status; // Open, Closed

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PollOption> options;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
