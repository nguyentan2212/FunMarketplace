import React, { useState, useEffect } from "react";
import NftCard from "./NftCard";

function NftList(props) {
  const { nfts } = props;
  const [height, setHeight] = useState(0);

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

  return (
    <div className="row">
      {nfts &&
        nfts.map((nft, index) => (
          <NftCard
            className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4"
            address={nft.tokenAddress}
            id={nft.tokenId}
            key={index}
            onImgLoad={onImgLoad}
            height={height}
            price={nft.price}
            sellerAddress={nft.seller}
          />
        ))}
    </div>
  );
}

export default NftList;
