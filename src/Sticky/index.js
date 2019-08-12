import React, { useEffect, useRef, useContext } from 'react'

import {
  StickyProvider,
  useStickyDispatch,
  useStickyState,
  ActionType,
  StickySectionContext,
} from './Context'

import styles from './index.module.scss'

const noop = () => {}

function Sticky({ children, as: Component = 'div', ...rest }) {
  const { topRef } = useContext(StickySectionContext)
  const dispatch = useStickyDispatch()

  const addStickyRef = stickyRef => {
    dispatch({
      type: ActionType.addStickyRef,
      payload: { key: topRef, value: stickyRef },
    })
  }

  return (
    <Component ref={addStickyRef} {...rest} className={styles.sticky}>
      {children}
    </Component>
  )
}

function StickySection({
  as: Component = 'section',
  onChange = noop,
  onStuck = noop,
  onUnstuck = noop,
  children,
  ...rest
}) {
  const topRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    const container = topRef.current
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          let type = ''
          if (entry.isIntersecting) {
            type = 'unstuck'
            onUnstuck(entry)
          } else {
            type = 'stuck'
            onStuck(entry)
          }

          onChange({ type, entry })
        })
      },
      { threshold: [0] }
    )

    container && observer.observe(container)

    return () => observer.unobserve(container)
  }, [topRef, onChange, onStuck, onUnstuck])

  const value = { topRef, bottomRef }
  return (
    <StickySectionContext.Provider value={value}>
      <Component className={styles.sticky__section} {...rest}>
        <div ref={topRef} className={styles.sticky__sentinel_top}>
          sentinel top
        </div>
        {children}
        <div ref={bottomRef} className={styles.sticky__sentinel_bottom}>
          sentinel bottom
        </div>
      </Component>
    </StickySectionContext.Provider>
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
