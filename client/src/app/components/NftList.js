import React, {useState, useEffect} from 'react'
import NftCard from './NftCard';

function NftList(props) {
    const {nfts} = props;
    const [height, setHeight] = useState(0);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    return (
        <div className='row'>
            {nfts && nfts.map( (nft, index) => (
                <NftCard address={nft.tokenAddress} id={nft.tokenId} key={index} onImgLoad={onImgLoad} height={height} price={nft.price} />
            ))}
        </div> 
    )
}

export default NftList
