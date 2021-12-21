import React from "react";
import SliderMain from "../components/SliderMain";
import FeatureBox from "../components/FeatureBox";
import CarouselCollection from "../components/CarouselCollection";
import CarouselNewOrders from "../components/CarouselNewOrders";
import AuthorList from "../components/authorList";
import Catgor from "../components/Catgor";
import Footer from "../components/footer";

const home = () => (
  <div>
    <section
      className="jumbotron breadcumb no-bg h-vh"
      style={{ backgroundImage: `url(${"./img/bg-shape-1.jpg"})` }}>
      <SliderMain />
    </section>

    <section className="container no-top no-bottom">
      <FeatureBox />
    </section>

    <section className="container no-bottom">
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center">
            <h2>Hot Collections</h2>
            <div className="small-border"></div>
          </div>
        </div>
        <div className="col-lg-12">
          <CarouselCollection />
        </div>
      </div>
    </section>

    <section className="container no-bottom">
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center">
            <h2>New Items</h2>
            <div className="small-border"></div>
          </div>
        </div>
        <div className="col-lg-12">
          <CarouselNewOrders />
        </div>
      </div>
    </section>

    <section className="container no-bottom">
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center">
            <h2>Top Sellers</h2>
            <div className="small-border"></div>
          </div>
        </div>
        <div className="col-lg-12">
          <AuthorList />
        </div>
      </div>
    </section>

    <Footer />
  </div>
);
export default home;
