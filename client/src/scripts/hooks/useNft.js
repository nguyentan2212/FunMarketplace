import { useState, useEffect } from "react";
import { initContract } from "../ethereum";
import { getAccountInfo } from "../account";
const FunNFT = require("../../contracts/FunNFT.json");

const useNft = (tokenAddress, tokenId) => {
  const [title, setTitle] = useState(null);
  const [uri, setUri] = useState(null);
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState(null);
  const [creator, setCreator] = useState(null);
  const [owner, setOwner] = useState(null);
  const [royalty, setRoyalty] = useState(null);
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await initContract(FunNFT, tokenAddress);

        // collection info
        const collectionName = await token.name();
        const collectionThumbnail = await token.getThumbnail();
        setCollection({ name: collectionName, thumbnail: collectionThumbnail, address: tokenAddress });

        // token uri
        const turi = await token.tokenURI(tokenId);
        setUri(turi);

        // token data : title - image path - description
        const tdata = await fetch(turi).then((response) => response.json());
        setDescription(tdata.description);
        setImage(tdata.imagePath);
        setTitle(tdata.title);

        // token royalty
        const troyalty = await token.royaltyOf(tokenId);
        setRoyalty(troyalty.toNumber());

        // token creator
        const creatorAddress = await token.creatorOf(tokenId);
        const tcreator = await getAccountInfo(creatorAddress);

        setCreator(tcreator);

        // token owner
        const ownerAddress = await token.ownerOf(tokenId);
        const towner = await getAccountInfo(ownerAddress);
        setOwner(towner);
      } catch (e) {
        console.log(e);
        setError(e);
      }
    };
    fetchData();
  }, [tokenAddress, tokenId]);

  return error ? null : { title, uri, description, image, creator, owner, royalty, collection };
};

export default useNft;
