import { GripVertical, Paintbrush, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const getContrastTextColor = (bgColor) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

const SortableTableRow = ({
  item,
  items,
  columns,
  onInputChange,
  onDelete,
  onColorChange,
  onReorder,
  dragMode,
  setDragMode,
}) => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768 ||
      (window.innerHeight <= 768 && window.orientation !== 0)
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          (window.innerHeight <= 768 && window.orientation !== 0)
      );
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: !dragMode && isMobile,
  });

  const isActive = dragMode === item.id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: item.backgroundColor || "#ffffff",
    color: getContrastTextColor(item.backgroundColor || "#ffffff"),
    boxShadow: isActive ? "0 0 0 2px #3b82f6" : undefined,
  };

  const handleColorClick = (e) => {
    e.stopPropagation();
    const input = document.createElement("input");
    input.type = "color";
    input.value = item.backgroundColor || "#ffffff";
    input.onchange = (e) => {
      onColorChange(item.id, e.target.value);
      toast.success("Row color updated");
    };
    input.click();
  };

  const handleRowClick = () => {
    if (dragMode && dragMode !== item.id) {
      const fromIndex = items.findIndex((i) => i.id === dragMode);
      const toIndex = items.findIndex((i) => i.id === item.id);
      const newItems = arrayMove(items, fromIndex, toIndex);
      onReorder(newItems);
      setDragMode(null);
      toast.success("Row moved successfully");
    }
  };

  const handleDragClick = (e) => {
    e.stopPropagation();
    if (isMobile) {
      if (dragMode === item.id) {
        setDragMode(null);
        toast.success("Drag mode disabled");
      } else {
        setDragMode(item.id);
        toast.success("Row selected for moving. Tap another row to move here.");
      }
    }
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={handleRowClick}
      className={`group border-b border-gray-200 hover:bg-gray-50/50 ${
        dragMode && dragMode !== item.id ? "cursor-pointer" : ""
      }`}
    >
      {columns.map((column, index) => {
        if (column.id === "actions") {
          return (
            <td
              key={column.id}
              className="w-10 p-0 flex items-center justify-end"
            >
              <button
                onClick={() => {
                  onDelete(item.id);
                  toast.success("Row deleted");
                }}
                className="hover:text-red-500 p-1 transition-colors"
                style={{
                  color: getContrastTextColor(
                    item.backgroundColor || "#ffffff"
                  ),
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </td>
          );
        }

        const inputStyle = {
          color: getContrastTextColor(item.backgroundColor || "#ffffff"),
          backgroundColor: "transparent",
        };

        const extraControls = index === 0 && (
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleColorClick}
              className="p-1 transition-colors mr-1 hover:bg-gray-100 rounded"
            >
              <Paintbrush
                className="w-3.5 h-3.5"
                style={{
                  color: getContrastTextColor(
                    item.backgroundColor || "#ffffff"
                  ),
                }}
              />
            </button>
            <div
              {...(!isMobile ? { ...attributes, ...listeners } : {})}
              onClick={isMobile ? handleDragClick : undefined}
              className={`cursor-grab touch-manipulation p-1 rounded hover:bg-gray-100
                           ${isActive ? "bg-blue-100" : ""}`}
            >
              <GripVertical
                className="w-3.5 h-3.5"
                style={{
                  color: getContrastTextColor(
                    item.backgroundColor || "#ffffff"
                  ),
                }}
              />
            </div>
          </div>
        );

        return (
          <td key={column.id} className="p-0 border-r border-gray-200">
            <div className="flex items-center">
              {extraControls}
              {column.id === "total" ? (
                <div className="px-2 text-right w-full">
                  {item.total.toFixed(2)}
                </div>
              ) : column.id === "dollar" ? (
                <div className="text-center w-full">$</div>
              ) : (
                <Input
                  type={
                    ["orderDate", "finish", "companyOrderDate"].includes(
                      column.id
                    )
                      ? "date"
                      : ["quantity", "unitPrice", "finalTotal"].includes(
                          column.id
                        )
                      ? "number"
                      : "text"
                  }
                  value={item[column.id]}
                  onChange={(e) =>
                    onInputChange(item.id, column.id, e.target.value)
                  }
                  placeholder={
                    column.id === "companyName" ? "Company name" : "0"
                  }
                  step={
                    ["unitPrice", "finalTotal"].includes(column.id)
                      ? "0.01"
                      : "1"
                  }
                  className={`h-7 min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 rounded-none
                              bg-transparent w-full ${
                                [
                                  "quantity",
                                  "unitPrice",
                                  "finalTotal",
                                ].includes(column.id)
                                  ? "text-right"
                                  : ""
                              }`}
                  style={inputStyle}
                />
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default SortableTableRow;
