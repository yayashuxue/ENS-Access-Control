
import React, { useEffect } from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { DiagramComponent, Inject, DataBinding, HierarchicalTree, SnapConstraints, DiagramConstraints } from "@syncfusion/ej2-react-diagrams";
import { DataManager, Query } from '@syncfusion/ej2-data';
import LanguageIcon from '@mui/icons-material/Language';
import WalletIcon from '@mui/icons-material/Wallet';
import { findSubdomains, findAddress } from "../utils/graph";
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { chains } from '@web3modal/ethereum'
import { useContractWrite, useWaitForTransaction, Web3Modal } from '@web3modal/react'
import ENSChangeSubdomainPusher from './ensChangeSubdomainPusher'
import ENSChangeResolvedAddress from "./ENSChangeResolvedAddress";
import { Web3Button, useAccount } from '@web3modal/react';
import {toast} from "react-toastify";
import { ContractMethodNoResultError } from "@wagmi/core";




function Diagram() {
    const [visible, setVisible] = React.useState(false);
    const [parent, setParent] = React.useState("Default parent");
    const [wallet, setWallet] = React.useState("Default wallet");
    const [ens, setEns] = React.useState("");
    const [add, setAdd] = React.useState(false);
    const [items, setItems] = React.useState(null);
    const [disableAdd, setDisableAdd] = React.useState(false);
    // const [parentName, setParentName] = React.useState("")
    const [nodeName, setNodeName] = React.useState("");
    const [walletAddress, setWalletAddress] = React.useState("");
    const [call, setCall] = React.useState(0)
    const [call2, setCall2] = React.useState(0)
    const [call1Status, setCall1Status] = React.useState("");
    const { account } = useAccount();

    let new_data = new Set()
    let root_address = "";

    const getSubdomainData = async (domainName) => {

        let data = await findSubdomains(domainName)
        
        console.log(data.data);
        new_data = []
    
        new_data.push({ ens: data.data.domains[0].name, wallet: data.data.domains[0].resolvedAddress ? data.data.domains[0].resolvedAddress.id : "Unassigned" })
        root_address = new_data[0].wallet;
        buildUpArray(data.data.domains[0])
        // console.log(root_address.toLowerCase())
        // console.log("=========")
        console.log(account)

        //problem here ?????
        

        return;
    }
    
    const buildUpArray = (parent_domains) => {
        if (!parent_domains.subdomains) {
            return;
        }
        for (let i = 0; i < parent_domains.subdomains.length; ++i) {
            new_data.push({ ens: parent_domains.subdomains[i].name, wallet: parent_domains.subdomains[i].resolvedAddress ? parent_domains.subdomains[i].resolvedAddress.id : "Unassigned", parent: parent_domains.name })
            buildUpArray(parent_domains.subdomains[i])
        }
    }
    
    function getPrefix(input) {
        let output = "";
        for (let i = 0; i < input.length; i++) {
            if (input[i] == ".") break;
            output += input[i];
        }
    
        return output;
    }
    


    useEffect(() => {
        // Event.preventDefault();
        
        const call = async () => {
            
            let ens = sessionStorage.getItem("isEns");
            if (ens != "" && ens != "false") {
                await getSubdomainData(ens);
                setItems(new DataManager(new_data, new Query().take(7)));
            } else {
                alert("ENS is not in session storage!!!!");
            }

        }
        call();
    }, [])

    const handler = (data) => {

        setAdd(false);
        setParent(getPrefix(data.ens));
        setWallet(data.wallet)
        setEns(data.ens);
        setVisible(true);
    }

    function handleNodeNameChange(event) {
        setNodeName(event.target.value);
    }

    async function handleWalletAddress(event) {
        setWalletAddress(event.target.value)
    }

    const addHandler = () => {
        setCall1Status("");
        setNodeName("");
        setWalletAddress("")
        setAdd(true);
    }

    const closeHandler = () => {
        setVisible(false);
    };

    async function translate(name) {
        if (name.endsWith(".eth")) {
            let address = await findAddress(name);
            console.log(address.data.domains[0].resolvedAddress.id);
            setWalletAddress(address.data.domains[0].resolvedAddress.id)
        }
    }

    const addToENSHandler = async () => {
        console.log("cakked");
        if(call1Status != "finished"){
            await translate(walletAddress);
            setCall(call + 1);
        }
        else{
            setCall2(call2+1);
        }
    }


    function node(props) {
        console.log(props);
        return <div>
            <Button bordered auto shadow onPress={() => { handler(props.data) }} css={{ width: "150px", height: "50px", backgroundColor: "#ffffff" }}>
                {getPrefix(props.data.ens)}
            </Button>
        </div>
    }



    return (<>
    {/* <h1>{account.address}</h1> */}
    <DiagramComponent id="container" width={'100%'} height={'530px'} constraints={DiagramConstraints.Default & ~DiagramConstraints.PageEditable} snapSettings={{
        constraints: SnapConstraints.None
    }}
        nodeTemplate={node}

        //Uses layout to auto-arrange nodes on the diagram page
        layout={{
            //Sets layout type
            type: 'OrganizationalChart',
            orientation: "TopToBottom",
            getLayoutInfo: (node, options) => {
                if (!options.hasSubTree) {
                    options.type = 'Center';
                    options.orientation = 'Horizontal';
                }
            }
        }}
        //Configures data source for diagram
        dataSourceSettings={{
            id: 'ens',
            parentId: 'parent',
            dataManager: items
        }}
        //Sets the default properties for nodes and connectors
        getNodeDefaults={(obj, diagram) => {
            obj.width = 150;
            obj.height = 50;
            // obj.style.fill = '#6BA5D7';
            obj.shape.type = "HTML";
            // obj.shape.content = '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
            // obj.annotations = [{
            //     content: obj.data['Id'],
            //     style: {
            //         color: 'white'
            //     }
            // }];
            return obj;
        }} getConnectorDefaults={(connector, diagram) => {
            connector.style = {
                strokeColor: '#6BA5D7',
                strokeWidth: 2
            };
            connector.targetDecorator.style.fill = '#6BA5D7';
            connector.targetDecorator.style.strokeColor = '#6BA5D7';
            connector.targetDecorator.shape = 'None';
            connector.targetDecorator.shape = 'None';
            connector.type = 'Orthogonal';
            return connector;
        }}><Inject services={[DataBinding, HierarchicalTree]} />
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
            width="500px"
        >
            {add ? <>
                <Modal.Header>
                    <Text id="modal-title" b size={18} >
                        {parent}
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ paddingTop: "25px" }}>
                    <Input
                        bordered
                        labelPlaceholder="Node name"
                        labelRight={`.${ens}`}
                        color="primary"
                        css={{ marginBottom: "30px" }}
                        onChange={handleNodeNameChange}
                        value={nodeName}
                    />
                    <Input
                        bordered
                        labelPlaceholder="Wallet Address/ENS"
                        value={walletAddress}
                        onChange={handleWalletAddress}
                        color="primary" />
                </Modal.Body>
                <Modal.Footer >
                    <Button auto onPress={addToENSHandler} css={{ width: "100%" }}>
                        {call1Status=="finished"? "Set Resolved Address": "Add Subdomain"}
                    </Button>
                </Modal.Footer>
            </> : <>
                <Modal.Header>
                    <Text id="modal-title" b size={18} >
                        {parent}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <LanguageIcon />
                        <Text css={{ textAlign: "left", padding: "0 0 0 10px", }}>
                            {ens}
                        </Text>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <WalletIcon />
                        <div style={{ width: "95%", overflow: "hidden" }}>
                            <Text css={{ textAlign: "left", padding: "0 0 0 10px" }}>
                                {wallet}
                            </Text>
                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button auto onPress={addHandler} css={{ width: "100%" }}>
                        Add Under This Node
                    </Button>
                </Modal.Footer>
            </>}

        </Modal>
        <ENSChangeSubdomainPusher setCall1Status={setCall1Status} call={call} domainName={namehash(ens)}  subName={keccak256(toUtf8Bytes(nodeName))} ownerAddress={account.address} resolver={"0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41"} resolvedAddress={walletAddress} ttl={0}></ENSChangeSubdomainPusher>
        <ENSChangeResolvedAddress call={call2} domainName={namehash(nodeName + "." + ens)}  resolvedAddress={walletAddress} ></ENSChangeResolvedAddress>
    </DiagramComponent></>);
}

export default Diagram;