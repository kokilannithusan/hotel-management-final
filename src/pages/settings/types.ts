/**
 * TypeScript interfaces and types for the Settings module
 */

export type SettingsTab =
    | "hotel"
    | "role"
    | "hotelPrivileges"
    | "hotelRolePrivileges"
    | "userPrivileges"
    | "user"
    | "emailConfig";

export interface PagePrivilege {
    read: boolean;
    write: boolean;
    maintain: boolean;
}

export interface HotelRolePrivileges {
    [hotelId: string]: {
        [roleName: string]: {
            [pagePath: string]: PagePrivilege;
        };
    };
}

export interface UserPrivilegeMatrix {
    [hotelId: string]: {
        [roleName: string]: {
            [userId: string]: {
                [pagePath: string]: PagePrivilege;
            };
        };
    };
}

export interface HotelRecord {
    id: string;
    hotelName: string;
    address: string;
    logoUrl: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    website: string;
    createdAt: string;
}

export interface HotelForm {
    hotelName: string;
    address: string;
    logoUrl: string;
    email: string;
    phoneNumber: string;
    city: string;
    country: string;
    website: string;
}

export interface UserForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    nic: string;
    country: string;
    city: string;
    hotelId: string;
    roleIds: string[];
}

export interface RoleForm {
    name: string;
    hotelId: string;
}

export interface RoleRecord {
    id: string;
    name: string;
    hotelId: string;
    createdAt: string;
}

export interface UserRecord {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    nic: string;
    country: string;
    city: string;
    hotelId: string;
    roleIds: string[];
    createdAt: string;
}

export interface EmailConfigRecord {
    id: string;
    hostname: string;
    password: string;
    port: string;
    protocol: string;
    sentEmail: string;
    displayName: string;
    ccEmail: string;
    createdAt: string;
}

export interface EmailConfigForm {
    hostname: string;
    password: string;
    port: string;
    protocol: string;
    sentEmail: string;
    displayName: string;
    ccEmail: string;
}

export interface OperationPermissionRow {
    id: string;
    label: string;
    icon?: React.ReactNode;
    depth: number;
    parentPath?: string;
}

export interface SectionConfig {
    id: SettingsTab;
    label: string;
    description: string;
}
