type PrimaryButtonProps = {
  children: React.ReactNode;
  handleOnClick: () => void;
  classNames?: string;
};

export const PrimaryButton = ({
  children,
  handleOnClick,
  classNames,
}: PrimaryButtonProps) => {
  return (
    <div className={`${classNames}`}>
      <button
        className={`
              bg-white text-purple-500
              px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
            `}
        onClick={handleOnClick}
      >
        {children}
      </button>
    </div>
  );
};

export const SecondaryButton = ({
  children,
  handleOnClick,
  classNames,
}: PrimaryButtonProps) => {
  return (
    <div className={`${classNames}`}>
      <button
        className={`
              bg-transparent text-white
              px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
              border-2 border-white border-opacity-30
            `}
        onClick={handleOnClick}
      >
        {children}
      </button>
    </div>
  );
};
