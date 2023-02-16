type ModalType = {
  //   handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleDivClose?: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
};

const Modal = ({ handleDivClose, children }: ModalType) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-center items-center xsm:px-6 lg:px-20 h-full
      bg-white bg-opacity-10 backdrop-blur-2xl
      `}
      // onClick={handleDivClose}
      onClick={() => {}}
    >
      {children}
    </div>
  );
};

export default Modal;
