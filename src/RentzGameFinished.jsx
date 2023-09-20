import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes, styled } from "styled-components";
import { colors } from "./style/colors";
import poop from './assests/poop.png'
import { sortDesc } from "./helpers/constants";

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

const ModalFooterStyled = styled(ModalFooter)`
  flex-wrap: wrap;
`

const StyledButton = styled(Button)`
  background: ${colors.blue} !important;
  color: white !important;
  width: 100%;
  margin-top: 10px;
`

const FinishGame = styled(Button)`
  background: ${colors.blue} !important;
  color: white !important;
  width: 100%;
`;

const shine = keyframes`
  0% {
      transform:translateX(-100%) translateY(-100%) rotate(30deg);
  }
  80% {
    transform:translateX(-100%) translateY(-100%) rotate(30deg);
  }
	100% {
    transform:translateX(100%) translateY(100%) rotate(30deg);
  }
`;

const Place = styled.div`
  display: flex;
  position: relative;
  z-index: 0;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-family: serif;

  &::after {
    content:'';
    top: 0;
    transform: translateX(100%) rotate(30deg);
    width: 300%;
    height: 500px;
    position: absolute;
    z-index: 1;
    animation: ${shine} 3s infinite ease-in;
    ${props => props.$delay && `animation-delay: ${props.$delay};`}
    background:
      linear-gradient( to right, 
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.8) 50%,
        rgba(128,186,232,0) 99%,
        rgba(128,186,232,0) 100%);
  }
`

const Names = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  font-size: 14px;
`

const podium = [
  {
    background: 'linear-gradient( to bottom, #bcc6cc, #eee, #bcc6cc)',
    height: '40%',
    delay: '0.5s',
    width: '75px',
    text: 'II',
    index: 1,
  },
  {
    background: 'linear-gradient(to bottom, #fffe00, #fdfdfd, #fffe00)',
    height: '50%',
    width: '75px',
    text: 'I',
    index: 0,
  },
  {
    background: 'linear-gradient(to bottom, #da9a1e,#f9f3e8,#da9a1e)',
    height: '30%',
    delay: '1s',
    width: '75px',
    text: 'III',
    index: 2,
  },
  {
    image: poop,
    height: '100%',
    width: '75px'
  },
]

const RentzGameFinished = ({ total, exit, reset }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ranks = Object.keys(total).map(t => ({ name: t, score: total[t] })).sort((a, b) => sortDesc(a.score, b.score));
  const groupedRanks = [];

  // eslint-disable-next-line
  ranks.map(r => {
    for (let i = 0; i < ranks.length; i++) {
      if (!groupedRanks[i]) {
        groupedRanks.push([r]);
        break;
      } else if (groupedRanks[i][0].score === r.score) {
        groupedRanks[i].push(r);
        break;
      } else if (i > 3) {
        groupedRanks[3].push(r);
        break;
      }
    }
  });

  return (
    <>
      <FinishGame onClick={onOpen}>
        Termina joc
      </FinishGame>
      {isOpen &&
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <StyledContentModal>
            <ModalHeader style={{ fontSize: 25 }}>Rezultate</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div
                style={{
                  width: '100%',
                  height: 160,
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'flex-start',
                }}
              >
                {podium.map((p, index) => {
                  if (index < 3) {
                    return (
                      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <Names>
                          {groupedRanks[p.index] && <span>({groupedRanks[p.index][0].score})</span>}
                          {groupedRanks[p.index] && groupedRanks[p.index].map(r => <span><b>{r.name}</b></span>)}
                        </Names>
                        <Place style={p} $delay={p.delay}>
                          {p.text && <p>{p.text}</p>}
                          {p.image && <img src={p.image} alt='poop' style={{ width: '60%' }} />}
                        </Place>
                      </div>
                    )
                  } else if (groupedRanks[3]) {
                    const shitPlayers = [];
                    groupedRanks.slice(3).map(p => shitPlayers.push(...p));

                    return (
                      <div style={{ ...p, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'end', marginLeft: 'auto', fontSize: '10px' }}>
                        {shitPlayers.map(p => <span style={{fontWeight: 500}}>{p.name} ({p.score})</span>)}
                        {p.image && <img src={p.image} alt='poop' style={{ width: '60%' }} />}
                      </div>
                    )
                  }

                  return null;
                })}
              </div>

            </ModalBody>

            <ModalFooterStyled>
              <StyledButton onClick={exit}>
                Incheie joc
              </StyledButton>
              <StyledButton onClick={reset}>
                Incepe joc cu aceleasi setari
              </StyledButton>
            </ModalFooterStyled>
          </StyledContentModal>
        </Modal>
      }
    </>
  )
}

export default RentzGameFinished;