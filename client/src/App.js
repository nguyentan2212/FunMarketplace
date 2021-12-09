import React, { useEffect } from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./app/components/menu/ScrollToTop";
import Header from "./app/components/menu/header";
import { createGlobalStyle } from "styled-components";
import { initWeb3 } from "./scripts/ethereum";
import Home from "./app/pages/home";
import Create from "./app/pages/create";
import Wallet from "./app/pages/Wallet";
import ItemDetail from "./app/pages/ItemDetail";
import Author from "./app/pages/Author";

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
  useEffect(() => {
    const init = async () => {
      await initWeb3();
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
            <Redirect to="/home" />
          </Home>
          <Create path="/create" />
          <ItemDetail path="ItemDetail" />
          <Wallet path="/wallet" />
          <Author path="/author/:address"/>
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
    </div>
  );
}

export default App;
