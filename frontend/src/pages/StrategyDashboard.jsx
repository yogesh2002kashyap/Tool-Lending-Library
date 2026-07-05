import { useEffect, useMemo, useState } from 'react';
import StrategyForm from '../components/StrategyForm';
import StrategyTable from '../components/StrategyTable';
import { createStrategy, deleteStrategy, extractErrorMessage, getStrategies, updateStrategy } from '../services/strategyService';

function StrategyDashboard() {
  const [strategies, setStrategies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadStrategies = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getStrategies();
        if (isMounted) {
          setStrategies(data);
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

    void loadStrategies();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStrategies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return strategies;
    }

    return strategies.filter((strategy) => {
      const haystack = [
        strategy.strategyName,
        strategy.serviceName,
        strategy.owner,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [searchTerm, strategies]);

  const handleOpenCreate = () => {
    setEditingStrategy(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (strategy) => {
    setEditingStrategy(strategy);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStrategy(null);
    setFormError('');
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingStrategy) {
        const updatedStrategy = await updateStrategy(editingStrategy._id, payload);
        setStrategies((current) =>
          current.map((strategy) => (strategy._id === updatedStrategy._id ? updatedStrategy : strategy))
        );
      } else {
        const createdStrategy = await createStrategy(payload);
        setStrategies((current) => [createdStrategy, ...current]);
      }

      handleCloseModal();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = (strategy) => {
    setDeleteTarget(strategy);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteStrategy(deleteTarget._id);
      setStrategies((current) => current.filter((strategy) => strategy._id !== deleteTarget._id));
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
          <p className="eyebrow">Internal operations</p>
          <h1>Strategy dashboard</h1>
          <p className="dashboard-subtitle">Track service decoupling initiatives with a clear, operational view.</p>
        </div>
        <button aria-label="Add a new strategy" className="button-primary" onClick={handleOpenCreate} type="button">
          Add Strategy
        </button>
      </header>

      <section className="toolbar" aria-label="Strategy controls">
        <label className="search-field" htmlFor="strategy-search">
          <span className="sr-only">Search strategies</span>
          <input
            aria-label="Search strategies"
            id="strategy-search"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by strategy, service, or owner"
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

      <StrategyTable
        isLoading={loading}
        onDelete={handleDeleteRequest}
        onEdit={handleOpenEdit}
        strategies={filteredStrategies}
      />

      {isModalOpen ? (
        <div className="modal-overlay" role="dialog" aria-label={editingStrategy ? 'Edit strategy' : 'Create strategy'} aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingStrategy ? 'Edit strategy' : 'Create strategy'}</h2>
              <button aria-label="Close strategy form" className="icon-button" onClick={handleCloseModal} type="button">
                ×
              </button>
            </div>
            <StrategyForm
              key={editingStrategy ? editingStrategy._id : 'new'}
              initialValues={editingStrategy}
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
            <h2>Delete strategy?</h2>
            <p>
              This action will remove <strong>{deleteTarget.strategyName}</strong> from the dashboard.
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

export default StrategyDashboard;
