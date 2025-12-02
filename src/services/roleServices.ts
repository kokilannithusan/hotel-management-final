import { api } from "./api";

interface AddRolePayload {
    name: string;
    hotelId: string;
}

export const addRole = async (payload: AddRolePayload, hotelId: string) => {
    try {
        const response = await api.post(
            `/settings/roles/added/${hotelId}`,
            payload
        );
        return response.data;
    } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
            errorData?.statusMessage ||
            errorData?.message ||
            errorData?.error ||
            (typeof errorData === "string" ? errorData : null) ||
            "Failed to add role. Please try again.";

        throw new Error(errorMessage);
    }
};

export const deleteRoleAPI = async (hotelId: string, id: string) => {
    try {
        const response = await api.delete(`/settings/roles/${hotelId}/${id}`);
        return response.data;
    } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
            errorData?.statusMessage ||
            errorData?.message ||
            errorData?.error ||
            (typeof errorData === "string" ? errorData : null) ||
            "Failed to delete role. Please try again.";

        throw new Error(errorMessage);
    }
};

export const getAllRole = async (hotelId: string) => {
    try {
        const response = await api.get(`/settings/roles/${hotelId}`);
        return response.data;
    } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
            errorData?.statusMessage ||
            errorData?.message ||
            errorData?.error ||
            (typeof errorData === "string" ? errorData : null) ||
            "Failed to fetch roles. Please try again.";

        throw new Error(errorMessage);
    }
};

interface UpdateRolePayload {
    id: string;
    name: string;
}

export const updateRoleAPI = async (
    hotelId: string,
    payload: UpdateRolePayload
) => {
    try {
        const response = await api.put(`/settings/roles/${hotelId}`, payload);
        return response.data;
    } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
            errorData?.statusMessage ||
            errorData?.message ||
            errorData?.error ||
            (typeof errorData === "string" ? errorData : null) ||
            "Failed to update role. Please try again.";

        throw new Error(errorMessage);
    }
};
