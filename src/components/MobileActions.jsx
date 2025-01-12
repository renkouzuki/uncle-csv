import { Plus, Save, Upload, Menu } from "lucide-react";
import { useState } from "react";

const MobileActions = ({
  onAddRow,
  onImport,
  onSave,
  onSaveAs,
  hasItems,
  currentFile,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImport = (e) => {
    onImport(e);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 relative">
          <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
            <button
              onClick={onAddRow}
              className="flex flex-col items-center gap-1 text-blue-600"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs">Add Row</span>
            </button>

            <label className="flex flex-col items-center gap-1 text-purple-600">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs">Import</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onSave}
                disabled={!hasItems}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  hasItems
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Save className="w-5 h-5" />
              </button>
              <span className="text-xs text-center">
                {currentFile ? "Save" : "Save as CSV"}
              </span>
              {currentFile && (
                <span className="text-[10px] text-gray-500 truncate max-w-[80px]">
                  ({currentFile})
                </span>
              )}
            </div>
          </div>

          {onSaveAs && (
            <div className="mt-2 text-center">
              <button
                onClick={onSaveAs}
                disabled={!hasItems}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Save As New File...
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close Menu
            </button>
          </div>
          <div className="h-6 bg-white" />
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-white rounded-full p-2.5 shadow-lg border border-gray-200 flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default MobileActions;
