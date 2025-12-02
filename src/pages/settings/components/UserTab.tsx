/**
 * Settings Module - All Component Templates
 * Copy each section into its respective file
 */

// ============================================
// FILE: UserTab.tsx
// Location: src/pages/settings/components/
// ============================================

import React from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Edit, Trash2 } from "lucide-react";
import type {
    UserRecord,
    HotelRecord,
    RoleRecord,
    HotelRolePrivileges,
    PagePrivilege,
    OperationPermissionRow
} from "../types";

interface UserTabProps {
    users: UserRecord[];
    hotels: HotelRecord[];
    roleRecords: RoleRecord[];
    hotelAssignedPages: Record<string, string[]>;
    hotelRolePrivileges: HotelRolePrivileges;
    operationMatrix: OperationPermissionRow[];
    getUserRolesForUser: (user: UserRecord) => RoleRecord[];
    getMergedPrivilegesForUser: (
        hotelId: string,
        roles: RoleRecord[]
    ) => Record<string, PagePrivilege>;
    onOpenCreateModal: () => void;
    onOpenEdit: (user: UserRecord) => void;
    onDelete: (id: string) => void;
    onSendPrivilegeEmail: (user: UserRecord) => void;
}

export const UserTab: React.FC<UserTabProps> = ({
    users,
    hotels,
    operationMatrix,
    hotelAssignedPages,
    getUserRolesForUser,
    getMergedPrivilegesForUser,
    onOpenCreateModal,
    onOpenEdit,
    onDelete,
    onSendPrivilegeEmail,
}) => {
    const getUserSubModules = (user: UserRecord) => {
        const userRoles = getUserRolesForUser(user);
        if (!user.hotelId || userRoles.length === 0) return [];

        const assignedPages = hotelAssignedPages[user.hotelId] || [];
        const privileges = getMergedPrivilegesForUser(user.hotelId, userRoles);

        return operationMatrix
            .filter((operation) => {
                if (operation.depth === 0) return false;
                return assignedPages.includes(operation.id);
            })
            .map((operation) => {
                const pagePrivs = privileges[operation.id] || {
                    read: false,
                    write: false,
                    maintain: false,
                };
                const hasAnyPrivilege =
                    pagePrivs.read || pagePrivs.write || pagePrivs.maintain;
                if (!hasAnyPrivilege) return null;

                const privs = [];
                if (pagePrivs.read) privs.push("Read");
                if (pagePrivs.write) privs.push("Write");
                if (pagePrivs.maintain) privs.push("Maintain");

                return {
                    page: operation.label,
                    privileges: privs.join(", "),
                };
            })
            .filter((page) => page !== null);
    };

    return (
        <div className="space-y-6">
            <Card
                title="User Management"
                actions={
                    <Button onClick={onOpenCreateModal}>
                        Add User
                    </Button>
                }
            >
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="text-5xl">👤</div>
                        <p className="text-base font-semibold text-slate-700">
                            No users created yet
                        </p>
                        <p className="max-w-md text-sm text-slate-500">
                            Click "Add User" to create your first user.
                        </p>
                    </div>
                ) : (
                    <div className="-mx-4 overflow-x-auto md:mx-0">
                        <table className="min-w-[1600px] w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest text-slate-500">
                                    <th className="px-4 py-3">First Name</th>
                                    <th className="px-4 py-3">Last Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Address</th>
                                    <th className="px-4 py-3">NIC</th>
                                    <th className="px-4 py-3">Country</th>
                                    <th className="px-4 py-3">City</th>
                                    <th className="px-4 py-3">Hotel</th>
                                    <th className="px-4 py-3">Role(s)</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {users.map((user) => {
                                    const userHotel = hotels.find((h) => h.id === user.hotelId);
                                    const userRoles = getUserRolesForUser(user);
                                    const subModules = getUserSubModules(user);

                                    return (
                                        <React.Fragment key={user.id}>
                                            <tr className="border-t border-slate-100 hover:bg-slate-50/70">
                                                <td className="px-4 py-4 font-semibold text-slate-900">
                                                    {user.firstName}
                                                </td>
                                                <td className="px-4 py-4 font-semibold text-slate-900">
                                                    {user.lastName}
                                                </td>
                                                <td className="px-4 py-4 text-blue-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-4">{user.phone}</td>
                                                <td className="px-4 py-4">{user.address}</td>
                                                <td className="px-4 py-4">{user.nic}</td>
                                                <td className="px-4 py-4">{user.country}</td>
                                                <td className="px-4 py-4">{user.city}</td>
                                                <td className="px-4 py-4">
                                                    {userHotel?.name || "N/A"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {userRoles.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {userRoles.map((role) => (
                                                                <span
                                                                    key={role.id}
                                                                    className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => onOpenEdit(user)}
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => onDelete(user.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                        {subModules.length > 0 && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => onSendPrivilegeEmail(user)}
                                                            >
                                                                Send Privilege Email
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {subModules.length > 0 && (
                                                <tr>
                                                    <td colSpan={11} className="px-4 py-4 bg-slate-50">
                                                        <div className="space-y-2">
                                                            <p className="text-xs font-semibold text-slate-600 mb-2">
                                                                Sub-Modules Assigned:
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {subModules.map((module, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                                                    >
                                                                        {module?.page} ({module?.privileges})
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};


// Note: Due to size constraints, I'm providing this as a template file.
// Please create individual files for each component using this as reference.
// See the complete code in the Settings.tsx file (lines indicated in the guide).
