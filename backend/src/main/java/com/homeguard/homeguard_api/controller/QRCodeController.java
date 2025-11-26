package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.dto.QRCodeValidationRequestDto;
import com.homeguard.homeguard_api.dto.QRCodeValidationResponseDto;
import com.homeguard.homeguard_api.service.QRCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${base.path}/qr-codes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class QRCodeController {
    
    private final QRCodeService qrCodeService;
    
    @PostMapping("/validate")
    public ResponseEntity<QRCodeValidationResponseDto> validateQRCode(
            @Valid @RequestBody QRCodeValidationRequestDto request) {
        log.info("Validating QR code for device: {}, home: {}", request.getDeviceId(), request.getHomeId());
        QRCodeValidationResponseDto response = qrCodeService.validateQRCode(request);
        return ResponseEntity.ok(response);
    }
}

