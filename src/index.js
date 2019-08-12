import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

import { StickyContainer, StickySection, Sticky } from './Sticky'

function App() {
  const handleStuck = entry => {
    console.log(`Stuck!`, entry)
    entry.target.style.backgroundColor = '#4caf50'
  }
  const handleUnstuck = entry => {
    console.log(`UNstuck!`, entry)
    entry.target.style.backgroundColor = 'rebeccapurple'
  }

  return (
    <div className='App'>
      <StickyContainer as='main'>
        <StickySection
          style={{ height: '90vh' }}
          onStuck={handleStuck}
          onUnstuck={handleUnstuck}
        >
          <Sticky as='h1'>Sticky Header 1</Sticky>
          <article>1 -- Some content under the sticky header</article>
        </StickySection>
        <StickySection
          style={{ height: '90vh' }}
          onStuck={handleStuck}
          onUnstuck={handleUnstuck}
        >
          <Sticky as='h1'>Sticky Header 2.1</Sticky>
          <article>2 -- Some content under the sticky header</article>
          <Sticky as='h1'>Sticky Header 2.2</Sticky>
        </StickySection>
        <StickySection style={{ height: '90vh' }}>
          <Sticky as='h1'>Sticky Header 3</Sticky>
          <article>3 -- Some content under the sticky header</article>
        </StickySection>
      </StickyContainer>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
