import {useState, useEffect} from 'react';
import { initContract } from '../ethereum';
const FunNFT = require("../../contracts/FunNFT.json");

const useNft = (tokenAddress, tokenId) => {
    const [name, setName] = useState(null);
    const [symbol, setSymbol] = useState(null);
    const [uri, setUri] = useState(null);
    const [data, setData] = useState(null);
    const [image, setImage] = useState(null);
    const [creator, setCreator] = useState(null);
    const [royalty, setRoyalty] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = await initContract(FunNFT, tokenAddress);
            const tname = await token.name();
            const tsymbol = await token.symbol();
            const turi = await token.tokenURI();
            const tcreator = await token.creatorOf(tokenId);
            const troyalty = await token.royaltyOf(tokenId);

            setName(tname);
            setSymbol(tsymbol);
            setUri(turi);
            setCreator(tcreator);
            setRoyalty(troyalty);
        }
    },[tokenAddress, tokenId]);
    return {name, symbol, uri, data, image, creator, royalty};
}

export default useNft;