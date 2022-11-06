import { useEffect, useState } from "react"
import org3Abi from '../data/org3Abi.json'
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction } from '@web3modal/react'
import { Modal, Input, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import ensAbi from '../data/ensAbi.json';
import ensResolverAbi from '../data/ensResolverAbi.json';
import toast from 'react-toastify';
import { Loading } from "@nextui-org/react";

const ENSChangeSubdomainPusher = (props) => {
  const addFileConfig = {
    address: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
    abi: ensAbi,
    functionName: 'setSubnodeRecord',
    chainId: chains.mainnet.id,
    args: [props.domainName, props.subName, props.ownerAddress, props.resolver, props.ttl]

  }

  let { data, error, isLoading, write } = useContractWrite(addFileConfig);
  let { receipt, isWaiting } = useWaitForTransaction({ hash: data ? data.hash : null })
  let [visible, setVisible] = useState(false);

  useEffect(() => {
    if (props.call) {
      console.log("calling1")
      console.log(props)
      write();
      // toast.success('Node added!', {
      //   position: "bottom-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
      console.log(error)
      props.setCall1Status("finished")
    }
  }, [props.call])

  return (
    <Modal
      aria-labelledby="modal-title"
      open={isLoading || isWaiting}
      onClose={() => setVisible(false)}
    >
      <Modal.Header>
          <Text id="modal-title" size={18}>
            Adding data to ENS Registry
            </Text>
        </Modal.Header>
        <Modal.Body>
          <Loading></Loading>
        </Modal.Body>
        
      </Modal>
    )
}

export default ENSChangeSubdomainPusher;