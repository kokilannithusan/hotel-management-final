import { api } from "./api";

export const createRoomArea = async (data: { name: string; description: string }) => {
    const response = await api.post("/room/area/added", data);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};

export const getAllRoomAreas = async () => {
    const response = await api.get("/room/area");
    return response.data.data.content || [];
};

export const updateRoomArea = async (
    id: bigint,
    data: { name: string; description: string }
) => {
    const response = await api.put(`/room/area/${id}`, data);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};

export const deleteRoomArea = async (id: bigint) => {
    const response = await api.delete(`/room/area/${id}`);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};
