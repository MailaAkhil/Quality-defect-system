-- MySQL Database Schema for Machine Quality Control & Defect Prediction
-- Run this in your MySQL Workbench, phpMyAdmin, or MySQL CLI client:

CREATE DATABASE IF NOT EXISTS qc_factory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qc_factory_db;

-- 1. Create table for machine inspection batches & sensor telemetry
CREATE TABLE IF NOT EXISTS machine_batches (
  id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL,
  product_line VARCHAR(100) NOT NULL,
  material_grade VARCHAR(64) NOT NULL,
  temperature DECIMAL(6, 2) NOT NULL,
  pressure DECIMAL(6, 2) NOT NULL,
  vibration DECIMAL(6, 2) NOT NULL,
  machine_speed INT NOT NULL,
  cycle_time DECIMAL(6, 2) NOT NULL,
  humidity DECIMAL(6, 2) NOT NULL,
  cooling_rate DECIMAL(6, 2) NOT NULL,
  operator_name VARCHAR(100),
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  defect_probability DECIMAL(6, 2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  predicted_defect VARCHAR(100) NOT NULL,
  flagged_for_inspection TINYINT(1) NOT NULL DEFAULT 0,
  confidence DECIMAL(6, 2) NOT NULL,
  inspection_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  inspector_name VARCHAR(100) NULL,
  inspection_timestamp DATETIME NULL,
  actual_defect_found VARCHAR(100) NULL,
  actual_disposition VARCHAR(64) NULL,
  inspector_notes TEXT NULL,
  raw_payload JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_timestamp (timestamp DESC),
  INDEX idx_status (inspection_status),
  INDEX idx_product_line (product_line),
  INDEX idx_risk_level (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Optional sample query: Check defect summary by line
-- SELECT product_line, COUNT(*) AS total_batches, SUM(flagged_for_inspection) AS defects_flagged
-- FROM machine_batches
-- GROUP BY product_line;
