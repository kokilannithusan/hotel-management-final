import {
  HotelRecord,
  RoleRecord,
  UserRecord,
  EmailConfigRecord,
} from "../pages/settings/types";
import {
  addRole,
  deleteRoleAPI,
  getAllRole,
  updateRoleAPI,
} from "./roleServices";
import * as userServices from "./userServices";
import * as emailServices from "./emailServices";

// Initialize data from localStorage or mock data
const loadFromStorage = <T>(key: string, defaultData: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultData;
};

const saveToStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};


// --- Services ---

// Hotels (from backend)
import { fetchHotels, createHotel as createHotelApi, deleteHotel as deleteHotelApi, updateHotel as updateHotelApi } from "./hotelServices";
export const getHotels = async (): Promise<HotelRecord[]> => {
  return fetchHotels();
};

export const createHotel = async (hotel: HotelRecord): Promise<HotelRecord> => {
  return createHotelApi(hotel);
};

export const updateHotel = async (id: string, payload: Partial<HotelRecord>): Promise<HotelRecord> => {
  return updateHotelApi(id, payload);
};

export const deleteHotel = async (id: string): Promise<void> => {
  await deleteHotelApi(id);
};

// Roles
export const getRoles = async (
  hotelId: string = "1"
): Promise<RoleRecord[]> => {
  try {
    const response = await getAllRole(hotelId);

    // Handle paginated response structure: { statusCode, statusMessage, data: { content: [], ... } }
    let rolesData = response;

    // If response has data property (paginated response)
    if (response && typeof response === "object" && response.data) {
      rolesData = response.data;

      // If data has content property (Spring Boot pagination)
      if (rolesData.content && Array.isArray(rolesData.content)) {
        rolesData = rolesData.content;
      }
    }

    // Ensure rolesData is an array
    if (!Array.isArray(rolesData)) {
      console.warn("Unexpected response format:", response);
      return loadFromStorage("roles", []);
    }

    // Map the API response to RoleRecord format
    const roles = rolesData.map((role: any) => ({
      id: role.id || role.roleId,
      name: role.name || role.roleName,
      hotelId: role.hotelId || hotelId,
      createdAt: role.createdAt || new Date().toISOString(),
    }));

    // Update localStorage with fetched data
    saveToStorage("roles", roles);

    return roles;
  } catch (error: any) {
    console.error("Failed to fetch roles:", error);
    // Fallback to localStorage if API fails
    return loadFromStorage("roles", []);
  }
};

export const createRole = async (role: RoleRecord): Promise<RoleRecord> => {
  try {
    const response = await addRole(
      { name: role.name, hotelId: role.hotelId },
      role.hotelId
    );

    const roles = loadFromStorage("roles", [] as RoleRecord[]);
    const newRoles = [role, ...roles];
    saveToStorage("roles", newRoles);

    return response || role;
  } catch (error: any) {
    const errorMessage = error.message || "Failed to create role";
    alert(errorMessage);
    throw error;
  }
};

export const updateRole = async (role: RoleRecord): Promise<RoleRecord> => {
  try {
    const response = await updateRoleAPI(role.hotelId, {
      id: role.id,
      name: role.name,
    });

    const roles = loadFromStorage("roles", [] as RoleRecord[]);
    const newRoles = roles.map((r: RoleRecord) =>
      r.id === role.id ? role : r
    );
    saveToStorage("roles", newRoles);

    return response || role;
  } catch (error: any) {
    const errorMessage = error.message || "Failed to update role";
    alert(errorMessage);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    const roles = loadFromStorage("roles", [] as RoleRecord[]);
    const roleToDelete = roles.find((r: RoleRecord) => r.id === id);

    if (!roleToDelete) {
      throw new Error("Role not found");
    }

    await deleteRoleAPI(roleToDelete.hotelId, id);

    const newRoles = roles.filter((r: RoleRecord) => r.id !== id);
    saveToStorage("roles", newRoles);
  } catch (error: any) {
    const errorMessage = error.message || "Failed to delete role";
    alert(errorMessage);
    throw error;
  }
};

// Users - Now integrated with backend
export const getUsers = async (hotelId?: string, roleId?: string): Promise<UserRecord[]> => {
  return await userServices.getAllUsers(hotelId, roleId);
};

export const createUser = async (user: UserRecord): Promise<UserRecord> => {
  try {
    // Use hotelId from user object, default to "1" if not provided
    const hotelId = user.hotelId || "1";
    return await userServices.createUser(hotelId, user);
  } catch (error: any) {
    const errorMessage = error.message || "Failed to create user";
    alert(errorMessage);
    throw error;
  }
};

export const updateUser = async (user: UserRecord): Promise<UserRecord> => {
  try {
    const hotelId = user.hotelId || "1";
    return await userServices.updateUser(hotelId, user.id, user);
  } catch (error: any) {
    const errorMessage = error.message || "Failed to update user";
    alert(errorMessage);
    throw error;
  }
};

export const deleteUser = async (id: string, hotelId: string = "1"): Promise<void> => {
  try {
    await userServices.deleteUser(hotelId, id);
  } catch (error: any) {
    const errorMessage = error.message || "Failed to delete user";
    alert(errorMessage);
    throw error;
  }
};

// Email Configs - Now integrated with backend
export const getEmailConfigs = async (): Promise<EmailConfigRecord[]> => {
  return await emailServices.getAllEmails();
};

export const createEmailConfig = async (
  config: EmailConfigRecord
): Promise<EmailConfigRecord> => {
  try {
    return await emailServices.createEmail(config);
  } catch (error: any) {
    const errorMessage = error.message || "Failed to create email configuration";
    alert(errorMessage);
    throw error;
  }
};

export const updateEmailConfig = async (
  config: EmailConfigRecord
): Promise<EmailConfigRecord> => {
  try {
    return await emailServices.updateEmail(config.id, config);
  } catch (error: any) {
    const errorMessage = error.message || "Failed to update email configuration";
    alert(errorMessage);
    throw error;
  }
};

export const deleteEmailConfig = async (id: string): Promise<void> => {
  try {
    await emailServices.deleteEmail(id);
  } catch (error: any) {
    const errorMessage = error.message || "Failed to delete email configuration";
    alert(errorMessage);
    throw error;
  }
};

// Privileges (Mock implementation for now)
export const getHotelPrivileges = async (): Promise<
  Record<string, string[]>
> => {
  return loadFromStorage("hotelPrivileges", {});
};

export const saveHotelPrivileges = async (
  data: Record<string, string[]>
): Promise<void> => {
  saveToStorage("hotelPrivileges", data);
};

export const getHotelRolePrivileges = async (): Promise<any> => {
  return loadFromStorage("hotelRolePrivileges", {});
};

export const saveHotelRolePrivileges = async (data: any): Promise<void> => {
  saveToStorage("hotelRolePrivileges", data);
};

export const getUserPrivileges = async (): Promise<any> => {
  return loadFromStorage("userPrivileges", {});
};

export const saveUserPrivileges = async (data: any): Promise<void> => {
  saveToStorage("userPrivileges", data);
};
