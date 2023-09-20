import { PokerCard } from "../components/PokerCard";
import { ClubsIcon } from "../icons/clubs";
import { DiamondsIcon } from "../icons/diamonds";
import { HandIcon } from "../icons/hand";
import { HeartsIcon } from "../icons/hearts";
import { MinusIcon } from "../icons/minus";
import { PlusIcon } from "../icons/plus";

export const CARD_COLORS = {
  SPADES: 'SPADES',
  DIAMONDS: 'DIAMONDS',
  CLUBS: 'CLUBS',
  HEARTS: 'HEARTS',
};

export const CARD_NUMBERS = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  'J': 'J',
  'Q': 'Q',
  'K': 'K',
  'A': 'A',
};

export const cardsInOrder = [
  CARD_NUMBERS.A,
  CARD_NUMBERS.K,
  CARD_NUMBERS.Q,
  CARD_NUMBERS.J,
  CARD_NUMBERS['10'],
  CARD_NUMBERS['9'],
  CARD_NUMBERS['8'],
  CARD_NUMBERS['7'],
  CARD_NUMBERS['6'],
  CARD_NUMBERS['5'],
  CARD_NUMBERS['4'],
  CARD_NUMBERS['3'],
  CARD_NUMBERS['2'],
];

export const RENTZ_GAMES = {
  KING: '1',
  QUEENS: '2',
  DIAMONDS: '3',
  TEN_OF_CLUBS: '4',
  POSITIVE_TRICKS: '5',
  NEGATIVE_TRICKS: '6',
  POSITIVE_TOTAL: '7',
  NEGATIVE_TOTAL: '8',
  RENTZ: '9'
};

export const RENTZ_GAMES_DETAILED = {
  [RENTZ_GAMES.KING]: {
    id: RENTZ_GAMES.KING,
    initial: 'K',
    label: 'K',
    icon: HeartsIcon,
  },
  [RENTZ_GAMES.TEN_OF_CLUBS]: {
    id: RENTZ_GAMES.TEN_OF_CLUBS,
    initial: '10',
    label: '10',
    icon: ClubsIcon,
  },
  [RENTZ_GAMES.QUEENS]: {
    id: RENTZ_GAMES.QUEENS,
    miniIcon: 'Q',
    label: 'Dame',
    icon: () => <PokerCard cardType='Q' allColors width={25} cardColor={CARD_COLORS.SPADES}/>
  },
  [RENTZ_GAMES.DIAMONDS]: {
    id: RENTZ_GAMES.DIAMONDS,
    label: 'Carouri',
    icon: DiamondsIcon,
  },
  [RENTZ_GAMES.POSITIVE_TRICKS]: {
    id: RENTZ_GAMES.POSITIVE_TRICKS,
    label: 'Levate',
    icon: ({width, height}) => <HandIcon width={width} height={height} color='green'/>,
  },
  [RENTZ_GAMES.NEGATIVE_TRICKS]: {
    id: RENTZ_GAMES.NEGATIVE_TRICKS,
    label: 'Levate',
    icon: ({width, height}) => <HandIcon width={width} height={height} color='red'/>,
  },
  [RENTZ_GAMES.POSITIVE_TOTAL]: {
    id: RENTZ_GAMES.POSITIVE_TOTAL,
    label: 'Totale',
    icon: PlusIcon,
  },
  [RENTZ_GAMES.NEGATIVE_TOTAL]: {
    id: RENTZ_GAMES.NEGATIVE_TOTAL,
    label: 'Totale',
    icon: MinusIcon,
  },
  [RENTZ_GAMES.RENTZ]: {
    id: RENTZ_GAMES.RENTZ,
    miniIcon: 'R',
    label: 'Rentz',
    icon: () => <PokerCard cardType='A' allColors width={25} cardColor={CARD_COLORS.SPADES}/>

  },
};

export const RENTZ_CARD_POINTS = {
  K: 0,
  Z: 1,
  D: 2,
  Q: 3,
  T: 4,
  R: 5,
};

export const RENTZ_CARD_POINTS_DETAILED = {
  [RENTZ_CARD_POINTS.K]: {
    id: RENTZ_CARD_POINTS.K,
    label: 'K',
    icon: HeartsIcon,
  },
  [RENTZ_CARD_POINTS.Z]: {
    id: RENTZ_CARD_POINTS.Z,
    label: '10',
    icon: ClubsIcon,
  },
  [RENTZ_CARD_POINTS.D]: {
    id: RENTZ_CARD_POINTS.D,
    icon: DiamondsIcon,
  },
  [RENTZ_CARD_POINTS.Q]: {
    id: RENTZ_CARD_POINTS.Q,
    label: 'Q',
  },
  [RENTZ_CARD_POINTS.T]: {
    id: RENTZ_CARD_POINTS.T,
    label: 'Mână',
    icon: HandIcon,
  },
  [RENTZ_CARD_POINTS.R]: {
    id: RENTZ_CARD_POINTS.R,
    label: 'Rentz',
  },
}

export const sortDesc = (a, b) => {
  if (a < b) {
    return 1;
  }
  if (a > b) {
    return -1;
  }

  return 0;
}