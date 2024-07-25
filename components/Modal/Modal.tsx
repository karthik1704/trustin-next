import '../Modal/modal.css';

const Modal = ({ isOpen, onClose, children }:{isOpen:boolean,onClose:()=>void, children:React.ReactNode}) => {
  if (!isOpen) return null;
  const handleContextMenu = (event:React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div  className="modal-overlay">
      <div  onContextMenu={handleContextMenu} className="modal-content">
        <button className="modal-close" onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;