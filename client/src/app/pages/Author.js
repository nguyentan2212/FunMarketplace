import React, { useState, useEffect, useContext } from "react";
import { createGlobalStyle } from "styled-components";
import NftList from "../components/NftList";
import Footer from "../components/footer";
import { getOrderOf } from "../../scripts/exchange";
import { getAccountInfo } from "../../scripts/account";
import { getAllTokenOf, getCreatedTokensOf } from "../../scripts/tokenFactory";

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

function Author({ address }) {
  const [user, setUser] = useState({ banner: null });
  const [sale, setSale] = useState([]);
  const [created, setCreated] = useState([]);
  const [owned, setOwned] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const tsale = await getOrderOf(address);
      setSale(tsale);

      var towned = await getAllTokenOf(address);
      towned = [...tsale, ...towned];
      setOwned(towned);

      var tcreated = await getCreatedTokensOf(address);
      setCreated(tcreated);

      const tuser = await getAccountInfo(address);
      setUser(tuser);
    };
    fetchData();
  }, []);
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    setOpenMenu2(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu2(false);
    setOpenMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
    setOpenMenu(false);
    setOpenMenu1(false);
    document.getElementById("Mainbtn2").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };

  return (
    <div>
      <GlobalStyles />
      {user.banner && (
        <section
          id="profile_banner"
          className="jumbotron breadcumb"
          style={{ backgroundImage: `url(${user.banner})` }}></section>
      )}

      <section className="container no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile de-flex">
              <div className="de-flex-col">
                <div className="profile_avatar">
                  {user.avatar && <img src={user.avatar} alt="" />}
                  <i className="fa fa-check"></i>
                  <div className="profile_name">
                    <h4>
                      {user.username}
                      <span className="profile_username">{user.social}</span>
                      <span id="wallet" className="profile_wallet">
                        {user.address}
                      </span>
                      <button
                        id="btn_copy"
                        title="Copy Text"
                        onClick={() => {
                          navigator.clipboard.writeText(user.address);
                        }}>
                        Copy
                      </button>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <ul className="de_nav text-left">
                <li id="Mainbtn" className="active">
                  <span onClick={handleBtnClick}>On Sale</span>
                </li>
                <li id="Mainbtn1" className="">
                  <span onClick={handleBtnClick1}>Owned</span>
                </li>
                <li id="Mainbtn2" className="">
                  <span onClick={handleBtnClick2}>Created</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {openMenu && sale && (
          <div id="zero1" className="onStep fadeIn">
            <NftList nfts={sale} />
          </div>
        )}
        {openMenu1 && created && ( 
        <div id='zero2' className='onStep fadeIn'>
         <NftList nfts={owned} />
        </div>
      )}
        {openMenu2 && owned && (
          <div id="zero3" className="onStep fadeIn">
            <NftList nfts={created} />
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default Author;
