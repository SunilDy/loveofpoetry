import { isPropertyAccessChain } from "typescript";

type PrimaryButtonProps = {
  children: React.ReactNode;
  handleOnClick: () => void;
  classNames?: string;
  buttonClassNames?: string;
  isDisabled?: boolean;
};

export const PrimaryButton = ({
  children,
  handleOnClick,
  classNames,
  buttonClassNames,
  isDisabled,
}: PrimaryButtonProps) => {
  return (
    <div className={`${classNames}`}>
      <button
        className={`
              bg-white text-purple-500
              md:px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
              lg:text-md xsm:text-sm
              border-2 border-white
              md:font-semibold
              ${buttonClassNames}
              disabled:cursor-not-allowed
            `}
        onClick={handleOnClick}
        disabled={isDisabled}
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
  buttonClassNames,
}: PrimaryButtonProps) => {
  return (
    <div className={`${classNames}`}>
      <button
        className={`
              bg-transparent text-white
              md:px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
              border-2 border-white border-opacity-30
              lg:text-md xsm:text-sm
              md:font-semibold
              ${buttonClassNames}
            `}
        onClick={handleOnClick}
      >
        {children}
      </button>
    </div>
  );
};
