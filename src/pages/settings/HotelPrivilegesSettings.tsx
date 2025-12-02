import React, { useState, useEffect } from "react";
import type { HotelRecord } from "./types";
import { sectionColors, operationMatrix } from "./constants";
import { HotelPrivilegesTab } from "./components";
import {
    getHotels,
    getHotelPrivileges,
    saveHotelPrivileges,
} from "../../services/settingsServices";

export const HotelPrivilegesSettings: React.FC = () => {
    const [hotels, setHotels] = useState<HotelRecord[]>([]);
    const [hotelAssignedPages, setHotelAssignedPages] = useState<
        Record<string, string[]>
    >({});
    const [selectedHotelForPrivileges, setSelectedHotelForPrivileges] =
        useState("");

    const colors = sectionColors.hotelPrivileges;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [hotelsData, privilegesData] = await Promise.all([
            getHotels(),
            getHotelPrivileges(),
        ]);
        setHotels(hotelsData);
        setHotelAssignedPages(privilegesData);
    };

    // Privilege Handlers
    const handleTogglePageAssignment = (hotelId: string, pageId: string) => {
        setHotelAssignedPages((prev) => {
            const currentPages = prev[hotelId] || [];
            const isAssigned = currentPages.includes(pageId);
            return {
                ...prev,
                [hotelId]: isAssigned
                    ? currentPages.filter((id) => id !== pageId)
                    : [...currentPages, pageId],
            };
        });
    };

    const handleSavePageAssignments = async () => {
        await saveHotelPrivileges(hotelAssignedPages);
        alert("Page assignments saved successfully!");
    };

    return (
        <div className={`flex h-screen flex-col overflow-hidden ${colors.background}`}>
            <header
                className={`shrink-0 rounded-xl border border-white/30 bg-gradient-to-r ${colors.header} p-4 text-white shadow-md`}
            >
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                    Settings
                </p>
                <h1 className="mt-2 text-xl font-bold">Hotel Privileges</h1>
                <p className="mt-1 max-w-2xl text-xs text-white/80">
                    Assign pages to each hotel
                </p>
            </header>

            <main className="flex-1 overflow-hidden px-1 pb-6">
                <div className="h-full overflow-y-auto space-y-6 pr-1">
                    <HotelPrivilegesTab
                        hotels={hotels}
                        selectedHotelId={selectedHotelForPrivileges}
                        onHotelChange={setSelectedHotelForPrivileges}
                        assignedPages={
                            hotelAssignedPages[selectedHotelForPrivileges] || []
                        }
                        operationMatrix={operationMatrix}
                        onTogglePrivilege={handleTogglePageAssignment}
                        onSave={handleSavePageAssignments}
                    />
                </div>
            </main>
        </div>
    );
};
