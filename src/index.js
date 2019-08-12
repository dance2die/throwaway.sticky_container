import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

import { StickyContainer, StickySection, Sticky } from './Sticky'

function App() {
  const handleStuck = targetEntry => {
    // console.log(`Stuck!`, targetEntry)
    targetEntry.style.backgroundColor = '#4caf50'
  }
  const handleUnstuck = targetEntry => {
    // console.log(`UNstuck!`, targetEntry)
    targetEntry.style.backgroundColor = 'rebeccapurple'
  }
  const handleChange = ({ targetEntry, type }) => {
    // console.log(`Changed!!`, type, targetEntry)
  }

  const stickySectionElements = Array.from({ length: 2 }, (_, i) => i + 1).map(
    key => (
      <StickySection
        key={key}
        style={{ height: '90vh' }}
        onStuck={handleStuck}
        onUnstuck={handleUnstuck}
        onChange={handleChange}
      >
        <Sticky as='h1'>Sticky Header {key}</Sticky>
        <article>{key} -- Some content under the sticky header</article>
      </StickySection>
    )
  )

  return (
    <div className='App'>
      <StickyContainer as='main'>{stickySectionElements}</StickyContainer>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
