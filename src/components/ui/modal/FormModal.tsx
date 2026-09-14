import { Modal } from "./index";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "max-w-4xl",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={`w-full ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </Modal>
  );
};
