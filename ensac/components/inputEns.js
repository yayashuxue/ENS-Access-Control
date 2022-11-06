import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { findSubdomains } from '../utils/graph';
import { useAccount } from '@web3modal/react';

function InputEns(props) {
  const { setIsEns } = props;
  const [ens, setEns] = useState("");
  const { account } = useAccount();

  const handleGo = async (event) => {
    event.preventDefault();
    let data = await findSubdomains(ens);
    let intheOrganization = checkIfUnderDomain(data.data.domains[0]);
    console.log(account.address);
    if (intheOrganization) {
      sessionStorage.setItem('isEns', ens);
      setIsEns(true);
    } else {
      toast.error("You are not in this organization!")
    }
  }

  const checkIfUnderDomain = (parentdomain) => {
    if(!parentdomain){
      return false;
    }
    if(parentdomain.resolvedAddress && parentdomain.resolvedAddress.id.toLowerCase() == account.address.toLowerCase()){
      return true;
    }
    if(!parentdomain.subdomains){
      return false;
    }
    for(let i = 0; i < parentdomain.subdomains.length; ++i){
      if(checkIfUnderDomain(parentdomain.subdomains[i])){
        return true;
      }
    }
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
