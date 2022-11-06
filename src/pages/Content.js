import { Text, Spacer } from "@nextui-org/react"
import { Box } from "./Box.js"

export const Content = () => (
  <Box css={{px: "$12", mt: "$8", "@xsMax": {px: "$10"}}}>
    <Text h2>ETH SF</Text>
    <Text size="$lg">
      Welcome to Home
    </Text>

    <Spacer y={1} />
  </Box>
);
