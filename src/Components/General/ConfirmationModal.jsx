import './ConfirmationModal.css';
import Button from "./Button";

export function ConfirmationModal ({ onConfirm, onCancel, message, displayModal }) {

    return (
        <>
            <div id="cancel-modal" className={`modal ${displayModal ? 'modalShown' : ''}`}>
                <div className="modal-content">
                    <p>{message}</p>
                    <Button text="Confirm" onClick={onConfirm} />
                    <Button text="Cancel" onClick={onCancel} />
                </div>
            </div>
        </>
    );
}
