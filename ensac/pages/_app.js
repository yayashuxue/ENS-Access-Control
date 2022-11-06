import '../styles/globals.css'
import React from "react";
import { registerLicense } from '@syncfusion/ej2-base';
import { Navbar, Button, Link, Text, Card, Radio } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { Logo } from "./Logo.js";
import Image from 'next/image';
import { Web3Button, useAccount } from '@web3modal/react';
import Head from 'next/head';
import './index.css';
import { Web3Modal } from '@web3modal/react'

const config = {
  projectId: '2178494a077a0d1c10f5b88476a39330',
  theme: 'light',
  accentColor: 'default',
  ethereum: {
    appName: 'web3Modal'
  }
}


registerLicense('ORg4AjUWIQA/Gnt2VVhjQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0RjXH5Yc3BWQ2hfWEE=');

function MyApp({ Component, pageProps }) {
  const [variant, setVariant] = React.useState("static");
  const variants = ["static", "floating", "sticky"];
  const { account } = useAccount()

  return <>
    <Head>
      <title>Org3</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="assets/css/fontAwesome5Pro.css" />
      <link rel="stylesheet" href="assets/css/flaticon.css" />
      <link rel="stylesheet" href="assets/css/default.css" />
      {/* Global Site Tag (gtag.js) - Google Analytics */}

    </Head>
    <Layout>
      <Navbar isBordered variant={variant}>
        <Navbar.Brand>
          <Logo />
        </Navbar.Brand>
        {account.isConnected ?
          <Navbar.Content hideIn="xs">
            <Navbar.Link href="/files">Files</Navbar.Link>
            <Navbar.Link href="/">Company</Navbar.Link>
          </Navbar.Content>
          :
          ""
        }

        <Navbar.Content>
          <Navbar.Item>
            {account.isConnected ?
              <Button size={"sm"}>{account.address.slice(0, 10) + "..."}</Button>
              :
              <Web3Button></Web3Button>
            }
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </Layout>
    <Component {...pageProps} />
    <Web3Modal config={config} />
  </>
}

export default MyApp
