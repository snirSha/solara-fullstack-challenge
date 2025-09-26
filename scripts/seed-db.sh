#!/bin/bash
# Placeholder script for seeding the database
CREATE TABLE IF NOT EXISTS campaign (
  id SERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_path TEXT,
  generated_text TEXT,
  user_id TEXT NOT NULL,
  error TEXT
);