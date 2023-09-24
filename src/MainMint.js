import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Flex, Button, Input, Text } from "@chakra-ui/react";
import scrolliumPass from "./ScrolliumPass.json";
import sc from "./assets/social-media-icons/ssc.gif";
import detectEthereumProvider from '@metamask/detect-provider';
import { useContractRead, useContract,useContractWrite, useAddress, ThirdwebProvider, ChainId, useDisconnect } from "@thirdweb-dev/react";
import { useMetamask } from '@thirdweb-dev/react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { Toaster, toast } from 'react-hot-toast';


const METAMASK_DEEPLINK = "https://metamask.app.link/dapp/scrollium.vercel.app/"; // Replace with your MetaMask deeplink

const MaintMint = ({ accounts, setAccounts }) => {
    const { contract, isLoading } = useContract(
        process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
      );
    const address = useAddress();
    const disconnect = useDisconnect();
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const connectWithMetamask = useMetamask();
    const { mutateAsync: approve  } = useContractWrite(contract, "approve")
    const { mutateAsync: claim, } = useContractWrite(contract, "claim")
    const desiredNetwork = {
        chainId: '0x8274F',
        chainName: 'Scroll Alpha Testnet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://sepolia-rpc.scroll.io'],
        blockExplorerUrls: ['https://sepolia-blockscout.scroll.io']
    };

    useEffect(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.muted = true;
            video.play();
        });
    }, []);

    useEffect(() => {
        const checkInstallation = async () => {
            const provider = await detectEthereumProvider();
            setIsMetaMaskInstalled(!!provider);
        };

        checkInstallation();
    }, []);

    async function requestNetworkSwitch(provider) {
        try {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [desiredNetwork],
            });
        } catch (switchError) {
            console.error(switchError);
            // Handle the error, maybe alert the user they need to switch manually or the network details are wrong
        }
    }
    
    const handleLoginClick = async (e) => {
        e.preventDefault();

        if (!isMetaMaskInstalled) {
            window.open(METAMASK_DEEPLINK, '_blank');
            toast.error('MetaMask is not installed!');
            return;
        }

        const { ethereum } = window;
        if (ethereum && ethereum.isMetaMask) {
            if (ethereum.chainId !== desiredNetwork.chainId) {
                await requestNetworkSwitch(ethereum);
            }
            // After ensuring the correct network or prompting to switch, proceed to connect with MetaMask
            connectWithMetamask();
        } else {
            console.log('Please install MetaMask!');
        }
    };

    const handleOneClick = async () => {
        try {
            // First approve
            await approve();
    
            // Once approve is successful, then claim
            await claim();
            
            // Optionally, display success message or perform some action here
    
        } catch (error) {
            // Handle any errors that might occur during approve or claim
            console.error('Error during one-click operation:', error);
        }
    }
    
    

 
  return (
    <Flex justify="center" align="center" height="70vh" paddingBottom="20px">
      <Box width="600px">
        <div className="">
          <Text fontSize="60px" textShadow="0 5px #000000">
            Scrollium Pass
          </Text>
        </div>
        <div>
          <img src={sc} className="items-center justify-center" />
        </div>
        {address ? (
          <div>
            <Flex
              justify="center"
              align="center"
              flexDirection="column"
              height="35vh"
              paddingBottom="20px"
            >
              <Input
                readOnly
                fontFamily="inherit"
                width="100px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value='1'
              />

              <Box
                onClick= {handleOneClick}
                width="20rem"
                display="flex" // Set this to flex
                alignItems="center" // Center content vertically
                justifyContent="center" // Center content horizontally
                margin="50px 15px"
                cursor="pointer"
                className="animate-bounce0"
                boxShadow="lg"
                border="2px solid"
                borderColor="#FFFFFF"
                _hover={{ bg: "gray.200" }}
                role="button"
                transition="0.3s"
                padding="20px 20px" // Adjust the size of the box around the content
                fontSize="1.5rem" // Increase the font size
                fontWeight="bold" // Make the text bold for emphasis
              >
                Mint Now
              </Box>
            </Flex>
          </div>
        ) : (
          <Flex
            justify="center"
            align="center"
            height="35vh"
            paddingBottom="20px"
          >
            <Box
              onClick={handleLoginClick}
              width="30rem"
              display="flex" // Set this to flex
              alignItems="center" // Center content vertically
              justifyContent="center" // Center content horizontally
              margin="20px 20px"
              cursor="pointer"
              className="animate-bounce0"
              boxShadow="lg"
              border="2px solid"
              borderColor="#FFFFFF"
              _hover={{ bg: "gray.200" }}
              role="button"
              transition="0.3s"
              padding="20px 20px" // Adjust the size of the box around the content
              fontSize="1.5rem" // Increase the font size
              fontWeight="bold" // Make the text bold for emphasis
            >
              Connect Account
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default MaintMint;
