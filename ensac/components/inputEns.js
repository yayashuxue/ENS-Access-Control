import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

function InputEns(props) {
  const { setIsEns } = props;

  function handleGo() {
    sessionStorage.setItem('isEns', 'true');
    setIsEns(true);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh"
      }}>
      <Input label="ENS address" placeholder="tech.flamingo.eth" />
      <Button onClick={handleGo}>
        Go
      </Button>
    </div>
  )
}

export default InputEns;
