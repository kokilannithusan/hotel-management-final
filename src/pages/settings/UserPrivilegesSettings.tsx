import React, { useState, useEffect } from "react";
import type { HotelRecord, RoleRecord, UserRecord } from "./types";
import { sectionColors, operationMatrix } from "./constants";
import { UserPrivilegesTab } from "./components";
import {
    getHotels,
    getRoles,
    getUsers,
    getHotelPrivileges,
    getUserPrivileges,
    saveUserPrivileges,
} from "../../services/settingsServices";

export const UserPrivilegesSettings: React.FC = () => {
    const [hotels, setHotels] = useState<HotelRecord[]>([]);
    const [roleRecords, setRoleRecords] = useState<RoleRecord[]>([]);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [hotelAssignedPages, setHotelAssignedPages] = useState<
        Record<string, string[]>
    >({});
    const [userPrivilegeMatrix, setUserPrivilegeMatrix] = useState<any>({});
    const [selectedHotelForUserPrivileges, setSelectedHotelForUserPrivileges] =
        useState("");
    const [selectedRoleForUserPrivileges, setSelectedRoleForUserPrivileges] =
        useState("");
    const [selectedUserForUserPrivileges, setSelectedUserForUserPrivileges] =
        useState("");

    const colors = sectionColors.userPrivileges;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [hotelsData, rolesData, usersData, assignedPagesData, privilegesData] =
            await Promise.all([
                getHotels(),
                getRoles(),
                getUsers(),
                getHotelPrivileges(),
                getUserPrivileges(),
            ]);
        setHotels(hotelsData);
        setRoleRecords(rolesData);
        setUsers(usersData);
        setHotelAssignedPages(assignedPagesData);
        setUserPrivilegeMatrix(privilegesData);
    };

    const handleToggleUserPrivilege = (
        hotelId: string,
        roleName: string,
        userId: string,
        pageId: string,
        privType: "read" | "write" | "maintain"
    ) => {
        setUserPrivilegeMatrix((prev: any) => {
            const hotelMatrix = prev[hotelId] || {};
            const roleMatrix = hotelMatrix[roleName] || {};
            const userMatrix = roleMatrix[userId] || {};
            const pagePrivs = userMatrix[pageId] || {
                read: false,
                write: false,
                maintain: false,
            };
            return {
                ...prev,
                [hotelId]: {
                    ...hotelMatrix,
                    [roleName]: {
                        ...roleMatrix,
                        [userId]: {
                            ...userMatrix,
                            [pageId]: {
                                ...pagePrivs,
                                [privType]: !pagePrivs[privType],
                            },
                        },
                    },
                },
            };
        });
    };

    const handleSaveUserPrivileges = async () => {
        await saveUserPrivileges(userPrivilegeMatrix);
        alert("User privileges saved successfully!");
    };

    return (
        <div className={`flex h-screen flex-col overflow-hidden ${colors.background}`}>
            <header
                className={`shrink-0 rounded-xl border border-white/30 bg-gradient-to-r ${colors.header} p-4 text-white shadow-md`}
            >
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                    Settings
                </p>
                <h1 className="mt-2 text-xl font-bold">User Privileges</h1>
                <p className="mt-1 max-w-2xl text-xs text-white/80">
                    Configure custom page privileges for individual users
                </p>
            </header>

            <main className="flex-1 overflow-hidden px-1 pb-6">
                <div className="h-full overflow-y-auto space-y-6 pr-1">
                    <UserPrivilegesTab
                        hotels={hotels}
                        roleRecords={roleRecords}
                        users={users}
                        selectedHotelId={selectedHotelForUserPrivileges}
                        onHotelChange={(id) => {
                            setSelectedHotelForUserPrivileges(id);
                            setSelectedRoleForUserPrivileges("");
                            setSelectedUserForUserPrivileges("");
                        }}
                        selectedRoleName={selectedRoleForUserPrivileges}
                        onRoleChange={(name) => {
                            setSelectedRoleForUserPrivileges(name);
                            setSelectedUserForUserPrivileges("");
                        }}
                        selectedUserId={selectedUserForUserPrivileges}
                        onUserChange={setSelectedUserForUserPrivileges}
                        assignedPages={
                            hotelAssignedPages[selectedHotelForUserPrivileges] || []
                        }
                        currentPrivileges={
                            userPrivilegeMatrix[selectedHotelForUserPrivileges]?.[
                            selectedRoleForUserPrivileges
                            ]?.[selectedUserForUserPrivileges] || {}
                        }
                        operationMatrix={operationMatrix}
                        onTogglePrivilege={handleToggleUserPrivilege}
                        onSave={handleSaveUserPrivileges}
                    />
                </div>
            </main>
        </div>
    );
};
