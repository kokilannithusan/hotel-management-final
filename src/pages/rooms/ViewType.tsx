import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ViewType as ViewTypeEntity } from '../../types/entities';
import { Edit, Trash2, Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateId } from '../../utils/formatters';
import { createViewType, getAllViewTypes, updateviewtype, deleteviewtype } from "../../services/viewTypeServices";


export const ViewType: React.FC = () => {
  const { state, dispatch } = useHotel();
  const [showModal, setShowModal] = useState(false);
  const [editingViewType, setEditingViewType] = useState<ViewTypeEntity | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [viewTypes, setViewTypes] = useState<ViewTypeEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleEdit = (viewType: ViewTypeEntity) => {
    setEditingViewType(viewType);
    setFormData({
      name: viewType.name,
    });
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllViewTypes();
        const viewTypesWithIds = data.map((vt: any) => ({
          id: vt.id || generateId(),
          name: vt.name,
        }));
        setViewTypes(viewTypesWithIds);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingViewType(null);
    setFormData({ name: '' });
    setShowModal(true);
  };

  const handleSave = async (newRoomData: { name: string }) => {
    try {

      const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

      if (!namePattern.test(newRoomData.name)) {
        alert("Name must contain only letters and single spaces (e.g., 'John Doe').");
        return;
      }

      if (editingViewType) {
        await updateviewtype(BigInt(editingViewType.id), newRoomData);
        const updatedViewType = { ...editingViewType, ...newRoomData };
        dispatch({
          type: "UPDATE_VIEW_TYPE",
          payload: updatedViewType
        });
        setViewTypes(viewTypes.map(vt => vt.id === editingViewType.id ? updatedViewType : vt));
        alert("View Type updated successfully!");
      } else {
        const response = await createViewType(newRoomData);
        const newViewType = { id: response.data.id || generateId(), ...response.data };
        dispatch({ type: "ADD_VIEW_TYPE", payload: newViewType });
        setViewTypes([...viewTypes, newViewType]);
        setCurrentPage(1);
        alert("View Type added successfully!");
      }

      setShowModal(false);
      setFormData({ name: "" });
      setEditingViewType(null);

    } catch (error: any) {
      console.error(editingViewType ? "Edit Error:" : "Add Error:", error);
      alert(error.response?.data?.message || (editingViewType ?
        "Failed to update view type" : "Failed to add view type"));
    }
  };



  const handleDelete = async (viewType: ViewTypeEntity) => {
    if (!window.confirm(`Are you sure you want to delete ${viewType.name}?`)) return;

    try {
      await deleteviewtype(BigInt(viewType.id));
      dispatch({ type: 'DELETE_VIEW_TYPE', payload: viewType.id });
      const updatedViewTypes = viewTypes.filter(vt => vt.id !== viewType.id);
      setViewTypes(updatedViewTypes);
      if (currentPage > Math.ceil(updatedViewTypes.length / itemsPerPage) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      alert("Delete view type Successfully");
    } catch (error: any) {
      console.error(error);
      alert("Failed to delete view type");
    }
  };


  const columns = [
    { key: 'name', header: 'Name' },

    {
      key: 'actions',
      header: 'Actions',
      render: (vt: ViewTypeEntity) => (
        <div className="flex gap-2">
          <Button aria-label="Edit view type" title="Edit view type" size="sm" variant="outline" onClick={() => handleEdit(vt)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button aria-label="Delete view type" title="Delete view type" size="sm" variant="danger" onClick={() => handleDelete(vt)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(viewTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedViewTypes = viewTypes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            View Types
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Manage room view types and pricing</p>
        </div>
        <Button aria-label="Add view type" title="Add view type" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Card>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : Array.isArray(viewTypes) && viewTypes.length > 0 ? (
          <>
            <Table columns={columns} data={paginatedViewTypes} />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Page {currentPage} of {totalPages} | Total: {viewTypes.length} view types
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p>No view types found</p>
        )}
      </Card>


      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingViewType ? 'Edit View Type' : 'Add View Type'}
        footer={
          <>
            <Button aria-label="Cancel" title="Cancel" variant="secondary" onClick={() => setShowModal(false)}>
              <X className="w-4 h-4" />
            </Button>
            <Button
              aria-label="Save"
              title="Save"
              onClick={() => handleSave({ name: formData.name })}              >
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

        </div>
      </Modal>
    </div>
  );
};


