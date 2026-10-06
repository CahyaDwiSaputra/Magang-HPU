<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;

it('accepts dashcam face recognition payload', function () {
    $payload = [
        'deviceId' => '240078916116',
        'driverName' => 'Cahya Dwi Saputra',
        'employeeId' => 'EMP-001',
        'confidence' => 96,
        'capturedAt' => now()->toISOString(),
        'photoUrl' => 'https://example.com/face.jpg',
    ];

    $response = $this->postJson('/api/dashcam/face-recognition', $payload);

    $response
        ->assertStatus(201)
        ->assertJsonPath('status', 'ok')
        ->assertJsonPath('data.driver_name', 'Cahya Dwi Saputra');
});
