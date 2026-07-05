function ToolTable({ tools, onEdit, onDelete, isLoading }) {
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

  if (tools.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No tools found.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="tool-table">
        <thead>
          <tr>
            <th scope="col">Tool</th>
            <th scope="col">Category</th>
            <th scope="col">Borrower</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool._id}>
              <td>
                <div className="table-primary">
                  <strong>{tool.toolName}</strong>
                  <span>{tool.condition}</span>
                </div>
              </td>
              <td>{tool.category}</td>
              <td>{tool.borrower || '—'}</td>
              <td>
                <span className={`status-pill ${tool.status.toLowerCase()}`}>
                  {tool.status}
                </span>
              </td>
              <td>
                <div className="action-group">
                  <button
                    aria-label={`Edit tool ${tool.toolName}`}
                    className="link-button"
                    onClick={() => onEdit(tool)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    aria-label={`Delete tool ${tool.toolName}`}
                    className="link-button destructive"
                    onClick={() => onDelete(tool)}
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

export default ToolTable;
