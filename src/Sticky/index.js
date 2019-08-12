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
  const { topRef, bottomRef } = useContext(StickySectionContext)
  const dispatch = useStickyDispatch()

  // So that we can retrieve correct child target element
  // from either a top sentinel or a bottom sentinel
  const addStickyRef = stickyRef => {
    dispatch({
      type: ActionType.addStickyRef,
      payload: { topRef, bottomRef, value: stickyRef },
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
  const { stickyRefs, containerRef } = useStickyState()
  const [sentinelHeight, setSentinelHeight] = useState(0)

  useEffect(() => {
    const container = topRef.current
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const container = containerRef.current
          const target = stickyRefs.get(entry.target)

          const targetInfo = entry.boundingClientRect
          const rootBoundsInfo = entry.rootBounds

          let type = ''
          // Started sticking.
          if (targetInfo.bottom < rootBoundsInfo.top) {
            type = 'stuck'
            onStuck(target)
          }

          // Stopped sticking.
          if (
            targetInfo.bottom >= rootBoundsInfo.top &&
            targetInfo.bottom < rootBoundsInfo.bottom
          ) {
            type = 'unstuck'
            onUnstuck(target)
          }

          // if (entry.isIntersecting) {
          //   type = 'unstuck'
          //   onUnstuck(target)
          // } else {
          //   type = 'stuck'
          //   onStuck(target)
          // }

          onChange({ type, target })
        })
      },
      { threshold: [0] }
    )

    container && observer.observe(container)

    return () => observer.unobserve(container)
  }, [topRef, onChange, onStuck, onUnstuck, stickyRefs, containerRef])

  // useEffect(() => {
  //   const container = bottomRef.current
  //   const observer = new IntersectionObserver(
  //     entries => {
  //       entries.forEach(entry => {
  //         const target = stickyRefs.get(entry.target)

  //         let type = ''
  //         if (entry.isIntersecting) {
  //           type = 'stuck'
  //           onStuck(target)
  //         } else {
  //           type = 'unstuck'
  //           onUnstuck(target)
  //         }

  //         onChange({ type, target })
  //       })
  //     },
  //     { threshold: [0] }
  //   )

  //   container && observer.observe(container)

  //   return () => observer.unobserve(container)
  // }, [bottomRef, onChange, onStuck, onUnstuck, stickyRefs])

  useEffect(() => {
    const topSentinel = stickyRefs.get(topRef.current)
    const topStyle = window.getComputedStyle(topSentinel)
    const height = topStyle.getPropertyValue('height')
    const paddingTop = topStyle.getPropertyValue('padding-top')
    const paddingBottom = topStyle.getPropertyValue('padding-bottom')
    // const marginTop = topStyle.getPropertyValue('margin-top')

    const newHeight =
      parseFloat(height) + parseFloat(paddingTop) + parseFloat(paddingBottom)
    // parseFloat(marginTop)
    setSentinelHeight(newHeight)
  }, [stickyRefs])

  const value = { topRef, bottomRef }
  return (
    <StickySectionContext.Provider value={value}>
      <Component className={styles.sticky__section} {...rest}>
        <div
          ref={topRef}
          style={{ height: `${sentinelHeight}px` }}
          className={styles.sticky__sentinel_top}
        >
          sentinel top
        </div>
        {children}
        <div
          ref={bottomRef}
          style={{
            height: `${sentinelHeight}px`,
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
