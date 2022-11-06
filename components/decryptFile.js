import { useEffect, useState } from "react";
import org3Abi from '../data/org3Abi.json'
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction } from '@web3modal/react'
import { Modal, Button, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import Encrypt from "../utils/encrypt";
function DecryptFile(props) {
    const [loading, setLoading] = useState(false);
    const [decryptedHash, setDecryptedHash] = useState("")

    const decryptHashFromContract = async () => {
        const encryptedStringBlob = await (await fetch(props.encryptedString)).blob();

        try {
            setDecryptedHash("")
            setLoading(true)
            const decryptedHash = await Encrypt.decryptHash(encryptedStringBlob, props.encryptedSymmetricKey, props.ensdomains);
            console.log(decryptedHash)
            setDecryptedHash(decryptedHash)
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

    useEffect(()=>{
        if(props.visible){
          window.alert = function() {};
        console.log("decrypt modal")
        console.log(props)
        decryptHashFromContract()
        }
    }, [props])

    return (
        <Modal
        closeButton
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={() => props.setVisible(false)}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Opening <span style={{ fontWeight: "600" }}>{props.filename}</span>
          </Text>
        </Modal.Header>
        <Modal.Body>
            {
                loading?
                
                <Button disabled>Decrypting...</Button>:
                decryptedHash?
                <Button onClick={()=>{window.open("https://flamingle.mypinata.cloud/ipfs/"+decryptedHash)}}>View File</Button>:
                <Button disabled>No Access</Button>
                
            }

        </Modal.Body>
      </Modal>

    )

}

export default DecryptFile;