import React, { useState, useEffect } from "react";
import { generateId } from "../../utils/formatters";
import type { HotelRecord, HotelForm } from "./types";
import { emptyHotelForm, sectionColors } from "./constants";
import { HotelTab } from "./components";
import { HotelModal } from "./modals";
import {
    getHotels,
    createHotel,
    updateHotel,
    deleteHotel,
} from "../../services/settingsServices";

export const HotelSettings: React.FC = () => {
    const [hotels, setHotels] = useState<HotelRecord[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [createForm, setCreateForm] = useState<HotelForm>(emptyHotelForm);
    const [editForm, setEditForm] = useState<HotelForm>(emptyHotelForm);
    const [editingHotel, setEditingHotel] = useState<HotelRecord | null>(null);

    const colors = sectionColors.hotel;

    // Centralized function to load hotels
    const loadHotels = async () => {
        const data = await getHotels();
        setHotels(data);
    };

    useEffect(() => {
        loadHotels();
    }, []);

    // Hotel CRUD Handlers
    const handleCreateHotel = async (event: React.FormEvent) => {
        event.preventDefault();
        await createHotel(createForm);
        await loadHotels();
        setCreateForm(emptyHotelForm);
        setShowCreateModal(false);
    };

    const handleOpenEdit = (hotel: HotelRecord) => {
        setEditingHotel(hotel);
        setEditForm({
            hotelName: hotel.hotelName,
            address: hotel.address,
            logoUrl: hotel.logoUrl,
            email: hotel.email,
            phoneNumber: hotel.phoneNumber,
            city: hotel.city,
            country: hotel.country,
            website: hotel.website,
        });
        setShowEditModal(true);
    };

    const handleUpdateHotel = async () => {
        if (!editingHotel) return;
        // Build payload with only updatable fields (no id, no createdAt)
        const updatePayload = {
            hotelName: editForm.hotelName,
            address: editForm.address,
            logoUrl: editForm.logoUrl,
            email: editForm.email,
            phoneNumber: editForm.phoneNumber,
            city: editForm.city,
            country: editForm.country,
            website: editForm.website,
        };
        try {
            const result = await updateHotel(editingHotel.id, updatePayload);
            // Optimistically update UI
            setHotels((prev) => prev.map((hotel) => hotel.id === editingHotel.id ? { ...hotel, ...updatePayload } : hotel));
            setEditingHotel(null);
            setEditForm(emptyHotelForm);
            setShowEditModal(false);
            // Optionally sync with backend
            loadHotels();
        } catch (error) {
            alert("Failed to update hotel. Please try again.");
        }
    };

    const handleDeleteHotel = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this hotel?")) {
            try {
                await deleteHotel(id);
                // Optimistically update UI
                setHotels((prev) => prev.filter((hotel) => hotel.id !== id));
                // Optionally sync with backend in background
                loadHotels();
            } catch (error) {
                alert("Failed to delete hotel. Please try again.");
            }
        }
    };

    const handleHotelLogoUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        formType: "create" | "edit"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (formType === "create") {
                setCreateForm({ ...createForm, logoUrl: result });
            } else {
                setEditForm({ ...editForm, logoUrl: result });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveHotelLogo = (formType: "create" | "edit") => {
        if (formType === "create") {
            setCreateForm({ ...createForm, logoUrl: "" });
        } else {
            setEditForm({ ...editForm, logoUrl: "" });
        }
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setCreateForm(emptyHotelForm);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingHotel(null);
        setEditForm(emptyHotelForm);
    };

    return (
        <>
            <div className={`flex h-screen flex-col overflow-hidden ${colors.background}`}>
                <header
                    className={`shrink-0 rounded-xl border border-white/30 bg-gradient-to-r ${colors.header} p-4 text-white shadow-md`}
                >
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                        Settings
                    </p>
                    <h1 className="mt-2 text-xl font-bold">Hotels</h1>
                    <p className="mt-1 max-w-2xl text-xs text-white/80">
                        Manage hotel records
                    </p>
                </header>

                <main className="flex-1 overflow-hidden px-1 pb-6">
                    <div className="h-full overflow-y-auto space-y-6 pr-1">
                        <HotelTab
                            hotels={hotels}
                            onOpenCreateModal={() => setShowCreateModal(true)}
                            onOpenEdit={handleOpenEdit}
                            onDelete={handleDeleteHotel}
                        />
                    </div>
                </main>
            </div>

            {/* Modals */}
            <HotelModal
                isOpen={showCreateModal}
                onClose={closeCreateModal}
                title="Add Hotel"
                form={createForm}
                setForm={setCreateForm}
                onSubmit={handleCreateHotel}
                onLogoUpload={(e) => handleHotelLogoUpload(e, "create")}
                onRemoveLogo={() => handleRemoveHotelLogo("create")}
                submitLabel="Create Hotel"
            />

            <HotelModal
                isOpen={showEditModal}
                onClose={closeEditModal}
                title="Edit Hotel"
                form={editForm}
                setForm={setEditForm}
                onSubmit={handleUpdateHotel}
                onLogoUpload={(e) => handleHotelLogoUpload(e, "edit")}
                onRemoveLogo={() => handleRemoveHotelLogo("edit")}
                submitLabel="Save Changes"
            />
        </>
    );
};
