/**
 * Central export file for all services
 * Import services from here to maintain consistency
 */

export * from './api';
export * from './auth.service';
export * from './room.service';
export * from './customer.service';
export * from './reservation.service';

// Re-export for convenience
export { api, handleApiError } from './api';
export { authService } from './auth.service';
export { roomService } from './room.service';
export { customerService } from './customer.service';
export { reservationService } from './reservation.service';
export * as userServices from './userServices';
export * as emailServices from './emailServices';
