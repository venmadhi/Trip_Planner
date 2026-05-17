package com.roammates.roammates.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "pinboard_announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PinboardAnnouncement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    private int thumbsUp;
    private int heart;
    private int laugh;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
