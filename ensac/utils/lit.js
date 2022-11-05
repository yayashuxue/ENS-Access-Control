import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();
const chain = "ethereum";

const getAccessControlConditions = (ensdomains) => { // input a list of ens domains
  const ensdomainsAddresses = ensdomains; // need to call api
  const accessControlConditions = [
      {
          contractAddress: '',
          standardContractType: '',
          chain,
          method: '',
          parameters: [
              ensdomainsAddresses,
          ],
          returnValueTest: {
              comparator: 'contains',
              value: ':userAddress'
          }
      }
  ]

  return [
    {
      contractAddress: '',
      standardContractType: '',
      chain,
      method: '',
      parameters: [
        ':userAddress',
      ],
      returnValueTest: {
        comparator: '=',
        value: '0x14589BDFdbe3044501044df5B6d53be2f47e92e5'
      }
    }
  ]

  return accessControlConditions;
}

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptFile(file, ensdomains) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: getAccessControlConditions(ensdomains),
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedFile: encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }

  async decryptFile(encryptedFile, encryptedSymmetricKey, ensdomains) {
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

    const decryptedFile = await LitJsSdk.decryptFile({
        file: encryptedFile,
        symmetricKey
    });
    return decryptedFile;
  }
}

export default new Lit();
