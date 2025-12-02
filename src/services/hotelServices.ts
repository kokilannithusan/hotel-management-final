import { api } from "./api";
import type { HotelRecord } from "../pages/settings/types";

// Fetch all hotels from backend
export const fetchHotels = async (): Promise<HotelRecord[]> => {
    const url = "/settings/hotels";
    const response = await api.get(url);

    // Extract from ResponseWrapper: { statusCode, statusMessage, data }
    const responseData = response.data.data || response.data;

    // If backend returns an array
    if (Array.isArray(responseData)) {
        return responseData;
    }
    // If backend returns { content: [...] }
    if (responseData && Array.isArray(responseData.content)) {
        return responseData.content;
    }
    return [];
};

// Create a new hotel
export const createHotel = async (hotel: HotelRecord): Promise<HotelRecord> => {
    const url = "/settings/hotels";
    const response = await api.post(url, hotel);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};

// Delete a hotel by ID
export const deleteHotel = async (id: string): Promise<void> => {
    const url = `/settings/hotels/${id}`;
    await api.delete(url);
};

// Update a hotel by ID
export const updateHotel = async (id: string, hotel: Partial<HotelRecord>): Promise<HotelRecord> => {
    const url = `/settings/hotels/${id}`;
    const response = await api.put(url, hotel);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};
