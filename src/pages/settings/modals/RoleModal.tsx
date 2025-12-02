import React from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { RoleForm, HotelRecord } from "../types";

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    form: RoleForm;
    setForm: (form: RoleForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    hotels: HotelRecord[];
    submitLabel: string;
}

export const RoleModal: React.FC<RoleModalProps> = ({
    isOpen,
    onClose,
    title,
    form,
    setForm,
    onSubmit,
    hotels,
    submitLabel,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
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
                    <Select
                        label="Hotel"
                        value={form.hotelId}
                        onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
                        options={[
                            { value: "", label: "Select a hotel" },
                            ...hotels.map((hotel) => ({
                                value: hotel.id,
                                label: hotel.name,
                            })),
                        ]}
                        required
                    />
                    <Input
                        label="Role Name"
                        placeholder="e.g., Manager"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <p className="text-sm text-slate-500">
                        Select a hotel and enter a descriptive role name.
                    </p>
                </div>
            </form>
        </Modal>
    );
};
