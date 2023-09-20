import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import { RENTZ_CARD_POINTS, RENTZ_CARD_POINTS_DETAILED, RENTZ_GAMES } from "./helpers/constants";
import { NumberInput } from "./components/NumberInput";

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

const StyledModalBody = styled(ModalBody)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const StartRound = styled(Button)`
  background: ${colors.blue} !important;
  color: white !important;
  width: 100%;
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

const LeftColumn = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;

  & > span {
    font-size: 18px;
  }
`;

const RightColumn = styled.div`
`

const PlayerContainer = styled.div`
  padding: 10px;
  border-radius: 10px;
  background: ${colors.blue}30;
  margin-bottom: 20px;
  width: ${props => props.$isHorizontal ? "49%" : "100%"};
`

const PlayerName = styled.h2`
  border-bottom: 2px solid grey;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
`

const StyledMenu = styled.div`
  flex-grow: 1;

  & > button {
    background: ${colors.blue} !important;
    width: 100%;
  }
`

const mapPlayerScore = (players, chosenGame) => {
  const playerResults = {};

  // eslint-disable-next-line
  players.map(p => {
    playerResults[p.name] = {};

    if (chosenGame === RENTZ_GAMES.KING) {
      playerResults[p.name] = {
        [RENTZ_CARD_POINTS.K]: 0,
      }
    } else if (chosenGame === RENTZ_GAMES.TEN_OF_CLUBS) {
      playerResults[p.name] = {
        [RENTZ_CARD_POINTS.Z]: 0,
      }
    } else if (chosenGame === RENTZ_GAMES.QUEENS) {
      playerResults[p.name] = {
        [RENTZ_CARD_POINTS.Q]: 0,
      }
    } else if (chosenGame === RENTZ_GAMES.DIAMONDS) {
      playerResults[p.name] = {
        [RENTZ_CARD_POINTS.D]: 0,
      }
    } else if (chosenGame === RENTZ_GAMES.NEGATIVE_TRICKS || chosenGame === RENTZ_GAMES.POSITIVE_TRICKS) {
      playerResults[p.name] = {
        [RENTZ_CARD_POINTS.T]: 0,
      }
    } else if (chosenGame === RENTZ_GAMES.NEGATIVE_TOTAL || chosenGame === RENTZ_GAMES.POSITIVE_TOTAL) {
      playerResults[p.name] = {
        [RENTZ_CARD_POINTS.K]: 0,
        [RENTZ_CARD_POINTS.Q]: 0,
        [RENTZ_CARD_POINTS.D]: 0,
        [RENTZ_CARD_POINTS.T]: 0,
      }
    } else if (chosenGame === RENTZ_GAMES.RENTZ) {
      playerResults[p.name] = {
        [RENTZ_CARD_POINTS.R]: 0,
      }
    }
  });

  return playerResults;
};

const computeRemainingCards = (playerResults, cardNumbers) => {
  const remainingCards = {};

  // eslint-disable-next-line
  Object.values(playerResults).map(pr => {
    if (pr[RENTZ_CARD_POINTS.K] !== undefined) {
      if (remainingCards[RENTZ_CARD_POINTS.K] === undefined) {
        remainingCards[RENTZ_CARD_POINTS.K] = cardNumbers[RENTZ_CARD_POINTS.K]
      }

      remainingCards[RENTZ_CARD_POINTS.K] -= pr[RENTZ_CARD_POINTS.K];
    }

    if (pr[RENTZ_CARD_POINTS.Q] !== undefined) {
      if (remainingCards[RENTZ_CARD_POINTS.Q] === undefined) {
        remainingCards[RENTZ_CARD_POINTS.Q] = cardNumbers[RENTZ_CARD_POINTS.Q]
      }

      remainingCards[RENTZ_CARD_POINTS.Q] -= pr[RENTZ_CARD_POINTS.Q];
    }

    if (pr[RENTZ_CARD_POINTS.D] !== undefined) {
      if (remainingCards[RENTZ_CARD_POINTS.D] === undefined) {
        remainingCards[RENTZ_CARD_POINTS.D] = cardNumbers[RENTZ_CARD_POINTS.D]
      }

      remainingCards[RENTZ_CARD_POINTS.D] -= pr[RENTZ_CARD_POINTS.D];
    }

    if (pr[RENTZ_CARD_POINTS.T] !== undefined) {
      if (remainingCards[RENTZ_CARD_POINTS.T] === undefined) {
        remainingCards[RENTZ_CARD_POINTS.T] = cardNumbers[RENTZ_CARD_POINTS.T]
      }

      remainingCards[RENTZ_CARD_POINTS.T] -= pr[RENTZ_CARD_POINTS.T];
    }

    if (pr[RENTZ_CARD_POINTS.Z] !== undefined) {
      if (remainingCards[RENTZ_CARD_POINTS.Z] === undefined) {
        remainingCards[RENTZ_CARD_POINTS.Z] = cardNumbers[RENTZ_CARD_POINTS.Z]
      }

      remainingCards[RENTZ_CARD_POINTS.Z] -= pr[RENTZ_CARD_POINTS.Z];
    }
  });

  return remainingCards;
}

const computeTotal = (playerResult, points, rentzPodium, playerName, chosenGame, bonusRound) => {
  let total = 0;

  // eslint-disable-next-line
  Object.keys(playerResult).map(key => {
    const intKey = parseInt(key, 10);
    switch (intKey) {
      case RENTZ_CARD_POINTS.K:
        total += playerResult[key] * points[RENTZ_CARD_POINTS.K];
        break;
      case RENTZ_CARD_POINTS.Q:
        total += playerResult[key] * points[RENTZ_CARD_POINTS.Q];
        break;
      case RENTZ_CARD_POINTS.D:
        total += playerResult[key] * points[RENTZ_CARD_POINTS.D];
        break;
      case RENTZ_CARD_POINTS.T:
        total += playerResult[key] * points[RENTZ_CARD_POINTS.T];
        break;
      case RENTZ_CARD_POINTS.Z:
        total += playerResult[key] * points[RENTZ_CARD_POINTS.Z];
        break;
      case RENTZ_CARD_POINTS.R:
        const index = rentzPodium.indexOf(playerName);
        total += points[RENTZ_CARD_POINTS.R][index];
        break;
      default:
        break;
    }
  });

  if (chosenGame === RENTZ_GAMES.TEN_OF_CLUBS
    || chosenGame === RENTZ_GAMES.RENTZ
    || chosenGame === RENTZ_GAMES.POSITIVE_TRICKS
    || chosenGame === RENTZ_GAMES.POSITIVE_TOTAL
  ) {
    total += 0;
  } else {
    total *= (-1);
  }

  if (bonusRound) {
    total *= 2;
  }

  return total;
}

const RentzInputResult = ({ players, chosenGame, gameSettings, bonusRound, setGameHistory }) => {
  const [playerResults, setPlayerResults] = useState(mapPlayerScore(players, chosenGame));
  const [rentzPodium, setRentzPodium] = useState(players.map(p => null));
  const cardNumbers = {
    [RENTZ_CARD_POINTS.K]: 1,
    [RENTZ_CARD_POINTS.Z]: 1,
    [RENTZ_CARD_POINTS.Q]: 4,
    [RENTZ_CARD_POINTS.T]: 8,
    [RENTZ_CARD_POINTS.D]: (players.length * 2),
  };
  const [isHorizontal] = useMediaQuery('(min-width: 800px)');

  const remainingCards = computeRemainingCards(playerResults, cardNumbers);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const setPoints = (name, game, value) => {
    const copyPlayerResults = JSON.parse(JSON.stringify(playerResults));
    copyPlayerResults[name][game] = value;

    setPlayerResults(copyPlayerResults);
  }

  const onSubmit = () => {
    const playerResultsFinal = {};
    // eslint-disable-next-line
    Object.keys(playerResults).map(key => {
      playerResultsFinal[key] = {
        ...playerResults[key],
        totalRound: computeTotal(playerResults[key], gameSettings.points, rentzPodium, key, chosenGame, bonusRound),
      };
    });

    setGameHistory({
      scores: playerResultsFinal,
      finished: true,
    });
  }

  const isInvalid = chosenGame === RENTZ_GAMES.RENTZ ? rentzPodium.some(rank => rank === null) : Object.values(remainingCards).some(rc => rc > 0);

  return (
    <>
      <StartRound onClick={onOpen}>Introdu rezultate</StartRound>

      {isOpen &&
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <StyledContentModal>
            <ModalHeader style={{ fontSize: 25 }}>Introdu rezultate</ModalHeader>
            <ModalCloseButton />
            <StyledModalBody>
              {chosenGame !== RENTZ_GAMES.RENTZ && players.map(p => (
                <PlayerContainer key={p.name} $isHorizontal={isHorizontal}>
                  <PlayerName>{p.name}</PlayerName>

                  {(chosenGame === RENTZ_GAMES.KING || chosenGame === RENTZ_GAMES.NEGATIVE_TOTAL || chosenGame === RENTZ_GAMES.POSITIVE_TOTAL) &&
                    <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                      <LeftColumn>
                        <span>{RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.K].label}</span>
                        {RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.K].icon({ width: '25px', height: '25px' })}
                      </LeftColumn>
                      <RightColumn>
                        <NumberInput
                          max={remainingCards[RENTZ_CARD_POINTS.K]}
                          value={playerResults[p.name][RENTZ_CARD_POINTS.K]}
                          onChange={(value) => setPoints(p.name, RENTZ_CARD_POINTS.K, value)}
                        />
                      </RightColumn>
                    </div>
                  }

                  {chosenGame === RENTZ_GAMES.TEN_OF_CLUBS &&
                    <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                      <LeftColumn>
                        <span>{RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.Z].label}</span>
                        {RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.Z].icon({ width: '25px', height: '25px' })}
                      </LeftColumn>
                      <RightColumn>
                        <NumberInput
                          max={remainingCards[RENTZ_CARD_POINTS.Z]}
                          value={playerResults[p.name][RENTZ_CARD_POINTS.Z]}
                          onChange={(value) => setPoints(p.name, RENTZ_CARD_POINTS.Z, value)}
                        />
                      </RightColumn>
                    </div>
                  }

                  {(chosenGame === RENTZ_GAMES.DIAMONDS || chosenGame === RENTZ_GAMES.NEGATIVE_TOTAL || chosenGame === RENTZ_GAMES.POSITIVE_TOTAL) &&
                    <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                      <LeftColumn>
                        {RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.D].icon({ width: '30px', height: '30px' })}
                      </LeftColumn>
                      <RightColumn>
                        <NumberInput
                          max={remainingCards[RENTZ_CARD_POINTS.D]}
                          value={playerResults[p.name][RENTZ_CARD_POINTS.D]}
                          onChange={(value) => setPoints(p.name, RENTZ_CARD_POINTS.D, value)}
                        />
                      </RightColumn>
                    </div>
                  }

                  {(chosenGame === RENTZ_GAMES.QUEENS || chosenGame === RENTZ_GAMES.NEGATIVE_TOTAL || chosenGame === RENTZ_GAMES.POSITIVE_TOTAL) &&
                    <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                      <LeftColumn>
                        <span>{RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.Q].label}</span>
                      </LeftColumn>
                      <RightColumn>
                        <NumberInput
                          max={remainingCards[RENTZ_CARD_POINTS.Q]}
                          value={playerResults[p.name][RENTZ_CARD_POINTS.Q]}
                          onChange={(value) => setPoints(p.name, RENTZ_CARD_POINTS.Q, value)}
                        />
                      </RightColumn>
                    </div>
                  }

                  {(chosenGame === RENTZ_GAMES.NEGATIVE_TRICKS || chosenGame === RENTZ_GAMES.POSITIVE_TRICKS || chosenGame === RENTZ_GAMES.NEGATIVE_TOTAL || chosenGame === RENTZ_GAMES.POSITIVE_TOTAL) &&
                    <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                      <LeftColumn>
                        <span>{RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.T].label}</span>
                        {RENTZ_CARD_POINTS_DETAILED[RENTZ_CARD_POINTS.T].icon({ width: '30px', height: '30px' })}
                      </LeftColumn>
                      <RightColumn>
                        <NumberInput
                          max={remainingCards[RENTZ_CARD_POINTS.T]}
                          value={playerResults[p.name][RENTZ_CARD_POINTS.T]}
                          onChange={(value) => setPoints(p.name, RENTZ_CARD_POINTS.T, value)}
                        />
                      </RightColumn>
                    </div>
                  }

                </PlayerContainer>
              ))}

              {chosenGame === RENTZ_GAMES.RENTZ &&
                <PlayerContainer key='rentz-podium'>
                  <PlayerName>Rentz podium</PlayerName>
                  {players.map((p, index) => (
                    <div key={'rentz-podium-' + index} style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                      <LeftColumn>
                        <span>{`Locul ${index + 1} ->`}</span>
                      </LeftColumn>
                      <StyledMenu>
                        <Menu>
                          <MenuButton colorScheme="blue" as={Button} rightIcon={<div />}>
                            {rentzPodium[index] ? rentzPodium[index] : 'Selecteaza jucator'}
                          </MenuButton>
                          <MenuList>
                            {players.map(pl =>
                              <MenuItem
                                key={'item-' + index + pl.name}
                                onClick={() => setRentzPodium(
                                  rentzPodium.map((rank, jndex) => index === jndex ? pl.name : rank === pl.name ? null : rank)
                                )}
                              >
                                {pl.name}
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </StyledMenu>
                    </div>
                  ))}
                </PlayerContainer>
              }
            </StyledModalBody>

            <ModalFooter>
              <CloseButton variant='outline' colorScheme='red' onClick={onClose}>
                Inchide
              </CloseButton>
              <Start
                isDisabled={isInvalid}
                onClick={() => !isInvalid && onSubmit()}
              >
                Salveaza
              </Start>
            </ModalFooter>
          </StyledContentModal>
        </Modal>
      }
    </>
  )
}

export default RentzInputResult;