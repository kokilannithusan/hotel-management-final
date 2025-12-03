import React from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { HotelRecord, OperationPermissionRow } from "../types";

interface HotelPrivilegesTabProps {
    hotels: HotelRecord[];
    selectedHotelId: string;
    onHotelChange: (id: string) => void;
    assignedPages: string[];
    operationMatrix: OperationPermissionRow[];
    onTogglePrivilege: (hotelId: string, pageId: string) => void;
    onSave: () => void;
}

export const HotelPrivilegesTab: React.FC<HotelPrivilegesTabProps> = ({
    hotels,
    selectedHotelId,
    onHotelChange,
    assignedPages,
    operationMatrix,
    onTogglePrivilege,
    onSave,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const filteredOperations = operationMatrix.filter((operation) => operation.depth > 0);
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
        <Card title="Page Privileges">
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
                    <div className="flex justify-end w-full lg:w-auto">
                        <Button onClick={onSave} disabled={!selectedHotelId}>
                            Save Selections
                        </Button>
                    </div>
                </div>

                {!selectedHotelId ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                        Please select a hotel to view and configure page privileges.
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-slate-500">
                            Select the pages you want to assign to this hotel by checking the
                            boxes below.
                        </p>

                        <div className="mt-6 rounded-2xl bg-white shadow-sm">
                            <div className="max-h-[65vh] overflow-auto rounded-2xl">
                                <div className="min-w-full overflow-x-auto">
                                    <table className="min-w-[900px] w-full table-fixed border-collapse">
                                        <thead className="sticky top-0 bg-slate-50/90 backdrop-blur">
                                            <tr className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                <th className="px-4 py-3 text-left">Submodules</th>
                                                <th className="px-4 py-3 text-center">Assign</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-slate-700">
                                            {paginatedOperations
                                                .map((operation) => {
                                                    // Find parent module label
                                                    const parentModule = operationMatrix.find(
                                                        (op) =>
                                                            op.id === operation.parentPath && op.depth === 0
                                                    );
                                                    const parentLabel = parentModule
                                                        ? parentModule.label
                                                        : "";
                                                    const isAssigned = assignedPages.includes(
                                                        operation.id
                                                    );

                                                    return (
                                                        <tr
                                                            key={operation.id}
                                                            className="transition-colors hover:bg-slate-50/70"
                                                        >
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                                        {operation.icon}
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-base font-bold text-slate-900">
                                                                            {operation.label}
                                                                            {parentLabel && (
                                                                                <span className="text-slate-600 font-semibold ml-2 text-sm">
                                                                                    ({parentLabel})
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center justify-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isAssigned}
                                                                        onChange={() =>
                                                                            onTogglePrivilege(
                                                                                selectedHotelId,
                                                                                operation.id
                                                                            )
                                                                        }
                                                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                    />
                                                                </div>
                                                            </td>
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
                    </>
                )}
            </div>
        </Card>
    );
};
