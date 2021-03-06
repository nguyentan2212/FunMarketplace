import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllCollections } from "../../scripts/tokenFactory";
import { navigate } from "@reach/router";

function CustomSlide(props) {
  const { index, ...prop } = props;
  return <div {...prop}></div>;
}

var settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1900,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
      }
    }
  ]
};

function CarouselCollection() {
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const tcols = await getAllCollections();
      setCollections(tcols);
      if (tcols.length < 8) {
        setCollections(tcols);
      } else {
        setCollections(tcols.slice(0, 7));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="nft">
      {collections && (
        <Slider {...settings}>
          {collections.map((collection, index) => (
            <CustomSlide className="itm" index={index} key={index}>
              <div className="nft_coll">
                <div className="nft_wrap">
                  <span>
                    <img src={collection.thumbnail} className="lazy img-fluid" alt="" />
                  </span>
                </div>
                <div className="nft_coll_info">
                  <span onClick={() => navigate(`/collection/${collection.address}`)}>
                    <h4>{collection.name}</h4>
                  </span>
                  <span>{collection.symbol}</span>
                </div>
              </div>
            </CustomSlide>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default CarouselCollection;
