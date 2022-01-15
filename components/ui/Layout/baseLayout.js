// Components
import { Header } from '@components/ui/Header'
import { Footer } from '@components/ui/Footer'

export function BaseLayout({ children }) {
  return (
    <>
      <div className="min-view-height bg-slate-100">
        <Header />
        {/* Header - END */}
        <div className="relative z-0 max-w-7xl sm:mx-auto py-4 sm:py-8">
          {children}
        </div>
      </div>
      {/* Footer - START */}
      <Footer />
      {/* Footer - END */}
    </>
  )
}
