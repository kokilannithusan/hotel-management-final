import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  createRoomArea,
  getAllRoomAreas,
  updateRoomArea,
  deleteRoomArea,
} from "../../services/roomAreaServices";

export const RoomAreas: React.FC = () => {
  const [roomAreas, setRoomAreas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description?: string;
  }>({ name: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const PAGE_SIZE = 10;

  // ✅ FETCH ROOM AREAS
  const fetchRoomAreas = async () => {
    try {
      const res = await getAllRoomAreas();
      let areas: any[] = Array.isArray(res) ? res : res.data || [];

      areas = areas.filter((item) => item && item.name);

      const total = areas.length;
      setTotalPages(Math.ceil(total / PAGE_SIZE));
      setTotalItems(total);
      const start = (page - 1) * PAGE_SIZE;
      const paginated = areas.slice(start, start + PAGE_SIZE);

      setRoomAreas(paginated);
    } catch (error: any) {
      console.error("Error fetching room areas:", error);
      alert(
        `Failed to load room areas: ${error?.message || "Try again later"}`
      );
      setRoomAreas([]);
    }
  };

  useEffect(() => {
    fetchRoomAreas();
  }, [page]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const doubleSpacePattern = /\s{2,}/;
    const validAlphaPattern = /^[a-zA-Z\s]*$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (doubleSpacePattern.test(formData.name)) {
      newErrors.name = "Double spaces are not allowed";
    } else if (!validAlphaPattern.test(formData.name)) {
      newErrors.name = "Name must contain only alphabetical letters and spaces";
    }

    if (formData.description && formData.description.trim()) {
      if (doubleSpacePattern.test(formData.description)) {
        newErrors.description = "Double spaces are not allowed";
      } else if (!validAlphaPattern.test(formData.description)) {
        newErrors.description =
          "Description must contain only alphabetical letters and spaces";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setFormData({ name: room.name || "", description: room.description || "" });
    setErrors({});
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setFormData({ name: "", description: "" });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Validation failed! Please check the errors and try again.");
      return;
    }

    try {
      if (editingRoom) {
        const updatedData = {
          name: formData.name.trim(),
          description: formData.description?.trim() || "",
        };
        await updateRoomArea(BigInt(editingRoom.id), updatedData);
        alert(` Room area "${formData.name}" updated successfully!`);
      } else {
        const newData = {
          name: formData.name.trim(),
          description: formData.description?.trim() || "",
        };
        await createRoomArea(newData);
        alert(` Room area "${formData.name}" created successfully!`);
      }

      setShowModal(false);
      setPage(1); // reset to first page
      fetchRoomAreas();
    } catch (error: any) {
      console.error("Error saving room area:", error);
      alert(` Failed to save room area: ${error?.message || "Unknown error"}`);
    }
  };

  const handleDeleteArea = async (
    areaId: string | number | undefined,
    areaName?: string
  ) => {
    if (!areaId) {
      alert(" Error: Room area ID is missing. Please refresh and try again.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete the room area "${areaName || areaId}"?`
      )
    )
      return;

    try {
      await deleteRoomArea(BigInt(areaId));
      alert(` Room area "${areaName || areaId}" deleted successfully!`);
      fetchRoomAreas();
    } catch (error: any) {
      console.error("Error deleting room area:", error);
      alert(
        ` Failed to delete room area: ${error?.message || "Unknown error"}`
      );
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "description",
      header: "Description",
      render: (room: any) => room.description || "",
    },
    {
      key: "actions",
      header: "Actions",
      render: (room: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(room)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteArea(room?.id, room?.name)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Room Areas
          </h1>
          <p className="text-slate-600 mt-1 font-medium">
            Define different areas or zones in your hotel
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          New Room Area
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={roomAreas} />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Page {page} of {totalPages} | Total: {totalItems} room areas
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRoom ? "Edit Room Area" : "Add New Room Area"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <X className="w-4 h-4" />
            </Button>
            <Button onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., East Wing, Sea View"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="e.g., Rooms with sea view, Easy access rooms"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
