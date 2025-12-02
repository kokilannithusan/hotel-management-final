/**
 * Environment Configuration
 *
 * This file centralizes all environment variables used throughout the application.
 * All environment variables should be accessed through this file to ensure consistency.
 */

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8088/api/v1";
export const API_TIMEOUT = parseInt(
  import.meta.env.VITE_API_TIMEOUT || "30000"
);

// Application Configuration
export const APP_NAME =
  import.meta.env.VITE_APP_NAME || "Hotel Management System";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

// Feature Flags
export const ENABLE_MOCK_DATA =
  import.meta.env.VITE_ENABLE_MOCK_DATA === "true";
export const ENABLE_DEBUG_MODE =
  import.meta.env.VITE_ENABLE_DEBUG_MODE === "true";
