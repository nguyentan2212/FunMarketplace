import { useState, useEffect } from "react";
import { initContract } from "../ethereum";
const FunNFT = require("../../contracts/FunNFT.json");

const useCollection = (collectionAddress) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [creatorAvatar, setCreatorAvatar] = useState(null);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const init = async () => {
      const tcollection = await initContract(FunNFT, collectionAddress);
      setCollection(tcollection);
      const tthumbnail = await token.getThumbnail();
      setThumbnail(tthumbnail);
    };
    init();
  }, [collectionAddress]);

  return { collection, thumbnail, creatorAvatar };
};

export default useCollection;
