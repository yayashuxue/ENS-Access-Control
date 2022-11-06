import { Input  } from '@nextui-org/react';

export default function InputEns() {
  return (
      <div
      style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh"
        }}>
      <Input label="ENS address" placeholder="tech.flamingo.eth" />
      <Button onClick={() => alert("change to landing page")}>
            Upload File Securely
      </Button>
      </div>
  )
}
