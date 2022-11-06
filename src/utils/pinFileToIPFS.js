import axios from "axios";

const pinFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);
    return axios.post(url, data, {
            headers: {
                pinata_api_key: "a1f78fdb57fc004b86b3",
                pinata_secret_api_key: "4e7d1be662a1e666612afb308e9673bbbf32dc9233a99cd50ebc19ae1d5104fb",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        })
        .then(function (response) {
            return response.data.IpfsHash;
        })
        .catch(function (error) {
            console.log(error)
        });
};

export default pinFileToIPFS;