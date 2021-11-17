import React from "react";

function ChooseCollection(props) {
  const { title, subtitle, clickHandler } = props;

  return (
    <div className="nft_coll" style={{ maxWidth: 140, maxHeight: 140 }}>
      <div className="nft_coll_info" style={{ paddingTop: 20 }}>
        <span onClick={clickHandler}>
          <h4>{title}</h4>
        </span>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export default ChooseCollection;
