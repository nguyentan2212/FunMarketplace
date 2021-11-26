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

export async function storeNft(imageFile) {
  const client = getClient();
  const {cid} = await client.add(imageFile, {pin: true});
  const imageURI = `https://ipfs.infura.io/ipfs/${cid}`;
  console.log(imageURI);
  return imageURI;
}
