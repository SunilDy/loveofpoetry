import { Montserrat } from "@next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

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
    <div className={`${classNames} ${montserrat.className}`}>
      <button
        className={`
              bg-primary text-secondary
              md:px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
              lg:text-md xsm:text-sm
              border-2 border-primary
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
    <div className={`${classNames} ${montserrat.className}`}>
      <button
        className={`
              bg-transparent text-primary
              md:px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
              accent-border
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
