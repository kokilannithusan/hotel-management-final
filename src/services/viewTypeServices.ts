import { api } from "./api";

export const createViewType = async (data: { name: string }) => {
    const response = await api.post("/viewtype/added", data);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};

export const getAllViewTypes = async () => {
    const response = await api.get("/viewtype");
    return response.data.data.content || [];
};

export const updateviewtype = async (id: bigint, data: { name: string }) => {
    const response = await api.put(`/viewtype/${id}`, data);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};

export const deleteviewtype = async (id: bigint) => {
    const response = await api.delete(`/viewtype/${id}`);
    // Extract from ResponseWrapper
    return response.data.data || response.data;
};
