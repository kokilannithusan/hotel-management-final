import React from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Edit, Trash2 } from "lucide-react";
import type { EmailConfigRecord } from "../types";
import { formatDate } from "../constants";

interface EmailConfigTabProps {
    emailConfigs: EmailConfigRecord[];
    onOpenCreateModal: () => void;
    onOpenEdit: (config: EmailConfigRecord) => void;
    onDelete: (id: string) => void;
}

export const EmailConfigTab: React.FC<EmailConfigTabProps> = ({
    emailConfigs,
    onOpenCreateModal,
    onOpenEdit,
    onDelete,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const totalPages = Math.ceil(emailConfigs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedConfigs = emailConfigs.slice(startIndex, endIndex);

    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="space-y-6">
            <Card
                title="Email Configuration"
                actions={
                    <Button onClick={onOpenCreateModal}>
                        Add Email Config
                    </Button>
                }
            >
                {emailConfigs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="text-5xl">📧</div>
                        <p className="text-base font-semibold text-slate-700">
                            No email configurations yet
                        </p>
                        <p className="max-w-md text-sm text-slate-500">
                            Click "Add Email Config" to set up SMTP email configuration for
                            sending notifications.
                        </p>
                    </div>
                ) : (
                    <div className="-mx-4 overflow-x-auto md:mx-0">
                        <table className="min-w-[1100px] w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest text-slate-500">
                                    <th className="px-4 py-3">Display Name</th>
                                    <th className="px-4 py-3">Sent Email</th>
                                    <th className="px-4 py-3">Hostname</th>
                                    <th className="px-4 py-3">Port</th>
                                    <th className="px-4 py-3">Protocol</th>
                                    <th className="px-4 py-3">CC Email</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {paginatedConfigs.map((config) => (
                                    <tr
                                        key={config.id}
                                        className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4 font-medium">
                                            {config.displayName}
                                        </td>
                                        <td className="px-4 py-4">{config.sentEmail}</td>
                                        <td className="px-4 py-4">{config.hostname}</td>
                                        <td className="px-4 py-4">{config.port}</td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                {config.protocol}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {config.ccEmail ? (
                                                <span className="text-slate-700">
                                                    {config.ccEmail}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-500">
                                            {formatDate(config.createdAt)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onOpenEdit(config)}
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => onDelete(config.id)}
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

                        {emailConfigs.length > 0 && (
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
                                        Showing {startIndex + 1} to {Math.min(endIndex, emailConfigs.length)} of {emailConfigs.length} entries
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
