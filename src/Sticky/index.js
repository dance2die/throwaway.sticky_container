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

  useEffect(() => {}, [])

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
  const [targetHeight, setTargetHeight] = useState('')
  const [sentinelMarginTop, setSentinelMarginTop] = useState('')

  // Move the sentinel up by the top margin of the sticky component
  useEffect(() => {
    const topSentinel = stickyRefs.get(topSentinelRef.current)

    const topStyle = window.getComputedStyle(topSentinel)
    const getProp = name => topStyle.getPropertyValue(name)
    const paddingtop = getProp('padding-top')
    const paddingBottom = getProp('padding-bottom')
    const height = getProp('height')
    const marginTop = getProp('margin-top')

    const targetHeight = `calc(${marginTop} +
      ${paddingtop} +
      ${height} +
      ${paddingBottom})`

    // console.log(`targetHeight`, targetHeight)
    setTargetHeight(targetHeight)
    setSentinelMarginTop(marginTop)
  }, [stickyRefs])

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
    console.log(`bottom render`)

    if (!containerRef) return
    if (!containerRef.current) return
    const root = containerRef.current

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const target = stickyRefs.get(entry.target)
          const targetInfo = entry.boundingClientRect
          const rootBoundsInfo = entry.rootBounds
          const ratio = entry.intersectionRatio

          let type = ''
          // Started sticking.
          if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1) {
            type = 'stuck from bottom'
            onStuck(target)
          }
          // Stopped sticking.
          else if (
            targetInfo.top < rootBoundsInfo.top &&
            targetInfo.bottom < rootBoundsInfo.bottom
          ) {
            type = 'unstuck from bottom'
            onUnstuck(target)
          }

          onChange({ type, target })
        })
      },
      { threshold: [1], root }
    )

    const bottomSentinelNode = bottomSentinelRef.current
    bottomSentinelNode && observer.observe(bottomSentinelNode)
    bottomSentinelNode && console.log(`bottom observing~~~~~`)
    return () => {
      console.log(`bottom unobserve.........`)
      return observer.unobserve(bottomSentinelNode)
    }
  }, [
    bottomSentinelRef,
    containerRef,
    onChange,
    onStuck,
    onUnstuck,
    stickyRefs,
  ])

  const value = { sectionRef, topSentinelRef, bottomSentinelRef }
  return (
    <StickySectionContext.Provider value={value}>
      <Component ref={sectionRef} className={styles.sticky__section} {...rest}>
        <div
          ref={topSentinelRef}
          style={{ marginTop: `-${sentinelMarginTop}` }}
          className={styles.sticky__sentinel_top}
        >
          sentinel top
        </div>
        {children}
        <div
          ref={bottomSentinelRef}
          style={{
            height: `${targetHeight}`,
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
