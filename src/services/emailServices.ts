import { api } from "./api";
import type { EmailConfigRecord } from "../pages/settings/types";

/**
 * Email Services - Integrates with EmailController backend
 * All endpoints require authentication token (automatically added by axios interceptor)
 */

interface EmailApiResponse {
    statusCode: number;
    statusMessage: string;
    data: EmailConfigRecord | EmailConfigRecord[] | { content: EmailConfigRecord[]; totalElements: number };
}

/**
 * Get all email configurations with pagination
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 */
export const getAllEmails = async (
    page: number = 0,
    size: number = 10
): Promise<EmailConfigRecord[]> => {
    try {
        const response = await api.get<EmailApiResponse>("/setting/email", {
            params: { page, size },
        });

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
            "Failed to fetch email configurations";
        throw new Error(errorMessage);
    }
};

/**
 * Get a single email configuration by ID
 * @param id - Email configuration ID
 */
export const getEmailById = async (id: string): Promise<EmailConfigRecord> => {
    try {
        const response = await api.get<EmailApiResponse>(`/setting/email/${id}`);

        // Extract data from ResponseWrapper
        return response.data.data as EmailConfigRecord || response.data as any;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.statusMessage ||
            error.response?.data?.message ||
            "Failed to fetch email configuration";
        throw new Error(errorMessage);
    }
};

/**
 * Create a new email configuration
 * @param emailData - Email configuration data to create
 */
export const createEmail = async (
    emailData: Omit<EmailConfigRecord, "id">
): Promise<EmailConfigRecord> => {
    try {
        const response = await api.post<EmailApiResponse>(
            "/setting/email/added",
            emailData
        );

        // Extract data from ResponseWrapper
        return response.data.data as EmailConfigRecord || response.data as any;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.statusMessage ||
            error.response?.data?.message ||
            "Failed to create email configuration";
        throw new Error(errorMessage);
    }
};

/**
 * Update an existing email configuration
 * @param id - Email configuration ID to update
 * @param emailData - Updated email configuration data
 */
export const updateEmail = async (
    id: string,
    emailData: Partial<EmailConfigRecord>
): Promise<EmailConfigRecord> => {
    try {
        const response = await api.put<EmailApiResponse>(
            `/setting/email/${id}`,
            emailData
        );

        // Extract data from ResponseWrapper
        return response.data.data as EmailConfigRecord || response.data as any;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.statusMessage ||
            error.response?.data?.message ||
            "Failed to update email configuration";
        throw new Error(errorMessage);
    }
};

/**
 * Delete an email configuration
 * @param id - Email configuration ID to delete
 */
export const deleteEmail = async (id: string): Promise<void> => {
    try {
        await api.delete(`/setting/email/${id}`);
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.statusMessage ||
            error.response?.data?.message ||
            "Failed to delete email configuration";
        throw new Error(errorMessage);
    }
};
