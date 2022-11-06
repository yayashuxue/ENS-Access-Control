import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { findSubdomains } from '../utils/graph';

function InputEns(props) {
  const { setIsEns } = props;
  const [ens, setEns] = useState("");

  const handleGo = async (event) => {
    event.preventDefault();
    let intheOrganization = await getSubdomainData(ens);
    if (intheOrganization) {
      sessionStorage.setItem('isEns', ens);
      setIsEns(true);
    } else {
      toast.error("You are not in this organization!")
    }
  }

  const getSubdomainData = async (domainName) => {

    let data = await findSubdomains(domainName)
    console.log(data.data);


    //return (true/false)
    return false;
  }


  function handleEnsChange(event) {
    setEns(event.target.value);
  }

  return (
    <form
      onSubmit={handleGo}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        flexGrow: 0
      }}>

      <Input labelPlaceholder="Organization's ENS address" css={{ width: "300px" }} value={ens} onChange={handleEnsChange} />
      <Button type="submit" css={{ marginLeft: "10px" }}>
        Go
      </Button>

    </form>
  )
}

export default InputEns;
