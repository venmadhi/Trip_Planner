package com.roammates.roammates.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "poll_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @Column(nullable = false)
    private String text;

    // To track who voted for what
    @ElementCollection
    @CollectionTable(name = "poll_votes", joinColumns = @JoinColumn(name = "poll_option_id"))
    @Column(name = "user_email")
    @Builder.Default
    private List<String> voterEmails = new ArrayList<>();
}
