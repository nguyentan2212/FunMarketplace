import React from "react";
import useNft from "../../scripts/hooks/useNft";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
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

function ItemDetail(props) {
  const address = "0x253F7EB2fA01F77fD76400C17083860Bd9A7b9ED";
  const tokenId = 0;
  const item = useNft(address, tokenId);

  return (
    <div>
      <GlobalStyles />

      <section className="container">
        <div className="row mt-md-5 pt-md-4">
          <div className="col-md-6 text-center">
            <img src={item.image} className="img-fluid img-rounded mb-sm-30" alt="" />
          </div>
          <div className="col-md-6">
            <div className="item_info">
              <h2>{item.title}</h2>
              <div className="item_info_counts">
                <div className="item_info_type">
                  <i className="fa fa-image"></i>Art
                </div>
                <div className="item_info_views">
                  <i className="fa fa-eye"></i>250
                </div>
                <div className="item_info_like">
                  <i className="fa fa-heart"></i>18
                </div>
              </div>
              <p>{item.description}</p>
              <div className="row">
                <div className="me-4 mb-5 col-lg-4 col-sm-6">
                  <h6>Creator</h6>
                  <div className="item_author">
                    <div className="author_list_pp">
                      <span>
                        <img
                          className="lazy"
                          src={item.creator && item.creator.thumbnail}
                          alt=""
                          width={50}
                          height={50}
                        />
                        {item.creator && item.creator.isVerified ? (
                          <i className="fa fa-check"></i>
                        ) : null}
                      </span>
                    </div>
                    <div className="author_list_info">
                      <span>{item.creator && item.creator.username}</span>
                    </div>
                  </div>
                </div>
                <div className="me-4 mb-5 col-lg-4 col-sm-6">
                  <h6>Collection</h6>
                  <div className="item_author">
                    <div className="author_list_pp">
                      <span>
                        <img
                          className="lazy"
                          src={item.collection && item.collection.thumbnail}
                          alt=""
                          width={50}
                          height={50}
                        />
                      </span>
                    </div>
                    <div className="author_list_info">
                      <span>{item.collection && item.collection.name}</span>
                    </div>
                  </div>
                </div>
                <div className="me-4 mb-5 col-lg-4 col-sm-6">
                  <h6>Owner</h6>
                  <div className="item_author">
                    <div className="author_list_pp">
                      <span>
                        <img
                          className="lazy"
                          src={item.owner && item.owner.thumbnail}
                          alt=""
                          width={50}
                          height={50}
                        />
                        {item.owner && item.owner.isVerified ? (
                          <i className="fa fa-check"></i>
                        ) : null}
                      </span>
                    </div>
                    <div className="author_list_info">
                      <span>{item.owner && item.owner.username}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="de_tab">
                <ul className="de_nav">
                  <li id="Mainbtn1" className="active">
                    <span>History</span>
                  </li>
                </ul>

                <div className="de_tab_content">
                  <div className="tab-2 onStep fadeIn">
                    <div className="p_list">
                      <div className="p_list_pp">
                        <span>
                          <img className="lazy" src="./img/author/author-5.jpg" alt="" />
                          <i className="fa fa-check"></i>
                        </span>
                      </div>
                      <div className="p_list_info">
                        Bid <b>0.005 ETH</b>
                        <span>
                          by <b>Jimmy Wright</b> at 6/14/2021, 6:40 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list">
                      <div className="p_list_pp">
                        <span>
                          <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                          <i className="fa fa-check"></i>
                        </span>
                      </div>
                      <div className="p_list_info">
                        Bid accepted <b>0.005 ETH</b>
                        <span>
                          by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list">
                      <div className="p_list_pp">
                        <span>
                          <img className="lazy" src="./img/author/author-2.jpg" alt="" />
                          <i className="fa fa-check"></i>
                        </span>
                      </div>
                      <div className="p_list_info">
                        Bid <b>0.005 ETH</b>
                        <span>
                          by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list">
                      <div className="p_list_pp">
                        <span>
                          <img className="lazy" src="./img/author/author-3.jpg" alt="" />
                          <i className="fa fa-check"></i>
                        </span>
                      </div>
                      <div className="p_list_info">
                        Bid <b>0.004 ETH</b>
                        <span>
                          by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list">
                      <div className="p_list_pp">
                        <span>
                          <img className="lazy" src="./img/author/author-4.jpg" alt="" />
                          <i className="fa fa-check"></i>
                        </span>
                      </div>
                      <div className="p_list_info">
                        Bid <b>0.003 ETH</b>
                        <span>
                          by <b>Lori Hart</b> at 6/12/2021, 12:57 AM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* button for checkout */}
            <div className="d-flex flex-row mt-5">
              <button className="btn-main lead mb-5 mr15" >
                Remove from sale
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ItemDetail;
