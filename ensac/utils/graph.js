import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

// new version of graph is still quite unstable
// const APIURL = 'https://gateway.thegraph.com/api/5ca87daf993b060c116315daa3b2b9c3/subgraphs/id/EjtE3sBkYYAwr45BASiFp8cSZEvd1VHTzzYFvJwQUuJx'
const APIURL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

export const GraphClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

export const findSubdomains = async (ensName) => {
    const query = 
    `
    {
        domains (where: {name:"${ensName}"}){
            owner{
                id
            }
            name
            subdomains{
                owner{
                    id
                }
                name
                subdomains{
                    owner{
                        id
                    }
                    name
                    subdomains{
                        owner{
                            id
                        }
                        name
                    }
                }
            }
        }
  }    `
    const data = await GraphClient
    .query({
        query: gql(query),
    })

    return data;
}

export const findAddress = async (ensName) => {
    const query = 
    `
    {
        domains (where: {name:"${ensName}"}){
            owner{
                id
            }
            name
        }
    }
    `
    console.log(query)
    const data = await GraphClient.query({
        query: gql(query),
    })

    return data;
}