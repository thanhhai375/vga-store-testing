package com.example.vgashop.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blog extends BaseEntity {

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, length = 1000)
    private String excerpt;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String thumbnail;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private Integer views = 0;

    private Boolean featured = false;

    @Column(name = "published_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date publishedDate;

    @Column(length = 500)
    private String tags; // comma-separated: "NVIDIA,RTX 4070,Benchmark"

}
