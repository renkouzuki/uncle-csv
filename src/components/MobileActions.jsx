import { Plus, Save, Upload } from "lucide-react";

const MobileActions = ({
  onAddRow,
  onImport,
  onSave,
  onSaveAs,
  hasItems,
  currentFile,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
        <button
          onClick={onAddRow}
          className="flex flex-col items-center gap-1 text-blue-600"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs">Add Row</span>
        </button>

        <label className="flex flex-col items-center gap-1 text-purple-600">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-xs">Import</span>
          <input
            type="file"
            accept=".csv"
            onChange={onImport}
            className="hidden"
          />
        </label>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onSave}
            disabled={!hasItems}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hasItems
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Save className="w-6 h-6" />
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

      <div className="h-6 bg-white" />
    </div>
  );
};

export default MobileActions;
