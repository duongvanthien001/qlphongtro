import React from "react";
import "./Home.css";
import { FaStar } from "react-icons/fa";
import housevid from "../../assets/housevideo.mp4";

const Home = () => {
  return (
    <div className="app">
      {/* Header Section */}
      <section className="main">
        <div className="main-text">
          <video autoPlay muted loop>
            <source src={housevid} type="video/mp4" />
          </video>
          {/* <img src={homepicture} alt="Hero" /> */}
          <div className="main-text-content">
            <div className="container">
              <h1>Phần mềm Quản Lý Nhà Trọ</h1>
              <p>
                Với công nghệ 4.0, Phần mềm quản lý Nhà Trọ (phòng trọ) là một
                ứng dụng dành cho các chủ nhà trọ hoặc quản lý nhà trọ để giúp
                họ quản lý và điều hành các hoạt động hàng ngày của nhà trọ một
                cách hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="reviews">
        <h2>Cảm Nhận Từ Khách Hàng</h2>
        <div className="review-cards">
          <div className="review-card">
            <h3>Tiện lợi, giao diện đẹp</h3>
            <p>
              Tôi rất thích phần mềm quản lý nhà trọ (phòng trọ) vì rất tiện
              lợi, phòng của tôi không nhiều nhưng trước khi biết đến ứng dụng
              tôi phải quản lý sổ sách rất cực. Giờ thì khoẻ hơn nhiều. Cảm ơn !
            </p>
            <div className="rating">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            </div>
          </div>
          <div className="review-card">
            <h3>Tăng hiệu suất và tối ưu hoá doanh thu</h3>
            <p>
              Với phần mềm quản lý nhà trọ (phòng trọ), tôi đã tăng hiệu suất
              trong việc quản lý nhà trọ của mình. Tôi có thể quản lý và tạo hóa
              đơn một cách nhanh chóng và hiệu quả.
            </p>
            <div className="rating">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            </div>
          </div>
          <div className="review-card">
            <h3>Hỗ trợ khách hàng tốt</h3>
            <p>
              Tôi đã nhận được sự hỗ trợ tuyệt vời từ đội ngũ phát triển phần
              mềm quản lý nhà trọ (phòng trọ). Họ đã luôn sẵn sàng trả lời câu
              hỏi và giải quyết các vấn đề mà tôi gặp phải. Điều này tạo ra sự
              tin tưởng và hài lòng của tôi!
            </p>
            <div className="rating">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <h4>Mọi thắc mắc liên hệ </h4>
          <ul>
            <li>
              <a href="#">Số điện thoại: 0866825756</a>
            </li>
            <li>
              <a href="#">Email: nbduongsv2dz@gmail.com</a>
            </li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>
            Cảm ơn bạn đã sử dụng dịch vụ quản lý phòng trọ của chúng tôi. Chúng
            tôi cam kết mang đến trải nghiệm tốt nhất và hỗ trợ bạn mọi lúc!
          </h4>
        </div>
      </footer>
    </div>
  );
};

export default Home;
