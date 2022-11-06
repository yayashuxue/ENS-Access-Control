import { chains } from '@web3modal/ethereum'
import { useContractRead } from '@web3modal/react'
import org3Abi from '../data/org3Abi.json'

export default function UseContractRead() {
  const config = {
    address: '0x5e378c084fcec1f30bf99f3ee5a406331b002060',
    abi: org3Abi,
    functionName: 'getAllData',
    chainId: chains.mainnet.id,
    args: ["flamingle.eth"]
  }
  const { data, error, isLoading, refetch } = useContractRead(config)
  console.log(data)
  return (
    <section>
      <h1>useContractRead</h1>

      <p>
        This example uses
        <a
          href="https://etherscan.io/address/0xecb504d39723b0be0e3a9aa33d646642d1051ee1#code"
          target="_blank"
          rel="noopener noreferer"
        >
          WagmiGotchi Contract
        </a>
        on Ethereum
      </p>

      <ul>
        <li>
          Contract read config: <span>{JSON.stringify(config)}</span>
        </li>
        <li>
          Returned data: <span>{isLoading ? 'Loading...' : JSON.stringify(data)}</span>
        </li>
        <li>
          Error: <span>{error ? error.message : 'No Error'}</span>
        </li>
      </ul>
      <button onClick={async () => refetch()}>Refetch data</button>
    </section>
  )
}