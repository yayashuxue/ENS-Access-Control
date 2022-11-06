import { Loading } from "@nextui-org/react";

function ComponentLoader() {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", zIndex: "999", backgroundColor: "white" }}>
        <Loading size="lg" />
    </div>

}

export default ComponentLoader;