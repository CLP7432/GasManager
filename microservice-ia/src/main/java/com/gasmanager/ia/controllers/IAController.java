package com.gasmanager.ia.controllers;

import com.gasmanager.ia.dto.ChatRequestDTO;
import com.gasmanager.ia.dto.ChatResponseDTO;
import com.gasmanager.ia.services.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
@RequiredArgsConstructor
public class IAController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@Valid @RequestBody ChatRequestDTO request) {
        ChatResponseDTO response = geminiService.consultarIA(request);
        return ResponseEntity.ok(response);
    }
}