import { useState } from 'react';
import lit from '../utils/lit';
import pinFileToIPFS from '../utils/pinFileToIPFS';

function App() {

  const [file, setFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [eHash, setEHash] = useState("")

  const selectFile = (e) => {
    setFile(e.target.files[0]);
    setEncryptedFile(null);
    setEncryptedSymmetricKey(null);
    setFileSize(0);
  }

  const encryptFile = async () => {
    if (file === null) {
      alert("Please select a file before encrypting!");
      return;
    }

    const { encryptedFile, encryptedSymmetricKey } = await lit.encryptFile(file, ["0x14589BDFdbe3044501044df5B6d53be2f47e92e5"]);
    setEncryptedFile(encryptedFile);
    setEncryptedSymmetricKey(encryptedSymmetricKey);
    console.log(encryptedFile)
    const IpfsHash = await pinFileToIPFS(encryptedFile);
    console.log(IpfsHash)
    setEHash(IpfsHash)
    setFileSize(0);
  }

  const decryptFile = async () => {
    const encryptedFile = await fetch('https://flamingle.mypinata.cloud/ipfs/'+eHash)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {            
            return blob;
    });
    console.log(encryptedFile)
    try {
      const decrypted = await lit.decryptFile(encryptedFile, encryptedSymmetricKey, ["0x14589BDFdbe3044501044df5B6d53be2f47e92e5"]);
      const IpfsHash = await pinFileToIPFS(decrypted);
      console.log(IpfsHash)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
        <h1>Encrypt & Decrypt a file using Lit SDK</h1>
        <input type="file" name="file" onChange={selectFile} />
        <div>
          <button onClick={encryptFile}>Encrypt</button>
          <button onClick={decryptFile}>Decrypt</button>
        </div>
        {(encryptedFile !== null && fileSize === 0) && (
          <h3>File Encrypted: {file.name}. Thanks for using Lit!</h3>
        )}
        {fileSize > 0 && (
          <h3>File Decrypted: {file.name} of {fileSize} bytes</h3>
        )}
    </div>
  );
}

export default App;
