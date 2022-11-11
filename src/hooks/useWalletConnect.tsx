import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ethers } from 'ethers'
import WalletConnect from '@walletconnect/client'
import { IClientMeta, IWalletConnectSession } from '@walletconnect/types'
// import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
// import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'

const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
  connector.rejectRequest({ id, error: { message } })
}

const useWalletConnect = (provider:any) => {
  console.log("useWalletConnect")
  console.log(provider)
  // const { safe, sdk } = useSafeAppsSDK()
  const address = '0xB7A453Ee4a8850cc8A738021245c5e08B8CaB378'
  const chainID = 5
  const [wcClientData, setWcClientData] = useState<IClientMeta | null>(null)
  const [connector, setConnector] = useState<WalletConnect | undefined>()
  const web3Provider = provider

  const localStorageSessionKey = useRef(`session_${address}`)


  const wcDisconnect = useCallback(async () => {
    try {
      await connector?.killSession()
      setConnector(undefined)
      setWcClientData(null)
    } catch (error) {
      console.log('Error trying to close WC session: ', error)
    }
  }, [connector])

  const wcConnect = useCallback(
    async ({ uri, session }: { uri?: string; session?: IWalletConnectSession }) => {
      const wcConnector = new WalletConnect({
        uri,
        session,
        storageId: localStorageSessionKey.current,
      })
      setConnector(wcConnector)
      setWcClientData(wcConnector.peerMeta)

      wcConnector.on('session_request', (error, payload) => {
        if (error) {
          throw error
        }

        wcConnector.approveSession({
          accounts: [address],
          chainId: chainID,
        })

        setWcClientData(payload.params[0].peerMeta)
      })

      wcConnector.on('call_request', async (error, payload) => {
        if (error) {
          throw error
        }

        try {
          let result = await web3Provider.send(payload.method, payload.params)

          wcConnector.approveRequest({
            id: payload.id,
            result,
          })
        } catch (err) {
          rejectWithMessage(wcConnector, payload.id, (err as Error).message)
        }
      })

      wcConnector.on('disconnect', error => {
        if (error) {
          throw error
        }
        wcDisconnect()
      })
    },
    [wcDisconnect, web3Provider],
  )

  useEffect(() => {
    if (!connector) {
      const session = localStorage.getItem(localStorageSessionKey.current)
      if (session) {
        wcConnect({ session: JSON.parse(session) })
      }
    }
  }, [connector, wcConnect])

  return { wcClientData, wcConnect, wcDisconnect }
}

export default useWalletConnect