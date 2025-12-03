import React, { useState } from "react";
import { useHotel } from "../../context/HotelContext";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { generateId } from "../../utils/formatters";
import { MealPlan as MealPlanEntity } from "../../types/entities";
import { Edit, Trash2, Plus, X, Check } from "lucide-react";

export const MealPlan: React.FC = () => {
  const { state, dispatch } = useHotel();
  const [showModal, setShowModal] = useState(false);
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlanEntity | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    perPersonRate: 0,
    perRoomRate: 0,
    isActive: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleEdit = (mealPlan: MealPlanEntity) => {
    setEditingMealPlan(mealPlan);
    setFormData({
      name: mealPlan.name,
      code: mealPlan.code,
      description: mealPlan.description,
      perPersonRate: mealPlan.perPersonRate,
      perRoomRate: mealPlan.perRoomRate || 0,
      isActive: mealPlan.isActive,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingMealPlan(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      perPersonRate: 0,
      perRoomRate: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingMealPlan) {
      dispatch({
        type: "UPDATE_MEAL_PLAN",
        payload: {
          ...editingMealPlan,
          ...formData,
          perRoomRate: formData.perRoomRate || undefined,
        },
      });
    } else {
      dispatch({
        type: "ADD_MEAL_PLAN",
        payload: {
          id: generateId(),
          ...formData,
          perRoomRate: formData.perRoomRate || undefined,
        },
      });
    }
    setShowModal(false);
  };

  const handleDelete = (mealPlan: MealPlanEntity) => {
    if (window.confirm(`Are you sure you want to delete ${mealPlan.name}?`)) {
      dispatch({ type: "DELETE_MEAL_PLAN", payload: mealPlan.id });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(state.mealPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMealPlans = state.mealPlans.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const columns = [
    { key: "name", header: "Name" },
    { key: "code", header: "Code" },
    { key: "description", header: "Description" },
    {
      key: "actions",
      header: "Actions",
      render: (mp: MealPlanEntity) => (
        <div className="flex gap-2">
          <Button
            aria-label="Edit meal plan"
            title="Edit meal plan"
            size="sm"
            variant="outline"
            onClick={() => handleEdit(mp)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            aria-label="Delete meal plan"
            title="Delete meal plan"
            size="sm"
            variant="danger"
            onClick={() => handleDelete(mp)}
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
            Meal Plans
          </h1>
          <p className="text-slate-600 mt-1 font-medium">
            Manage meal plan options and pricing
          </p>
        </div>
        <Button
          aria-label="Add meal plan"
          title="Add meal plan"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Card>
        <Table columns={columns} data={paginatedMealPlans} />

        {/* Pagination Controls */}
        {state.mealPlans.length > 0 && (
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
                Showing {startIndex + 1} to {Math.min(endIndex, state.mealPlans.length)} of {state.mealPlans.length} entries
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
        title={editingMealPlan ? "Edit Meal Plan" : "Add Meal Plan"}
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
            label="Code"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
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
        </div>
      </Modal>
    </div>
  );
};
