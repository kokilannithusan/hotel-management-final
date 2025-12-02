import React from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { HotelForm } from "../types";

interface HotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    form: HotelForm;
    setForm: (form: HotelForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveLogo: () => void;
    submitLabel: string;
}

export const HotelModal: React.FC<HotelModalProps> = ({
    isOpen,
    onClose,
    title,
    form,
    setForm,
    onSubmit,
    onLogoUpload,
    onRemoveLogo,
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
                    <Input
                        label="Hotel Name"
                        placeholder="Emerald Oasis Resort"
                        value={form.hotelName}
                        onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
                        required
                    />
                    <Input
                        label="Address"
                        placeholder="42 Beach Road, Southern Province"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        required
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="City"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            required
                        />
                        <Input
                            label="Country"
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Phone Number"
                            value={form.phoneNumber}
                            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        label="Website"
                        placeholder="https://yourhotel.com"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        required
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                            Logo Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onLogoUpload}
                            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500">
                            Upload a square image (PNG, JPG, GIF) up to 2MB.
                        </p>
                        {form.logoUrl && (
                            <div className="flex items-center gap-4">
                                <img
                                    src={form.logoUrl}
                                    alt="Preview"
                                    className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={onRemoveLogo}
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
};
