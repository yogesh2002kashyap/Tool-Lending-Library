function StrategyTable({ strategies, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="table-card" aria-live="polite">
        <div className="table-skeleton" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="skeleton-row" key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No strategies found.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="strategy-table">
        <thead>
          <tr>
            <th scope="col">Strategy</th>
            <th scope="col">Service</th>
            <th scope="col">Owner</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy) => (
            <tr key={strategy._id}>
              <td>
                <div className="table-primary">
                  <strong>{strategy.strategyName}</strong>
                  <span>{strategy.communicationType}</span>
                </div>
              </td>
              <td>{strategy.serviceName}</td>
              <td>{strategy.owner}</td>
              <td>
                <span className={`status-pill ${strategy.status.toLowerCase()}`}>
                  {strategy.status}
                </span>
              </td>
              <td>
                <div className="action-group">
                  <button
                    aria-label={`Edit strategy ${strategy.strategyName}`}
                    className="link-button"
                    onClick={() => onEdit(strategy)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    aria-label={`Delete strategy ${strategy.strategyName}`}
                    className="link-button destructive"
                    onClick={() => onDelete(strategy)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StrategyTable;
