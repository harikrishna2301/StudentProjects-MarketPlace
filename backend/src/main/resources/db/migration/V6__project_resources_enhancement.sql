-- V6: Project Resources Enhancement
-- Supports Presentation (PPT/PPTX), Demo Video, and Live Demo URL

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS demo_url VARCHAR(500) NULL,
    ADD COLUMN IF NOT EXISTS demo_video_url VARCHAR(500) NULL;
