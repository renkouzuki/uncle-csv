import InvoiceTable from "@/components/InvoiceTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { useState } from "react";
import WelcomeHeader from "@/components/WelcomeHeader";

export default function Home() {
  const [items, setItems] = useState([]);

  const emptyItem = {
    id: Date.now(),
    orderDate: new Date().toISOString().split("T")[0],
    finish: new Date().toISOString().split("T")[0],
    companyName: "",
    quantity: "",
    unitPrice: "",
    total: 0,
    companyOrderDate: new Date().toISOString().split("T")[0],
    finalTotal: "",
    backgroundColor: "#ffffff",
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

  const handleReorder = (newItems) => {
    setItems(newItems);
  };

  const handleRowColorChange = (id, color) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, backgroundColor: color } : item
      )
    );
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
                finish: row.finish || new Date().toISOString().split("T")[0],
                companyName: row.companyName || "",
                quantity: row.quantity || "",
                unitPrice: row.unitPrice || "",
                total: calculateRowTotal(row.quantity, row.unitPrice),
                companyOrderDate:
                  row.companyOrderDate ||
                  new Date().toISOString().split("T")[0],
                finalTotal: row.finalTotal || "",
                backgroundColor: row.backgroundColor || "#ffffff",
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
    <div className="p-6 max-w-[1200px] mx-auto">
      <WelcomeHeader />
      <Card className="w-full mx-auto bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-6">
            <InvoiceTable
              items={items}
              onInputChange={handleInputChange}
              onDelete={handleDelete}
              onReorder={handleReorder}
              onRowColorChange={handleRowColorChange}
            />

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="space-x-2">
                <Button
                  onClick={handleAddRow}
                  className="bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
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
                  className="bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </div>
              <Button
                onClick={handleSaveToCSV}
                disabled={items.length === 0}
                className="bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors
                     disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
