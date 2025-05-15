import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container d-flex justify-content-between">
        <div className="footer-links">
          <h4>Mọi thắc mắc liên hệ </h4>
          <ul className="mb-0">
            <li>
              <a href="tel:0866825756">Số điện thoại: 0866825756</a>
            </li>
            <li>
              <a href="mailto:nbduongsv2dz@gmail.com">
                Email: nbduongsv2dz@gmail.com
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>
            Cảm ơn bạn đã sử dụng dịch vụ quản lý phòng trọ của chúng tôi. Chúng
            tôi cam kết mang đến trải nghiệm tốt nhất và hỗ trợ bạn mọi lúc!
          </h4>
        </div>
      </div>
    </footer>
  );
}
