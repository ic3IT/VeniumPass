import { useState, useEffect, useMemo } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Flex, Button, Input, Text, MenuButton } from "@chakra-ui/react";
import scrolliumPass from "./ScrolliumPass.json";
import sc from "./assets/social-media-icons/ssc.gif";
import detectEthereumProvider from "@metamask/detect-provider";
import {
  useContractRead,
  useContract,
  useContractWrite,
  useAddress,
  ThirdwebProvider,
  ChainId,
  useDisconnect,
  useCoinbaseWallet,
  useWalletConnect,
  useNFTDrop,
  EditionDrop,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";
import { useMetamask } from "@thirdweb-dev/react";
import MetaMaskOnboarding from "@metamask/onboarding";
import TT from "./conthrax-sb.otf";
import { Toaster, toast } from "react-hot-toast";
import {
  ChakraProvider,
  extendTheme,
  Menu,
  MenuList,
  MenuItem,
  IconButton,
  Grid,
  Divider,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
} from "@chakra-ui/react";
import { MetamaskLogo } from "./assets/icons/MetamaskLogo.tsx";
import { WalletConnectLogo } from "./assets/icons/WalletConnectLogo.tsx";
import { CoinbaseLogo } from "./assets/icons/CoinbaseLogo.tsx";

import {
  useClaimedNFTSupply,
  useContractMetadata,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useClaimNFT,
  useBalance,
  MediaRenderer,
  useNetworkMismatch,
  useNetwork,
  useClaimIneligibilityReasons,
} from "@thirdweb-dev/react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";
import { ScrollSepoliaTestnet } from "@thirdweb-dev/chains";

const contractAddress = "0xFbBce08d3395314C70EC7696AEb9A1882C893632";

const MaintMint = ({ accounts, setAccounts }) => {
  const { contract } = useContract(contractAddress);

  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithMetamask = useMetamask();

  const address = useAddress();
  const disconnect = useDisconnect();
  const { data: stock } = useContractRead(contract, "totalMinted");
  // const { mutateAsync: claim } = useContractWrite(contract, "claim");
  const d = 65;

  const { contract: editionDrop } = useContract(contractAddress);
  const tokenId = 0;
  
  const {
    data: totalCirculatingSupply,
    isLoading,
    error,
  } = useTotalCirculatingSupply(contract);
  const { data: count } = useTotalCount(contract);

  const { data: contractMetadata } = useContractMetadata(contract);
  const x = d;
  const mint = async () => {
    try {
        // Your transaction call
        await contract.erc721.claim(1);
        toast.success("Mint Successful");
    } catch (error) {
        console.error("Error encountered:", error);

        // Check for the specific pattern in the error message
        if (error.message.includes('Transaction reverted without a reason string')) {
            toast.error("Insuffienct Funds for Mint");
        } else {
            // Handle other errors
            toast.error("An unexpected error occurred.");
        }
    }
};





  const desiredNetwork = {
    chainId: "0x82750",
    chainName: "Scroll",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.scroll.io"],
    blockExplorerUrls: ["https://scrollscan.com/"],
  };

  async function requestNetworkSwitch(provider) {
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [desiredNetwork],
      });
    } catch (switchError) {
      console.error(switchError);
      // Handle the error, maybe alert the user they need to switch manually or the network details are wrong
    }
  }

  function CountdownTimer({ targetDate }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                // seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
          <Text as="span" fontSize="13px" key={interval}>
              {timeLeft[interval]} {interval}{" "}
          </Text>
        );
    });

    return (
        <div>
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
}

  return (
    <Flex justify="center" align="center" height="70vh" paddingBottom="20px" paddingTop='60px'>
      <Toaster position="top-center" />
      <Box width="600px" height="950px">
        <div>
          <Text fontSize="60px" textShadow="0 5px #000000">
            Scrollium Pass
          </Text>
          <Flex justify="center">
          <CountdownTimer targetDate="2024-02-16"/> 
         </Flex>
        </div>
        {/* <div>
          <Text>
            Mint price: 0.002.ETH
          </Text>
        </div> */}
        <Flex justify="center" >
          <Text>
            Total Minted: {stock?.toNumber()} / 333{" "}
          </Text>
        </Flex>
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
              paddingBottom="100px"
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
                value="1"
              />
              <Text fontSize="14px">
            Mint price: 0.002.ETH
            </Text>

              <Box
                onClick={mint}
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
            paddingBottom="100px"
          >
            <Menu placement="bottom">
              <MenuButton
                background="black" // Set the background to black
                color="white" // Set the text color to white
                as={Button}
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
                Connect wallet
              </MenuButton>

              <MenuList>
                <MenuItem
                  background="black"
                  color="white"
                  icon={<MetamaskLogo />}
                  onClick={async () => {
                    try {
                      // Connect to MetaMask. If this function doesn't actually connect, adjust accordingly.

                      // After connecting, try to switch the network
                      if (window.ethereum) {
                        await requestNetworkSwitch(window.ethereum);
                        await connectWithMetamask();
                      } else {
                        console.error(
                          "Ethereum provider (MetaMask) is not connected or not available."
                        );
                      }
                    } catch (error) {
                    toast.error('Oeps something went wrong')
                      console.error("An error occurred:", error);
                    }
                  }}
                >
                  Connect MetaMask
                </MenuItem>

                <MenuItem
                  background="black" // Set the background to black
                  color="white" // Set the text color to white
                  icon={<WalletConnectLogo />}
                  onClick={async () => {
                    try {
                      // Connect to MetaMask. If this function doesn't actually connect, adjust accordingly.

                      // After connecting, try to switch the network
                      if (window.ethereum) {
                        await requestNetworkSwitch(window.ethereum);
                        await connectWithWalletConnect();
                      } else {
                        toast.error('Oeps something went wrong')
                        console.error(
                          "Ethereum provider (MetaMask) is not connected or not available."
                        );
                      }
                    } catch (error) {
                      console.error("An error occurred:", error);
                    }
                  }}
                >
                  Connect with Wallet Connect
                </MenuItem>
                <MenuItem
                  background="black" // Set the background to black
                  color="white" // Set the text color to white
                  icon={<CoinbaseLogo />}
                  onClick={async () => {
                    try {
                      // Connect to MetaMask. If this function doesn't actually connect, adjust accordingly.

                      // After connecting, try to switch the network
                      if (window.ethereum) {
                        await requestNetworkSwitch(window.ethereum);
                        await connectWithCoinbaseWallet();
                      } else {
                        toast.error('Oeps something went wrong')
                        console.error(
                          "Ethereum provider (MetaMask) is not connected or not available."
                        );
                      }
                    } catch (error) {
                      console.error("An error occurred:", error);
                    }
                  }}
                >
                  Connect with Coinbase Wallet
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default MaintMint;
