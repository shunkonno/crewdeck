import Head from 'next/head'

import { Header } from '@components/ui/Header'
import { Footer } from '@components/ui/Footer'

export function BaseLayout({children}) {
  return(
    <>
      <div className="min-view-height bg-slate-50">
          <Header />
        {/* Header - END */}
        <div className="relative z-0">
          {children}
        </div>
      </div>
      {/* Footer - START */}
        <Footer />
      {/* Footer - END */}
    </>
  )
}