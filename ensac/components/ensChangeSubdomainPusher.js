import { useEffect, useState } from "react"
import org3Abi from '../data/org3Abi.json'
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction } from '@web3modal/react'
import { Modal, Input, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import ensAbi from '../data/ensAbi.json';

    
const ENSChangeSubdomainPusher = (props) => {
    const addFileConfig = {
        address: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
        abi: ensAbi,
        functionName: 'setSubnodeRecord',
        chainId: chains.mainnet.id,
        args: [props.domainName, props.subName, props.ownerAddress, props.resolver, props.ttl]
        // args: [namehash('julieshi.eth'), keccak256(toUtf8Bytes(nodeName)), walletAddress, "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41", "0000000000000000000000000000000000000000000000000000000000000000"]
        
    }
      
    let { data, error, isLoading, write } = useContractWrite(addFileConfig);
    let { receipt, isWaiting } = useWaitForTransaction({ hash: data?data.hash:null })
    let [visible, setVisible] = useState(false);

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
            Adding data to ENS Registry
            </Text>
        </Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
        
      </Modal>
    )
}

export default ENSChangeSubdomainPusher