import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Diagram from '../components/diagram'
import React from "react";
import { findSubdomains } from "../utils/graph"
import { useAccount } from '@web3modal/react';
import LandingPage from '../components/landing';
import InputEns from '../components/inputEns';
import { useEffect } from 'react';

export default function Home(props) {
  const { account } = useAccount;
  const { isEns, setIsEns } = props;

  useEffect(() => {
    console.log(account);
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>ORG3</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {account.isConnected && isEns &&
        <>
          <h1>Organizational Structrue Tree</h1>
          <Diagram></Diagram>
        </>
      }

      {account.isConnected && !isEns &&
        <>
          <h1>Input ENS</h1>
          <InputEns />
        </>
      }

      {!account.isConnected && !isEns &&
        <LandingPage></LandingPage>
      }



    </div>
  )
}
