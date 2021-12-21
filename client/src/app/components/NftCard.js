import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
import useNft from "../../scripts/hooks/useNft";
import { fromWei } from "../../scripts/ethereum";
import { getAccountInfo } from "../../scripts/account";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

function NftCard(props) {
  const { address, id, height, onImgLoad, price, className, sellerAddress } = props;
  const [truePrice, setTruePrice] = useState(null);
  const [seller, setSeller] = useState(null);

  const nft = useNft(address, id);
  useEffect(() => {
    const init = async () => {
      if (price) {
        const temp = await fromWei(price);
        setTruePrice(temp);
      }
      if (sellerAddress) {
        const tseller = await getAccountInfo(sellerAddress);
        setSeller(tseller);
      }
    };
    init();
  }, []);

  return (
    <div className={`d-item ${className}`}>
      {nft && (
        <div className="nft__item m-0">
          <div
            className="author_list_pp"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Creator">
            <Link to={`/author/${nft.creator && nft.creator.address}`}>
              <img className="lazy" src={nft.creator ? nft.creator.avatar : ""} alt="" />
              {nft.creator && nft.creator.isVerified && <i className="fa fa-check"></i>}
            </Link>
          </div>
          <div
            className="author_list_pp"
            style={{ marginLeft: 50 }}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Owner">
            {seller ? (
              <Link to={`/author/${seller.address}`}>
                <img className="lazy" src={seller.avatar} alt="" />
                {seller.isVerified && <i className="fa fa-check"></i>}
              </Link>
            ) : (
              <Link to={`/author/${nft.owner && nft.owner.address}`}>
                <img className="lazy" src={nft.owner ? nft.owner.avatar : ""} alt="" />
                {nft.owner && nft.owner.isVerified && <i className="fa fa-check"></i>}
              </Link>
            )}
          </div>
          <div className="nft__item_wrap" style={{ height: `${height}px` }}>
            <Outer>
              <span>
                <img
                  onLoad={onImgLoad}
                  src={nft.image}
                  className="lazy nft__item_preview"
                  alt=""
                  style={{ maxHeight: 300 }}
                />
              </span>
            </Outer>
          </div>
          <div className="nft__item_info">
            <div className="d-flex justify-content-between align-items-center">
              <Link to={`/detail/${address}/${id}`}>
                <h4>{nft.title}</h4>
              </Link>
              <div className="nft__item_price">
                {truePrice ? `${truePrice} ETH` : "Not for sale"}
              </div>
            </div>
            <div className="nft__item_action mb-2">
              <Link to={`/detail/${address}/${id}`}>Buy Now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NftCard;
