import React from 'react'
import { avatar, quotationMark } from './assets'
import './styles/FeedbackCard.css'

const FeedbackCard = () => {
  return (
    <div className='a'>
      <div className='b'>
        <div className='c'>
                <img src={avatar} alt=""/>
                <div>
                    <h1>Jenny Wilson</h1>
                    <p>UI-UX Designer</p>
                </div>
            
            </div>
            <img className='d' src={quotationMark} alt=""/>
      </div>

      <div className='e'>
        <h3 className='f'>Ut pharetra ipsum nec leo blandit, sit amet tincidunt eros pharetra. Nam sed imperdiet turpis. In hac habitasse platea dictumst. Praesent nulla massa, hendrerit vestibulum gravida in, feugiat auctor felis.Ut pharetra ipsum nec leo blandit, sit amet tincidunt eros pharetra. Nam sed imperdiet turpis. In hac habitasse platea dictumst.</h3>
      </div>
    </div>
  )
}

export default FeedbackCard