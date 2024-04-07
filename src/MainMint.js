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
import { ConnectWallet } from "@thirdweb-dev/react";
import { useRef } from "react";

const contractAddress = "0x1e62eC2e1813a3305B3Fe7099347dF50b1E73923";

const MaintMint = ({ accounts, setAccounts }) => {
  const { contract } = useContract(contractAddress);
  const address = useAddress();
  const { data: availableForWithdrawal } = useContractRead(
    contract,
    "availableForWithdrawal",
    [address]
  );  
  const etherAmount = ethers.utils.formatUnits(availableForWithdrawal || 0, 18);
  console.log(etherAmount)

  const isCooldown = useRef(false);

  const { mutateAsync: withdrawTokens } = useContractWrite(
    contract,
    "withdrawTokens"
  );

  const handleWithdraw = async () => {
    if (isCooldown.current) {
      return;
    }
    const notification = toast.loading("Withdraw Tokens...");

    if ( availableForWithdrawal === 0) {
      toast.error("No Tokens Unlocked Yet")
    }

    try {
      const data = await withdrawTokens({ args: [] }, );
      if ( availableForWithdrawal === 0) {
        toast.error("No tokens eligble")
      }

      toast.success("Withdraw succesfully!", {
        id: notification,
        duration: 300
      });
    } catch (err) {
      toast.error("No tokens for withdraw", {
        id: notification,
        duration: 300
      } ); 

      console.error("contract call failure", err);
    } finally {
      // Reset the cooldown after 3 seconds, whether the try block succeeded or caught an error
      setTimeout(() => {
        isCooldown.current = false;
      }, 3000);
  };
}





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
        {/* <Flex justify="center" >
          <Text>
            Total Minted: {stock?.toNumber() + x}{" "}
          </Text>
        </Flex> */}
        <div>
          <img src={sc} className="items-center justify-center" />
        </div>
        {address ? (
          <div>
             <Flex justify="center"
              align="center"
              >
                <span>Elgible for {etherAmount}</span>
              </Flex>
            {/* <Flex
              justify="center"
              align="center"
              flexDirection="column"
              height="35vh"
              paddingBottom="100px"
            >
              <Flex>
                <span>Elgible for {etherAmount}</span>
              </Flex>
              <Box
                onClick={handleWithdraw}
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
                fontSize="1rem" // Increase the font size
                fontWeight="bold" // Make the text bold for emphasis
              >
                Withdraw
              </Box>
            </Flex> */}
          </div>
        ) : (
          <Flex
            justify="center"
            align="center"
            height="35vh"
            paddingBottom="100px"
          >
            <ConnectWallet/>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default MaintMint;
