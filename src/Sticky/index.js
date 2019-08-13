import React, { useEffect, useRef, useContext, useState } from 'react'

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
  const { sectionRef, topSentinelRef, bottomSentinelRef } = useContext(
    StickySectionContext
  )
  const dispatch = useStickyDispatch()

  // So that we can retrieve correct child target element
  // from either a top sentinel or a bottom sentinel
  const addStickyRef = stickyRef => {
    dispatch({
      type: ActionType.addStickyRef,
      payload: {
        sectionRef,
        topSentinelRef,
        bottomSentinelRef,
        value: stickyRef,
      },
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
  const sectionRef = useRef(null)
  const topSentinelRef = useRef(null)
  const bottomSentinelRef = useRef(null)

  const { stickyRefs, containerRef } = useStickyState()
  const [sentinelMarginTop, setSentinelMarginTop] = useState(0)

  useEffect(() => {
    if (!containerRef) return
    if (!containerRef.current) return
    const root = containerRef.current

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const target = stickyRefs.get(entry.target)
          const targetInfo = entry.boundingClientRect
          const rootBoundsInfo = entry.rootBounds

          // console.log(
          //   `target , targetInfo, rootBoundsInfo`,
          //   target,
          //   targetInfo,
          //   rootBoundsInfo
          // )

          let type = ''

          // Stopped sticking.
          if (
            targetInfo.bottom >= rootBoundsInfo.top &&
            targetInfo.bottom < rootBoundsInfo.bottom
          ) {
            type = 'unstuck'
            onUnstuck(target)
          }
          // Started sticking.
          else if (targetInfo.top < rootBoundsInfo.top) {
            type = 'stuck'
            onStuck(target)
          }

          onChange({ type, target })
        })
      },
      { threshold: [0], root }
    )

    const topSentinelNode = topSentinelRef.current
    topSentinelNode && observer.observe(topSentinelNode)
    return () => observer.unobserve(topSentinelNode)
  }, [topSentinelRef, onChange, onStuck, onUnstuck, stickyRefs, containerRef])

  useEffect(() => {
    const topSentinel = stickyRefs.get(topSentinelRef.current)
    const topStyle = window.getComputedStyle(topSentinel)
    const marginTop = topStyle.getPropertyValue('margin-top')

    setSentinelMarginTop(parseFloat(marginTop))
  }, [stickyRefs])

  const value = { sectionRef, topSentinelRef, bottomSentinelRef }
  return (
    <StickySectionContext.Provider value={value}>
      <Component ref={sectionRef} className={styles.sticky__section} {...rest}>
        <div
          ref={topSentinelRef}
          style={{ marginTop: `-${sentinelMarginTop}px` }}
          className={styles.sticky__sentinel_top}
        >
          sentinel top
        </div>
        {children}
        <div
          ref={bottomSentinelRef}
          style={{
            height: `${sentinelMarginTop}px`,
          }}
          className={styles.sticky__sentinel_bottom}
        >
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
