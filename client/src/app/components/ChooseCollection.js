import React, { useState, useEffect } from "react";
import { getCurrentAccount } from "../../scripts/ethereum";
import { getCollectionsOf, getCollectionInfo } from "../../scripts/tokenFactory";

function ChooseCollection(props) {
  const { setCollection, reload } = props;
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const account = await getCurrentAccount();
      const addressList = await getCollectionsOf(account);
      const tempList = [];
      for (let i = 0; i < addressList.length; i++) {
        const item = await getCollectionInfo(addressList[i]);
        tempList[i] = item;
      }
      setCollections([...tempList]);
      //
      setCollection(tempList[0]);
    };
    fetchData();
  }, [reload]);

  const optionChange = (e) => {
    setCollection(e.target.value);
  };

  return (
    <div>
      <div className="input-group">
        <select className="form-select" onChange={optionChange}>
          {collections &&
            collections.map((collection, index) => (
              <option value={collection.address} key={index}>
                {collection.name}
              </option>
            ))}
        </select>
        <button className="btn-main" type="button" data-bs-toggle="modal" data-bs-target="#myModal">
          New
        </button>
      </div>
    </div>
  );
}

export default ChooseCollection;
