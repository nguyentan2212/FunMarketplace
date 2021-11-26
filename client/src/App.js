import React, { useEffect, useState, useContext } from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./components/menu/ScrollToTop";
import Header from "./components/menu/header";
import { createGlobalStyle } from "styled-components";
import Home from "./app/pages/home";
import Create from "./app/pages/create";
import { initWeb3 } from "./scripts/ethereum";
import { Web3Context } from "./scripts/contexts/Web3Provider";

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
  const web3Provider = useContext(Web3Context);

  useEffect(() => {
    const init = async () => {
      const { provider, web3 } = await initWeb3();
      web3Provider.setWeb3(web3);
      web3Provider.setProvider(provider);
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
          <Create path="/create"/>
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
    </div>
  );
}

export default App;
