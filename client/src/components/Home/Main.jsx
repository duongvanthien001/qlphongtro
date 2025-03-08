import React from "react";
import housevid from "../../assets/housevideo.mp4";

export default function Main() {
  return (
    <section className="main">
      <div className="main-text">
        <video autoPlay muted loop>
          <source src={housevid} type="video/mp4" />
        </video>
        <div className="main-text-content">
          <div className="container">
            <h1>Phần mềm Quản Lý Nhà Trọ</h1>
            <p>
              Với công nghệ 4.0, Phần mềm quản lý Nhà Trọ (phòng trọ) là một ứng
              dụng dành cho các chủ nhà trọ hoặc quản lý nhà trọ để giúp họ quản
              lý và điều hành các hoạt động hàng ngày của nhà trọ một cách hiệu
              quả.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
