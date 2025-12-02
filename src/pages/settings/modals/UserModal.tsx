import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { UserForm, HotelRecord } from "../types";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    form: UserForm;
    setForm: (form: UserForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    hotels: HotelRecord[];
    roleOptions: { value: string; label: string }[];
    submitLabel: string;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    title,
    form,
    setForm,
    onSubmit,
    hotels,
    roleOptions,
    submitLabel,
}) => {
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const roleDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (roleOptions.length === 0) {
            setIsRoleDropdownOpen(false);
        }
    }, [roleOptions.length]);

    const handleToggleRoleSelection = (roleId: string) => {
        setForm({
            ...form,
            roleIds: form.roleIds.includes(roleId)
                ? form.roleIds.filter((id) => id !== roleId)
                : [...form.roleIds, roleId],
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="6xl"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit}>{submitLabel}</Button>
                </>
            }
        >
            <form onSubmit={onSubmit}>
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Input
                            label="First Name"
                            placeholder="John"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            required
                        />
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Input
                            label="Phone"
                            placeholder="+94 77 123 4567"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                        <Input
                            label="Address"
                            placeholder="123 Main Street"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            required
                        />
                        <Input
                            label="NIC"
                            placeholder="123456789V"
                            value={form.nic}
                            onChange={(e) => setForm({ ...form, nic: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Country"
                            placeholder="Sri Lanka"
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            required
                        />
                        <Input
                            label="City"
                            placeholder="Colombo"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            required
                        />
                    </div>
                    <Select
                        label="Hotel"
                        value={form.hotelId}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                hotelId: e.target.value,
                                roleIds: [],
                            });
                        }}
                        options={[
                            { value: "", label: "Select a hotel" },
                            ...hotels.map((hotel) => ({
                                value: hotel.id,
                                label: hotel.name,
                            })),
                        ]}
                        required
                    />
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Roles</p>
                        {!form.hotelId ? (
                            <p className="text-sm text-slate-500">
                                Select a hotel first to view available roles.
                            </p>
                        ) : roleOptions.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No roles are assigned to this hotel yet. Assign roles before
                                adding users.
                            </p>
                        ) : (
                            <>
                                <div ref={roleDropdownRef} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
                                        className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-2.5 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span className="truncate">
                                            {form.roleIds.length > 0
                                                ? `${form.roleIds.length} role${form.roleIds.length > 1 ? "s" : ""
                                                } selected`
                                                : "Select role(s)"}
                                        </span>
                                        <svg
                                            className={`h-4 w-4 text-slate-500 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    {isRoleDropdownOpen && (
                                        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl">
                                            <div className="max-h-60 overflow-auto py-2">
                                                {roleOptions.map((option) => {
                                                    const isSelected = form.roleIds.includes(
                                                        option.value
                                                    );
                                                    return (
                                                        <label
                                                            key={option.value}
                                                            className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                checked={isSelected}
                                                                onChange={() =>
                                                                    handleToggleRoleSelection(option.value)
                                                                }
                                                            />
                                                            <span
                                                                className={
                                                                    isSelected
                                                                        ? "font-semibold text-slate-900"
                                                                        : ""
                                                                }
                                                            >
                                                                {option.label}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">
                                    {form.roleIds.length > 0
                                        ? "Selected: " +
                                        roleOptions
                                            .filter((option) =>
                                                form.roleIds.includes(option.value)
                                            )
                                            .map((option) => option.label)
                                            .join(", ")
                                        : "Choose one or more roles to assign to this user."}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
};
