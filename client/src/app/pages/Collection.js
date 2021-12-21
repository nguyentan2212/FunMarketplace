import React, { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { Link } from "@reach/router";
import { getAccountInfo } from "../../scripts/account";
import { getCollectionInfo } from "../../scripts/tokenFactory";
import Footer from "../components/footer";
import NftList from "../components/NftList";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

function Collection({ address }) {
  const [collection, setCollection] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const tcollection = await getCollectionInfo(address);
      const tauthor = await getAccountInfo(tcollection.author);
      setCollection(tcollection);
      setAuthor(tauthor);
    };
    fetchData();
  }, []);
  return (
    <div>
      <GlobalStyles />
      {author && author.banner && (
        <section
          id="profile_banner"
          className="jumbotron breadcumb no-bg"
          style={{ backgroundImage: `url(${author.banner})` }}>
          <div className="mainbreadcumb"></div>
        </section>
      )}

      <section className="container d_coll no-top no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                {collection && collection.thumbnail && (
                  <div className="d_profile_img">
                    <img src={collection.thumbnail} alt="" style={{height: 150}}/>
                    <i className="fa fa-check"></i>
                  </div>
                )}
                {collection && (
                  <div className="profile_name">
                    <h4>
                      {collection.name}
                      <div className="clearfix"></div>
                      {collection.address && (
                        <span id="wallet" className="profile_wallet">
                          {collection.address}
                        </span>
                      )}
                      <button
                        id="btn_copy"
                        title="Copy Text"
                        onClick={() => {
                          navigator.clipboard.writeText(collection.address);
                        }}>
                        Copy
                      </button>
                    </h4>
                  </div>
                )}
                {author && (
                  <span className="fw-light">
                    Created by{" "}
                    <Link className="fw-bold" to={`/author/${author.address}`}>
                      {author.username}
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container no-top">
        {collection && collection.items && (
          <div id="zero1" className="onStep fadeIn">
            <NftList nfts={collection.items} />
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default Collection;
