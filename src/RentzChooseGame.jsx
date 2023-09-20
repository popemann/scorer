import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useMediaQuery
} from "@chakra-ui/react";
import { styled } from "styled-components";
import { colors } from "./style/colors";
import { useState } from "react";
import { RENTZ_GAMES_DETAILED } from "./helpers/constants";

const StyledContentModal = styled(ModalContent)`
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 10px !important;
  max-width: unset !important;
  margin-top: 15px !important;

  & > header {
    background: ${colors.blue}dd !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: white !important;
    padding: 10px 5px 10px 15px;
    font-size: 22px !important;
  }

  & > button {
    color: white !important;
    top: 15px !important;
    right: 15px !important;
  }
`

const StartRound = styled(Button)`
  background: ${colors.blue} !important;
  color: white !important;
  width: 100%;
`

const GamesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const GameCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.$isHorizontal ? "24%" : "49%"};
  height: 70px;
  background: ${props => props.$isChecked ? '#aee6aeb3' : '#80808030'};
  border: 2px solid ${props => props.$isChecked ? '#05c405' : 'grey'};
  border-radius: 5px;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  ${props => props.$isPlayed && `
    opacity: 0.5;
    background: ${colors.red}50;
  `}

  & > div {
    display: flex;
    align-items: center;

    & > span {
      margin-right: 5px;
      margin-left: 5px;
    }
  }
`

const CheckboxContainer = styled.div`
  padding-top: 20px;
  font-size: 20px;

  & span {
    --checkbox-size: 2rem;
    font-size: 25px;
  }

  & svg {
    width: 1.5rem;
  }

  & > p {
    margin-top: 10px;
    font-size: 14px;
    color: darkorange;
  }
`

const Start = styled(Button)`
  background: ${colors.blue} !important;
  color: white !important;
  width: 48%;
  margin-left: 4%;
`

const CloseButton = styled(Button)`
  width: 48%;
`

const RentzChooseGame = ({ player, gameSettings, setGameHistory }) => {
  const [chosenGame, setChosenGame] = useState(null);
  const [bonusRound, setBonusRound] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHorizontal] = useMediaQuery('(min-width: 800px)');

  const onStart = () => {
    const round = {
      initiator: player.name,
      chosenGame,
      bonusRound,
      finished: false,
    };

    setGameHistory(round);
    setChosenGame(null);
    setBonusRound(false);
    onClose();
  }

  const onCloseReset = () => {
    setChosenGame(null);
    setBonusRound(false);
    onClose();
  }

  return (
    <>
      <StartRound onClick={onOpen}>Incepe Runda</StartRound>

      {isOpen &&
        <Modal isOpen={isOpen} onClose={onCloseReset}>
          <ModalOverlay />
          <StyledContentModal>
            <ModalHeader style={{ fontSize: 30 }}>{player.name} alege jocul</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <GamesContainer>
                {Object.values(RENTZ_GAMES_DETAILED).filter(game => gameSettings.games.includes(game.id)).map(game => {
                  return (
                    <GameCheckbox
                      key={'game' + game.id}
                      $isChecked={chosenGame === game.id}
                      $isPlayed={player.gamesPlayed.includes(game.id)}
                      $isHorizontal={isHorizontal}
                      onClick={() => {
                        if (player.remainingGames.includes(game.id)) {
                          setChosenGame(game.id);
                        }
                      }}
                    >
                      <div>
                        {game.icon && <game.icon width='18px' height='18px' />}
                        <span>{game.label}</span>
                        {game.icon && <game.icon width='18px' height='18px' />}
                      </div>
                    </GameCheckbox>
                  )
                })}
              </GamesContainer>
              <CheckboxContainer>
                <Checkbox
                  disabled={player.remainingGames.length === 1}
                  checked={bonusRound}
                  onChange={(e) => setBonusRound(e.target.checked)}
                >
                  Tura dubla? (Neve)
                </Checkbox>
                {player.remainingGames.length === 1 &&
                  <p>Nu se poate juca tura dubla in ultimul joc</p>
                }
              </CheckboxContainer>
            </ModalBody>

            <ModalFooter>
              <CloseButton variant='outline' colorScheme='red' onClick={onCloseReset}>
                Inchide
              </CloseButton>
              <Start
                isDisabled={chosenGame === null}
                onClick={onStart}
              >
                Start
              </Start>
            </ModalFooter>
          </StyledContentModal>
        </Modal>
      }
    </>
  )
}

export default RentzChooseGame;