import { useState } from 'react';

const emptyForm = {
  strategyName: '',
  serviceName: '',
  communicationType: '',
  description: '',
  owner: '',
  status: 'Planned',
};

const requiredFields = [
  'strategyName',
  'serviceName',
  'communicationType',
  'description',
  'owner',
];

const fieldLabels = {
  strategyName: 'Strategy name',
  serviceName: 'Service name',
  communicationType: 'Communication type',
  description: 'Description',
  owner: 'Owner',
  status: 'Status',
};

function StrategyForm({ initialValues, onSubmit, onCancel, isSubmitting, serverError }) {
  const [formData, setFormData] = useState(initialValues || emptyForm);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = (values) => {
    const errors = {};

    requiredFields.forEach((field) => {
      if (!String(values[field] || '').trim()) {
        errors[field] = `${fieldLabels[field]} is required`;
      }
    });

    if (!['Planned', 'Active', 'Deprecated'].includes(values.status || '')) {
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
        ['strategyName', 'serviceName', 'communicationType', 'description', 'owner', 'status'].includes(key)
      )
    );

    onSubmit(payload);
  };

  return (
    <form className="strategy-form" onSubmit={handleSubmit} noValidate>
      {serverError ? (
        <div className="form-banner" role="alert">
          {serverError}
        </div>
      ) : null}

      <div className="form-grid">
        <label className="field">
          <span>Strategy name</span>
          <input
            aria-label="Strategy name"
            aria-invalid={Boolean(validationErrors.strategyName)}
            className={validationErrors.strategyName ? 'invalid' : ''}
            name="strategyName"
            onChange={handleChange}
            placeholder="e.g. Domain ownership migration"
            type="text"
            value={formData.strategyName}
          />
          {validationErrors.strategyName ? <small>{validationErrors.strategyName}</small> : null}
        </label>

        <label className="field">
          <span>Service name</span>
          <input
            aria-label="Service name"
            aria-invalid={Boolean(validationErrors.serviceName)}
            className={validationErrors.serviceName ? 'invalid' : ''}
            name="serviceName"
            onChange={handleChange}
            placeholder="e.g. billing-service"
            type="text"
            value={formData.serviceName}
          />
          {validationErrors.serviceName ? <small>{validationErrors.serviceName}</small> : null}
        </label>

        <label className="field">
          <span>Communication type</span>
          <input
            aria-label="Communication type"
            aria-invalid={Boolean(validationErrors.communicationType)}
            className={validationErrors.communicationType ? 'invalid' : ''}
            name="communicationType"
            onChange={handleChange}
            placeholder="e.g. Async event"
            type="text"
            value={formData.communicationType}
          />
          {validationErrors.communicationType ? <small>{validationErrors.communicationType}</small> : null}
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
            <option value="Planned">Planned</option>
            <option value="Active">Active</option>
            <option value="Deprecated">Deprecated</option>
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
            placeholder="Describe the implementation approach"
            rows="4"
            value={formData.description}
          />
          {validationErrors.description ? <small>{validationErrors.description}</small> : null}
        </label>

        <label className="field field-full">
          <span>Owner</span>
          <input
            aria-label="Owner"
            aria-invalid={Boolean(validationErrors.owner)}
            className={validationErrors.owner ? 'invalid' : ''}
            name="owner"
            onChange={handleChange}
            placeholder="e.g. Maya Chen"
            type="text"
            value={formData.owner}
          />
          {validationErrors.owner ? <small>{validationErrors.owner}</small> : null}
        </label>
      </div>

      <div className="form-actions">
        <button aria-label="Cancel strategy form" className="button-secondary" onClick={onCancel} type="button">
          Cancel
        </button>
        <button aria-label="Submit strategy form" className="button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving…' : 'Save strategy'}
        </button>
      </div>
    </form>
  );
}

export default StrategyForm;
