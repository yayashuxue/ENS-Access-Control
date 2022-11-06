import { useEffect, useState } from "react"
import org3Abi from '../data/org3Abi.json'
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction } from '@web3modal/react'
import { Modal, Input, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";

const ContractPusher = (props) => {
    const addFileConfig = {
        address: '0xcc9A39284f5b0045B00731b474A9cA96f10dC707',
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
            if(error){
              alert(error.message)
            }
        }
    }, [props.call])


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
          
        </Modal.Body>
        
      </Modal>
    )
}

export default ContractPusher