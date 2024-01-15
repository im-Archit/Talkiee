import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import React from 'react'
import { useState } from "react";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useDisclosure } from "@chakra-ui/hooks";
import { useHistory } from "react-router-dom"
import axios from 'axios';
import ChatLoading from '../UserAvatar/ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import {Spinner} from "@chakra-ui/spinner"
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {

  
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

     const {
       user,
       setSelectedChat,
       chats,
       setChats,
       selectedChat,
       notification,
       setNotification,
     } = ChatState();
     const history = useHistory();
     const { isOpen, onOpen, onClose } = useDisclosure()

     const logoutHandler = () =>{
      localStorage.removeItem("userInfo");
      history.push("/");
     }

     const toast = useToast();


 const handleSearch= async () =>{
      if(!search) {
        toast({
          title: "Please Enter Something",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.get(`/api/user?search=${search}`, config)
        setLoading(false);
        setSearchResult(data);

      } catch (error){
            toast({
              title: "An error occured",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
      }
     }


     const accessChat = async (userId) => {
        try {
          setLoadingChat(true)
          const config = {
            headers: {
              "Content-type":"application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };

          const {data} = await axios.post('/api/chat', {userId} , config);

          if( !chats.find((c) => c._id === data._id)) setChats([data,...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
          toast({
            title: "An error occured in fetching chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }

     };

  return (
    <>
      <Box
        marginTop="0px"
        display="flex"
        justifyContent="space-between"
        alignItems="center" // Align items vertically to center them
        w="100%"
        bg="#5CDB94"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "block" }} pl="2">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work-sans">
          Talkiee
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.lenght}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.lenght && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.user)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="2px">Search users </DrawerHeader>
          <DrawerBody>
            <Box display="flex">
              <Input
                placeholder="Search name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer
