import { create } from "ipfs-http-client";

function getClient() {
  const projectId = process.env.REACT_APP_INFURA_ID;
  const projectSecret = process.env.REACT_APP_INFURA_SECRET;

  const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth
    }
  });

  return client;
}

export async function storeData(data) {
  const client = getClient();
  // post to ipfs
  const { cid } = await client.add(data, { pin: true });
  // get path
  const uri = `https://ipfs.infura.io/ipfs/${cid}`;
  return uri;
}

export async function storeNft(imageFile, description) {
  // store image on ipfs
  const imagePath = await storeData(imageFile);
  // create nft json data file
  const nftJson = JSON.stringify({ imagePath, description });
  // store nft data to ipfs
  const nftPath = await storeData(nftJson);
  console.log(nftPath);
  return nftPath;
}
