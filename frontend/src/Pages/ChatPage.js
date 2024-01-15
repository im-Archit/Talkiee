import React, { useEffect } from "react";
import axios from 'axios'
import { useState } from "react";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer"
import { ChatState }from "../Context/ChatProvider"
import ChatBox from "../components/UserAvatar/ChatBox";
import MyChats from "../components/UserAvatar/MyChats";


const ChatPage = () => {

     const [fetchAgain, setFetchAgain] = useState(false);
     const { user } = ChatState();

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer /> }
      <Box display='flex' justifyContent='space-between' w='100%' h='91.5vh' p='15px' > 
        {user && <MyChats  fetchAgain={fetchAgain}/> }
        {user &&( <ChatBox 
          fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}   /> )}
      </Box>

    </div>
  )
};

export default ChatPage;
