package com.example.vgashop.service;

import com.example.vgashop.entity.SystemSetting;
import com.example.vgashop.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingRepository repository;

    public Map<String, String> getAllSettings() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SystemSetting::getSettingKey, SystemSetting::getSettingValue));
    }

    public String getSettingValue(String key, String defaultValue) {
        return repository.findBySettingKey(key)
                .map(SystemSetting::getSettingValue)
                .orElse(defaultValue);
    }

    public void updateSettings(Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            SystemSetting setting = repository.findBySettingKey(entry.getKey())
                    .orElse(SystemSetting.builder()
                            .settingKey(entry.getKey())
                            .description("Auto-created setting")
                            .build());
            setting.setSettingValue(entry.getValue());
            repository.save(setting);
        }
    }
}
