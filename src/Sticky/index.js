import React, { useEffect } from "react";

import {
  StickyProvider,
  useStickyDispatch,
  useStickyState,
  ActionType
} from "./Context";

let renderCount = 1;

function Sticky({ children }) {
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
    <div ref={addRef}>
      <div>sentinel top</div>
      {children}
      <div>sentinel bottom</div>
    </div>
  );
}

function StickyParent({ children, as: Component = "div", ...props }) {
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
    <Component ref={addRef} {...props}>
      {children}
    </Component>
  );
}

function StickyContainer({ children, as: Component = "div", ...rest }) {
  return (
    <StickyProvider>
      <StickyParent as={Component} {...rest}>
        {children}
      </StickyParent>
    </StickyProvider>
  );
}

export { StickyContainer, Sticky, useStickyState, useStickyDispatch };
