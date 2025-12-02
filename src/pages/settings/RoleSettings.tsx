import React, { useState, useEffect } from "react";
import { generateId } from "../../utils/formatters";
import type { HotelRecord, RoleRecord, RoleForm } from "./types";
import { emptyRoleForm, sectionColors } from "./constants";
import { RoleTab } from "./components";
import { RoleModal } from "./modals";
import {
    getHotels,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
} from "../../services/settingsServices";

export const RoleSettings: React.FC = () => {
    const [hotels, setHotels] = useState<HotelRecord[]>([]);
    const [roleRecords, setRoleRecords] = useState<RoleRecord[]>([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleForm, setRoleForm] = useState<RoleForm>(emptyRoleForm);
    const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);

    const colors = sectionColors.role;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [hotelsData, rolesData] = await Promise.all([
            getHotels(),
            getRoles(),
        ]);
        setHotels(hotelsData);
        setRoleRecords(rolesData);
    };

    // Role CRUD Handlers
    const handleCreateRole = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload: RoleRecord = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...roleForm,
        };
        await createRole(payload);
        const rolesData = await getRoles();
        setRoleRecords(rolesData);
        setRoleForm(emptyRoleForm);
        setShowRoleModal(false);
    };

    const handleUpdateRole = async () => {
        if (!editingRole) return;
        const updatedRole = { ...editingRole, ...roleForm };
        await updateRole(updatedRole);
        const rolesData = await getRoles();
        setRoleRecords(rolesData);
        setEditingRole(null);
        setRoleForm(emptyRoleForm);
        setShowRoleModal(false);
    };

    const handleDeleteRole = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this role?")) {
            await deleteRole(id);
            const rolesData = await getRoles();
            setRoleRecords(rolesData);
        }
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
                    <h1 className="mt-2 text-xl font-bold">Roles</h1>
                    <p className="mt-1 max-w-2xl text-xs text-white/80">
                        Manage user roles for each hotel
                    </p>
                </header>

                <main className="flex-1 overflow-hidden px-1 pb-6">
                    <div className="h-full overflow-y-auto space-y-6 pr-1">
                        <RoleTab
                            roleRecords={roleRecords}
                            hotels={hotels}
                            onOpenCreateModal={() => {
                                setEditingRole(null);
                                setRoleForm(emptyRoleForm);
                                setShowRoleModal(true);
                            }}
                            onOpenEdit={(role: RoleRecord) => {
                                setEditingRole(role);
                                setRoleForm({ name: role.name, hotelId: role.hotelId });
                                setShowRoleModal(true);
                            }}
                            onDelete={handleDeleteRole}
                        />
                    </div>
                </main>
            </div>

            {/* Modals */}
            <RoleModal
                isOpen={showRoleModal}
                onClose={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                    setRoleForm(emptyRoleForm);
                }}
                title={editingRole ? "Edit Role" : "Add Role"}
                form={roleForm}
                setForm={setRoleForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    editingRole ? handleUpdateRole() : handleCreateRole(e);
                }}
                hotels={hotels}
                submitLabel={editingRole ? "Save Changes" : "Add Role"}
            />
        </>
    );
};
