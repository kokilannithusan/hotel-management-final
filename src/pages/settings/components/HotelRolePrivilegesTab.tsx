import React from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import {
    HotelRecord,
    RoleRecord,
    OperationPermissionRow,
    PagePrivilege,
} from "../types";

interface HotelRolePrivilegesTabProps {
    hotels: HotelRecord[];
    roleRecords: RoleRecord[];
    selectedHotelId: string;
    onHotelChange: (id: string) => void;
    selectedRoleName: string;
    onRoleChange: (name: string) => void;
    assignedPages: string[];
    currentPrivileges: Record<string, PagePrivilege>;
    operationMatrix: OperationPermissionRow[];
    onTogglePrivilege: (
        hotelId: string,
        roleName: string,
        pageId: string,
        type: "read" | "write" | "maintain"
    ) => void;
    onSave: () => void;
}

export const HotelRolePrivilegesTab: React.FC<HotelRolePrivilegesTabProps> = ({
    hotels,
    roleRecords,
    selectedHotelId,
    onHotelChange,
    selectedRoleName,
    onRoleChange,
    assignedPages,
    currentPrivileges,
    operationMatrix,
    onTogglePrivilege,
    onSave,
}) => {
    // Get roles from Role Management for the selected hotel
    const rolesForHotel = selectedHotelId
        ? roleRecords
            .filter((role) => role.hotelId === selectedHotelId)
            .map((role) => role.name)
        : [];

    return (
        <div className="space-y-6">
            <Card title="Role Permissions">
                <div className="space-y-6">
                    <div className="flex flex-row flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[220px]">
                            <Select
                                label="Select Hotel"
                                value={selectedHotelId}
                                onChange={(e) => onHotelChange(e.target.value)}
                                options={[
                                    { value: "", label: "Select a hotel" },
                                    ...hotels.map((hotel) => ({
                                        value: hotel.id,
                                        label: hotel.name,
                                    })),
                                ]}
                            />
                        </div>
                        <div className="flex-1 min-w-[220px]">
                            <Select
                                label="Select Role"
                                value={selectedRoleName}
                                onChange={(e) => onRoleChange(e.target.value)}
                                disabled={!selectedHotelId || rolesForHotel.length === 0}
                                options={[
                                    {
                                        value: "",
                                        label: !selectedHotelId
                                            ? "Select a hotel first"
                                            : rolesForHotel.length > 0
                                                ? "Select a role"
                                                : "Assign roles to this hotel first",
                                    },
                                    ...rolesForHotel.map((roleName) => ({
                                        value: roleName,
                                        label: roleName,
                                    })),
                                ]}
                            />
                        </div>
                    </div>

                    {!selectedHotelId ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            Please select a hotel first.
                        </div>
                    ) : rolesForHotel.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            No roles have been assigned to this hotel yet. Please assign roles
                            in the Hotel Assign Role page first.
                        </div>
                    ) : !selectedRoleName ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            Please select a role to configure permissions.
                        </div>
                    ) : (
                        <>
                            <div className="rounded-xl bg-white shadow-sm">
                                <div className="max-h-[60vh] overflow-auto">
                                    <div className="min-w-full overflow-x-auto">
                                        <table className="min-w-[900px] w-full border-collapse">
                                            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur">
                                                <tr className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                    <th className="px-4 py-3 text-left">
                                                        Sub Module Name
                                                    </th>
                                                    <th className="px-4 py-3 text-center">Read</th>
                                                    <th className="px-4 py-3 text-center">Write</th>
                                                    <th className="px-4 py-3 text-center">Maintain</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-slate-700">
                                                {operationMatrix
                                                    .filter(
                                                        (operation) =>
                                                            operation.depth > 0 &&
                                                            assignedPages.includes(operation.id)
                                                    )
                                                    .map((operation) => {
                                                        const pagePrivs = currentPrivileges[
                                                            operation.id
                                                        ] || {
                                                            read: false,
                                                            write: false,
                                                            maintain: false,
                                                        };
                                                        return (
                                                            <tr
                                                                key={operation.id}
                                                                className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                                                            >
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                                            {operation.icon}
                                                                        </span>
                                                                        <div>
                                                                            <p className="text-base font-bold text-slate-900">
                                                                                {operation.label}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                {(["read", "write", "maintain"] as const).map(
                                                                    (privType) => (
                                                                        <td key={privType} className="px-4 py-3">
                                                                            <div className="flex items-center justify-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={pagePrivs[privType]}
                                                                                    onChange={() =>
                                                                                        onTogglePrivilege(
                                                                                            selectedHotelId,
                                                                                            selectedRoleName,
                                                                                            operation.id,
                                                                                            privType
                                                                                        )
                                                                                    }
                                                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                    )
                                                                )}
                                                            </tr>
                                                        );
                                                    })}
                                                {assignedPages.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan={4}
                                                            className="px-4 py-8 text-center text-slate-500"
                                                        >
                                                            No pages have been assigned to this hotel yet.
                                                            Please assign pages in the Hotel Privileges tab
                                                            first.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
                                <Button onClick={onSave}>Save Privileges</Button>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};
