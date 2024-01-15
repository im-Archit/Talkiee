import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useStatStyles } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from 'react-router-dom'

const Signup = () => {
     
    
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
const toast = useToast();

const history = useHistory();

    const handelClick = () => {
        setShow(!show)
    }

     const postDetails=(pics)=>{
            setLoading(true);
            if(pics ===undefined){
                    toast({
                      title: "Please select a image",
                      description: "warning",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: 'bottom',
                    });
                    return
            }
            if(pics.type==="image/jpeg" ||pics.type==="image/png"){
                const data = new FormData();
                data.append("file",pics);
                data.append("upload_preset","chat-app");
                data.append("cloud_name", "dfv6em3rh");
                fetch("https://api.cloudinary.com/v1_1/dfv6em3rh/image/upload", {
                  method: "post",
                  body: data,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setLoading(false);
                  });

            } else {
                toast({
                  title: "Please select a image",
                  description: "warning",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
                });
            }
     };

     const submitHandler = async () => {
      setLoading(true);
      if(!name || !email || !password || !confirmpassword){
        toast({
          title: "Please fill all Fields",
          description: "warning",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      if(password !== confirmpassword){
                toast({
                  title: "Password doesnt match",
                  description: "warning",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
                });
                return;
      }

      try{
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post("/api/user", { name, email ,password , pic}, config);
          toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);

          history.push('/chats')
      } catch(error) {
           toast({
             title: "AN error occured",
             description: error.response.data.message,
             status: "error",
             duration: 5000,
             isClosable: true,
             position: "bottom",
           });
             setLoading(false);

      }

     };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel color="white">Name </FormLabel>
        <Input
          color="white"
          border="1px solid #389583"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" color="white" isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          border="1px solid #389583"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" color="white" isRequired>
        <FormLabel>Password </FormLabel>
        <InputGroup>
          <Input
            border="1px solid #389583"
            placeholder="Enter Password"
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handelClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" color="white" isRequired>
        <FormLabel> Confirm Password </FormLabel>
        <InputGroup>
          <Input
            border="1px solid #389583"
            placeholder="Confirm Password"
            type={show ? "text" : "password"}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handelClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel color="white">Upload Your Picture </FormLabel>
        <Input
          border="1px solid #389583"
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        color="white"
        backgroundColor="rgb(54, 52, 145)"
        colorScheme="blue"
        width="50vh"
        style={{ marginTop: "20px" }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
}

export default Signup
