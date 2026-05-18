package com.example.vgashop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BlogDTO {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(min = 3, max = 500, message = "Tiêu đề phải từ 3 đến 500 ký tự")
    private String title;

    @NotBlank(message = "Thể loại không được để trống")
    private String category;

    private String excerpt;

    private String author;

    private String content;

    private Boolean featured = false;

    private String tags; // comma-separated

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public String getExcerpt() {
        return excerpt;
    }
    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
}

