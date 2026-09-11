const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const todayIso = () => new Date().toISOString().slice(0, 10);

export function isValidIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(`${value}T00:00:00Z`);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function formatDate(value) {
  if (!isValidIsoDate(value)) return 'Date unavailable';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`));
}

function positiveNumber(value, label, maximum) {
  const number = Number(value);
  if (value === '' || value === null || value === undefined) {
    return `${label} is required.`;
  }
  if (!Number.isFinite(number) || number <= 0) {
    return `${label} must be greater than 0.`;
  }
  if (number > maximum)
    return `${label} must not exceed ${maximum.toLocaleString()}.`;
  return '';
}

export function validateCrop(form) {
  const errors = {};
  if (!form.name) errors.name = 'Select a crop.';
  const quantity = positiveNumber(form.quantity, 'Quantity', 100000);
  if (quantity) errors.quantity = quantity;
  if (!form.quality) errors.quality = 'Select a quality grade.';
  if (!isValidIsoDate(form.harvestDate)) {
    errors.harvestDate = 'Enter a valid harvest date.';
  } else if (form.harvestDate < '2020-01-01') {
    errors.harvestDate = 'Harvest date cannot be before 01 Jan 2020.';
  } else {
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 2);
    if (form.harvestDate > farFuture.toISOString().slice(0, 10)) {
      errors.harvestDate = 'Harvest date is too far in the future.';
    }
  }
  if (!form.status) errors.status = 'Select a crop status.';
  const price = positiveNumber(form.price, 'Current price', 1000000);
  if (price) errors.price = price;
  return errors;
}

export function validateOffer(form) {
  const errors = {};
  const quantity = positiveNumber(form.quantity, 'Quantity', 100000);
  const price = positiveNumber(form.price, 'Offer price', 1000000);
  if (quantity) errors.quantity = quantity;
  if (price) errors.price = price;
  if (form.message && form.message.trim().length > 500) {
    errors.message = 'Message must be 500 characters or fewer.';
  }
  return errors;
}

export function validateRequirement(form) {
  const errors = {};
  if (!form.crop) errors.crop = 'Select a crop.';
  const quantity = positiveNumber(form.quantity, 'Quantity required', 1000000);
  const price = positiveNumber(form.offeredPrice, 'Offered price', 1000000);
  if (quantity) errors.quantity = quantity;
  if (price) errors.offeredPrice = price;
  if (!form.quality) errors.quality = 'Select a minimum quality grade.';
  if (!isValidIsoDate(form.requiredBy)) {
    errors.requiredBy = 'Enter a valid required-by date.';
  } else if (form.requiredBy < todayIso()) {
    errors.requiredBy = 'Required-by date cannot be in the past.';
  }
  const location = form.location.trim();
  if (location.length < 3)
    errors.location = 'Enter a location of at least 3 characters.';
  if (!form.paymentTerms) errors.paymentTerms = 'Select payment terms.';
  if (form.notes && form.notes.trim().length > 500) {
    errors.notes = 'Notes must be 500 characters or fewer.';
  }
  return errors;
}
