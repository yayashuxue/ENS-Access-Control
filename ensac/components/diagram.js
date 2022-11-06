
import React, { useEffect } from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { DiagramComponent, Inject, DataBinding, HierarchicalTree, SnapConstraints, DiagramConstraints } from "@syncfusion/ej2-react-diagrams";
import { DataManager, Query } from '@syncfusion/ej2-data';
import LanguageIcon from '@mui/icons-material/Language';
import WalletIcon from '@mui/icons-material/Wallet';
import {findSubdomains} from "../utils/graph";

let new_data = new Set()
const getSubdomainData = async (domainName) => {

    let data = await findSubdomains(domainName)
    new_data = []

    new_data.push({ens: data.data.domains[0].name, wallet: data.data.domains[0].id})

    buildUpArray(data.data.domains[0])
    console.log(new_data)
    console.log(new_data.length)

    return;
}

const buildUpArray = (parent_domains) => {
    if(!parent_domains.subdomains){
        return;
    }
    for(let i = 0; i < parent_domains.subdomains.length; ++i){
        new_data.push({ens: parent_domains.subdomains[i].name, wallet: parent_domains.subdomains[i].id, parent: parent_domains.name})
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

function Diagram() {
    const [visible, setVisible] = React.useState(false);
    const [parent, setParent] = React.useState("Default parent");
    const [wallet, setWallet] = React.useState("Default wallet");
    const [ens, setEns] = React.useState("Default ENS");
    const [add, setAdd] = React.useState(false);
    const [items, setItems] = React.useState(null);

    useEffect(()=>{
        // Event.preventDefault();
        const call = async () => {
            await getSubdomainData("julieshi.eth");
            setItems(new DataManager(new_data, new Query().take(7)));
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

    const addHandler = () => {
        setAdd(true);
    }

    const closeHandler = () => {
        setVisible(false);
    };


    function node(props) {
        console.log(props);
        return <div>
            <Button bordered auto shadow onPress={() => { handler(props.data) }} css={{ width: "150px", height: "50px" }}>
                {getPrefix(props.data.ens)}
            </Button>
        </div>
    }



    return <DiagramComponent id="container" width={'100%'} height={'530px'} constraints={DiagramConstraints.Default & ~DiagramConstraints.PageEditable} snapSettings={{
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
                    />
                    <Input
                        bordered
                        labelPlaceholder="Wallet Address"
                        color="primary" />
                </Modal.Body>
                <Modal.Footer >
                    <Button auto onPress={closeHandler} css={{ width: "100%" }}>
                        Add
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
                        <Text css={{ textAlign: "left", margin: "0 0 0 10px", }}>
                            {ens}
                        </Text>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <WalletIcon />
                        <Text css={{ textAlign: "left", margin: "0 0 0 10px", }}>
                            {wallet}
                        </Text>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button auto onPress={addHandler} css={{ width: "100%" }}>
                        Add Under This Node
                    </Button>
                </Modal.Footer>
            </>}

        </Modal>
    </DiagramComponent>;
}

export default Diagram;