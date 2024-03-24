import { forwardRef } from "react";
import { ChevronCompactDown, ChevronCompactLeft } from "react-bootstrap-icons";
import { Group, Text, Menu, UnstyledButton, Button, Flex, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import ColorScheme from "../color_scheme/ColorScheme";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(({ name, ...others }: UserButtonProps, ref) => (
  <UnstyledButton
    ref={ref}
    style={{
      padding: "var(--mantine-spacing-md)",
      color: "var(--mantine-color-text)",
      borderRadius: "var(--mantine-radius-sm)",
    }}
    {...others}
  >
    <Group>
      <div style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          {name}
        </Text>
      </div>

      <ChevronCompactDown size="1rem" />
    </Group>
  </UnstyledButton>
));

const UserBar: React.FC<UserButtonProps> = () => {
  return (
    <Container h={50} w="100vw" mt="md">
      <Flex mih={50} align="center" direction="row" justify={"space-between"} wrap="wrap" columnGap={"sm"}>
        <Menu withArrow>
          <Menu.Target>
            <UserButton name="User"/>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>
              <Link to="personal-space">Personal Space</Link>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Flex
          direction="row"
        >
          <Button variant="light" leftSection={<ChevronCompactLeft />} right={5}>
              Go back
          </Button>
          <ColorScheme/>
        </Flex>
      </Flex>
    </Container>
  );
}

export default UserBar;
