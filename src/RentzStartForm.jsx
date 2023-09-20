import { styled } from "styled-components";
import { colors } from "./style/colors";
import { Button, Input, InputGroup as InputGroupChakra, InputLeftAddon, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { TrashIcon } from "./icons/trash";
import { useContext, useEffect, useState } from "react";
import { CARD_COLORS, RENTZ_CARD_POINTS, RENTZ_CARD_POINTS_DETAILED, RENTZ_GAMES_DETAILED, cardsInOrder } from "./helpers/constants";
import { PokerCard } from "./components/PokerCard";
import { RentzContext } from "./context/RentzContext";
import { onClickLink } from "./utils/redirect";

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10vh;
  padding-left: 5vw;
  padding-right: 5vw;
`

const Tile = styled.div`
  width: 100%;
  min-height: 100px;
  border: 3px solid ${colors.blue};
  background: ${colors.blue}30;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 4px 10px -1px black;
  padding: 0px 16px 16px 16px;
  margin-top: ${props => props.$hasMargin ? '16px' : '0'};
`

const ErrorMessage = styled.div`
  width: 100%;
  border: 3px solid ${colors.red};
  background: ${colors.red}30;
  border-radius: 10px;
  box-shadow: 2px 4px 10px -1px black;
  padding: 10px;
  margin-top: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
`

const Title = styled.h1`
  font-family: 'Rocher', 'Comic Sans MS', Roboto, Helvetica, sans-serif;
  font-size: 25px;
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
`

const CustomInput = styled(({ hasMargin, hasAddon, width, ...props }) => <Input {...props} />)`
  border-color: ${colors.blue} !important;
  background: ${colors.blue}70 !important;
  margin-right: ${props => props.hasMargin ? '16px' : '0'};
  color: white;
  font-size: 20px !important;
  ${props => props.width && `width: ${props.width} !important`};
  ${props => props.hasAddon && `
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  `}
`

const AddPlayerButton = styled(Button)`
  background: ${colors.blue} !important;
  margin-top: 20px;
  color: white !important;
  width: 100%;
`

const CardsContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 35px);
  justify-content: space-between;
  row-gap: 10px;
  column-gap: 5px;
`

const PointLetter = styled.span`
  font-size: 25px;
`

const LeftColumn = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;
`

const RightColumn = styled.div`
  width: 70%;
`

const RentzScores = styled.div`
  width: 70%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 100px);
  justify-content: space-between;
  row-gap: 10px;
  column-gap: 5px;
`

const Rank = styled(InputLeftAddon)`
  background: ${colors.blue} !important;
  border-color: ${colors.blue} !important;
  color: white !important;
  font-weight: 700;
  padding: 7px !important;
  width: 30px !important;
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
  width: 49%;
  height: 70px;
  background: ${props => props.$isChecked ? '#aee6aeb3' : '#80808030'};
  border: 2px solid ${props => props.$isChecked ? '#05c405' : 'grey'};
  border-radius: 5px;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;

  & > div {
    display: flex;
    align-items: center;

    & > span {
      margin-right: 5px;
      margin-left: 5px;
    }
  }
`

const StartButton = styled(Button)`
  background: ${colors.blue} !important;
  margin-top: 20px;
  margin-bottom: 50px;
  color: white !important;
  width: 100%;
`

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
`

const StyledButton = styled(Button)`
  background: ${colors.blue} !important;
  color: white !important;
  width: 100%;
  margin-top: 10px;
`

const ModalFooterStyled = styled(ModalFooter)`
  flex-wrap: wrap;
`

const isFormInvalid = (players, points) => {
  let error = '';
  const names = players.map(p => p.name);

  if (names.includes('')) {
    error = 'Unul sau mai multi jucatori nu au nume';
  }

  if ((new Set(names)).size !== names.length) {
    error =  'Doi sau mai multi jucatori au acelasi nume';
  }

  // eslint-disable-next-line
  points.map((p, index) => {
    if (index === 5 && p.some(rs => rs !== 0 && !rs)) {
      error = 'Nu ai setat toate punctajele pentru Rentz'
    } else if (p !== 0 && !p) {
      error = 'Nu ai setat toate punctajele pentru carti'
    }
  })

  return error;
}

const RentzStartForm = () => {
  const { players: playersStorage, gameSettings, exit } = useContext(RentzContext);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [games, setGames] = useState(Object.keys(RENTZ_GAMES_DETAILED));
  const [points, setPoints] = useState([200, 200, 30, 40, 50, [200, 100, 0]]);
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: '',
    },
    {
      id: 2,
      name: ''
    },
    {
      id: 3,
      name: ''
    }
  ]);
  const { setGameSettings, setPlayers: setPlayersContext } = useContext(RentzContext);

  useEffect(() => {
    if (!!playersStorage && !!gameSettings) {
      setGameInProgress(true);
    }
  }, [playersStorage, gameSettings]);

  const addName = (id, name) => {
    const newPlayers = players.map(p => {
      if (p.id !== id) {
        return {
          ...p
        }
      } else {
        return {
          id,
          name,
        }
      }
    });

    setPlayers(newPlayers);
  };

  const addPoints = (value, i, j) => {
    if (isNaN(value)) {
      return;
    }
    const parsedValue = value === '' ? value: parseInt(value, 10);
    const newPoints = points.map((p, index) => {
      if (i !== index) {
        return p;
      }

      if (i === 5) {
        return points[i].map((rp, jndex) => jndex === j ? parsedValue : rp);
      } else {
        return parsedValue;
      }
    });

    setPoints(newPoints);
  };

  const submit = () => {
    setPlayersContext(players.map(p => ({
      name: p.name,
      remainingGames: [...games],
      gamesPlayed: [],
    })));

    setGameSettings({
      games: [...games],
      points: [...points],
    });

    onClickLink('/scorer/rentz/game-in-progress');
  }

  const isInvalid = isFormInvalid(players, points);
  return (
    <Container>
      <Tile>
        <Title>Jucatori</Title>
        {players.map((p, index) => (
          <InputGroup key={p.id}>
            <CustomInput
              hasMargin={index > 2 && index === players.length - 1}
              placeholder={'Jucatorul ' + (index + 1)}
              _placeholder={{ color: 'lightgrey' }}
              onChange={(e) => addName(index + 1, e.target.value)}
              value={p.name}
            />
            {index > 2 && index === players.length - 1 &&
              <TrashIcon
                width='24px'
                height='24px'
                onClick={() => {
                  setPlayers(players.slice(0, -1));
                  setPoints(points.map((p, index) =>
                    (index + 1) !== points.length ? p : p.slice(0, -1)
                  ));
                }}
              />
            }
          </InputGroup>
        ))}
        <AddPlayerButton
          onClick={() => {
            setPlayers([...players, { id: players.length + 1, name: '' }]);
            setPoints(points.map((p, index) =>
              (index + 1) !== points.length ? p : [...p, '']
            ));
          }}
          isDisabled={players.length === 6}
        >
          Adauga jucator
        </AddPlayerButton>
      </Tile>


      <Tile $hasMargin={true} >
        <Title>Carti de joc necesare</Title>
        <CardsContainer>
          {cardsInOrder.slice(0, players.length * 2).map(card =>
            <PokerCard key={card} cardType={card} width={35} cardColor={CARD_COLORS.SPADES} />
          )}
        </CardsContainer>
      </Tile>

      <Tile $hasMargin={true} >
        <Title>Punctaje carti</Title>
        {Object.values(RENTZ_CARD_POINTS_DETAILED).map(rg => (
          <InputGroup key={'rentz-points' + rg.id}>
            <LeftColumn style={rg.id === RENTZ_CARD_POINTS.R ? { alignSelf: 'start', marginTop: -1 } : {}}>
              {rg.label && <PointLetter>{rg.label}</PointLetter>}
              {rg.icon && <rg.icon width='30px' height='30px' />}
            </LeftColumn>
            {rg.id === RENTZ_CARD_POINTS.R
              ?
              <RentzScores>
                {players.map((p, index) =>
                  <InputGroupChakra key={p.id}>
                    <Rank children={index + 1 + '.'} />
                    <CustomInput
                      hasAddon
                      type='number'
                      width={'70px'}
                      onChange={(e) => addPoints(e.target.value, rg.id, index)}
                      value={points[rg.id][index]}
                    />
                  </InputGroupChakra>
                )}
              </RentzScores>
              :
              <RightColumn>
                <CustomInput
                  type='number'
                  onChange={(e) => addPoints(e.target.value, rg.id)}
                  value={points[rg.id]}
                />
              </RightColumn>
            }
          </InputGroup>
        ))}
      </Tile>

      <Tile $hasMargin={true} >
        <Title>Alege jocurile</Title>
        <GamesContainer>
          {Object.values(RENTZ_GAMES_DETAILED).map(game => {
            return (
              <GameCheckbox
                key={'game' + game.id}
                $isChecked={games.includes(game.id)}
                onClick={() => {
                  if (games.includes(game.id)) {
                    setGames(games.filter(g => g !== game.id));
                  } else {
                    setGames([...games, game.id]);
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
      </Tile>

      {!!isInvalid &&
        <ErrorMessage>
          {isInvalid}
        </ErrorMessage>
      }

      <StartButton
        onClick={() => !isInvalid && submit()}
        isDisabled={!!isInvalid}
      >
        Start Joc!
      </StartButton>

      {gameInProgress && 
        <Modal isOpen={gameInProgress}>
          <ModalOverlay />
          <StyledContentModal>
            <ModalHeader style={{ fontSize: 25 }}>Joc in progres</ModalHeader>
            <ModalBody>
              <h1>Exist deja un joc in progres. Vrei sa incepi un joc nou sau sa continui jocul existent? </h1>
            </ModalBody>

            <ModalFooterStyled>
              <StyledButton onClick={exit}>
                Joc nou
              </StyledButton>
              <StyledButton onClick={() => onClickLink('/scorer/rentz/game-in-progress')}>
                Continua
              </StyledButton>
            </ModalFooterStyled>
          </StyledContentModal>
        </Modal>
      }
    </Container>
  );
}

export default RentzStartForm;