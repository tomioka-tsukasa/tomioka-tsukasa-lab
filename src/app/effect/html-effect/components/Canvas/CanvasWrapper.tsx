'use client'

import dynamic from 'next/dynamic'

const Canvas = dynamic(() => import('./Canvas'), {
  ssr: false,
  // loading: () => <div>Loading WebGL...</div>
})

export default Canvas
