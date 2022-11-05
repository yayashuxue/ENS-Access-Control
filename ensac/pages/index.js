import React from "react";
import { Navbar, Button, Link, Text, Card, Radio } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { Logo } from "./Logo.js";

export default function Home() {
  const [variant, setVariant] = React.useState("static");

  const variants = ["static", "floating", "sticky"];

  return (
    <Layout>
      <Navbar isBordered variant={variant}>
        <Navbar.Brand>
          <Logo />
        </Navbar.Brand>
        <Navbar.Content hideIn="xs">
          <Navbar.Link href="/files">Files</Navbar.Link>
          <Navbar.Link href="#">Company</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Link color="inherit" href="#">
            Login
          </Navbar.Link>
          <Navbar.Item>
            <Button auto flat as={Link} href="#">
              Sign Up
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </Layout>
  )
}
