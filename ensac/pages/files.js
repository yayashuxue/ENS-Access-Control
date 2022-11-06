import React, { useEffect, useState } from 'react';
import { Modal, Input, Table, Row, Col, Tooltip, file, Text } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { StyledBadge } from "./StyledBadge";
import { IconButton } from "./IconButton";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import pinFileToIPFS from '../utils/pinFileToIPFS';
import Encrypt from '../utils/encrypt';
import { useRef } from 'react';
import { useContractRead } from '@web3modal/react'
import ContractPusher from '../components/contractPusher';
import org3Abi from '../data/org3Abi.json'
import { chains } from '@web3modal/ethereum'

export default function Files(props) {
  const [file, setFile] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState("");
  const [hash, setHash] = useState("")
  const [filename, setFilename] = useState("");
  const [encryptedDescriptionString, setEncryptedDescriptionString] = useState("")
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("")
  const [ensdomains, setEnsdomains] = useState("")
  const [call, setCall] = useState(0)
  const [fileList, setFileList] = useState([])
  const inputFile = useRef(null)

  const columns = [
    { name: "FILE NAME", uid: "name" },
    { name: "ACCESS", uid: "access" },
    { name: "ACTIONS", uid: "actions" },
  ];
  const file_svg = "https://upload.wikimedia.org/wikipedia/commons/0/0c/File_alt_font_awesome.svg"
  
  const blobToBase64 = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const config = {
    address: '0xcc9A39284f5b0045B00731b474A9cA96f10dC707',
    abi: org3Abi,
    functionName: 'getAllData',
    chainId: chains.mainnet.id,
    args: ["flamingle.eth"]
  }
  const { data, error, isLoading, refetch } = useContractRead(config)

  useState(()=>{
    const getData = async ()=>{
      console.log("fetch")
      setInterval(async()=>{
        await refetch();
        console.log(fileList)
      }, 10000
      )
    }

    getData()
  }, [refetch])

  useEffect(()=>{
    console.log(data)
    if(!isLoading && data){
      const fileCount = data.length / 4;
      const allFiles = [];
      for(let i = 0; i < fileCount; i+=1){
        const f = {
          filename: data[i],
          encryptedDescriptionString: data[fileCount+i],
          encryptedSymmetricKey: data[fileCount*2+i],
          ensdomains: data[fileCount*3+i]
        }
        allFiles.push(f)
        console.log(f)
      }
      setFileList(allFiles);
    }
  }, [!isLoading])

  const selectFile = async (e) => {
    setFile(e.target.files[0]);
    setVisible(true);
  }
  const uploadFile = async () => {
    setLoading("Uploading to IPFS");
    const IpfsHash = await pinFileToIPFS(file);
    setHash(IpfsHash);
    setLoading("Encrypting");
    const ensdomains = "0x14589BDFdbe3044501044df5B6d53be2f47e92e5"; // TODO
    const { encryptedString, encryptedSymmetricKey } = await Encrypt.encryptHash(IpfsHash, ensdomains)
    const encryptedDescriptionString = await blobToBase64(encryptedString);

    const filename = file.name;
    setEnsdomains(ensdomains)
    setFilename(filename)
    setEncryptedDescriptionString(encryptedDescriptionString)
    setEncryptedSymmetricKey(encryptedSymmetricKey)
    setVisible(false);
    setCall(call+1);
    setLoading(false);
  }

  const decryptHashFromContract = async (encryptedString, encryptedSymmetricKey) => {
    const encryptedStringBlob = await (await fetch(encryptedString)).blob();

    try {
      const decryptedHash = await Encrypt.decryptHash(encryptedStringBlob, encryptedSymmetricKey, ["0x14589BDFdbe3044501044df5B6d53be2f47e92e5"]);
      console.log(decryptedHash)
      setDecryptedHash(decryptedHash)
    } catch (error) {
      console.log(error);
    }

    // Set decrypted string
    // setDescription(decryptedDescription);
  }

  const renderCell = (file, columnKey) => {
    const cellValue = file[columnKey];
    switch (columnKey) {
      case "name":
        return <a style={{cursor:"pointer"}}>{file.filename}</a>;
      //case "status":
      //  return <StyledBadge type={file.status}>{cellValue}</StyledBadge>;
      case "access":
        return <a>{file.ensdomains}</a>;
  
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="View File">
                <IconButton onClick={() => console.log("View file", file.id)}>
                  <EyeIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };
  console.log(fileList) 
  return (

    <div>
      <div style={{ marginLeft: "200px", marginRight: "200px" }}>
        <h1>Files</h1>
        <Table
          aria-label="Example table with custom cells"
          css={{
            height: "auto"
          }}
          bordered
      shadow={false}
      striped
          selectionMode="none"
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={ "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={fileList}>
            {(item) => (
              <Table.Row key={item.filename}>
                {(columnKey) => (
                  <Table.Cell key={item.filename}>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Row style={{ marginTop: "20px" }} justify="end" align="center">
          <Button onClick={() => inputFile.current.click()}>
            + Upload File Securely
          </Button>
          <input type="file" name="file" ref={inputFile} onChange={selectFile} style={{ display: "none" }} />
        </Row>
      </div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible && file && file.name}
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Uploading <span style={{ fontWeight: "600" }}>{file ? file.name : ""}</span>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text size={16}>
            File Name
          </Text>
          <Input
            readOnly={loading}
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            value={file ? file.name : ""}
          />
          <Text size={16}>
            Who can access?
          </Text>
          <Input
            readOnly={loading}
            placeholder={"tech.flamingle.eth"}
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
          />

        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setVisible(false)} disabled={loading}>
            Cancel
          </Button>
          <Button auto onClick={uploadFile} disabled={loading}>
            {!loading ? "Confirm" : loading + "..."}
          </Button>
        </Modal.Footer>
      </Modal>
      <ContractPusher call={call} primaryDomain={"flamingle.eth"} filename={filename} encryptedDescriptionString={encryptedDescriptionString} encryptedSymmetricKey={encryptedSymmetricKey} ensdomains={ensdomains}></ContractPusher>
    </div>


  );

}
