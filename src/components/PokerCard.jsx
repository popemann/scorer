import { styled } from "styled-components";
import { ClubsIcon } from "../icons/clubs";
import { DiamondsIcon } from "../icons/diamonds";
import { SpadesIcon } from "../icons/spades";
import { HeartsIcon } from "../icons/hearts";
import { CARD_COLORS } from "../helpers/constants";

const Card = styled.div`
  position: relative;
  height: ${props => `${props.width * 1.5}px`};
  width: ${props => `${props.width}px`};
  border: ${props => `${props.width * 0.02}px`} solid black;
  border-radius: ${props => `${props.width * 0.07}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;

  & > span {
    font-family: serif;
    font-size: ${props => `${props.width * 0.7}px`};
    font-weight: 400;
  }

  & > svg {
    position: absolute;
  }

  ${props => {
    if (props.$allColors) {
      return `
        & > svg:nth-child(1) {
          top: ${props.padding};
          left: ${props.padding};
        }
        & > svg:nth-child(2) {
          top: ${props.padding};
          right: ${props.padding};
        }
        & > svg:nth-child(3) {
          bottom: ${props.padding};
          right: ${props.padding};
          transform: rotate(180deg);
        }
        & > svg:nth-child(4) {
          bottom: ${props.padding};
          left: ${props.padding};
        }
      `
    } else {
      return `
        & > svg:nth-child(1) {
          top: ${props.padding};
          left: ${props.padding};
        }
        & > svg:nth-child(2) {
          bottom: ${props.padding};
          right: ${props.padding};
          transform: rotate(180deg);
        }
      `
    }

  }}
`

export const PokerCard = ({ className, width, allColors, cardType, cardColor }) => {
  const finalWidth = width ? width : 100;
  const iconWidth = `${finalWidth * 0.3}px`;
  const padding =`${finalWidth * 0.05}px`;
  const finalCardColor = allColors ? CARD_COLORS.HEARTS : cardColor;

  const getIcon = (cc) => {
    switch(cc) {
      case CARD_COLORS.CLUBS: 
        return <ClubsIcon width={iconWidth} height={iconWidth}/>;
      case CARD_COLORS.DIAMONDS: 
        return <DiamondsIcon width={iconWidth} height={iconWidth}/>;
      case CARD_COLORS.SPADES: 
        return <SpadesIcon width={iconWidth} height={iconWidth}/>;
      default:
        return <HeartsIcon width={iconWidth} height={iconWidth}/>;
    }
  }

  return (
    <Card className={className} width={finalWidth} $allColors={allColors} padding={padding}>
      {getIcon(finalCardColor)}
      {allColors && getIcon(CARD_COLORS.CLUBS)}
      {allColors ? getIcon(CARD_COLORS.SPADES) : getIcon(finalCardColor)}
      {allColors && getIcon(CARD_COLORS.DIAMONDS)}
      <span>{cardType}</span>
    </Card>
  );
}