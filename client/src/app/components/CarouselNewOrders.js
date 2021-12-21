import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NftCard from "./NftCard";
import { getAllOrders } from "../../scripts/exchange";

function CustomSlide(props) {
  const { index, ...childProps } = props;
  return <div {...childProps}></div>;
}

var settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  adaptiveHeight: 300,
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

function CarouselNewOrders() {
  const [height, setHeight] = useState(0);
  const [nfts, setNfts] = useState([]);

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      if (img.offsetHeight > 320) {
        setHeight(300);
      } else {
        setHeight(img.offsetHeight);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const torders = await getAllOrders();
      if (torders.length < 8) {
        setNfts(torders);
      } else {
        setNfts(torders.slice(0, 7));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="nft">
      <Slider {...settings}>
        {nfts &&
          nfts.map((nft, index) => (
            <CustomSlide className="itm" index={index} key={index}>
              <NftCard
                className="mb-2 me-2"
                address={nft.tokenAddress}
                id={nft.tokenId}
                key={index}
                onImgLoad={onImgLoad}
                height={height}
                price={nft.price}
              />
            </CustomSlide>
          ))}
      </Slider>
    </div>
  );
}

export default CarouselNewOrders;
