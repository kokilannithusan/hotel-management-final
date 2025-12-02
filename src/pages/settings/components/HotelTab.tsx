import React from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Edit, Trash2 } from "lucide-react";
import type { HotelRecord } from "../types";
import { formatDate } from "../constants";

interface HotelTabProps {
    hotels: HotelRecord[];
    onOpenCreateModal: () => void;
    onOpenEdit: (hotel: HotelRecord) => void;
    onDelete: (id: string) => void;
}

export const HotelTab: React.FC<HotelTabProps> = ({
    hotels,
    onOpenCreateModal,
    onOpenEdit,
    onDelete,
}) => {
    return (
        <div className="space-y-8">
            <Card
                title="Hotels"
                actions={
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 hidden md:block">
                            {hotels.length} property{hotels.length === 1 ? "" : "ies"}
                        </span>
                        <Button
                            onClick={onOpenCreateModal}
                            className="flex items-center justify-center text-lg font-bold"
                            aria-label="Add Hotel"
                        >
                            +
                        </Button>
                    </div>
                }
            >
                {hotels.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="text-5xl">🏨</div>
                        <p className="text-base font-semibold text-slate-700">
                            No hotels created yet
                        </p>
                        <p className="max-w-md text-sm text-slate-500">
                            Click the + button above to add your first hotel. It will appear
                            here with edit and delete options.
                        </p>
                    </div>
                ) : (
                    <div className="-mx-4 overflow-x-auto md:mx-0">
                        <table className="min-w-[1000px] w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest text-slate-500">
                                    {[
                                        "Hotel Name",
                                        "Logo",
                                        "Address",
                                        "Email",
                                        "Phone Number",
                                        "City",
                                        "Country",
                                        "Website",
                                        "Created Date",
                                        "Action",
                                    ].map((header) => (
                                        <th key={header} className="px-4 py-3">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {hotels.map((hotel) => (
                                    <tr
                                        key={hotel.id}
                                        className="border-t border-slate-100 hover:bg-slate-50/70"
                                    >
                                        <td className="px-4 py-4 font-semibold text-slate-900">
                                            {hotel.hotelName}
                                        </td>
                                        <td className="px-4 py-4">
                                            {hotel.logoUrl ? (
                                                <img
                                                    src={hotel.logoUrl}
                                                    alt={`${hotel.name} logo`}
                                                    className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-slate-400">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">{hotel.address}</td>
                                        <td className="px-4 py-4 text-blue-600">{hotel.email}</td>
                                        <td className="px-4 py-4">{hotel.phoneNumber}</td>
                                        <td className="px-4 py-4">{hotel.city}</td>
                                        <td className="px-4 py-4">{hotel.country}</td>
                                        <td className="px-4 py-4">
                                            <a
                                                href={hotel.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {hotel.website}
                                            </a>
                                        </td>
                                        <td className="px-4 py-4">{formatDate(hotel.createdAt)}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onOpenEdit(hotel)}
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => onDelete(hotel.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};
