import { useEffect, useState } from "react"
import org3Abi from '../data/org3Abi.json'
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction } from '@web3modal/react'
import { Modal, Input, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import ensAbi from '../data/ensAbi.json';
import ensResolverAbi from '../data/ensResolverAbi.json';
import toast from 'react-toastify';
import { Loading } from "@nextui-org/react";

const ENSChangeResolvedAddress = (props) => {
    const addFileConfig = {
      address: '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
      abi: ensResolverAbi,
      functionName: 'setAddr',
      chainId: chains.mainnet.id,
      args: [props.domainName, 60, props.resolvedAddress]
  
    }
  
    let { data, error, isLoading, write } = useContractWrite(addFileConfig);
    let { receipt, isWaiting } = useWaitForTransaction({ hash: data ? data.hash : null })
    let [visible, setVisible] = useState(false);
  
    useEffect(() => {
      if (props.call) {
        console.log("calling2")
        console.log(props)
        write();
        console.log(error)
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
              Adding data to ENS Resolver
              </Text>
          </Modal.Header>
          <Modal.Body>
          <Loading></Loading>
          </Modal.Body>
          
        </Modal>
      )
}

export default ENSChangeResolvedAddress;