import { ChevronCompactDown, ChevronCompactLeft } from "react-bootstrap-icons";
import { Group, Menu, Button, Flex, Badge } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import ColorScheme from "../color_scheme/ColorScheme";
import Api from "../../utils/Api";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../layouts/home/Home";

interface UserBarProps {
  username: string;
  goBack: boolean;
  isBackOffice?: boolean;
  setIsBackOffice?: React.Dispatch<React.SetStateAction<boolean>> | null;
  refreshKey?: number;
}

const UserBar: React.FC<UserBarProps> = ({ username, goBack, isBackOffice, setIsBackOffice, refreshKey }) => {
  let navigate = useNavigate();
  const { userType } = useContext(userContext);
  const [userClosestEvent, setUserClosestEvent] = useState(null);
  const [closestEventDate, setClosestEventDate] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);

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

  const fetchUserClosestEvent = async () => {
    const apiService = new Api();
    const response = await apiService.getUserClosestEvent();
    if (!response.data) {
      await setUserClosestEvent(null);
      await setClosestEventDate(null);
    } else {
      const eventDate = new Date(response.data.eventStartDate);
      const formattedDate = `${eventDate.getDate().toString().padStart(2, "0")}/${(eventDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${eventDate.getFullYear()}`;
      await setUserClosestEvent(response.data.eventName);
      await setClosestEventDate(formattedDate);
    }
  };

  useEffect(() => {
    fetchUserClosestEvent();
  }, [userClosestEvent, closestEventDate, refreshKey]);
  
  useEffect(() => {
    if (userClosestEvent !== null && closestEventDate !== null) {
      setLoadingEvent(false);
    }
  }, [userClosestEvent, closestEventDate]);

  return (
    <Flex miw={"50rem"} mih={50} align="center" direction="row" justify={"space-between"} wrap="wrap" columnGap={"sm"}>
      <Group>
        {goBack && (
          <Button variant="light" leftSection={<ChevronCompactLeft />} onClick={() => navigate(-1)}>
            Go back
          </Button>
        )}

        {userType != "User" && setIsBackOffice && (
          <Button
            variant="light"
            onClick={() => {
              setIsBackOffice((prevState) => {
                const newValue = !prevState;
                return newValue;
              });
            }}
          >
            {isBackOffice ? "Catalog" : "Back Office"}
          </Button>
        )}
      </Group>

      <Group>
        {userType != "User" && isBackOffice && (
          <Button variant="light" onClick={() => navigate("/newevent")}>
            Add New Event
          </Button>
        )}
        {!username ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <Badge
              bg={"rgba(90, 185, 90, 1)"}
              p={"md"}
              radius={"sm"}
              style={{ textTransform: "none", fontSize: "0.8rem" }}
            >
              {loadingEvent ? "Loading..." : `Closest Event: ${userClosestEvent} (${closestEventDate})`}
            </Badge>
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
          </>
        )}
        <ColorScheme />
      </Group>
    </Flex>
  );
};

export default UserBar;
