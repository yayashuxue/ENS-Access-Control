import { useEffect, useState } from "react"
import org3Abi from '../data/org3Abi.json'
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction } from '@web3modal/react'
import { Modal, Input, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { Loading } from "@nextui-org/react";

const ContractPusher = (props) => {
    const addFileConfig = {
        address: '0x5e378c084fcec1f30bf99f3ee5a406331b002060',
        abi: org3Abi,
        functionName: 'addFile',
        chainId: chains.mainnet.id,
        args: [props.primaryDomain, props.filename, props.encryptedDescriptionString, props.encryptedSymmetricKey, props.ensdomains]
    }
      
    const { data, error, isLoading, write } = useContractWrite(addFileConfig)
    const { receipt, isWaiting } = useWaitForTransaction({ hash: data?data.hash:null })
    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        if(props.call){
            console.log(props)
            write();
            console.log(error)
            
        }
    }, [props.call])

    console.log(props)

    return (
        <Modal
        aria-labelledby="modal-title"
        open={isLoading || isWaiting}
        onClose={()=>setVisible(false)}
      >
      <Modal.Header>
          <Text id="modal-title" size={18}>
            Syncing Data to Smart Contract
            </Text>
        </Modal.Header>
        <Modal.Body>
          <Loading></Loading>
        </Modal.Body>
        
      </Modal>
    )
}

export default ContractPusher