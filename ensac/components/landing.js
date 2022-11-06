import { Text } from "@nextui-org/react";

function LandingPage() {
    return <div id="landing-background">
        <div style={{ width: "70vw" }}>
            <Text
                h1
                size={60}
                css={{
                    textGradient: "45deg, $blue600 -20%, $pink600 50%",
                }}
                weight="bold"
            >
                Org3 - Better organization management empowered by ENS access control
            </Text>
            <Text
                h2
                weight="bold"
            >
                Please connect wallet to begin.
            </Text>
        </div>

    </div>;
}

export default LandingPage;
