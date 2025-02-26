export const formatAxiosError = (error) => {
  if (error.response) {
    return error.response.data.message;
  } else if (error.request) {
    return "Không thể kết nối đến máy chủ";
  } else {
    return "Đã xảy ra lỗi";
  }
};
