
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DiagramComponent, Inject, DataBinding, HierarchicalTree, SnapConstraints, DiagramConstraints } from "@syncfusion/ej2-react-diagrams";
import { DataManager, Query } from '@syncfusion/ej2-data';
//Initializes data source
let data = [{
    Id: "Flamingle.eth",
},
{
    Id: "Tech.Flamingle.eth",
    Team: "Flamingle.eth"
},
{
    Id: "Design.Flamingle.eth",
    Team: "Flamingle.eth"
},
{
    Id: "R&D.Tech.Flamingle.eth",
    Team: "Tech.Flamingle.eth"
},
{
    Id: "Test.Tech.Flamingle.eth",
    Team: "Tech.Flamingle.eth"
},
{
    Id: "DS.Tech.Flamingle.eth",
    Team: "Tech.Flamingle.eth"
},
{
    Id: "UI.Design.Flamingle.eth",
    Team: "Design.Flamingle.eth"
},
{
    Id: "UX.Design.Flamingle.eth",
    Team: "Design.Flamingle.eth"
},
{
    Id: "Product.Design.Flamingle.eth",
    Team: "Design.Flamingle.eth"
},
];
let items = new DataManager(data, new Query().take(7));

function node(props) {
    console.log(props);
    return <button type="button" id="button">{props.data.Id}</button>
}

function Diagram() {
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
            id: 'Id',
            parentId: 'Team',
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
    </DiagramComponent>;
}

export default Diagram;