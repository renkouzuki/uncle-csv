import InvoiceTable from "@/components/InvoiceTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);

  const emptyItem = {
    id: Date.now(),
    orderDate: new Date().toISOString().split("T")[0],
    finish: "",
    companyName: "",
    quantity: "",
    unitPrice: "",
    total: 0,
    companyOrderDate: new Date().toISOString().split("T")[0],
    finalTotal: "",
  };

  const handleAddRow = () => {
    setItems([...items, { ...emptyItem, id: Date.now() }]);
    toast.success("New row added");
  };

  const calculateRowTotal = (quantity, unitPrice) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return qty * price;
  };

  const handleInputChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [field]: value };

        if (field === "quantity" || field === "unitPrice") {
          updatedItem.total = calculateRowTotal(
            field === "quantity" ? value : item.quantity,
            field === "unitPrice" ? value : item.unitPrice
          );
        }

        return updatedItem;
      })
    );
  };

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSaveToCSV = () => {
    try {
      const exportData = items.map(({ id, ...item }) => item);
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", "invoice-items.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const parsedItems = results.data
              .filter((row) => row.companyName || row.quantity || row.unitPrice)
              .map((row) => ({
                id: Date.now() + Math.random(),
                orderDate:
                  row.orderDate || new Date().toISOString().split("T")[0],
                finish: row.finish || "",
                companyName: row.companyName || "",
                quantity: row.quantity || "",
                unitPrice: row.unitPrice || "",
                total: calculateRowTotal(row.quantity, row.unitPrice),
                companyOrderDate:
                  row.companyOrderDate ||
                  new Date().toISOString().split("T")[0],
                finalTotal: row.finalTotal || "",
              }));
            setItems(parsedItems);
            toast.success(`Imported ${parsedItems.length} rows successfully!`);
          },
          error: () => {
            toast.error("Failed to parse CSV file");
          },
        });
      } catch (error) {
        toast.error("Error processing file");
      }
    }
    event.target.value = "";
  };

  return (
    <Card className="w-full mx-auto bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="space-y-6">
          <InvoiceTable
            items={items}
            onInputChange={handleInputChange}
            onDelete={handleDelete}
          />

          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <div className="space-x-2">
              <Button
                onClick={handleAddRow}
                className="bg-[#1e293b] text-gray-200 hover:bg-[#334155] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Row
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csvUpload"
              />
              <Button
                onClick={() => document.getElementById("csvUpload").click()}
                className="bg-[#1e293b] text-gray-200 hover:bg-[#334155] transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            </div>
            <Button
              onClick={handleSaveToCSV}
              disabled={items.length === 0}
              className={`bg-[#1e293b] text-gray-200 hover:bg-[#334155] transition-colors
                     disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
