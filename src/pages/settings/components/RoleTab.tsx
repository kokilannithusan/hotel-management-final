import React from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Edit, Trash2 } from "lucide-react";
import type { RoleRecord, HotelRecord } from "../types";
import { formatDate } from "../constants";

interface RoleTabProps {
    roleRecords: RoleRecord[];
    hotels: HotelRecord[];
    onOpenCreateModal: () => void;
    onOpenEdit: (role: RoleRecord) => void;
    onDelete: (id: string) => void;
}

export const RoleTab: React.FC<RoleTabProps> = ({
    roleRecords,
    hotels,
    onOpenCreateModal,
    onOpenEdit,
    onDelete,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    // Pagination logic
    const totalPages = Math.ceil(roleRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRoles = roleRecords.slice(startIndex, endIndex);

    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="space-y-6">
            <Card
                title="Role Management"
                actions={
                    <Button onClick={onOpenCreateModal}>
                        Add Role
                    </Button>
                }
            >
                {roleRecords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="text-5xl">👤</div>
                        <p className="text-base font-semibold text-slate-700">
                            No roles created yet
                        </p>
                        <p className="max-w-md text-sm text-slate-500">
                            Click "Add Role" to create your first role.
                        </p>
                    </div>
                ) : (
                    <div className="-mx-4 overflow-x-auto md:mx-0">
                        <table className="min-w-[600px] w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest text-slate-500">
                                    <th className="px-4 py-3">Hotel</th>
                                    <th className="px-4 py-3">Role Name</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {paginatedRoles.map((role) => {
                                    const hotel = hotels.find((h) => h.id === role.hotelId);
                                    return (
                                        <tr
                                            key={role.id}
                                            className="border-t border-slate-100 hover:bg-slate-50/70"
                                        >
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-slate-900">
                                                    {hotel?.hotelName || "Unknown Hotel"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-slate-900">
                                                {role.name}
                                            </td>
                                            <td className="px-4 py-4 text-xs text-slate-500">
                                                {formatDate(role.createdAt)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onOpenEdit(role)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() => onDelete(role.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {roleRecords.length > 0 && (
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
                                        Showing {startIndex + 1} to {Math.min(endIndex, roleRecords.length)} of {roleRecords.length} entries
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
                )}
            </Card>
        </div>
    );
};
