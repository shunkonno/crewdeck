import { JoinedDaoCard } from '@components/ui/Card'

export function JoinedDaosListSection({
  daoSelectorOptions,
  daoSelectorIsReady,
  currentAccount
}) {
  return (
    <section className="py-sm ml-sm">
      <h1 className="text-2xl">{`DAOs You've Joined`}</h1>
      <div className="flex mt-sm overflow-x-auto">
        {currentAccount ? (
          daoSelectorIsReady ? (
            daoSelectorOptions.length ? (
              daoSelectorOptions.map((dao) => (
                <JoinedDaoCard
                  key={dao.dao_id}
                  dao={dao}
                  daoSelectorIsReady={daoSelectorIsReady}
                />
              ))
            ) : (
              <div className="flex w-full justify-center mt-sm">
                <p>{`No DAOs you've joined.`}</p>
              </div>
            )
          ) : (
            [...Array(4)].map((empty, idx) => (
              <JoinedDaoCard
                key={idx}
                daoSelectorIsReady={daoSelectorIsReady}
              />
            ))
          )
        ) : (
          <div className="flex w-full justify-center mt-sm">
            <p>{`Your wallet is not connected to this site.`}</p>
          </div>
        )}
      </div>
    </section>
  )
}
