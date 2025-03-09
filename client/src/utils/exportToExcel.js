import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (jsonData, fileName = "data.xlsx") => {
  // Chuyển JSON thành worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData);

  // Tạo workbook và thêm worksheet vào
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Xuất file Excel dưới dạng blob
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Lưu file
  saveAs(data, fileName);
};

export default exportToExcel;
