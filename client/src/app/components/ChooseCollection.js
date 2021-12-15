import React, { useState, useEffect } from "react";
import { getCurrentAccount } from "../../scripts/ethereum";
import { getCollectionsOf, getCollectionInfo, getCollection } from "../../scripts/tokenFactory";

function ChooseCollection(props) {
  const { setCollection, reload } = props;
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const defaultAddress = await getCollection(0);
      const account = await getCurrentAccount();
      const addressList = await getCollectionsOf(account);

      const tempList = [];
      const index = addressList.findIndex((x) => x == defaultAddress);
      if (index < 0) {
        tempList[0] = await getCollectionInfo(defaultAddress);
      }
      console.log(addressList);
      for (let i = 0; i < addressList.length; i++) {
        const item = await getCollectionInfo(addressList[i]);
        tempList[i] = item;
      }
      console.log(tempList);
      setCollections([...tempList]);
      //
      setCollection(tempList[0].address);
    };
    fetchData();
  }, [reload]);

  const optionChange = (e) => {
    setCollection(e.target.value);
    console.log(e.target.value);
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
        <button className="btn-main" type="button" data-bs-toggle="modal" data-bs-target="#newCollectionModal">
          New
        </button>
      </div>
    </div>
  );
}

export default ChooseCollection;
