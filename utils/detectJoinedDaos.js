import { useGetTokenBalances } from '@components/hooks/useGetTokenBalances'

// Filter the list of DAOs from DB, and filter the ones that the user owns tokens for. Set filtered array to state.
  // @params {array} daoList - The initial list of all DAOs.
  export const detectJoinedDaos =
    async (daoList, currentAccount, setDaoSelectorOptions) => {
      //Filter DAO Function
      const filterResult = await daoList?.reduce(async (promise, dao) => {
        let accumulator = []
        accumulator = await promise
        const data = await useGetTokenBalances(
          currentAccount,
          dao.contract_address
        )

        // Get substring of tokenBalance. (e.g. 0x0000000000000000000000000000000000000000000000000000000000000001)
        // If tokenBalance is greater than 0, the user owns at least one token.
        if (Number(data.tokenBalance?.substring(2)) > 0) {
          await accumulator.push(dao)
        }
        return accumulator
      }, [])

      await setDaoSelectorOptions(filterResult)
    }