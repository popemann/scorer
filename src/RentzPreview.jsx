import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { styled } from "styled-components";
import { colors } from "./style/colors";
import { RENTZ_CARD_POINTS_DETAILED, RENTZ_GAMES, RENTZ_GAMES_DETAILED } from "./helpers/constants";

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

const Section = styled.div`
  padding: 10px;
  border-radius: 10px;
  background: ${colors.blue}30;
  margin-bottom: 20px;
`

const CloseButton = styled(Button)`
  width: 100%;
`

const PlayerName = styled.h2`
  border-bottom: 2px solid grey;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
`

const GamePoints = styled.div`
  height: 40px;
  background: ${colors.blue}50;
  border: 3px solid ${colors.blue};
  display: flex;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 5px;

  & > span:nth-child(1) {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > span:nth-child(2) {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.blue}99;
    height: 100%;
    color: white;
    font-weight: 600;
  }

  & > span:nth-child(3) {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const ChosenGame = styled.p`
  display: flex;
  align-items: center;

  & > b {
    margin-left: 5px;
    margin-right: 5px;
  }
`

const RentzPreview = ({ onClose, round, points }) => {
  const Icon = RENTZ_GAMES_DETAILED[round.chosenGame].icon;
  const players = round && round.scores ? Object.keys(round.scores) : [];
  let rentzPodium;

  if (round.chosenGame === RENTZ_GAMES.RENTZ) {
    rentzPodium = players.map(p => ({name: p, ...round.scores[p]})).sort((a, b) => b.totalRound - a.totalRound);
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <StyledContentModal>
        <ModalHeader style={{ fontSize: 25 }}>Runda {round.roundNumber}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Section>
            <p>Dealer: <b>{round.initiator}</b></p>
            <ChosenGame>
              Joc ales: 
              <b>{RENTZ_GAMES_DETAILED[round.chosenGame].label}</b>
              <Icon style={{background: 'red'}}/>
            </ChosenGame>
            <p>Runda dubla: <b>{round.bonusRound ? "Da" : "Nu"}</b></p>
          </Section>

          {round.scores && round.chosenGame !== RENTZ_GAMES.RENTZ && players.map(p => (
            <Section>
              <PlayerName>
                <span>{p}</span>
                <span>
                  Puncte total: <b>{round.scores[p].totalRound}</b>
                </span>
              </PlayerName>
              {Object.keys(round.scores[p]).map(g => {
                if (g === 'totalRound') {
                  return null
                } else {
                  return (
                    <GamePoints>
                      <span>
                        {RENTZ_CARD_POINTS_DETAILED[g].label}
                        {RENTZ_CARD_POINTS_DETAILED[g].icon && RENTZ_CARD_POINTS_DETAILED[g].icon({ width: '20px', height: '20px' })}
                      </span>
                      <span>{round.scores[p][g]}</span>
                      <span> = {round.scores[p][g] * points[g]}p</span>
                    </GamePoints>
                  )
                }
              })}
            </Section>
          ))}

          {round.scores && round.chosenGame === RENTZ_GAMES.RENTZ &&
            <Section>
              {rentzPodium.map((r, index) => (
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{width: '50%'}}>{index + 1}. <b>{r.name}</b></div>
                  <span>{r.totalRound} puncte</span>
                </div>
              ))}
            </Section>
          }
        </ModalBody>

        <ModalFooter>
          <CloseButton variant='outline' colorScheme='red' onClick={onClose}>
            Inchide
          </CloseButton>
        </ModalFooter>
      </StyledContentModal>
    </Modal>
  )
}

export default RentzPreview;