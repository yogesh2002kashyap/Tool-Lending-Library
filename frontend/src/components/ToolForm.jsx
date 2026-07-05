import { useState } from 'react';

const emptyForm = {
  toolName: '',
  category: '',
  condition: 'Good',
  status: 'Available',
  borrower: '',
  description: '',
};

const requiredFields = ['toolName', 'category', 'condition', 'description'];

const fieldLabels = {
  toolName: 'Tool name',
  category: 'Category',
  condition: 'Condition',
  status: 'Status',
  borrower: 'Borrower',
  description: 'Description',
};

function ToolForm({ initialValues, onSubmit, onCancel, isSubmitting, serverError }) {
  const [formData, setFormData] = useState(initialValues || emptyForm);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = (values) => {
    const errors = {};

    requiredFields.forEach((field) => {
      if (!String(values[field] || '').trim()) {
        errors[field] = `${fieldLabels[field]} is required`;
      }
    });

    if (!['Excellent', 'Good', 'Fair', 'Damaged'].includes(values.condition || '')) {
      errors.condition = 'Select a valid condition';
    }

    if (!['Available', 'Borrowed', 'Maintenance'].includes(values.status || '')) {
      errors.status = 'Select a valid status';
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setValidationErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validate(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(formData).filter(([key]) =>
        ['toolName', 'category', 'condition', 'status', 'borrower', 'description'].includes(key)
      )
    );

    onSubmit(payload);
  };

  return (
    <form className="tool-form" onSubmit={handleSubmit} noValidate>
      {serverError ? (
        <div className="form-banner" role="alert">
          {serverError}
        </div>
      ) : null}

      <div className="form-grid">
        <label className="field">
          <span>Tool name</span>
          <input
            aria-label="Tool name"
            aria-invalid={Boolean(validationErrors.toolName)}
            className={validationErrors.toolName ? 'invalid' : ''}
            name="toolName"
            onChange={handleChange}
            placeholder="e.g. Cordless Drill"
            type="text"
            value={formData.toolName}
          />
          {validationErrors.toolName ? <small>{validationErrors.toolName}</small> : null}
        </label>

        <label className="field">
          <span>Category</span>
          <input
            aria-label="Category"
            aria-invalid={Boolean(validationErrors.category)}
            className={validationErrors.category ? 'invalid' : ''}
            name="category"
            onChange={handleChange}
            placeholder="e.g. Power Tools"
            type="text"
            value={formData.category}
          />
          {validationErrors.category ? <small>{validationErrors.category}</small> : null}
        </label>

        <label className="field">
          <span>Condition</span>
          <select
            aria-label="Condition"
            aria-invalid={Boolean(validationErrors.condition)}
            className={validationErrors.condition ? 'invalid' : ''}
            name="condition"
            onChange={handleChange}
            value={formData.condition}
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Damaged">Damaged</option>
          </select>
          {validationErrors.condition ? <small>{validationErrors.condition}</small> : null}
        </label>

        <label className="field">
          <span>Status</span>
          <select
            aria-label="Status"
            aria-invalid={Boolean(validationErrors.status)}
            className={validationErrors.status ? 'invalid' : ''}
            name="status"
            onChange={handleChange}
            value={formData.status}
          >
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          {validationErrors.status ? <small>{validationErrors.status}</small> : null}
        </label>

        <label className="field field-full">
          <span>Description</span>
          <textarea
            aria-label="Description"
            aria-invalid={Boolean(validationErrors.description)}
            className={validationErrors.description ? 'invalid' : ''}
            name="description"
            onChange={handleChange}
            placeholder="Describe the tool and any usage notes"
            rows="4"
            value={formData.description}
          />
          {validationErrors.description ? <small>{validationErrors.description}</small> : null}
        </label>

        <label className="field field-full">
          <span>Borrower</span>
          <input
            aria-label="Borrower"
            aria-invalid={Boolean(validationErrors.borrower)}
            className={validationErrors.borrower ? 'invalid' : ''}
            name="borrower"
            onChange={handleChange}
            placeholder="e.g. Jordan Miles"
            type="text"
            value={formData.borrower}
          />
          {validationErrors.borrower ? <small>{validationErrors.borrower}</small> : null}
        </label>
      </div>

      <div className="form-actions">
        <button aria-label="Cancel tool form" className="button-secondary" onClick={onCancel} type="button">
          Cancel
        </button>
        <button aria-label="Submit tool form" className="button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving…' : 'Save tool'}
        </button>
      </div>
    </form>
  );
}

export default ToolForm;
