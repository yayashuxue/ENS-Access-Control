import { useState } from 'react';
import Encrypt from '../utils/encrypt';
import pinFileToIPFS from '../utils/pinFileToIPFS';

function App() {

    const [file, setFile] = useState(null);
    const [hash, setHash] = useState(null);
    const [decryptedHash, setDecryptedHash] = useState(null);
    const [encryptedDescriptionString, setEncryptedDescriptionString] = useState(null);
    const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null);
    const [loading, setLoading] = useState(false);

    const selectFile = async (e) => {
        setLoading(true);
        setFile(e.target.files[0]);
        console.log("Upload")
        const IpfsHash = await pinFileToIPFS(e.target.files[0]);

        setHash(IpfsHash);

        const { encryptedString, encryptedSymmetricKey } = await Encrypt.encryptHash(IpfsHash, ["0x14589BDFdbe3044501044df5B6d53be2f47e92e5"])
        const encryptedDescriptionString = await blobToBase64(encryptedString);
        console.log(encryptedDescriptionString);
        console.log(encryptedSymmetricKey);
        setEncryptedDescriptionString(encryptedDescriptionString);
        setEncryptedSymmetricKey(encryptedSymmetricKey);
        setLoading(false);
        console.log("Encrypt Done")
    }

    const blobToBase64 = blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };
    
    const decryptHashFromContract = async (encryptedString, encryptedSymmetricKey) => {
        const encryptedStringBlob = await (await fetch(encryptedString)).blob();

        try {
            const decryptedHash = await Encrypt.decryptHash(encryptedStringBlob, encryptedSymmetricKey, ["0x14589BDFdbe3044501044df5B6d53be2f47e92e5"]);
            console.log(decryptedHash)
            setDecryptedHash(decryptedHash)
        } catch (error) {
            console.log(error);
        }

        // Set decrypted string
        // setDescription(decryptedDescription);
    }

    return (
        <div className="App">
            <h1>Test</h1>
            <input type="file" name="file" onChange={selectFile} />
            <div>
                <button onClick={() => decryptHashFromContract(encryptedDescriptionString, encryptedSymmetricKey)}>Decrypt</button>
            </div>
            <h3>R:{hash}</h3>
            <h3>D:{decryptedHash}</h3>
        </div>
    );
}

export default App;
