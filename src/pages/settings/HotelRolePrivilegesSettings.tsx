import React, { useState, useEffect } from "react";
import type { HotelRecord, RoleRecord } from "./types";
import { sectionColors, operationMatrix } from "./constants";
import { HotelRolePrivilegesTab } from "./components";
import {
    getHotels,
    getRoles,
    getHotelPrivileges,
    getHotelRolePrivileges,
    saveHotelRolePrivileges,
} from "../../services/settingsServices";

export const HotelRolePrivilegesSettings: React.FC = () => {
    const [hotels, setHotels] = useState<HotelRecord[]>([]);
    const [roleRecords, setRoleRecords] = useState<RoleRecord[]>([]);
    const [hotelAssignedPages, setHotelAssignedPages] = useState<
        Record<string, string[]>
    >({});
    const [hotelRolePrivileges, setHotelRolePrivileges] = useState<any>({});
    const [selectedHotelForRolePrivilegesPage, setSelectedHotelForRolePrivilegesPage] =
        useState("");
    const [selectedRoleForPrivileges, setSelectedRoleForPrivileges] = useState("");

    const colors = sectionColors.hotelRolePrivileges;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [hotelsData, rolesData, assignedPagesData, privilegesData] =
            await Promise.all([
                getHotels(),
                getRoles(),
                getHotelPrivileges(),
                getHotelRolePrivileges(),
            ]);
        setHotels(hotelsData);
        setRoleRecords(rolesData);
        setHotelAssignedPages(assignedPagesData);
        setHotelRolePrivileges(privilegesData);
    };

    const handleTogglePagePrivilege = (
        hotelId: string,
        roleName: string,
        pageId: string,
        privType: "read" | "write" | "maintain"
    ) => {
        setHotelRolePrivileges((prev: any) => {
            const hotelPrivs = prev[hotelId] || {};
            const rolePrivs = hotelPrivs[roleName] || {};
            const pagePrivs = rolePrivs[pageId] || {
                read: false,
                write: false,
                maintain: false,
            };
            return {
                ...prev,
                [hotelId]: {
                    ...hotelPrivs,
                    [roleName]: {
                        ...rolePrivs,
                        [pageId]: {
                            ...pagePrivs,
                            [privType]: !pagePrivs[privType],
                        },
                    },
                },
            };
        });
    };

    const handleSaveRolePrivileges = async () => {
        if (!selectedHotelForRolePrivilegesPage || !selectedRoleForPrivileges) {
            alert("Please select both a hotel and a role.");
            return;
        }
        await saveHotelRolePrivileges(hotelRolePrivileges);
        alert("Privileges saved successfully!");
    };

    return (
        <div className={`flex h-screen flex-col overflow-hidden ${colors.background}`}>
            <header
                className={`shrink-0 rounded-xl border border-white/30 bg-gradient-to-r ${colors.header} p-4 text-white shadow-md`}
            >
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                    Settings
                </p>
                <h1 className="mt-2 text-xl font-bold">Hotel Role Privileges</h1>
                <p className="mt-1 max-w-2xl text-xs text-white/80">
                    Configure page privileges for each role within a hotel
                </p>
            </header>

            <main className="flex-1 overflow-hidden px-1 pb-6">
                <div className="h-full overflow-y-auto space-y-6 pr-1">
                    <HotelRolePrivilegesTab
                        hotels={hotels}
                        roleRecords={roleRecords}
                        selectedHotelId={selectedHotelForRolePrivilegesPage}
                        onHotelChange={(id) => {
                            setSelectedHotelForRolePrivilegesPage(id);
                            setSelectedRoleForPrivileges("");
                        }}
                        selectedRoleName={selectedRoleForPrivileges}
                        onRoleChange={setSelectedRoleForPrivileges}
                        assignedPages={
                            hotelAssignedPages[selectedHotelForRolePrivilegesPage] || []
                        }
                        currentPrivileges={
                            hotelRolePrivileges[selectedHotelForRolePrivilegesPage]?.[
                            selectedRoleForPrivileges
                            ] || {}
                        }
                        operationMatrix={operationMatrix}
                        onTogglePrivilege={handleTogglePagePrivilege}
                        onSave={handleSaveRolePrivileges}
                    />
                </div>
            </main>
        </div>
    );
};
