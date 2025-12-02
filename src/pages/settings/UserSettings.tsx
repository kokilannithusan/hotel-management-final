import React, { useState, useEffect } from "react";
import { generateId } from "../../utils/formatters";
import type {
    HotelRecord,
    RoleRecord,
    UserRecord,
    UserForm,
    PagePrivilege,
} from "./types";
import { emptyUserForm, sectionColors, operationMatrix } from "./constants";
import { UserTab } from "./components";
import { UserModal } from "./modals";
import {
    getHotels,
    getRoles,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getHotelRolePrivileges,
} from "../../services/settingsServices";

export const UserSettings: React.FC = () => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [hotels, setHotels] = useState<HotelRecord[]>([]);
    const [roleRecords, setRoleRecords] = useState<RoleRecord[]>([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState<UserForm>(emptyUserForm);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const hotelAssignedPages: Record<string, string[]> = {}; // Not currently used, but passed to UserTab
    const [hotelRolePrivileges, setHotelRolePrivileges] = useState<any>({});

    const colors = sectionColors.user;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [hotelsData, rolesData, usersData, privilegesData] =
            await Promise.all([
                getHotels(),
                getRoles(),
                getUsers(),
                getHotelRolePrivileges(),
            ]);
        setHotels(hotelsData);
        setRoleRecords(rolesData);
        setUsers(usersData);
        setHotelRolePrivileges(privilegesData);
    };

    // User CRUD Handlers
    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        if (userForm.roleIds.length === 0) {
            alert("Please assign at least one role to the user.");
            return;
        }
        const payload: UserRecord = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...userForm,
        };
        await createUser(payload);
        const usersData = await getUsers();
        setUsers(usersData);
        setUserForm(emptyUserForm);
        setShowUserModal(false);
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        if (userForm.roleIds.length === 0) {
            alert("Please assign at least one role to the user.");
            return;
        }
        const updatedUser = { ...editingUser, ...userForm };
        await updateUser(updatedUser);
        const usersData = await getUsers();
        setUsers(usersData);
        setEditingUser(null);
        setUserForm(emptyUserForm);
        setShowUserModal(false);
    };

    const handleOpenEditUser = (user: UserRecord) => {
        setEditingUser(user);
        setUserForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            nic: user.nic,
            country: user.country,
            city: user.city,
            hotelId: user.hotelId,
            roleIds: user.roleIds,
        });
        setShowUserModal(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const user = users.find(u => u.id === userId);
            const hotelId = user?.hotelId || "1";
            await deleteUser(userId, hotelId);
            const usersData = await getUsers();
            setUsers(usersData);
        }
    };

    const getRoleOptionsForHotel = (hotelId: string) => {
        if (!hotelId) return [];
        return roleRecords
            .filter((role) => role.hotelId === hotelId)
            .map((role) => ({ value: role.id, label: role.name }));
    };

    const getUserRolesForUser = (user: UserRecord) => {
        if (!user.roleIds || user.roleIds.length === 0) return [];
        return roleRecords.filter((role) => user.roleIds.includes(role.id));
    };

    const getMergedPrivilegesForUser = (
        hotelId: string,
        roles: RoleRecord[]
    ) => {
        const mergedPrivileges: Record<string, PagePrivilege> = {};

        roles.forEach((role) => {
            const rolePrivs = hotelRolePrivileges[hotelId]?.[role.name] || {};
            Object.entries(rolePrivs).forEach(([pageId, privs]) => {
                const p = privs as PagePrivilege;
                if (!mergedPrivileges[pageId]) {
                    mergedPrivileges[pageId] = {
                        read: false,
                        write: false,
                        maintain: false,
                    };
                }
                mergedPrivileges[pageId].read =
                    mergedPrivileges[pageId].read || p.read;
                mergedPrivileges[pageId].write =
                    mergedPrivileges[pageId].write || p.write;
                mergedPrivileges[pageId].maintain =
                    mergedPrivileges[pageId].maintain || p.maintain;
            });
        });

        return mergedPrivileges;
    };

    return (
        <>
            <div className={`flex h-screen flex-col overflow-hidden ${colors.background}`}>
                <header
                    className={`shrink-0 rounded-xl border border-white/30 bg-gradient-to-r ${colors.header} p-4 text-white shadow-md`}
                >
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                        Settings
                    </p>
                    <h1 className="mt-2 text-xl font-bold">Users</h1>
                    <p className="mt-1 max-w-2xl text-xs text-white/80">
                        Manage user accounts and their role assignments
                    </p>
                </header>

                <main className="flex-1 overflow-hidden px-1 pb-6">
                    <div className="h-full overflow-y-auto space-y-6 pr-1">
                        <UserTab
                            users={users}
                            hotels={hotels}
                            roleRecords={roleRecords}
                            hotelAssignedPages={hotelAssignedPages}
                            hotelRolePrivileges={hotelRolePrivileges}
                            operationMatrix={operationMatrix}
                            getUserRolesForUser={getUserRolesForUser}
                            getMergedPrivilegesForUser={getMergedPrivilegesForUser}
                            onOpenCreateModal={() => {
                                setEditingUser(null);
                                setUserForm(emptyUserForm);
                                setShowUserModal(true);
                            }}
                            onOpenEdit={handleOpenEditUser}
                            onDelete={handleDeleteUser}
                            onSendPrivilegeEmail={(user) => {
                                alert(`Email sent to ${user.email}`);
                            }}
                        />
                    </div>
                </main>
            </div>

            {/* Modals */}
            <UserModal
                isOpen={showUserModal}
                onClose={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                    setUserForm(emptyUserForm);
                }}
                title={editingUser ? "Edit User" : "Add User"}
                form={userForm}
                setForm={setUserForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    editingUser ? handleUpdateUser() : handleCreateUser(e);
                }}
                hotels={hotels}
                roleOptions={getRoleOptionsForHotel(userForm.hotelId)}
                submitLabel={editingUser ? "Save Changes" : "Create User"}
            />
        </>
    );
};
