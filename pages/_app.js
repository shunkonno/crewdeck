import { AccountProvider } from '@contexts/AccountContext'
import '@styles/globals.css'

const NoSetLayout = ({children}) => <>{children}</>

function MyApp({ Component, pageProps }) {

  const Layout = Component.Layout ?? NoSetLayout

  return (
    <AccountProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AccountProvider>
  )
}

export default MyApp
