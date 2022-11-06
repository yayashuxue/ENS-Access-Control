import React, { useState } from 'react';
import { Modal, Input, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { StyledBadge } from "./StyledBadge";
import { IconButton } from "./IconButton";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction } from '@web3modal/react'
import pinFileToIPFS from '../utils/pinFileToIPFS';
import Encrypt from '../utils/encrypt';
import org3Abi from '../data/org3Abi.json'
import { useRef } from 'react';

export default function Files() {
  const [file, setFile] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState("");
  const [hash, setHash] = useState("")

  const inputFile = useRef(null)

  const columns = [
    { name: "FILE NAME", uid: "name" },
    { name: "OWNER", uid: "role" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
  ];
  const file_svg = "https://upload.wikimedia.org/wikipedia/commons/0/0c/File_alt_font_awesome.svg"
  const users = [
    {
      id: 1,
      name: "A Certified Digital Signature",
      role: "Ralph C. Merkle",
      team: "1979",
      status: "ViewOnly",
      age: "29",
      avatar: file_svg,
      email: "tony.reichert@example.com",
    },
    {
      id: 2,
      name: "Smart Contracts",
      role: "Nick Szabo",
      team: "1994",
      status: "ViewOnly",
      age: "25",
      avatar: file_svg,
      email: "zoey.lang@example.com",
    },
    {
      id: 3,
      name: "Bitcoin: a Peer-to-Peer Electronic Cash System",
      role: "Satoshi Nakamoto",
      team: "2008",
      status: "ViewOnly",
      age: "22",
      avatar: file_svg,
      email: "jane.fisher@example.com",
    },
    {
      id: 4,
      name: "Ethereum: A Next Generation Smart Contract & Decentralized Application Platform",
      role: "Vitalik Buterin",
      team: "2013",
      status: "ViewOnly",
      age: "28",
      avatar: file_svg,
      email: "william.howard@example.com",
    },
    {
      id: 4,
      name: "Flamingo Design Doc",
      role: "Flamingo team",
      team: "2022",
      status: "Edit",
      age: "28",
      avatar: file_svg,
      email: "william.howard@example.com",
    },
  ];

  const blobToBase64 = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const addFileConfig = {
    addressOrName: '0xcc9A39284f5b0045B00731b474A9cA96f10dC707',
    abi: org3Abi,
    functionName: 'addFile',
    chainId: chains.mainnet.id
  }

  const { data, error, isLoading, write } = useContractWrite(addFileConfig)
  const { receipt, isWaiting } = useWaitForTransaction({ hash: data ? data.hash : null })

  const selectFile = async (e) => {
    setFile(e.target.files[0]);
    setVisible(true);
  }
  const uploadFile = async () => {
    
    console.log(write)
    setLoading("Uploading to IPFS");
    const IpfsHash = await pinFileToIPFS(file);
    setHash(IpfsHash);
    setLoading("Encrypting");
    const ensdomains = ["0x14589BDFdbe3044501044df5B6d53be2f47e92e5"]; // TODO
    const { encryptedString, encryptedSymmetricKey } = await Encrypt.encryptHash(IpfsHash, ensdomains)
    const encryptedDescriptionString = await blobToBase64(encryptedString);

    const filename = file.name;
    console.log(write)
    await write(filename, encryptedDescriptionString, encryptedSymmetricKey, ensdomains.join("/"))

    setLoading(false);
    console.log("Encrypt Done")
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

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User squared src={user.avatar} name={cellValue} css={{ p: 0 }}>

          </User>
        );
      case "role":
        return (
          <Col>
            <Row>
              <Text b size={14} css={{ tt: "capitalize" }}>
                {cellValue}
              </Text>
            </Row>
            <Row>
              <Text b size={13} css={{ tt: "capitalize", color: "$accents7" }}>
                {user.team}
              </Text>
            </Row>
          </Col>
        );
      case "status":
        return <StyledBadge type={user.status}>{cellValue}</StyledBadge>;

      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Details">
                <IconButton onClick={() => console.log("View user", user.id)}>
                  <EyeIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit user">
                <IconButton onClick={() => console.log("Edit user", user.id)}>
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete user"
                color="error"
                onClick={() => console.log("Delete user", user.id)}
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };
  return (

    <div>
      <div style={{ marginLeft: "80px", marginRight: "80px" }}>
        <Table
          aria-label="Example table with custom cells"
          css={{
            height: "auto"
          }}
          selectionMode="none"
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={users}>
            {(item) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Row style={{ marginTop: "20px" }} justify="end" align="center">
          <Button onClick={() => inputFile.current.click()}>
            Upload File Securely
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
    </div>


  );

}
