import { useEffect, useMemo, useState } from 'react';
import ToolForm from '../components/ToolForm';
import ToolTable from '../components/ToolTable';
import { createTool, deleteTool, extractErrorMessage, getTools, updateTool } from '../services/toolService';

function ToolDashboard() {
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTools = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getTools();
        if (isMounted) {
          setTools(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(extractErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadTools();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTools = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return tools;
    }

    return tools.filter((tool) => {
      const haystack = [tool.toolName, tool.category, tool.borrower || '']
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [searchTerm, tools]);

  const handleOpenCreate = () => {
    setEditingTool(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tool) => {
    setEditingTool(tool);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTool(null);
    setFormError('');
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingTool) {
        const updatedTool = await updateTool(editingTool._id, payload);
        setTools((current) => current.map((tool) => (tool._id === updatedTool._id ? updatedTool : tool)));
      } else {
        const createdTool = await createTool(payload);
        setTools((current) => [createdTool, ...current]);
      }

      handleCloseModal();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = (tool) => {
    setDeleteTarget(tool);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteTool(deleteTarget._id);
      setTools((current) => current.filter((tool) => tool._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Community operations</p>
          <h1>Tool lending dashboard</h1>
          <p className="dashboard-subtitle">Track available tools, borrower activity, and maintenance needs in one place.</p>
        </div>
        <button aria-label="Add a new tool" className="button-primary" onClick={handleOpenCreate} type="button">
          Add Tool
        </button>
      </header>

      <section className="toolbar" aria-label="Tool controls">
        <label className="search-field" htmlFor="tool-search">
          <span className="sr-only">Search tools</span>
          <input
            aria-label="Search tools"
            id="tool-search"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by tool, category, or borrower"
            type="search"
            value={searchTerm}
          />
        </label>
      </section>

      {error ? (
        <div className="banner error" role="alert">
          {error}
        </div>
      ) : null}

      <ToolTable
        isLoading={loading}
        onDelete={handleDeleteRequest}
        onEdit={handleOpenEdit}
        tools={filteredTools}
      />

      {isModalOpen ? (
        <div className="modal-overlay" role="dialog" aria-label={editingTool ? 'Edit tool' : 'Create tool'} aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingTool ? 'Edit tool' : 'Create tool'}</h2>
              <button aria-label="Close tool form" className="icon-button" onClick={handleCloseModal} type="button">
                ×
              </button>
            </div>
            <ToolForm
              key={editingTool ? editingTool._id : 'new'}
              initialValues={editingTool}
              isSubmitting={isSubmitting}
              onCancel={handleCloseModal}
              onSubmit={handleSubmit}
              serverError={formError}
            />
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal-overlay" role="dialog" aria-label="Confirm deletion" aria-modal="true">
          <div className="modal-card confirm-card">
            <h2>Delete tool?</h2>
            <p>
              This action will remove <strong>{deleteTarget.toolName}</strong> from the dashboard.
            </p>
            <div className="form-actions">
              <button aria-label="Cancel deletion" className="button-secondary" onClick={() => setDeleteTarget(null)} type="button">
                Cancel
              </button>
              <button aria-label="Confirm deletion" className="button-danger" disabled={isDeleting} onClick={handleDeleteConfirm} type="button">
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default ToolDashboard;
