import React from "react";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical, Paintbrush } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  columns,
  onInputChange,
  onDelete,
  onColorChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: item.backgroundColor || "#ffffff",
    color: getContrastTextColor(item.backgroundColor || "#ffffff"),
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

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="group border-b border-gray-200"
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
              className="p-1 transition-colors mr-1"
              style={{
                color: getContrastTextColor(item.backgroundColor || "#ffffff"),
              }}
            >
              <Paintbrush className="w-3 h-3" />
            </button>
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical
                className="w-3 h-3"
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
                              ["quantity", "unitPrice", "finalTotal"].includes(
                                column.id
                              )
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

const InvoiceTable = ({
  items,
  onInputChange,
  onDelete,
  onReorder,
  onRowColorChange,
}) => {
  const columns = [
    { id: "orderDate", label: "DAT", width: "100px" },
    { id: "finish", label: "XONG", width: "100px" },
    { id: "companyName", label: "CTY", width: "150px" },
    { id: "quantity", label: "SL", width: "70px" },
    { id: "unitPrice", label: "1 CAI", width: "80px" },
    { id: "total", label: "TIEN", width: "90px" },
    { id: "dollar", label: "$", width: "30px" },
    { id: "companyOrderDate", label: "NGAY CK", width: "100px" },
    { id: "finalTotal", label: "CK", width: "80px" },
    { id: "actions", label: "", width: "40px" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
      toast.success("Row order updated");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="border-r border-gray-200 px-2 py-1.5 font-medium text-left"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <tbody>
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableTableRow
                    key={item.id}
                    item={item}
                    columns={columns}
                    onInputChange={onInputChange}
                    onDelete={onDelete}
                    onColorChange={onRowColorChange}
                  />
                ))}
              </SortableContext>
            </tbody>
          </DndContext>

          <tfoot>
            <tr className="bg-gray-50">
              <td
                colSpan="3"
                className="text-right px-2 py-1.5 border-r border-gray-200"
              >
                Totals:
              </td>
              <td className="text-right px-2 py-1.5 border-r border-gray-200">
                {items
                  .reduce(
                    (sum, item) => sum + (parseFloat(item.quantity) || 0),
                    0
                  )
                  .toFixed(0)}
              </td>
              <td className="text-right px-2 py-1.5 border-r border-gray-200">
                {items
                  .reduce(
                    (sum, item) => sum + (parseFloat(item.unitPrice) || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td className="text-right px-2 py-1.5 border-r border-gray-200">
                {items
                  .reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
                  .toFixed(2)}
              </td>
              <td className="border-r border-gray-200"></td>
              <td className="border-r border-gray-200"></td>
              <td className="text-right px-2 py-1.5 border-r border-gray-200">
                {items
                  .reduce(
                    (sum, item) => sum + (parseFloat(item.finalTotal) || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default InvoiceTable;
