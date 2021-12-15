import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
import useNft from "../../scripts/hooks/useNft";
import { fromWei } from "../../scripts/ethereum";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

function NftCard(props) {
  const { address, id, height, onImgLoad, price } = props;
  const [truePrice, setTruePrice] = useState(null);

  const nft = useNft(address, id);
  useEffect(() => {
    const init = async () => {
      if (price) {
        const temp = await fromWei(price);
        setTruePrice(temp);
      }
    };
    init();
  }, []);

  return (
    <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4">
      {nft && (
        <div className="nft__item m-0">
          <div
            className="author_list_pp"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Creator">
            <Link to="#">
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
            <Link to="#">
              <img className="lazy" src={nft.owner ? nft.owner.avatar : ""} alt="" />
              {nft.owner && nft.owner.isVerified && <i className="fa fa-check"></i>}
            </Link>
          </div>
          <div className="nft__item_wrap" style={{ height: `${height}px` }}>
            <Outer>
              <span>
                <img onLoad={onImgLoad} src={nft.image} className="lazy nft__item_preview" alt="" />
              </span>
            </Outer>
          </div>
          <div className="nft__item_info">
            <Link to={`/detail/${address}/${id}`}>
              <h4>{nft.title}</h4>
            </Link>
            <div className="nft__item_price">{truePrice ? `${truePrice} ETH` : "Not for sale"}</div>
            <div className="nft__item_action">
              <Link to={`/detail/${address}/${id}`}>Buy Now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NftCard;
