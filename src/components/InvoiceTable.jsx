import React, { useRef, useState } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ScrollButtons from "./ScrollButtons";
import SortableTableRow from "./SortableTableRow";

const InvoiceTable = ({
  items,
  onInputChange,
  onDelete,
  onReorder,
  onRowColorChange,
}) => {
  const [dragMode, setDragMode] = useState(null);
  const scrollContainerRef = useRef(null);

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
        delay: 100,
        tolerance: 5,
        pressureThreshold: 0,
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
      <div className="lg:hidden">
        <ScrollButtons scrollContainer={scrollContainerRef} />
      </div>
      <div className="overflow-x-auto relative" ref={scrollContainerRef}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
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
            <tbody>
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableTableRow
                    key={item.id}
                    item={item}
                    items={items}
                    columns={columns}
                    onInputChange={onInputChange}
                    onDelete={onDelete}
                    onColorChange={onRowColorChange}
                    onReorder={onReorder}
                    dragMode={dragMode}
                    setDragMode={setDragMode}
                  />
                ))}
              </SortableContext>
            </tbody>
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
                    .reduce(
                      (sum, item) => sum + (parseFloat(item.total) || 0),
                      0
                    )
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
        </DndContext>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default InvoiceTable;
