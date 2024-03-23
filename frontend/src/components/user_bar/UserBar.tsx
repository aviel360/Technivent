import { forwardRef } from "react";
import { ChevronCompactRight } from "react-bootstrap-icons";
import { Group, Text, Menu, UnstyledButton, Button, Flex } from "@mantine/core";
import { Link } from "react-router-dom";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ name, ...others }: UserButtonProps, ref) => (
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

        <ChevronCompactRight size="1rem" />
      </Group>
    </UnstyledButton>
  )
);

function UserBar() {
  return (
    <Flex
      mih={50}
      bg="rgba(0, 0, 0, .3)"
      align="center"
      direction="row"
      justify={"space-between"}
      wrap="wrap"
      columnGap={'sm'}
    >
      <Menu withArrow>
        <Menu.Target>
          <UserButton name="User" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Link to="personal-space">Personal Space</Link>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button right={5}>Go back</Button>
    </Flex>
  );
}

export default UserBar;
