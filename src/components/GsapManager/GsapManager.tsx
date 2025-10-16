'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'
import ScrollTrigger from 'gsap/ScrollTrigger'

export const GsapManager = () => {
  useEffect(() => {
    gsap.registerPlugin(CustomEase)
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  return <></>
}
