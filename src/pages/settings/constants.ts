/**
 * Constants and configuration for the Settings module
 */

import { navItems, NavItem } from "../../config/navigation";
import type { SettingsTab, OperationPermissionRow, SectionConfig, HotelForm, UserForm, RoleForm, EmailConfigForm } from "./types";

export const emptyHotelForm: HotelForm = {
    hotelName: "",
    address: "",
    logoUrl: "",
    email: "",
    phoneNumber: "",
    city: "",
    country: "",
    website: "",
};

export const emptyUserForm: UserForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    nic: "",
    country: "",
    city: "",
    hotelId: "",
    roleIds: [],
};

export const emptyRoleForm: RoleForm = {
    name: "",
    hotelId: "",
};

export const emptyEmailConfigForm: EmailConfigForm = {
    hostname: "",
    password: "",
    port: "587",
    protocol: "SMTP",
    sentEmail: "",
    displayName: "",
    ccEmail: "",
};

export const sections: SectionConfig[] = [
    {
        id: "hotel",
        label: "Hotel",
        description: "Create hotels, keep brand details in sync",
    },
    {
        id: "role",
        label: "Role Management",
        description: "Create and manage roles with hotel assignments",
    },
    {
        id: "hotelPrivileges",
        label: "Hotel Privileges",
        description: "Assign granular access per module for each hotel",
    },
    {
        id: "hotelRolePrivileges",
        label: "Hotel Role Privileges",
        description: "Configure permissions for roles within hotels",
    },
    {
        id: "userPrivileges",
        label: "User Privileges",
        description: "Assign sub-module access per hotel, role, and user",
    },
    {
        id: "user",
        label: "User",
        description: "Create and manage users with hotel and role assignments",
    },
    {
        id: "emailConfig",
        label: "Email Configuration",
        description: "Configure SMTP email settings for sending notifications",
    },
];

const flattenNavItems = (
    items: NavItem[],
    depth = 0,
    parentPath?: string
): OperationPermissionRow[] =>
    items.flatMap((item) => [
        {
            id: item.path,
            label: item.label,
            icon: item.icon,
            depth,
            parentPath,
        },
        ...(item.children
            ? flattenNavItems(item.children, depth + 1, item.path)
            : []),
    ]);

export const operationMatrix = flattenNavItems(navItems);

export const sectionRouteAliases: Record<string, SettingsTab> = {
    hotel: "hotel",
    role: "role",
    roles: "role",
    hotelPrivileges: "hotelPrivileges",
    operations: "hotelPrivileges",
    hotelRolePrivileges: "hotelRolePrivileges",
    userPrivileges: "userPrivileges",
    hotelRolePermissions: "hotelRolePrivileges",
    user: "user",
    addUser: "user",
    emailConfig: "emailConfig",
    email: "emailConfig",
};

export const sectionColors: Record<
    SettingsTab,
    { background: string; header: string }
> = {
    hotel: {
        background: "bg-slate-50",
        header: "from-blue-600 via-cyan-600 to-emerald-500",
    },
    role: {
        background: "bg-slate-50",
        header: "from-blue-600 via-cyan-600 to-emerald-500",
    },
    hotelPrivileges: {
        background: "bg-slate-50",
        header: "from-blue-600 via-cyan-600 to-emerald-500",
    },
    hotelRolePrivileges: {
        background: "bg-slate-50",
        header: "from-blue-600 via-cyan-600 to-emerald-500",
    },
    userPrivileges: {
        background: "bg-slate-50",
        header: "from-blue-600 via-cyan-600 to-emerald-500",
    },
    user: {
        background: "bg-slate-50",
        header: "from-blue-600 via-cyan-600 to-emerald-500",
    },
    emailConfig: {
        background: "bg-slate-50",
        header: "from-blue-600 via-cyan-600 to-emerald-500",
    },
};

export const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "—";
    }
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
