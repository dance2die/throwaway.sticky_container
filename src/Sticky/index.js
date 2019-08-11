import React, { useEffect } from "react";

import {
  StickyProvider,
  useStickyDispatch,
  useStickyState,
  ActionType
} from "./Context";

let renderCount = 1;

function Sticky({ children, as: Component = "div", ...rest }) {
  // const ref = useRef(null);
  // const dispatch = useStickyDispatch();

  const addRef = current => {
    console.log(`current`, current, renderCount++);
    // setChildRefs(prev => prev.concat({ ref: { current } }));
    // dispatch({ type: ActionType.AddRef, payload: { ref } });
  };

  // useEffect(() => {
  //   dispatch({ type: ActionType.AddRef, payload: { ref } });
  //   console.log(`child ref`, ref);
  // }, [ref, dispatch]);

  return (
    <Component ref={addRef} {...rest}>
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

  const addRef = containerRef => {
    console.log(`containerRef node`, { containerRef });
    dispatch({ type: ActionType.setContainerRef, payload: { containerRef } });
  };

  useEffect(() => {
    console.log(`Sticky Parent state`, state);
  }, [state]);

  return (
    <Component ref={addRef} {...rest}>
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
