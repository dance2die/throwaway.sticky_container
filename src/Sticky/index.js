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
      payload: { key: topRef.current, value: stickyRef },
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
  const { stickyRefs } = useStickyState()

  useEffect(() => {
    const container = topRef.current
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const targetEntry = stickyRefs.get(entry.target)
          console.log(`targetEntry`, targetEntry)

          let type = ''
          if (entry.isIntersecting) {
            type = 'unstuck'
            onUnstuck(targetEntry)
          } else {
            type = 'stuck'
            onStuck(targetEntry)
          }

          onChange({ type, targetEntry })
        })
      },
      { threshold: [0] }
    )

    container && observer.observe(container)

    return () => observer.unobserve(container)
  }, [topRef, onChange, onStuck, onUnstuck, stickyRefs])

  // useEffect(() => {
  //   const container = bottomRef.current
  //   const observer = new IntersectionObserver(
  //     entries => {
  //       entries.forEach(entry => {
  //         let type = ''
  //         if (entry.isIntersecting) {
  //           type = 'stuck'
  //           onStuck(entry)
  //         } else {
  //           type = 'unstuck'
  //           onUnstuck(entry)
  //         }

  //         onChange({ type, entry })
  //       })
  //     },
  //     { threshold: [0] }
  //   )

  //   container && observer.observe(container)

  //   return () => observer.unobserve(container)
  // }, [bottomRef, onChange, onStuck, onUnstuck])

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
