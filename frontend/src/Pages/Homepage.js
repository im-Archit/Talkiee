import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Popover,
} from "@chakra-ui/react";
import React from 'react'
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChatIcon } from "@chakra-ui/icons";

const Homepage = () => {

    const history = useHistory();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (user) {
        history.push("/chats");                                    //// if login not working
      }
    }, [history]);

  return (
    <Container maxW="xl" centerContent backdropBlur="2xl">
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        color="white"
        bg={"#5CDB94"}
        border="8px solid #389583"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="Open Sans"
          fontWeight="bold"
          color="white"
        >
          <ChatIcon colorScheme="blue" fontSize="5xl" /> Talkiee
        </Text>
      </Box>
      <Box
        bg={"#5CDB94"}
        border="8px solid #389583"
        color="white"
        w="100%"
        p="4"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em" color="white" w="100%">
            <Tab width="50%" color="white">
              Login
            </Tab>
            <Tab width="50%" color="white">
              Signup
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage
