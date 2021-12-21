import React, { useState, useEffect, useContext } from "react";
import * as Swal from "sweetalert2";
import useNft from "../../scripts/hooks/useNft";
import Footer from "../components/footer";
import { cancellOrder, getNewestOrderOf, sell, buy } from "../../scripts/exchange";
import { createGlobalStyle } from "styled-components";
import { fromWei, getCurrentAccount, getBalance } from "../../scripts/ethereum";
import { AppContext } from "../../scripts/contexts/AppProvider";
import { Link } from "@reach/router";
import { getAccountInfo } from "../../scripts/account";

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

function ItemDetail({ address, id }) {
  const item = useNft(address, id);
  const { user, setUser } = useContext(AppContext);
  const [order, setOrder] = useState(null);
  const [price, setPrice] = useState(0);
  const [account, setAccount] = useState(null);
  const [reload, setReload] = useState(false);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const temp = await getNewestOrderOf(address, id);
      setOrder(temp);
      const tprice = temp ? await fromWei(temp.price) : "0";
      setPrice(tprice);
      const tseller = temp ? await getAccountInfo(temp.seller) : null;
      setSeller(tseller);
      const tacc = await getCurrentAccount();
      setAccount(tacc);
    };
    fetchData();
  }, [reload]);

  const removeFromSell = async () => {
    await Swal.fire({
      title: "Remove from sale",
      didOpen: async () => {
        Swal.showLoading();
        await cancellOrder(order.id);
        Swal.close();
      }
    });
    setReload(!reload);
  };

  const putOnSale = async () => {
    var error = null;
    const { value: price } = await Swal.fire({
      title: "Enter item's price",
      input: "number",
      inputLabel: "Enter item's price here",
      inputValidator: (value) => {
        if (value <= 0) {
          return "Price must greater than 0!";
        }
      }
    });

    if (price) {
      await Swal.fire({
        title: "Place order",
        didOpen: async () => {
          Swal.showLoading();
          try {
            await sell(address, id, price);
          } catch (e) {
            error = e;
          }
          Swal.close();
        }
      });
    }

    if (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
    } else {
      await Swal.fire({
        icon: "success",
        title: "Success"
      });
    }
    setReload(!reload);
  };

  const buyItem = async () => {
    var error = null;
    await Swal.fire({
      title: "Buy item",
      didOpen: async () => {
        Swal.showLoading();
        try {
          await buy(order.id, order.price);
        } catch (e) {
          error = e;
        }
        Swal.close();
      }
    });
    if (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
    } else {
      await Swal.fire({
        icon: "success",
        title: "Success"
      });
    }
    setReload(!reload);
    const tbalance = await getBalance(user.address);
    setUser((user) => ({ ...user, balance: tbalance }));
  };
  return (
    <div>
      <GlobalStyles />

      <section className="container">
        {item && (
          <div className="row mt-md-5 pt-md-4">
            <div className="col-md-5 text-center">
              <img src={item.image} className="img-fluid img-rounded mb-sm-30" alt="" />
            </div>
            <div className="col-md-7">
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
                <div className="row">
                  <div className="mb-5 col-lg-4 col-sm-6">
                    <h5>Creator</h5>
                    <div className="item_author">
                      <div className="author_list_pp">
                        <Link to={`/author/${item.creator && item.creator.address}`}>
                          <img
                            className="lazy"
                            src={item.creator && item.creator.avatar}
                            alt=""
                            width={50}
                            height={50}
                          />
                          {item.creator && item.creator.isVerified ? (
                            <i className="fa fa-check"></i>
                          ) : null}
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <span>{item.creator && item.creator.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5 col-lg-4 col-sm-6">
                    <h5>Owner</h5>
                    {seller ? (
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${seller.address}`}>
                            <img
                              className="lazy"
                              src={seller.avatar}
                              alt=""
                              width={50}
                              height={50}
                            />
                            {seller.isVerified ? <i className="fa fa-check"></i> : null}
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <span>{seller.username}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.owner && item.owner.address}`}>
                            <img
                              className="lazy"
                              src={item.owner && item.owner.avatar}
                              alt=""
                              width={50}
                              height={50}
                            />
                            {item.owner && item.owner.isVerified ? (
                              <i className="fa fa-check"></i>
                            ) : null}
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <span>{item.owner && item.owner.username}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mb-5 col-lg-4 col-sm-6">
                    <h5>Collection</h5>
                    <div className="item_author">
                      <div className="author_list_pp">
                        <Link to={`/collection/${item.collection && item.collection.address}`}>
                          <img
                            className="lazy"
                            src={item.collection && item.collection.thumbnail}
                            alt=""
                            width={50}
                            height={50}
                          />
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <span>{item.collection && item.collection.name}</span>
                      </div>
                    </div>
                  </div>
                  <h5>Description</h5>
                  <p>{item.description}</p>
                  <div className="row">
                    <div className="col-6 d-flex">
                      <h5 className="me-2">Royalty</h5>
                      <p>{item.royalty}%</p>
                    </div>
                    {order && price && (
                      <div className="col-6 d-flex">
                        <h5 className="me-2">Price</h5>
                        <p>{price} ETH</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* button for checkout */}
              <div className="d-flex flex-row mt-2 justify-content-center">
                {order && account && user.isLogin && order.seller == account && (
                  <button className="btn-main lead mb-5 mr15" onClick={removeFromSell}>
                    Remove from sale
                  </button>
                )}
                {order == null &&
                  account &&
                  user.isLogin &&
                  item.owner &&
                  account == item.owner.address && (
                    <button className="btn-main lead mb-5 mr15" onClick={putOnSale}>
                      Put on sale
                    </button>
                  )}
                {order && account && order.seller != account && (
                  <button className="btn-main lead mb-5 mr15" onClick={buyItem}>
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default ItemDetail;
