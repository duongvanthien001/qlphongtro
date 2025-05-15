import React from "react";
import { FaStar, FaUser, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Tiện lợi, giao diện đẹp",
      description:
        "Tôi rất thích phần mềm quản lý nhà trọ (phòng trọ) vì rất tiện lợi, phòng của tôi không nhiều nhưng trước khi biết đến ứng dụng tôi phải quản lý sổ sách rất cực. Giờ thì khoẻ hơn nhiều. Cảm ơn !",
      rating: 4.5,
      user: {
        id: 1,
        name: "Chị Lê Thị Ca",
        role: "Chủ Trọ",
      },
    },
    {
      id: 2,
      name: "Tăng hiệu suất và tối ưu hoá doanh thu",
      description:
        "Với phần mềm quản lý nhà trọ (phòng trọ), tôi đã tăng hiệu suất trong việc quản lý nhà trọ của mình. Tôi có thể quản lý và tạo hóa đơn một cách nhanh chóng và hiệu quả.",
      rating: 5,
      user: {
        id: 2,
        name: "Ông Bảo Huỳnh",
        role: "Chủ Trọ",
      },
    },
    {
      id: 3,
      name: "Hỗ trợ khách hàng tốt",
      description:
        "Tôi đã nhận được sự hỗ trợ tuyệt vời từ đội ngũ phát triển phần mềm quản lý nhà trọ (phòng trọ). Họ đã luôn sẵn sàng trả lời câu hỏi và giải quyết các vấn đề mà tôi gặp phải. Điều này tạo ra sự tin tưởng và hài lòng của tôi!",
      rating: 4,
      user: {
        id: 3,
        name: "Anh Nguyễn Long",
        role: "Chủ Trọ",
      },
    },
  ];

  return (
    <section className="reviews">
      <div className="container">
        <h2>Cảm Nhận Từ Khách Hàng</h2>
        <div className="review-cards">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="top">
                <div className="rating text-warning">
                  {[...Array(Math.ceil(review.rating))].map(() => (
                    <>
                      <FaStar size={16} />{" "}
                    </>
                  ))}

                  {review.rating % 1 !== 0 && <FaStarHalfAlt size={16} />}
                  {[...Array(5 - Math.ceil(review.rating))].map(() => (
                    <>
                      <FaRegStar size={16} />{" "}
                    </>
                  ))}
                </div>
                <h3 className="text-primary">{review.name}</h3>
                <p>{review.description}</p>
              </div>

              <div className="bottom">
                <FaUser className="icon" size={50} />
                <div>
                  <h5>{review.user.name}</h5>
                  <p>{review.user.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
