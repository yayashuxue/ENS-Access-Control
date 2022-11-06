import { Loading } from "@nextui-org/react";

function Preloader() {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", width: "100vw", height: "100vh", zIndex: "999", backgroundColor: "white" }}>
        <Loading size="xl" />
    </div>

}

export default Preloader;