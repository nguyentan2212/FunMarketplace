import React, { useContext } from "react";
import { navigate } from "@reach/router";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { getCurrentAccount } from "../../scripts/ethereum";
import { getAccountInfo } from "../../scripts/account";
import { AppContext } from "../../scripts/contexts/AppProvider";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

function Wallet() {
  const { login } = useContext(AppContext);
  const signin = async () => {
    const address = await getCurrentAccount();
    const user = await getAccountInfo(address);
    login(user);
    navigate("/home");
  };
  return (
    <div>
      <GlobalStyles />

      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}>
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Wallet</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-3 mb30" onClick={signin}>
            <span className="box-url">
              <span className="box-url-label">Most Popular</span>
              <img src="./img/wallet/1.png" alt="" className="mb20" />
              <h4>Metamask</h4>
              <p>
                Start exploring blockchain applications in seconds. Trusted by over 1 million users
                worldwide.
              </p>
            </span>
          </div>

          <div className="col-lg-3 mb30">
            <span className="box-url">
              <img src="./img/wallet/2.png" alt="" className="mb20" />
              <h4>Bitski</h4>
              <p>
                Bitski connects communities, creators and brands through unique, ownable digital
                content.
              </p>
            </span>
          </div>

          <div className="col-lg-3 mb30">
            <span className="box-url">
              <img src="./img/wallet/3.png" alt="" className="mb20" />
              <h4>Fortmatic</h4>
              <p>Let users access your Ethereum app from anywhere. No more browser extensions.</p>
            </span>
          </div>

          <div className="col-lg-3 mb30">
            <span className="box-url">
              <img src="./img/wallet/4.png" alt="" className="mb20" />
              <h4>WalletConnect</h4>
              <p>
                Open source protocol for connecting decentralised applications to mobile wallets.
              </p>
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Wallet;
