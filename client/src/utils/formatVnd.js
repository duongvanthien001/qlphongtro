export const formatVnd = (value) => {
  return value.toLocaleString("vi", { style: "currency", currency: "VND" });
};
