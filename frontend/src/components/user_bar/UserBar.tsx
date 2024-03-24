import { ChevronCompactDown, ChevronCompactLeft } from "react-bootstrap-icons";
import { Group, Menu, Button, Flex, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import ColorScheme from "../color_scheme/ColorScheme";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string;
}

const UserBar: React.FC<UserButtonProps> = () => {
  return (
    <Container h={50} w="100vw" mt="md">
      <Flex mih={50} align="center" direction="row" justify={"space-between"} wrap="wrap" columnGap={"sm"}>
        <Button variant="light" leftSection={<ChevronCompactLeft />}>
          Go back
        </Button>

        <Group>
          <Menu withArrow>
            <Menu.Target>
              <Button variant="light" rightSection={<ChevronCompactDown size="1rem" />}>
                Username
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Link to="personal-space">Personal Space</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="login">Logout</Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ColorScheme />
        </Group>
      </Flex>
    </Container>
  );
};

export default UserBar;
