import { ChevronCompactDown, ChevronCompactLeft } from "react-bootstrap-icons";
import { Group, Menu, Button, Flex } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import ColorScheme from "../color_scheme/ColorScheme";
import Api from "../../utils/Api";
import { useContext } from "react";
import { userContext } from "../layouts/home/Home";

interface UserBarProps {
  username: string;
  goBack: boolean;
  isBackOffice?: boolean ;
  setIsBackOffice?: React.Dispatch<React.SetStateAction<boolean>> | null;
  goBackToCatalog?: boolean;
}

const UserBar: React.FC<UserBarProps> = ({ username, goBack,isBackOffice, setIsBackOffice, goBackToCatalog }) => {
  let navigate = useNavigate();
  const { userType } = useContext(userContext);


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
        {goBackToCatalog && (
            <Button variant="light" leftSection={<ChevronCompactLeft />}
            onClick={() => navigate("/")}>
              Go To Catalog
            </Button>
          )}

          {goBack && (
            <Button variant="light" leftSection={<ChevronCompactLeft />}
            onClick={() => navigate(-1)}>
              Go back
            </Button>
          )}

          { userType != "User" && setIsBackOffice &&(
             <Button variant="light" onClick={() => { 
              setIsBackOffice(prevState => {
                const newValue = !prevState;
                return newValue;
              });             
            }}>
              {isBackOffice ? "Catalog" : "Back Office"}
            </Button>
          )}
        </Group>

        <Group>
        { userType != "User" && isBackOffice &&(
             <Button variant="light" onClick={() => navigate('/newevent')}>
              Add New Event
            </Button>
          )}
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
                  <Link to="/personal-space">Personal Space</Link>
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
