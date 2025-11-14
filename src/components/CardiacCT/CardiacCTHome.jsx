import React from 'react'
import CardiacCTHeader from './CardiacCTHeader'
import WhatisCardiacCT from './WhatisCardiacCT'
import BenefitsCardiacCT from './BenefitsCardiacCT'
import WhyshouldCardiacCT from './WhyshouldCardiacCT'
import CardiacCTExpectation from './CardiacCTExpectation'

const CardiacCTHome = () => {
  return (
    <>
        <CardiacCTHeader/>
        <WhatisCardiacCT/>
        <BenefitsCardiacCT/>
        <WhyshouldCardiacCT/>
        <CardiacCTExpectation/>
    </>
  )
}

export default CardiacCTHome