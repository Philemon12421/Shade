package com.bloom.community_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "community_posts")
@Data
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

   
    @Column(nullable = false)
    private String pseudonym;

    private String channel;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer upvotes = 0;
    private Boolean isFlagged = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
