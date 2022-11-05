import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();
const chain = "ethereum";

const getAccessControlConditions = (ensdomains) => { // input a list of ens domains
    const ensdomainsAddresses = ensdomains; // need to call api
    const accessControlConditions = []

    for(let i = 0; i < ensdomains.length; i++){
        const codition = {
            contractAddress: '',
            standardContractType: '',
            chain,
            method: '',
            parameters: [
              ':userAddress',
            ],
            returnValueTest: {
              comparator: '=',
              value: ensdomainsAddresses[i]
            }
        };
        const or = {"operator": "or"};
        accessControlConditions.push(codition);
        if(i != ensdomains.length-1){
            accessControlConditions.push(or);
        }
    }

    return accessControlConditions;
}

class Encrypt {
    litNodeClient;

    async connect() {
        await client.connect();
        this.litNodeClient = client;
    }

    async encryptHash(hash, ensdomains) {
        if (!this.litNodeClient) {
            await this.connect();
        }
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(hash);

        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
            accessControlConditions: getAccessControlConditions(ensdomains),
            symmetricKey,
            authSig,
            chain,
        });

        return {
            encryptedString,
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        };
    }

    async decryptHash(encryptedString, encryptedSymmetricKey, ensdomains) {
        if (!this.litNodeClient) {
          await this.connect();
        }
    
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
        const symmetricKey = await this.litNodeClient.getEncryptionKey({
            accessControlConditions: getAccessControlConditions(ensdomains),
            toDecrypt: encryptedSymmetricKey,
            chain,
            authSig
        });
        
        console.log(symmetricKey)
        return await LitJsSdk.decryptString(
            encryptedString,
            symmetricKey
        );
    }
}

export default new Encrypt();