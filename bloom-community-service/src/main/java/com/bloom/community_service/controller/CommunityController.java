package com.bloom.community_service.controller;

import com.bloom.community_service.dto.PostRequest;
import com.bloom.community_service.model.CommunityPost;
import com.bloom.community_service.repository.PostRepository;
import com.bloom.community_service.service.PseudonymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CommunityController {

    private final PostRepository postRepo;
    private final PseudonymService pseudonymService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/posts/{channel}")
    public ResponseEntity<List<CommunityPost>> getPosts(@PathVariable String channel) {
        return ResponseEntity.ok(postRepo.findByChannelOrderByCreatedAtDesc(channel));
    }

    @PostMapping("/posts")
    public ResponseEntity<CommunityPost> createPost(@RequestBody PostRequest req) {
        CommunityPost post = new CommunityPost();
        post.setPseudonym(pseudonymService.generate());
        post.setChannel(req.getChannel());
        post.setContent(req.getContent());
        CommunityPost saved = postRepo.save(post);
        messagingTemplate.convertAndSend("/topic/channel/" + req.getChannel(), saved);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<Void> upvote(@PathVariable UUID id) {
        postRepo.findById(id).ifPresent(post -> {
            post.setUpvotes(post.getUpvotes() + 1);
            postRepo.save(post);
        });
        return ResponseEntity.ok().build();
    }
}