package com.example.vgashop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "service_policies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicePolicy {

    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id; // e.g. "bao-hanh", "thanh-toan"

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(length = 50)
    private String icon;

    @Column(name = "hero_image")
    private String heroImage;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // JSON blocks for content

}
