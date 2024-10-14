import classNames from "classnames";

interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}

const Switch = ({ isOn, handleToggle }: SwitchProps) => {
  return (
    <div
      role="switch"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        //Space and Enter key
        if (e.key === " " || e.key === "Enter") {
          handleToggle();
        }
      }}
      className={classNames(
        "w-10 h-6 flex items-center rounded-lg p-1 cursor-pointer transition-colors duration-300",
        {
          "bg-primary-color": isOn,
          "bg-secondary-button-selected": !isOn,
        }
      )}
    >
      <div
        className={classNames(
          "bg-white w-4 h-4 rounded-md shadow-md transform transition-transform duration-300",
          {
            "translate-x-4": isOn,
            "translate-x-0": !isOn,
          }
        )}
      ></div>
    </div>
  );
};

export default Switch;
