package com.bloom.community_service.repository;

import com.bloom.community_service.model.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<CommunityPost, UUID> {

    List<CommunityPost> findByChannelOrderByCreatedAtDesc(String channel);

    List<CommunityPost> findByChannelOrderByUpvotesDesc(String channel);

    List<CommunityPost> findByIsFlaggedTrue();
}
