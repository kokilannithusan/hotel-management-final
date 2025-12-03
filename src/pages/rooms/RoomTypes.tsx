import React, { useState } from "react";
import { useHotel } from "../../context/HotelContext";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { generateId } from "../../utils/formatters";
import { RoomType } from "../../types/entities";
import { Edit, Trash2, Plus, X, Check } from "lucide-react";

export const RoomTypes: React.FC = () => {
  const { state, dispatch } = useHotel();
  const [showModal, setShowModal] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 2,
    basePrice: 0,
    viewTypeId: "",
    amenities: [] as string[],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleEdit = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description,
      capacity: roomType.capacity,
      basePrice: roomType.basePrice,
      viewTypeId: roomType.viewTypeId || "",
      amenities: roomType.amenities || [],
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingRoomType(null);
    setFormData({
      name: "",
      description: "",
      capacity: 2,
      basePrice: 0,
      viewTypeId: "",
      amenities: [],
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingRoomType) {
      dispatch({
        type: "UPDATE_ROOM_TYPE",
        payload: {
          ...editingRoomType,
          ...formData,
          viewTypeId: formData.viewTypeId || undefined,
          amenities: formData.amenities,
        },
      });
    } else {
      dispatch({
        type: "ADD_ROOM_TYPE",
        payload: {
          id: generateId(),
          ...formData,
          viewTypeId: formData.viewTypeId || undefined,
          amenities: formData.amenities,
        },
      });
    }
    setShowModal(false);
  };

  const handleDelete = (roomType: RoomType) => {
    if (window.confirm(`Are you sure you want to delete ${roomType.name}?`)) {
      dispatch({ type: "DELETE_ROOM_TYPE", payload: roomType.id });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(state.roomTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoomTypes = state.roomTypes.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const columns = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
    {
      key: "capacity",
      header: "Capacity",
      render: (rt: RoomType) => `${rt.capacity} persons`,
    },
    {
      key: "amenitiesCount",
      header: "Amenities Count",
      render: (rt: RoomType) => {
        const count = rt.amenities?.length || 0;
        return `${count}`;
      },
    },
    {
      key: "amenities",
      header: "Amenities",
      render: (rt: RoomType) => (
        <div className="text-sm">
          {rt.amenities && rt.amenities.length > 0
            ? rt.amenities
              .map(
                (id: string) => state.amenities.find((a) => a.id === id)?.name
              )
              .filter(Boolean)
              .join(", ")
            : "—"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (rt: RoomType) => (
        <div className="flex gap-2">
          <Button
            aria-label="Edit room type"
            title="Edit room type"
            size="sm"
            variant="outline"
            onClick={() => handleEdit(rt)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            aria-label="Delete room type"
            title="Delete room type"
            size="sm"
            variant="danger"
            onClick={() => handleDelete(rt)}
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
            Room Types
          </h1>
          <p className="text-slate-600 mt-1 font-medium">
            Define and manage different room categories
          </p>
        </div>
        <Button
          aria-label="Add room type"
          title="Add room type"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          <span className="ml-2">New Room Type</span>
        </Button>
      </div>
      <Card>
        <Table columns={columns} data={paginatedRoomTypes} />

        {/* Pagination Controls */}
        {state.roomTypes.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
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
                Showing {startIndex + 1} to {Math.min(endIndex, state.roomTypes.length)} of {state.roomTypes.length} entries
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
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRoomType ? "Edit Room Type" : "Add Room Type"}
        footer={
          <>
            <Button
              aria-label="Cancel"
              title="Cancel"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button aria-label="Save" title="Save" onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
            }
            placeholder="e.g., 2"
            min="1"
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {state.amenities.map((amenity) => (
                <label key={amenity.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          amenities: [...formData.amenities, amenity.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          amenities: formData.amenities.filter(
                            (id) => id !== amenity.id
                          ),
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  {amenity.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
