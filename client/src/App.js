import React, { useEffect, useContext } from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./app/components/menu/ScrollToTop";
import Header from "./app/components/menu/header";
import { createGlobalStyle } from "styled-components";
import { initWeb3 } from "./scripts/ethereum";
import { AppContext } from "./scripts/contexts/AppProvider";
import Home from "./app/pages/home";
import Create from "./app/pages/create";
import Wallet from "./app/pages/Wallet";
import ItemDetail from "./app/pages/ItemDetail";
import Author from "./app/pages/Author";
import { alreadyLogin, getToken } from "./scripts/localStorage";
import { getAccountInfo } from "./scripts/account";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location]);
  return children;
};

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id="routerhang">
        <div key={location.key}>
          <Router location={location}>{children}</Router>
        </div>
      </div>
    )}
  </Location>
);

function App() {
  const { user, login } = useContext(AppContext);
  useEffect(() => {
    const init = async () => {
      await initWeb3();
      if (alreadyLogin()) {
        const { address } = getToken();
        const account = await getAccountInfo(address);
        login(account);
      }
    };
    init();
  }, []);

  return (
    <div className="App">
      <GlobalStyles />
      <Header />
      <PosedRouter>
        <ScrollTop path="/">
          <Home exact path="/">
            <Redirect to="home" />
          </Home>
          {!user.isLogin && <Redirect from="/create" to="/wallet" noThrow />}
          <Create path="create" />
          <ItemDetail path="detail/:address/:id" />
          <Wallet path="wallet" />
          <Author path="author/:address" />
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
    </div>
  );
}

export default App;
