package com.exam.literaryplanner.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.literaryplanner.repository.LiteraryRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final LiteraryRepository literaryRepository;

    public AuthApiController(LiteraryRepository literaryRepository) {
        this.literaryRepository = literaryRepository;
    }

    @GetMapping("/status")
    public Map<String, Object> status(HttpSession session) {
        boolean loggedIn = session.getAttribute("loginMember") != null;
        return Map.of("loggedIn", loggedIn);
    }

    @GetMapping("/id-exists")
    public Map<String, Object> idExists(@RequestParam String id) {
        boolean exists = (id != null && !id.isBlank()) && literaryRepository.existsByMId(id);
        return Map.of("exists", exists);
    }
}