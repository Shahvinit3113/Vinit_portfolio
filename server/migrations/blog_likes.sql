-- Migration: blog_likes.sql
-- Adds table for tracking blog post likes from portfolio visitors

-- Use the database
USE bnqbnctylez7kikru54q;

-- Blog Likes Table (local likes from portfolio visitors)
-- Stores likes by visitor fingerprint (no auth required)
CREATE TABLE IF NOT EXISTS blog_likes (
    id VARCHAR(36) PRIMARY KEY,
    post_slug VARCHAR(255) NOT NULL,
    visitor_id VARCHAR(255) NOT NULL, -- Browser fingerprint or IP hash
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (post_slug, visitor_id)
);

-- Blog Comments Table (local comments from portfolio visitors)
CREATE TABLE IF NOT EXISTS blog_comments (
    id VARCHAR(36) PRIMARY KEY,
    post_slug VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    is_approved TINYINT(1) DEFAULT 0,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0
);

-- Index for faster queries
CREATE INDEX idx_blog_likes_slug ON blog_likes(post_slug);
CREATE INDEX idx_blog_comments_slug ON blog_comments(post_slug);
