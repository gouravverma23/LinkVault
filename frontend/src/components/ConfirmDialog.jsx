import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', danger = true }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} maxWidth="max-w-md">
      <p className="text-dark-500 dark:text-dark-400 mb-6">{message || 'Are you sure? This action cannot be undone.'}</p>
      <div className="flex items-center justify-end gap-3">
        <button onClick={onClose} className="btn-secondary text-sm">
          Cancel
        </button>
        <button onClick={onConfirm} className={danger ? 'btn-danger text-sm' : 'btn-primary text-sm'}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
