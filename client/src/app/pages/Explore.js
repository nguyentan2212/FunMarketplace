import React, { useState, useEffect, useContext } from "react";
import { createGlobalStyle } from "styled-components";
import { navigate } from "@reach/router";
import Footer from "../../app/components/footer";
import { getAllOrders } from "../../scripts/exchange";
import NftList from "../components/NftList";
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
    color: rgba(255, 255, 255, .5);;
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

function Explore() {
  const { searchString, setSearchString } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const torders = await getAllOrders(searchString);
      
      setOrders(torders);
    };
    fetchData();
  }, [searchString]);

  const searchHandler = (e) => {
    e.preventDefault();
    setSearchString(search);
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
                <h1 className="text-center">Explore</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 50, paddingBottom: 50 }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <form
                className="row w-100"
                id="form_quick_search"
                name="form_quick_search"
                onSubmit={searchHandler}>
                <div className="col-lg-6">
                  <input
                    style={{ width: 300 }}
                    className="form-control"
                    id="name_1"
                    name="search"
                    placeholder="search item here..."
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                  />{" "}
                  <button type="submit" id="btn-submit">
                    <i className="fa fa-search bg-color-secondary"></i>
                  </button>
                  <div className="clearfix"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 0, paddingBottom: 50 }}>
        {orders && <NftList nfts={orders} />}
      </section>
      <Footer />
    </div>
  );
}

export default Explore;
