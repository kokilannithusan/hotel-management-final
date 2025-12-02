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
                                {roleRecords.map((role) => {
                                    const hotel = hotels.find((h) => h.id === role.hotelId);
                                    return (
                                        <tr
                                            key={role.id}
                                            className="border-t border-slate-100 hover:bg-slate-50/70"
                                        >
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-slate-900">
                                                    {hotel?.name || "Unknown Hotel"}
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
                    </div>
                )}
            </Card>
        </div>
    );
};
