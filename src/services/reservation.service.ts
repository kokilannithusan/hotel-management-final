import { api } from './api';

// Types
export type ReservationStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

export interface Reservation {
    id: string;
    customerId: string;
    roomId: string;
    stayTypeId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    numberOfAdults: number;
    numberOfChildren: number;
    status: ReservationStatus;
    totalAmount: number;
    paidAmount: number;
    notes?: string;
    reservationType: string;
    specialRequests?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReservationRequest {
    customerId: string;
    roomId: string;
    stayTypeId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    numberOfAdults: number;
    numberOfChildren: number;
    reservationType: string;
    notes?: string;
    specialRequests?: string;
}

export interface UpdateReservationRequest {
    roomId?: string;
    stayTypeId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    numberOfGuests?: number;
    numberOfAdults?: number;
    numberOfChildren?: number;
    status?: ReservationStatus;
    notes?: string;
    specialRequests?: string;
}

export interface ChangeRoomRequest {
    newRoomId: string;
    reason?: string;
}

export interface ChangeStayTypeRequest {
    newStayTypeId: string;
    reason?: string;
}

export interface CalendarEvent {
    id: string;
    reservationId: string;
    roomId: string;
    roomNumber: string;
    customerName: string;
    checkInDate: string;
    checkOutDate: string;
    status: ReservationStatus;
}

// Reservation Service
export const reservationService = {
    /**
     * Get all reservations
     */
    getAllReservations: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/reservations');
        return response.data;
    },

    /**
     * Get reservation by ID
     */
    getReservationById: async (id: string): Promise<Reservation> => {
        const response = await api.get<Reservation>(`/reservations/${id}`);
        return response.data;
    },

    /**
     * Create new reservation
     */
    createReservation: async (reservation: CreateReservationRequest): Promise<Reservation> => {
        const response = await api.post<Reservation>('/reservations', reservation);
        return response.data;
    },

    /**
     * Update existing reservation
     */
    updateReservation: async (id: string, updates: UpdateReservationRequest): Promise<Reservation> => {
        const response = await api.put<Reservation>(`/reservations/${id}`, updates);
        return response.data;
    },

    /**
     * Cancel reservation
     */
    cancelReservation: async (id: string): Promise<void> => {
        await api.delete(`/reservations/${id}`);
    },

    /**
     * Check-in guest
     */
    checkIn: async (id: string): Promise<Reservation> => {
        const response = await api.post<Reservation>(`/reservations/${id}/check-in`);
        return response.data;
    },

    /**
     * Check-out guest
     */
    checkOut: async (id: string): Promise<Reservation> => {
        const response = await api.post<Reservation>(`/reservations/${id}/check-out`);
        return response.data;
    },

    /**
     * Change room for reservation
     */
    changeRoom: async (id: string, request: ChangeRoomRequest): Promise<Reservation> => {
        const response = await api.put<Reservation>(`/reservations/${id}/room`, request);
        return response.data;
    },

    /**
     * Change stay type for reservation
     */
    changeStayType: async (id: string, request: ChangeStayTypeRequest): Promise<Reservation> => {
        const response = await api.put<Reservation>(`/reservations/${id}/stay-type`, request);
        return response.data;
    },

    /**
     * Get calendar view data
     */
    getCalendarData: async (startDate?: string, endDate?: string): Promise<CalendarEvent[]> => {
        const response = await api.get<CalendarEvent[]>('/reservations/calendar', {
            params: { startDate, endDate },
        });
        return response.data;
    },

    /**
     * Get reservations by status
     */
    getReservationsByStatus: async (status: ReservationStatus): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/reservations', {
            params: { status },
        });
        return response.data;
    },

    /**
     * Get reservations by customer
     */
    getCustomerReservations: async (customerId: string): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>(`/customers/${customerId}/reservations`);
        return response.data;
    },
};
