import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

function InputEns(props) {
  const { setIsEns } = props;
  const [ens, setEns] = useState("");

  function handleGo() {
    sessionStorage.setItem('isEns', ens);
    setIsEns(true);
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
