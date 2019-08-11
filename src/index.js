import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

import { StickyContainer, StickySection, Sticky } from './Sticky'

function App() {
  return (
    <div className='App'>
      <StickyContainer as='main'>
        <StickySection style={{ height: '90vh' }}>
          <Sticky as='h1'>Sticky Header 1</Sticky>
          <article>1 -- Some content under the sticky header</article>
        </StickySection>
        <StickySection style={{ height: '90vh' }}>
          <Sticky as='h1'>Sticky Header 2</Sticky>
          <article>2 -- Some content under the sticky header</article>
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
