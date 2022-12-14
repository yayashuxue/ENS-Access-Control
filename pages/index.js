import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Diagram from '../components/diagram'
import React, { useState } from "react";
import { findSubdomains } from "../utils/graph"
import { useAccount } from '@web3modal/react';
import LandingPage from '../components/landing';
import InputEns from '../components/inputEns';
import { useEffect } from 'react';
import { Container } from '@nextui-org/react';

export default function Home(props) {
  const { account } = useAccount();
  const { isEns, setIsEns, setNickName } = props;

  // useEffect(() => {
  //   console.log(sessionStorage.getItem("isEns"));
  // });

  return (
    <div className={styles.container} style={{ overflow: "hidden" }}>
      <Head>
        <title>ORG3</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {account.isConnected && isEns &&
        <div id="index-background">
          <Container sm style={{ padding: "40px 0px 0px 0px" }}><h1 style={{ marginTop: "0", textAlign: "center" }}>Organizational Structure Tree</h1></Container>
          <Diagram />
        </div>
      }

      {account.isConnected && !isEns &&
        <InputEns setIsEns={setIsEns} setNickName={setNickName} />
      }

      {!account.isConnected &&
        <LandingPage />
      }

    </div>
  )
}
