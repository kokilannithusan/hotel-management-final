import { api } from "./api";
import type { UserRecord } from "../pages/settings/types";

/**
 * User Services - Integrates with UserController backend
 * All endpoints require authentication token (automatically added by axios interceptor)
 */

interface UserApiResponse {
  statusCode: number;
  statusMessage: string;
  data: UserRecord | UserRecord[] | { content: UserRecord[]; totalElements: number };
}

/**
 * Get all users with optional filtering and pagination
 * @param hotelId - Optional hotel ID filter
 * @param roleId - Optional role ID filter
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 */
export const getAllUsers = async (
  hotelId?: string,
  roleId?: string,
  page: number = 0,
  size: number = 10
): Promise<UserRecord[]> => {
  try {
    const params: any = { page, size };
    if (hotelId) params.hotelId = hotelId;
    if (roleId) params.roleId = roleId;

    const response = await api.get<UserApiResponse>("/settings/users", { params });

    // Extract data from ResponseWrapper
    const responseData = response.data.data || response.data;

    // Handle paginated response
    if (responseData && typeof responseData === "object" && "content" in responseData) {
      return (responseData as any).content || [];
    }

    // Handle array response
    if (Array.isArray(responseData)) {
      return responseData;
    }

    return [];
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.statusMessage ||
      error.response?.data?.message ||
      "Failed to fetch users";
    throw new Error(errorMessage);
  }
};

/**
 * Get a single user by ID
 * @param hotelId - Hotel ID
 * @param userId - User ID
 */
export const getUserById = async (
  hotelId: string,
  userId: string
): Promise<UserRecord> => {
  try {
    const response = await api.get<UserApiResponse>(
      `/settings/users/user/${hotelId}/${userId}`
    );

    // Extract data from ResponseWrapper
    return response.data.data as UserRecord || response.data as any;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.statusMessage ||
      error.response?.data?.message ||
      "Failed to fetch user";
    throw new Error(errorMessage);
  }
};

/**
 * Create a new user
 * @param hotelId - Hotel ID
 * @param userData - User data to create
 */
export const createUser = async (
  hotelId: string,
  userData: Omit<UserRecord, "id" | "createdAt">
): Promise<UserRecord> => {
  try {
    const response = await api.post<UserApiResponse>(
      `/settings/users/${hotelId}`,
      userData
    );

    // Extract data from ResponseWrapper
    return response.data.data as UserRecord || response.data as any;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.statusMessage ||
      error.response?.data?.message ||
      "Failed to create user";
    throw new Error(errorMessage);
  }
};

/**
 * Update an existing user
 * @param hotelId - Hotel ID
 * @param userId - User ID to update
 * @param userData - Updated user data
 */
export const updateUser = async (
  hotelId: string,
  userId: string,
  userData: Partial<UserRecord>
): Promise<UserRecord> => {
  try {
    const response = await api.put<UserApiResponse>(
      `/settings/users/update/${hotelId}/${userId}`,
      userData
    );

    // Extract data from ResponseWrapper
    return response.data.data as UserRecord || response.data as any;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.statusMessage ||
      error.response?.data?.message ||
      "Failed to update user";
    throw new Error(errorMessage);
  }
};

/**
 * Delete a user
 * @param hotelId - Hotel ID
 * @param userId - User ID to delete
 */
export const deleteUser = async (
  hotelId: string,
  userId: string
): Promise<void> => {
  try {
    await api.delete(`/settings/users/user/${hotelId}/${userId}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.statusMessage ||
      error.response?.data?.message ||
      "Failed to delete user";
    throw new Error(errorMessage);
  }
};
