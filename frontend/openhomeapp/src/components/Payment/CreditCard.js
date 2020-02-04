import React from 'react';
import './Payment.css';

import masterLogo from './Logos/mastercard.png';
import visaLogo from './Logos/visa.png';
import discoverLogo from './Logos/discover.png';

const cardTypeToLogo = {
    'MASTERCARD': masterLogo,
    'VISA': visaLogo,
    'DISCOVER': discoverLogo
};



export default (props) => {
    return (
        <div className='credit-card'>

                 
          <div className='credit-card__info'>
          <div className='credit-card__logo'>
                <img className='logo' src={cardTypeToLogo[props.type]} width="60"/>
            </div>

            <div className='credit-card__info_expiry'>
                    <div className='credit-card__info_label'>CVV</div>
                    <div>{props.cvv}</div>
             </div>
            </div>

            <div className='credit-card__number'>{props.number}</div>
                
            <div className='credit-card__info'>
                <div className='credit-card__info_name'>
                    <div className='credit-card__info_label'>CARDHOLDER'S NAME</div>
                    <div>{props.name}</div>
                </div>

                <div className='credit-card__info_expiry'>
                    <div className='credit-card__info_label'>VALID UP TO</div>
                    <div>{props.expiry}</div>
                </div>
            </div>

        </div>
    );
}