-- Migration: featured_blogs_project_link.sql
-- Adds project_id column to featured_blogs table to link blogs to projects

USE bnqbnctylez7kikru54q;

-- Add project_id column to featured_blogs
ALTER TABLE featured_blogs 
ADD COLUMN project_id VARCHAR(36) DEFAULT NULL;

-- Add index for faster lookups
CREATE INDEX idx_featured_blogs_project ON featured_blogs(project_id);
