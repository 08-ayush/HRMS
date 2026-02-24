export function Loader() {
    return (
        <div className="loader-wrapper">
            <div className="spinner" />
        </div>
    );
}

export function EmptyState({ icon = "📭", title, message }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <h4>{title}</h4>
            <p>{message}</p>
        </div>
    );
}

export function ErrorBanner({ message, onRetry }) {
    return (
        <div className="error-banner">
            ⚠️ {message}
            {onRetry && (
                <button className="btn btn-ghost btn-sm" onClick={onRetry} style={{ marginLeft: "auto" }}>
                    Retry
                </button>
            )}
        </div>
    );
}

export function SuccessBanner({ message }) {
    return <div className="success-banner">✅ {message}</div>;
}

export function Modal({ title, children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function ConfirmModal({ title, message, onConfirm, onCancel, danger }) {
    return (
        <Modal title={title} onClose={onCancel}>
            <div className="modal-body">
                <p className="confirm-text">{message}</p>
            </div>
            <div className="modal-footer">
                <button className="btn btn-ghost" onClick={onCancel}>
                    Cancel
                </button>
                <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
                    Confirm
                </button>
            </div>
        </Modal>
    );
}
