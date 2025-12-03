import React from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import {
    HotelRecord,
    RoleRecord,
    UserRecord,
    OperationPermissionRow,
    PagePrivilege,
} from "../types";

interface UserPrivilegesTabProps {
    hotels: HotelRecord[];
    roleRecords: RoleRecord[];
    users: UserRecord[];
    selectedHotelId: string;
    onHotelChange: (id: string) => void;
    selectedRoleName: string;
    onRoleChange: (name: string) => void;
    selectedUserId: string;
    onUserChange: (id: string) => void;
    assignedPages: string[];
    currentPrivileges: Record<string, PagePrivilege>;
    operationMatrix: OperationPermissionRow[];
    onTogglePrivilege: (
        hotelId: string,
        roleName: string,
        userId: string,
        pageId: string,
        type: "read" | "write" | "maintain"
    ) => void;
    onSave: () => void;
}

export const UserPrivilegesTab: React.FC<UserPrivilegesTabProps> = ({
    hotels,
    roleRecords,
    users,
    selectedHotelId,
    onHotelChange,
    selectedRoleName,
    onRoleChange,
    selectedUserId,
    onUserChange,
    assignedPages,
    currentPrivileges,
    operationMatrix,
    onTogglePrivilege,
    onSave,
}) => {
    // Get roles from Role Management for the selected hotel
    const rolesForSelectedHotel = selectedHotelId
        ? roleRecords
            .filter((role) => role.hotelId === selectedHotelId)
            .map((role) => role.name)
        : [];

    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const filteredOperations = operationMatrix.filter(
        (operation) => operation.depth > 0 && assignedPages.includes(operation.id)
    );
    const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOperations = filteredOperations.slice(startIndex, endIndex);

    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="space-y-6">
            <Card title="User Privilege Matrix">
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
                                        label: hotel.hotelName,
                                    })),
                                ]}
                            />
                        </div>
                        <div className="flex-1 min-w-[220px]">
                            <Select
                                label="Select Role"
                                value={selectedRoleName}
                                onChange={(e) => onRoleChange(e.target.value)}
                                disabled={!selectedHotelId || rolesForSelectedHotel.length === 0}
                                options={[
                                    {
                                        value: "",
                                        label: !selectedHotelId
                                            ? "Select a hotel first"
                                            : rolesForSelectedHotel.length > 0
                                                ? "Select a role"
                                                : "Assign roles to this hotel first",
                                    },
                                    ...rolesForSelectedHotel.map((role) => ({
                                        value: role,
                                        label: role,
                                    })),
                                ]}
                            />
                        </div>
                        <div className="flex-1 min-w-[220px]">
                            <Select
                                label="Select User"
                                value={selectedUserId}
                                onChange={(e) => onUserChange(e.target.value)}
                                disabled={users.length === 0}
                                options={[
                                    {
                                        value: "",
                                        label:
                                            users.length === 0 ? "No users found" : "Select a user",
                                    },
                                    ...users.map((user) => ({
                                        value: user.id,
                                        label: `${user.firstName} ${user.lastName}`,
                                    })),
                                ]}
                            />
                        </div>
                    </div>

                    {!selectedHotelId ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            Please select a hotel to continue.
                        </div>
                    ) : rolesForSelectedHotel.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            No roles have been assigned to this hotel yet. Please assign roles
                            first.
                        </div>
                    ) : !selectedRoleName ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            Select a role to configure privileges.
                        </div>
                    ) : users.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            No users have been created yet. Please add a user first.
                        </div>
                    ) : !selectedUserId ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            Choose a user to assign privileges.
                        </div>
                    ) : assignedPages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                            No sub-modules have been assigned to this hotel yet. Configure them
                            in Hotel Privileges first.
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
                                                {paginatedOperations
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
                                                                                            selectedUserId,
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
                                            </tbody>
                                        </table>

                                        {filteredOperations.length > 0 && (
                                            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-slate-600">Items per page:</span>
                                                    <select
                                                        value={itemsPerPage}
                                                        onChange={(e) => {
                                                            setItemsPerPage(Number(e.target.value));
                                                            setCurrentPage(1);
                                                        }}
                                                        className="rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                        <option value={100}>100</option>
                                                    </select>
                                                    <span className="text-sm text-slate-600">
                                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredOperations.length)} of {filteredOperations.length} entries
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="px-3 py-1 text-sm rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-sm text-slate-600">
                                                        Page {currentPage} of {totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="px-3 py-1 text-sm rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button onClick={onSave}>Save Privileges</Button>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};
