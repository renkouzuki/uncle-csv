import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Toaster, toast } from "sonner";

const InvoiceTable = ({ items, onInputChange, onDelete }) => {
  const totals = items.reduce(
    (acc, item) => ({
      quantity: acc.quantity + (parseFloat(item.quantity) || 0),
      unitPrice: acc.unitPrice + (parseFloat(item.unitPrice) || 0),
      total: acc.total + (parseFloat(item.total) || 0),
      finalTotal: acc.finalTotal + (parseFloat(item.finalTotal) || 0),
    }),
    {
      quantity: 0,
      unitPrice: 0,
      total: 0,
      finalTotal: 0,
    }
  );

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Your existing file upload logic here
        toast.success("CSV imported successfully!", {
          description: `Imported ${items.length} rows from ${file.name}`,
        });
      } catch (error) {
        toast.error("Failed to import CSV", {
          description: "Please check your file format and try again",
        });
      }
    }
    event.target.value = "";
  };

  const handleSaveCSV = () => {
    try {
      // Your existing CSV save logic here
      toast.success("CSV exported successfully!", {
        description: "Your invoice data has been saved",
      });
    } catch (error) {
      toast.error("Failed to export CSV", {
        description: "Please try again",
      });
    }
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-sm text-gray-100">
          <colgroup>
            <col className="w-[120px]" />
            <col className="w-[100px]" />
            <col className="w-[180px]" />
            <col className="w-[100px]" />
            <col className="w-[100px]" />
            <col className="w-[120px]" />
            <col className="w-[40px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
            <col className="w-[40px]" />
          </colgroup>

          <thead>
            <tr className="bg-gray-800 h-8">
              <th className="border-r border-gray-700 text-left px-2 font-medium text-gray-200">
                Order Date
              </th>
              <th className="border-r border-gray-700 text-left px-2 font-medium text-gray-200">
                Status
              </th>
              <th className="border-r border-gray-700 text-left px-2 font-medium text-gray-200">
                Company Name
              </th>
              <th className="border-r border-gray-700 text-right px-2 font-medium text-gray-200">
                Quantity
              </th>
              <th className="border-r border-gray-700 text-right px-2 font-medium text-gray-200">
                Unit Price
              </th>
              <th className="border-r border-gray-700 text-right px-2 font-medium text-gray-200">
                Total
              </th>
              <th className="border-r border-gray-700 text-center px-2 font-medium text-gray-200">
                $
              </th>
              <th className="border-r border-gray-700 text-left px-2 font-medium text-gray-200">
                Company Order
              </th>
              <th className="border-r border-gray-700 text-right px-2 font-medium text-gray-200">
                Final Total
              </th>
              <th></th>
            </tr>
          </thead>

          <tbody className="bg-gray-900">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-800/50 h-8 transition-colors"
              >
                <td className="p-0 border-r border-gray-700">
                  <Input
                    type="date"
                    value={item.orderDate}
                    onChange={(e) =>
                      onInputChange(item.id, "orderDate", e.target.value)
                    }
                    className="h-7 min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 rounded-none
                             bg-transparent text-gray-100"
                  />
                </td>
                <td className="p-0 border-r border-gray-700">
                  <Select
                    value={item.finish}
                    onValueChange={(value) => {
                      onInputChange(item.id, "finish", value);
                      toast.success(`Status updated to ${value}`);
                    }}
                  >
                    <SelectTrigger
                      className="h-7 min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 
                                            rounded-none bg-transparent text-gray-100"
                    >
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-0 border-r border-gray-700">
                  <Input
                    value={item.companyName}
                    onChange={(e) =>
                      onInputChange(item.id, "companyName", e.target.value)
                    }
                    placeholder="Company name"
                    className="h-7 min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 rounded-none
                             bg-transparent text-gray-100"
                  />
                </td>
                <td className="p-0 border-r border-gray-700">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onInputChange(item.id, "quantity", e.target.value)
                    }
                    placeholder="Qty"
                    className="h-7 text-end min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 rounded-none
                             bg-transparent text-gray-100"
                  />
                </td>
                <td className="p-0 border-r border-gray-700">
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      onInputChange(item.id, "unitPrice", e.target.value)
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="h-7 text-end min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 rounded-none
                             bg-transparent text-gray-100"
                  />
                </td>
                <td className="px-2 text-right border-r border-gray-700">
                  ${item.total.toFixed(2)}
                </td>
                <td className="text-center border-r border-gray-700">$</td>
                <td className="p-0 border-r border-gray-700">
                  <Input
                    type="date"
                    value={item.companyOrderDate}
                    onChange={(e) =>
                      onInputChange(item.id, "companyOrderDate", e.target.value)
                    }
                    className="h-7 min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 rounded-none
                             bg-transparent text-gray-100"
                  />
                </td>
                <td className="p-0 border-r border-gray-700">
                  <Input
                    type="number"
                    value={item.finalTotal}
                    onChange={(e) =>
                      onInputChange(item.id, "finalTotal", e.target.value)
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="h-7 text-end min-h-0 px-1 py-0 text-sm border-0 focus:ring-1 focus:ring-blue-500 rounded-none
                             bg-transparent text-gray-100"
                  />
                </td>
                <td className="w-10 p-0 text-center">
                  <button
                    onClick={() => {
                      onDelete(item.id);
                      toast.success("Row deleted");
                    }}
                    className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-800 h-8 font-medium">
              <td
                colSpan="3"
                className="text-right px-2 border-r border-gray-700 text-gray-200"
              >
                Totals:
              </td>
              <td className="text-right px-2 border-r border-gray-700 text-gray-200">
                {totals.quantity.toFixed(0)}
              </td>
              <td className="text-right px-2 border-r border-gray-700 text-gray-200">
                ${totals.unitPrice.toFixed(2)}
              </td>
              <td className="text-right px-2 border-r border-gray-700 text-gray-200">
                ${totals.total.toFixed(2)}
              </td>
              <td className="border-r border-gray-700"></td>
              <td className="border-r border-gray-700"></td>
              <td className="text-right px-2 border-r border-gray-700 text-gray-200">
                ${totals.finalTotal.toFixed(2)}
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
