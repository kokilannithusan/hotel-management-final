import { api } from './api';

// Types
export interface Room {
    id: string;
    roomNumber: string;
    roomTypeId: string;
    areaId: string;
    floor: number;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    maxOccupancy: number;
    createdAt: string;
}

export interface RoomType {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    maxOccupancy: number;
    bedConfiguration: string;
    size: number;  // in sq ft or sq m
    createdAt: string;
}

export interface RoomArea {
    id: string;
    name: string;
    description: string;
    floor: number;
    createdAt: string;
}

export interface ViewType {
    id: string;
    name: string;
    description: string;
    priceModifier: number; // percentage or fixed amount
    createdAt: string;
}

export interface Amenity {
    id: string;
    name: string;
    description: string;
    icon?: string;
    category: string;
    createdAt: string;
}

export interface MealPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    includedMeals: string[];
    createdAt: string;
}

export interface StayType {
    id: string;
    roomTypeId: string;
    viewTypeId: string;
    mealPlanId: string;
    name: string;
    basePrice: number;
    maxOccupancy: number;
    description?: string;
    createdAt: string;
}

export interface RoomAvailabilityQuery {
    checkInDate: string;
    checkOutDate: string;
    roomTypeId?: string;
    guests?: number;
}

// Room Management Service
export const roomService = {
    // Rooms
    getAllRooms: async (): Promise<Room[]> => {
        const response = await api.get<Room[]>('/rooms');
        return response.data;
    },

    getRoomById: async (id: string): Promise<Room> => {
        const response = await api.get<Room>(`/rooms/${id}`);
        return response.data;
    },

    createRoom: async (room: Omit<Room, 'id' | 'createdAt'>): Promise<Room> => {
        const response = await api.post<Room>('/rooms', room);
        return response.data;
    },

    updateRoom: async (id: string, room: Partial<Room>): Promise<Room> => {
        const response = await api.put<Room>(`/rooms/${id}`, room);
        return response.data;
    },

    deleteRoom: async (id: string): Promise<void> => {
        await api.delete(`/rooms/${id}`);
    },

    checkAvailability: async (query: RoomAvailabilityQuery): Promise<Room[]> => {
        const response = await api.get<Room[]>('/rooms/availability', { params: query });
        return response.data;
    },

    // Room Types
    getAllRoomTypes: async (): Promise<RoomType[]> => {
        const response = await api.get<RoomType[]>('/room-types');
        return response.data;
    },

    createRoomType: async (roomType: Omit<RoomType, 'id' | 'createdAt'>): Promise<RoomType> => {
        const response = await api.post<RoomType>('/room-types', roomType);
        return response.data;
    },

    updateRoomType: async (id: string, roomType: Partial<RoomType>): Promise<RoomType> => {
        const response = await api.put<RoomType>(`/room-types/${id}`, roomType);
        return response.data;
    },

    deleteRoomType: async (id: string): Promise<void> => {
        await api.delete(`/room-types/${id}`);
    },

    // Room Areas
    getAllAreas: async (): Promise<RoomArea[]> => {
        const response = await api.get<RoomArea[]>('/room-areas');
        return response.data;
    },

    createArea: async (area: Omit<RoomArea, 'id' | 'createdAt'>): Promise<RoomArea> => {
        const response = await api.post<RoomArea>('/room-areas', area);
        return response.data;
    },

    updateArea: async (id: string, area: Partial<RoomArea>): Promise<RoomArea> => {
        const response = await api.put<RoomArea>(`/room-areas/${id}`, area);
        return response.data;
    },

    deleteArea: async (id: string): Promise<void> => {
        await api.delete(`/room-areas/${id}`);
    },

    // View Types
    getAllViewTypes: async (): Promise<ViewType[]> => {
        const response = await api.get<ViewType[]>('/view-types');
        return response.data;
    },

    createViewType: async (viewType: Omit<ViewType, 'id' | 'createdAt'>): Promise<ViewType> => {
        const response = await api.post<ViewType>('/view-types', viewType);
        return response.data;
    },

    updateViewType: async (id: string, viewType: Partial<ViewType>): Promise<ViewType> => {
        const response = await api.put<ViewType>(`/view-types/${id}`, viewType);
        return response.data;
    },

    deleteViewType: async (id: string): Promise<void> => {
        await api.delete(`/view-types/${id}`);
    },

    // Amenities
    getAllAmenities: async (): Promise<Amenity[]> => {
        const response = await api.get<Amenity[]>('/amenities');
        return response.data;
    },

    createAmenity: async (amenity: Omit<Amenity, 'id' | 'createdAt'>): Promise<Amenity> => {
        const response = await api.post<Amenity>('/amenities', amenity);
        return response.data;
    },

    updateAmenity: async (id: string, amenity: Partial<Amenity>): Promise<Amenity> => {
        const response = await api.put<Amenity>(`/amenities/${id}`, amenity);
        return response.data;
    },

    deleteAmenity: async (id: string): Promise<void> => {
        await api.delete(`/amenities/${id}`);
    },

    // Meal Plans
    getAllMealPlans: async (): Promise<MealPlan[]> => {
        const response = await api.get<MealPlan[]>('/meal-plans');
        return response.data;
    },

    createMealPlan: async (mealPlan: Omit<MealPlan, 'id' | 'createdAt'>): Promise<MealPlan> => {
        const response = await api.post<MealPlan>('/meal-plans', mealPlan);
        return response.data;
    },

    updateMealPlan: async (id: string, mealPlan: Partial<MealPlan>): Promise<MealPlan> => {
        const response = await api.put<MealPlan>(`/meal-plans/${id}`, mealPlan);
        return response.data;
    },

    deleteMealPlan: async (id: string): Promise<void> => {
        await api.delete(`/meal-plans/${id}`);
    },

    // Stay Types (Combinations)
    getAllStayTypes: async (): Promise<StayType[]> => {
        const response = await api.get<StayType[]>('/stay-types');
        return response.data;
    },

    createStayType: async (stayType: Omit<StayType, 'id' | 'createdAt'>): Promise<StayType> => {
        const response = await api.post<StayType>('/stay-types', stayType);
        return response.data;
    },

    updateStayType: async (id: string, stayType: Partial<StayType>): Promise<StayType> => {
        const response = await api.put<StayType>(`/stay-types/${id}`, stayType);
        return response.data;
    },

    deleteStayType: async (id: string): Promise<void> => {
        await api.delete(`/stay-types/${id}`);
    },
};
