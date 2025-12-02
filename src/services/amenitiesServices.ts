import { api } from "./api";

export const createAmenity = async (data: { name: string; icon?: string }) => {
    const response = await api.post("/room/amenty/added", data);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};

export const getAllAmenities = async () => {
    const response = await api.get("/room/amenty");
    return response.data.data.content || [];
};

export const updateAmenity = async (
    id: string,
    data: { name: string; icon?: string }
) => {
    const response = await api.put(`/room/amenty/${id}`, data);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};

export const deleteAmenity = async (id: string) => {
    const response = await api.delete(`/room/amenty/${id}`);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};
