import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function JoinedDaoCard({ dao, daoSelectorIsReady }) {
  return (
    <>
      {daoSelectorIsReady ? (
        <div className="inline-flex shadow-md border border-slate-300 bg-white py-2 px-4 rounded-lg">
          <img src={dao.logo_url} alt="" className="block h-6 w-6 mr-3" />
          <p>{dao.name}</p>
        </div>
      ) : (
        <Skeleton
          containerClassName="flex-none w-64 mr-xs h-full"
          height={'2.5rem'}
        />
      )}
    </>
  )
}
