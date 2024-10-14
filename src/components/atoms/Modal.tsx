import { ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

export default function Modal({ isOpen, children }: Props) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="drop-shadow-[0_8px_16px_rgb(34,36,3,0.15)] fixed z-50 inset-0 bg-black bg-opacity-75 backdrop-blur-[4px] min-h-screen">
      <div className="flex items-center justify-center h-full w-full px-4 text-center opacity-100">
        {isOpen && (
          <div className="flex items-center justify-center h-full w-full">
            {children}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
