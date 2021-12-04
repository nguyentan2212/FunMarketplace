import React, { useState, useEffect } from "react";
import { getCurrentAccount } from "../../scripts/ethereum";
import { getCollectionsOf, getCollectionInfo } from "../../scripts/tokenFactory";

function ChooseCollection(props) {
  const { setCollection } = props;
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
  }, []);

  useEffect(() => {
    console.log(collections);
  }, [collections]);

  const optionChange = (e) => {
    setCollection(e.target.value);
  }
  return (
    <div className="input-group">
      <select className="form-select" onChange={optionChange} value={collections[0]}>
        {collections &&
          collections.map((collection, index) => (
            <option value={collection.address} key={index}>
              {collection.name}
            </option>
          ))}
      </select>
      <button className="btn-main" type="button" id="button-addon2">New</button>
    </div>
  );
}

export default ChooseCollection;
