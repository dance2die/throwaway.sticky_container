import React from 'react'

import {
  StickyProvider,
  useStickyDispatch,
  useStickyState,
  ActionType,
} from './Context'

import styles from './index.module.scss'
console.log(`styles`, styles)

function Sticky({ children, as: Component = 'div', ...rest }) {
  const dispatch = useStickyDispatch()

  const addStickyRef = stickyRef => {
    dispatch({ type: ActionType.addStickyRef, payload: { stickyRef } })
  }

  return (
    <Component ref={addStickyRef} {...rest} className={styles.sticky}>
      {children}
    </Component>
  )
}

function StickySection({ children, as: Component = 'section', ...rest }) {
  return (
    <Component className={styles.sticky__section} {...rest}>
      <div className={styles.sticky__sentinel_top}>sentinel top</div>
      {children}
      <div className={styles.sticky__sentinel_bottom}>sentinel bottom</div>
    </Component>
  )
}

function StickyRoot({ children, as: Component = 'div', ...rest }) {
  const dispatch = useStickyDispatch()

  const addContainerRef = containerRef => {
    dispatch({ type: ActionType.setContainerRef, payload: { containerRef } })
  }

  return (
    <Component ref={addContainerRef} {...rest}>
      {children}
    </Component>
  )
}

function StickyContainer({ children, as: Component = 'div', ...rest }) {
  return (
    <StickyProvider>
      <StickyRoot as={Component} {...rest}>
        {children}
      </StickyRoot>
    </StickyProvider>
  )
}

export {
  StickyContainer,
  StickySection,
  Sticky,
  useStickyState,
  useStickyDispatch,
}
