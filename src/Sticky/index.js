import React, { useEffect } from "react";

import {
  StickyProvider,
  useStickyDispatch,
  useStickyState,
  ActionType
} from "./Context";

let renderCount = 1;

function Sticky({ children, as: Component = "div", ...rest }) {
  const state = useStickyState();
  const dispatch = useStickyDispatch();

  const addStickyRef = stickyRef => {
    dispatch({ type: ActionType.addStickyRef, payload: { stickyRef } });
  };

  useEffect(() => {
    console.log(`child state`, state, renderCount++);
  }, [state]);

  return (
    <Component ref={addStickyRef} {...rest}>
      {children}
    </Component>
  );
}

function StickySection({ children, as: Component = "section", ...rest }) {
  return (
    <Component {...rest}>
      <div>sentinel top</div>
      {children}
      <div>sentinel bottom</div>
    </Component>
  );
}

function StickyRoot({ children, as: Component = "div", ...rest }) {
  const state = useStickyState();
  const dispatch = useStickyDispatch();

  const addContainerRef = containerRef => {
    dispatch({ type: ActionType.setContainerRef, payload: { containerRef } });
  };

  // useEffect(() => {
  //   console.log(`Sticky Parent state`, state);
  // }, [state]);

  return (
    <Component ref={addContainerRef} {...rest}>
      {children}
    </Component>
  );
}

function StickyContainer({ children, as: Component = "div", ...rest }) {
  return (
    <StickyProvider>
      <StickyRoot as={Component} {...rest}>
        {children}
      </StickyRoot>
    </StickyProvider>
  );
}

export {
  StickyContainer,
  StickySection,
  Sticky,
  useStickyState,
  useStickyDispatch
};
