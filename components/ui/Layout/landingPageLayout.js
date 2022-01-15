// Components
import { Header } from '@components/ui/Header'
import { Footer } from '@components/ui/Footer'

export function LandingPageLayout({ children }) {
  return (
    <>
      <div className="min-view-height bg-white">
        <Header />
        {/* Header - END */}
        <div className="relative z-0 w-full">{children}</div>
      </div>
      {/* Footer - START */}
      <Footer />
      {/* Footer - END */}
    </>
  )
}
