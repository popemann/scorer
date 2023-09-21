import { keyframes, styled } from "styled-components";
import { colors } from "./style/colors";
import { SpadesIcon } from "./icons/spades";
import { HeartsIcon } from "./icons/hearts";
import { ClubsIcon } from "./icons/clubs";
import { DiamondsIcon } from "./icons/diamonds";
import { PokerCard } from "./components/PokerCard";
import { CARD_COLORS } from "./helpers/constants";
import { onClickLink } from "./utils/redirect";

const DashboardContainer = styled.div`
  width: 80vw;
  height: 100vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const wiggle = keyframes`
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  30% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  40% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  50% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  60% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  70% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  80% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  90% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
  100% {
    transform: translate(1px, 1px) rotate(0deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.96, 0.96);
  }
  50% {
    transform: scale(1.04, 1.04);
  }
  100% {
    transform: scale(0.96, 0.96);
  }
`

const reversePulse = keyframes`
  0% {
    transform: scale(1.04, 1.04);
  }
  50% {
    transform: scale(0.96, 0.96);
  }
  100% {
    transform: scale(1.04, 1.04);
  }
`

const Title = styled.h1`
  font-family: 'Rocher', 'Comic Sans MS', Roboto, Helvetica, sans-serif;
  font-size: 45px;
  animation: ${wiggle} 3s;
  animation-iteration-count: infinite;
  margin-bottom: 50px;
`

const WhistButton = styled.div`
  width: 300px;
  height: 90px;
  border: 3px solid ${colors.red};
  background: ${colors.red}30;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
  animation: ${pulse} 2s infinite;
  box-shadow: 2px 4px 10px -1px black;

  & > span {
    margin: 10px;
  }
`

const RentzButton = styled.div`
  position: relative;
  width: 300px;
  height: 90px;
  border: 3px solid ${colors.blue};
  background: ${colors.blue}30;
  border-radius: 10px;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
  animation: ${reversePulse} 2s infinite;
  box-shadow: 2px 4px 10px -1px black;

  & > span {
    margin: 20px;
  }
`

const Dashboard = () => {
  return (
    <>
      <DashboardContainer>
        <Title className="title">Let's play !!!</Title>

        <WhistButton onClick={() => onClickLink('/scorer/whist')}>
          <SpadesIcon height={'30px'} width={'30px'} />
          <HeartsIcon height={'30px'} width={'30px'} />
          <span>Whist</span>
          <DiamondsIcon height={'30px'} width={'30px'} />
          <ClubsIcon height={'30px'} width={'30px'} />
        </WhistButton>
        <RentzButton onClick={() => onClickLink('/scorer/rentz')}>
          <PokerCard cardType='K' width={40} cardColor={CARD_COLORS.HEARTS} />
          <span>Rentz</span>
          <PokerCard cardType='10' width={40} cardColor={CARD_COLORS.CLUBS} />
        </RentzButton>
      </DashboardContainer>
      <p style={{ position: 'absolute', bottom: 0 }}>version 1.0.4</p>
    </>
  );
}

export default Dashboard;