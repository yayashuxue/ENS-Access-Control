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
import { chains } from '@web3modal/ethereum';
import { Container } from '@nextui-org/react';
import DecryptFile from '../components/decryptFile';
import { findSubdomains } from '../utils/graph';
import { toast } from 'react-toastify';


export default function Files(props) {
  const [file, setFile] = useState();
  const [visible, setVisible] = useState(false);
  const [decryptVisible, setDecryptVisible] = useState(false);
  const [loading, setLoading] = useState("");
  const [hash, setHash] = useState("")
  const [filename, setFilename] = useState("");
  const [encryptedDescriptionString, setEncryptedDescriptionString] = useState("")
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("")
  const [ensdomains, setEnsdomains] = useState("")
  const [dfilename, setDFilename] = useState("");
  const [dencryptedDescriptionString, setDEncryptedDescriptionString] = useState("")
  const [dencryptedSymmetricKey, setDEncryptedSymmetricKey] = useState("")
  const [densdomains, setDEnsdomains] = useState("")
  const [call, setCall] = useState(0)
  const [fileList, setFileList] = useState([])
  const inputFile = useRef(null)
  const [pens, setPEns] = useState("");
  useEffect(()=>{
    if(typeof sessionStorage != undefined && sessionStorage.getItem("isEns") && sessionStorage.getItem("isEns") != 'false'){
      if(sessionStorage.getItem("isEns")){
        setPEns(sessionStorage.getItem("isEns"))
      }
      //console.log("enss",sessionStorage.getItem("isEns"))
    }
  }
  , [typeof sessionStorage != undefined])

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
    address: '0x5e378c084fcec1f30bf99f3ee5a406331b002060',
    abi: org3Abi,
    functionName: 'getAllData',
    chainId: chains.mainnet.id,
    args: [pens]
  }
  //console.log("enss", pens)
  const { data, error, isLoading, refetch } = useContractRead(config)

  useState(()=>{
    const getData = async ()=>{
      setInterval(async()=>{
        if(sessionStorage.getItem("isEns")){
          await refetch();
        }
      }, 10000
      )
    }

    getData()
  }, [refetch])

  useEffect(()=>{
    //console\.log\("ddd",data)
    if(!isLoading && data && data.length){
      const fileCount = data.length / 4;
      const allFiles = [];
      for (let i = 3; i < fileCount; i += 1) {
        const f = {
          filename: data[i],
          encryptedDescriptionString: data[fileCount + i],
          encryptedSymmetricKey: data[fileCount * 2 + i],
          ensdomains: data[fileCount * 3 + i]
        }
        allFiles.push(f)
      }
      if(allFiles.length > 0){
        setFileList(allFiles);
      }
    }
  }, [!isLoading])


  const selectFile = async (e) => {
    setFile(e.target.files[0]);
    setVisible(true);
    setFilename(e.target.files[0].name)
    setLoading(false);
    setEnsdomains("")
  }

  const getAllAddresses = (subd) =>{
    const res = [];
    addAddresses(subd, res);
    res.sort();
    //console\.log\("ddd", res)
    return res
  }

  const addAddresses = (subd, res) => {
    //console\.log\("ddd", subd)
    if(subd.resolvedAddress){
      res.push(subd.resolvedAddress.id);
    }
    if(subd.subdomains){
      for(let i = 0; i < subd.subdomains.length; i++){
        addAddresses(subd.subdomains[i], res)
      }
    }
  }

  const uploadFile = async () => {
    //console\.log\("ddd", ensdomains)
    if(!filename || !ensdomains){
      toast.error("Input fields cannot be empty")
      return
    }
    setLoading("Uploading to IPFS");
    const IpfsHash = await pinFileToIPFS(file);
    setHash(IpfsHash);
    setLoading("Encrypting");
    const ensdomainsT = ensdomains.split(",").map(element => {
      return element.trim();
    });
    let ensDomainsAddresses = [];
    for(let i = 0; i < ensdomainsT.length; i++){
      const subd =  await findSubdomains(ensdomainsT[i]);
      //console\.log\("ddd", subd)
      if(subd.data.domains.length){
        ensDomainsAddresses = ensDomainsAddresses.concat(getAllAddresses(subd.data.domains[0]))
      }
    }
    ensDomainsAddresses.sort();
    //console\.log\("ddd", ensDomainsAddresses)

    const { encryptedString, encryptedSymmetricKey } = await Encrypt.encryptHash(IpfsHash, ensDomainsAddresses)
    const encryptedDescriptionString = await blobToBase64(encryptedString);

    setEnsdomains(ensdomainsT.join("/"))
    setEncryptedDescriptionString(encryptedDescriptionString)
    setEncryptedSymmetricKey(encryptedSymmetricKey)
    setVisible(false);
    setCall(call + 1);
    setLoading(false);
  }

  const handleClickFile = async (file) =>{
    //console.log("click", file.filename)
    
    setDFilename(file.filename)
    setDEncryptedDescriptionString(file.encryptedDescriptionString);
    setDEncryptedSymmetricKey(file.encryptedSymmetricKey);
    const ensdomainsT = file.ensdomains.split("/").map(element => {
      return element.trim();
    });
    let ensDomainsAddresses = [];
    for(let i = 0; i < ensdomainsT.length; i++){
      const subd = await findSubdomains(ensdomainsT[i]);
      //console\.log\("ddd", subd)
      if(subd.data.domains.length){
        ensDomainsAddresses = ensDomainsAddresses.concat(getAllAddresses(subd.data.domains[0]))
      }
    }
    ensDomainsAddresses.sort();
    console.log("ddd", ensDomainsAddresses)
    setDEnsdomains(ensDomainsAddresses)
    setDecryptVisible(true)
  }

  const renderCell = (file, columnKey) => {
    
    const cellValue = file[columnKey];
    switch (columnKey) {
      case "name":
        return <a style={{cursor:"pointer"}} onClick={()=>{handleClickFile(file)}}>{file.filename}</a>;
      //case "status":
      //  return <StyledBadge type={file.status}>{cellValue}</StyledBadge>;
      case "access":
        return <a>{file.ensdomains.split("/").join(", ")}</a>;

      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="View File">
                <IconButton onClick={() => handleClickFile(file)}>
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
      <Container sm>
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
                align={"start"}
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
      </Container>
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
            onChange={(e)=>{setFilename(e.target.value)}}
            color="primary"
            size="lg"
            value={filename}
          />
          <Text size={16}>
            Who can access?
            <br></br>
            <span style={{fontSize:"10px"}}>
            Input ENS domains to grant access to groups or individuals
            </span>
          </Text>
          <Input
            readOnly={loading}
            placeholder={`tech.${pens}, vitalik.${pens}`}
            clearable
            bordered
            fullWidth
            color="primary"
            onChange={(e)=>{setEnsdomains(e.target.value)}}
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
      <ContractPusher call={call} primaryDomain={pens} filename={filename} encryptedDescriptionString={encryptedDescriptionString} encryptedSymmetricKey={encryptedSymmetricKey} ensdomains={ensdomains}></ContractPusher>
      <DecryptFile visible={decryptVisible} setVisible={setDecryptVisible} filename={dfilename} encryptedString={dencryptedDescriptionString} encryptedSymmetricKey={dencryptedSymmetricKey} ensdomains={densdomains}></DecryptFile>
    </div>


  );

}
