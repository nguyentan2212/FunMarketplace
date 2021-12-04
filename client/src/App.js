import React, { useEffect } from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./components/menu/ScrollToTop";
import Header from "./components/menu/header";
import { createGlobalStyle } from "styled-components";
import Home from "./app/pages/home";
import Create from "./app/pages/create";
import { initWeb3 } from "./scripts/ethereum";

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
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
    </div>
  );
}

export default App;
