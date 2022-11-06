import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const APIURL = 'https://gateway.thegraph.com/api/5ca87daf993b060c116315daa3b2b9c3/subgraphs/id/EjtE3sBkYYAwr45BASiFp8cSZEvd1VHTzzYFvJwQUuJx'

export const GraphClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

export const findSubdomains = (ensName) => {
    const query = 
    `
    {
        domains (where: {name:"julieshi.eth"}){
            id
            name
            labelName
            subdomains{
                id
                name
                labelName
                subdomains{
                    id
                    name
                    labelName
                    subdomains{
                        id
                        name
                        labelName
                    }
                }
            }
        }
    }
    `
    console.log("jere");
    GraphClient
    .query({
        query: gql(query),
    })
    .then((data) => console.log('Subgraph data: ', data))
    .catch((err) => {
        console.log('Error fetching data: ', err)
    })
}