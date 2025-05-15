import { Pagination } from "react-bootstrap";

export const paginationItems = ({ page, limit, total, handleChangePage }) => {
  const items = [];
  const maxVisiblePages = 5; // Số trang hiển thị tối đa giữa Ellipsis
  const totalPages = Math.ceil(total / limit);

  // Nút First
  items.push(
    <Pagination.First
      key="first"
      onClick={() => handleChangePage(1)}
      disabled={page === 1}
    />
  );

  // Nút Prev
  items.push(
    <Pagination.Prev
      key="prev"
      onClick={() => handleChangePage(page - 1)}
      disabled={page === 1}
    />
  );

  // Trang đầu tiên
  items.push(
    <Pagination.Item
      key={1}
      active={1 === page}
      onClick={() => handleChangePage(1)}
    >
      {1}
    </Pagination.Item>
  );

  // Tính toán phạm vi trang hiển thị
  let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(2, endPage - maxVisiblePages + 1);
  }

  // Thêm Ellipsis nếu cần trước các trang giữa
  if (startPage > 2) {
    items.push(<Pagination.Ellipsis key="start-ellipsis" />);
  }

  // Các trang giữa
  for (let number = startPage; number <= endPage; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => handleChangePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Thêm Ellipsis nếu cần trước trang cuối
  if (endPage < totalPages - 1) {
    items.push(<Pagination.Ellipsis key="end-ellipsis" />);
  }

  // Trang cuối cùng (nếu totalPages > 1)
  if (totalPages > 1) {
    items.push(
      <Pagination.Item
        key={totalPages}
        active={totalPages === page}
        onClick={() => handleChangePage(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }

  // Nút Next
  items.push(
    <Pagination.Next
      key="next"
      onClick={() => handleChangePage(page + 1)}
      disabled={page === totalPages}
    />
  );

  // Nút Last
  items.push(
    <Pagination.Last
      key="last"
      onClick={() => handleChangePage(totalPages)}
      disabled={page === totalPages}
    />
  );

  return items;
};
