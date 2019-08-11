import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import { StickyContainer, Sticky } from "./Sticky";

function App() {
  return (
    <div className="App">
      <StickyContainer as="section">
        <Sticky>
          <h1>Sticky Header 1</h1>
        </Sticky>
        <article>1 -- Some content under the sticky header</article>
        <Sticky>
          <h1>Sticky Header 2</h1>
        </Sticky>
        <article>2 -- Some content under the sticky header</article>
      </StickyContainer>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
