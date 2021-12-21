import React, { useEffect, useState, useContext } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { Link, navigate } from "@reach/router";
import useOnclickOutside from "react-cool-onclickoutside";
import { AppContext } from "../../../scripts/contexts/AppProvider";

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? "active" : "non-active"
      };
    }}
  />
);

const Header = function () {
  const { user, logout, setSearchString } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const closeMenu = () => {
    setOpenMenu(false);
  };

  const [showmenu, btn_icon] = useState(false);
  const [showpop, btn_icon_pop] = useState(false);
  const closePop = () => {
    btn_icon_pop(false);
  };
  const refpop = useOnclickOutside(() => {
    closePop();
  });

  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");
      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      }
      if (window.pageYOffset > sticky) {
        closeMenu();
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  const logoutHandle = () => {
    logout();
    navigate("/wallet");
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setSearchString(search);
    navigate(`/explore`);
  }
  return (
    <header id="myHeader" className="navbar white">
      <div className="container">
        <div className="row w-100-nav">
          <div className="logo px-0">
            <div className="navbar-title navbar-item my-auto">
              <NavLink to="/">
                <h2 className="navbar-brand">Fun Exchange</h2>
              </NavLink>
            </div>
          </div>

          <div className="search">
            <form
              onSubmit={searchHandler}>
              <input
                id="quick_search"
                className="xs-hide"
                placeholder="search item here..."
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
              <input type="submit" className="d-none"></input>
            </form>
          </div>

          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu && (
                <div className="menu">
                  <div className="navbar-item">
                    <NavLink to="/" onClick={() => btn_icon(!showmenu)}>
                      Home
                    </NavLink>
                  </div>

                  <div className="navbar-item">
                    <NavLink to="/explore" onClick={() => btn_icon(!showmenu)}>
                      Explore
                    </NavLink>
                  </div>
                </div>
              )}
            </Breakpoint>

            <Breakpoint xl>
              <div className="menu">
                <div className="navbar-item">
                  <NavLink to="/">
                    Home
                    <span className="lines"></span>
                  </NavLink>
                </div>
                <div className="navbar-item">
                  <NavLink to="/explore">
                    Explore
                    <span className="lines"></span>
                  </NavLink>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className="mainside">
            {!user.isLogin && (
              <div className="connect-wal">
                <NavLink to="/wallet">Connect Wallet</NavLink>
              </div>
            )}
            <div className={user.isLogin ? "d-flex align-items-center" : "logout"}>
              <NavLink to="/create">Create</NavLink>
              <div
                id="de-click-menu-profile"
                className="de-menu-profile ms-2"
                onClick={() => btn_icon_pop(!showpop)}
                ref={refpop}>
                <img src={user.avatar} alt="" />
                {showpop && (
                  <div className="popshow">
                    <div className="d-name">
                      <h4>{user.username}</h4>
                      <span className="name" onClick={() => navigate("/profile")}>
                        Set display name
                      </span>
                    </div>
                    <div className="d-balance">
                      <h4>Balance</h4>
                      {user.balance} ETH
                    </div>
                    <div className="d-wallet">
                      <h4>My Wallet</h4>
                      <span id="wallet" className="d-wallet-address">
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
                    </div>
                    <div className="d-line"></div>
                    <ul className="de-submenu-profile">
                      <li>
                        <span onClick={() => navigate(`/author/${user.address}`)}>
                          <i className="fa fa-user"></i> My profile
                        </span>
                      </li>
                      <li>
                        <span onClick={() => navigate(`/profile`)}>
                          <i className="fa fa-pencil"></i> Edit profile
                        </span>
                      </li>
                      <li>
                        <span onClick={logoutHandle}>
                          <i className="fa fa-sign-out"></i> Sign out
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>
      </div>
    </header>
  );
};
export default Header;
