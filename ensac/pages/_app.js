import '../styles/globals.css'
import React, { useEffect } from "react";
import { registerLicense } from '@syncfusion/ej2-base';
import { Navbar, Button, Link, Text, Card, Popover } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { Logo } from "./Logo.js";
import { Web3Button, useAccount } from '@web3modal/react';
import Head from 'next/head';
import './index.css';
import { Web3Modal } from '@web3modal/react'
import { useDisconnect } from '@web3modal/react'
import { useRouter } from 'next/router';
import Preloader from '../components/preloader';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [variant, setVariant] = React.useState("sticky");
  const variants = ["static", "floating", "sticky"];
  const { account } = useAccount();
  const [isEns, setIsEns] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const disconnect = useDisconnect();

  const disconnectWallet = () => {
    sessionStorage.setItem("isEns", "false");
    setIsEns(false);
    disconnect();
    toast("Log out success!");
    if (router.pathname != "/") {
      router.push("/")
    }
  }


  useEffect(() => {
    setIsLoading(true);
    if (sessionStorage.getItem("isEns") != null && sessionStorage.getItem("isEns") != "" && sessionStorage.getItem("isEns") != 'false') {
      setIsEns(true);
    } else {
      setIsEns(false);
    }
    setTimeout(() => { setIsLoading(false) }, 1000);
  }, [])

  return <>
    <Head>
      <title>ORG3</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="assets/css/fontAwesome5Pro.css" />
      <link rel="stylesheet" href="assets/css/flaticon.css" />
      <link rel="stylesheet" href="assets/css/default.css" />
      {/* Global Site Tag (gtag.js) - Google Analytics */}

    </Head>
    {isLoading && <Preloader />}
    <Layout>
      <Navbar disableShadow isBordered variant={variant}>
        <Navbar.Brand>
          <Logo />
        </Navbar.Brand>
        {account.isConnected && isEns ?
          <Navbar.Content hideIn="xs" css={{ marginLeft: "30px" }}>
            <Navbar.Link href="/" isActive={router.pathname == "/"}><AccountTreeIcon sx={{ mr: 1 }} /> Organization</Navbar.Link>
            <Navbar.Link href="/files" isActive={router.pathname == "/files"} ><InsertDriveFileIcon sx={{ mr: 1 }} /> Files</Navbar.Link>
          </Navbar.Content>
          :
          ""
        }

        <Navbar.Content>
          <Navbar.Item>
            {account.isConnected ?
              <Popover>
                <Popover.Trigger>
                  <Button style={{ marginRight: "120px" }} size={"md"}>{account.address.slice(0, 10) + "..."}</Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Button onPress={disconnectWallet} auto color="error" size="md">Sign Out</Button>
                </Popover.Content>
              </Popover>
              :
              <Web3Button style={{ marginRight: "120px" }}></Web3Button>
            }
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </Layout>
    <Component {...pageProps} isEns={isEns} setIsEns={setIsEns} isLoading={isLoading} setIsLoading={setIsLoading} />
    <Web3Modal config={config} />
    <ToastContainer />
  </>
}

export default MyApp
