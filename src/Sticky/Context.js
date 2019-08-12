import React, { createContext, useContext, useReducer } from 'react'

const initialState = {
  containerRef: null,
  stickyRefs: new Map(),
}

const StickyStateContext = createContext(initialState)
const StickyDispatchContext = createContext()

const ActionType = {
  setContainerRef: 'set container ref',
  addStickyRef: 'add sticky ref',
}

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case ActionType.setContainerRef:
      // Reassigning a new ref, will infinitely re-load!
      return Object.assign(state, { containerRef: payload.containerRef })
    case ActionType.addStickyRef:
      const { sectionRef, topSentinelRef, bottomSentinelRef, value } = payload
      // console.log(
      //   `ActionType.addStickyRef topSentinelRef.currunt, bottomSentinelRef.current, value`,
      //   topSentinelRef.current,
      //   bottomSentinelRef.current,
      //   value
      // )
      state.stickyRefs.set(sectionRef.current, value)
      state.stickyRefs.set(topSentinelRef.current, value)
      state.stickyRefs.set(bottomSentinelRef.current, value)

      return Object.assign(state, {
        stickyRefs: state.stickyRefs,
      })
    default:
      return state
  }
}

function StickyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StickyStateContext.Provider value={state}>
      <StickyDispatchContext.Provider value={dispatch}>
        {children}
      </StickyDispatchContext.Provider>
    </StickyStateContext.Provider>
  )
}

function useStickyState() {
  const context = useContext(StickyStateContext)
  if (context === undefined)
    throw Error('"useStickyState should be used under "StickyStateContext')
  return context
}

function useStickyDispatch() {
  const context = useContext(StickyDispatchContext)
  if (context === undefined)
    throw Error(
      '"useStickyDispatch should be used under "StickyDispatchContext'
    )
  return context
}

const StickySectionContext = createContext()

export {
  StickyProvider,
  useStickyState,
  useStickyDispatch,
  ActionType,
  StickySectionContext,
}
