import React, { useEffect, useRef } from 'react'

import {
  StickyProvider,
  useStickyDispatch,
  useStickyState,
  ActionType,
} from './Context'

import styles from './index.module.scss'

console.log(`styles`, styles)

const noop = () => {}

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
    // console.log(`topRef ==> `, topRef)

    const container = topRef.current
    const observer = new IntersectionObserver(
      entries => {
        // console.log(`topRef entries`, topRef, entries)
        entries.forEach(entry => {
          if (entry.isIntersecting) onUnstuck(entry)
          else onStuck(entry)

          onChange(entry)
        })
      },
      { threshold: [0] }
    )

    container && observer.observe(container)

    return () => observer.unobserve(container)
  }, [topRef, onChange, onStuck, onUnstuck])

  // useEffect(() => {
  //   observe(bottomRef)
  //   return () => unobserve(bottomRef)
  // }, [bottomRef])

  return (
    <Component className={styles.sticky__section} {...rest}>
      <div ref={topRef} className={styles.sticky__sentinel_top}>
        sentinel top
      </div>
      {children}
      <div ref={bottomRef} className={styles.sticky__sentinel_bottom}>
        sentinel bottom
      </div>
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
