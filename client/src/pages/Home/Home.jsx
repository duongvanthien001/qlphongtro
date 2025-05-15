import React from "react";
import "./Home.css";
import Main from "../../components/Home/Main";
import Reviews from "../../components/Home/Reviews";
import Footer from "../../components/Home/Footer";

const Home = () => {
  return (
    <div>
      {/* Main Section */}
      <Main />

      {/* Reviews Section */}
      <Reviews />

      <Footer />
    </div>
  );
};

export default Home;
