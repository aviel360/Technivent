import { ChevronCompactDown, ChevronCompactLeft } from "react-bootstrap-icons";
import { Group, Menu, Button, Flex } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import ColorScheme from "../color_scheme/ColorScheme";
import Api from "../../utils/Api";

interface UserBarProps {
  username: string;
  goBack: boolean;
}

const UserBar: React.FC<UserBarProps> = ({ username, goBack }) => {
  let navigate = useNavigate();

  const logoutClick = async (): Promise<void> => {
    const apiService = new Api();
    const response = await apiService.logout();

    if (response) {
      window.alert(response.data);
      if (response.status == 200) {
        navigate("/login");
      }
    }
  };

  return (
      <Flex miw={'50rem'} mih={50} align="center" direction="row" justify={"space-between"} wrap="wrap" columnGap={"sm"}>
        <Group>
          {goBack && (
            <Button variant="light" leftSection={<ChevronCompactLeft />}>
              Go back
            </Button>
          )}
        </Group>

        <Group>
          {!username ? (
              <Link to="/login">Login</Link>
          ) : (
            <Menu withArrow>
              <Menu.Target>
                <Button variant="light" rightSection={<ChevronCompactDown size="1rem" />}>
                  {username}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Link to={username}>Personal Space</Link>
                </Menu.Item>
                <Menu.Item onClick={logoutClick}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          <ColorScheme />
        </Group>
      </Flex>
  );
};

export default UserBar;
