import React, { useState } from 'react';
import { Navbar, Link, Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { StyledBadge } from "./StyledBadge";
import { IconButton } from "./IconButton";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { Content } from './Content';
import { Logo } from "./Logo.js";

export default function Files() {
  const [variant, setVariant] = React.useState("static");

  const variants = ["static", "floating", "sticky"];
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

  //   const addFile() => {
  //     alert("add file clicked")
  //   }


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
      <Content />
      <Table
        aria-label="Example table with custom cells"
        css={{
          height: "auto",
          minWidth: "100%",
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
      <Row justify="end" align="center">
        <Button onClick={() => alert("add file clicked")}>Add File</Button>
      </Row>
    </div>

  );

}
