
import React from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { DiagramComponent, Inject, DataBinding, HierarchicalTree, SnapConstraints, DiagramConstraints } from "@syncfusion/ej2-react-diagrams";
import { DataManager, Query } from '@syncfusion/ej2-data';


//Initializes data source
let data = [{
    ens: "Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "Tech.Flamingle.eth",
    team: "Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "Design.Flamingle.eth",
    team: "Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "R&D.Tech.Flamingle.eth",
    team: "Tech.Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "Test.Tech.Flamingle.eth",
    team: "Tech.Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "DS.Tech.Flamingle.eth",
    team: "Tech.Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "UI.Design.Flamingle.eth",
    team: "Design.Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "UX.Design.Flamingle.eth",
    team: "Design.Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
{
    ens: "Product.Design.Flamingle.eth",
    team: "Design.Flamingle.eth",
    wallet: "0xADa31620FA61097CC3dCCaF40215ad74d124aF48"
},
];
let items = new DataManager(data, new Query().take(7));


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
    const [team, setTeam] = React.useState("Default team");
    const [wallet, setWallet] = React.useState("Default wallet");
    const [ens, setEns] = React.useState("Default ENS");
    const [add, setAdd] = React.useState(false);

    const handler = (data) => {
        setAdd(false);
        setTeam(getPrefix(data.ens));
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
            orientation: "LeftToRight",
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
            parentId: 'team',
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
        >
            {add ? <>
                <Modal.Header>
                    <Text id="modal-title" b size={18} >
                        {team}
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
                        {team}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text css={{ textAlign: "left", marginBottom: "0" }}>
                        ENS domain: {ens}
                    </Text>
                    <Text css={{ textAlign: "left" }}>
                        Wallet address: {wallet}
                    </Text>

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