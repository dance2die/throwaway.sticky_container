import React, { createContext, useContext, useReducer } from 'react'

const initialState = {
  containerRef: null,
  stickyRefs: [],
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
      return Object.assign(state, {
        stickyRefs: state.stickyRefs.concat(payload.stickyRef),
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

export { StickyProvider, useStickyState, useStickyDispatch, ActionType }