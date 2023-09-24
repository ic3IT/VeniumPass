import React from 'react';
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react';
import Discord from "./assets/social-media-icons/discord.gif";
import Twitter from "./assets/social-media-icons/twitter.gif";
import sc from "./assets/social-media-icons/sc.gif";
import { useContractRead, useContract,useContractWrite, useAddress, ThirdwebProvider, ChainId, useDisconnect } from "@thirdweb-dev/react";


const NavBar = ({accounts, setAccounts}) => {
    const address = useAddress();
    const disconnect = useDisconnect();
    

    return(
        
        <Flex justify="space-between" align="center" padding="30px">
        
            {/*Left Side - Social Media Icons*/}
            <Flex justify="space-around" width="40%" padding="0px">
                <Link href="https://www.scrollium.io/" target="_blank" rel="noopener noreferrer">
                    <Image src={sc} boxSize="70px" margin="0 15px"/>
                </Link>
            </Flex> 

            
            {/*Right Side - Sections and Connect*/}
            <Flex justify="space-between" align="center" padding="0">
               <Flex justify="space-around" width="40%" padding="75px">
                
            <Spacer />
            <Link href="scrollium.io" target="_blank" rel="noopener noreferrer">
                    <Image src={Twitter} boxSize="50px" margin="0 15px"/>
                </Link>
            <Spacer />      
            <Link href="scrollium.io" target="_blank" rel="noopener noreferrer">
                    <Image src={Discord} boxSize="50px" margin="0 15px"/>
                </Link>
                { address ? (
    <Box 
    onClick={disconnect} 
    boxSize="50px"
    margin="15px 15px 0 15px" 
    cursor="pointer"
    _hover={{ bg: "gray.200" }} // Change the background on hover for visual feedback
    role="button" // For accessibility
    transition="0.3s" // Smoothens the hover effect transition
>
    Disconnect
</Box>

) : null }
            </Flex>
            
      

            
        </Flex>
        
</Flex>


    );
};

export default NavBar;