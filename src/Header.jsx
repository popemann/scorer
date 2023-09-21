import { styled } from "styled-components";
import { HomeIcon } from "./icons/home";
import { UndoIcon } from "./icons/undo";
import { onClickLink } from "./utils/redirect";
import { useContext, useState } from "react";
import { RentzContext } from "./context/RentzContext";
import { CardsIcon } from "./icons/cards";
import { Button, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { colors } from "./style/colors";
import { CARD_COLORS, RENTZ_GAMES, RENTZ_GAMES_DETAILED, cardsInOrder } from "./helpers/constants";
import { PokerCard } from "./components/PokerCard";
import { RulesIcon } from "./icons/rules";
import { ExitIcon } from "./icons/exit";
import { MenuIcon } from "./icons/menu";

const HomeIconStyled = styled(HomeIcon)`
  position: absolute;
  top: 10px;
  left: 10px;
`

const RightIcons = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 8px;
  right: 10px;

  & > svg {
    margin-right: 15px;
  }

  & > button {
    background: #504f4f !important;
    color: white !important;
  }

  & > div {
    z-index: 99 !important
  }
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

  & > button {
    color: white !important;
    top: 15px !important;
    right: 15px !important;
  }
`

const CloseButton = styled(Button)`
  width: 100%;
`

const Section = styled.div`
  padding: 10px 10px 1px 10px;
  border-radius: 10px;
  background: ${colors.blue}30;
  margin-bottom: 15px;

  & > p {
    margin-bottom: 15px;
  }

  & > h2 {
    font-size: 20px;
    font-weight: 700;
    border-bottom: 1px solid;
    margin-bottom: 10px;
  }

  & > h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
`

const CardsContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 35px);
  justify-content: space-between;
  row-gap: 10px;
  column-gap: 5px;
  padding-bottom: 15px;
`

const Exit = styled(Button)`
  background: ${colors.blue} !important;
  color: white !important;
  width: 48%;
  margin-left: 4%;
`

const CloseButtonExit = styled(Button)`
  width: 48%;
`

const returnGame = (game) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {RENTZ_GAMES_DETAILED[game].initial &&
        <span style={{ marginRight: 2 }}>{RENTZ_GAMES_DETAILED[game].initial}</span>}
      {RENTZ_GAMES_DETAILED[game].miniIcon || RENTZ_GAMES_DETAILED[game].icon({})}
    </div>
  )
}

const Header = () => {
  const { undoRound, gameHistory, players, exit } = useContext(RentzContext);
  const [viewCards, setViewCards] = useState(false);
  const [viewRules, setViewRules] = useState(false);
  const [viewExit, setViewExit] = useState(false);

  const isFirstRound = !gameHistory || gameHistory.length === 0;

  const path = window.location.pathname;

  return (
    <>
      <HomeIconStyled width='30px' height='30px' onClick={() => onClickLink('/scorer')} />
      {path.includes('scorer/rentz') &&
        <RightIcons>
          {path.includes('scorer/rentz/game-in-progress') &&
            <UndoIcon isDisabled={isFirstRound} width='30px' height='30px' onClick={() => !isFirstRound && undoRound()} />
          }
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<MenuIcon height={'22px'} width={'22px'} />}
              style={{ background: 'red !important' }}
              size='sm'
            />
            <MenuList>
              <MenuItem onClick={() => setViewRules(true)} icon={<RulesIcon width='22px' height='22px' />}>
                Regulament
              </MenuItem>
              {path.includes('scorer/rentz/game-in-progress') &&
                <>
                  <MenuItem onClick={() => setViewCards(true)} icon={<CardsIcon width='32px' height='32px' />}>
                    Carti in joc
                  </MenuItem>

                  <MenuItem onClick={() => setViewExit(true)} icon={<ExitIcon width='22px' height='22px' />}>
                    Iesi din joc
                  </MenuItem>
                </>
              }
            </MenuList>
          </Menu>
        </RightIcons>
      }

      {viewCards &&
        <Modal isOpen={viewCards} onClose={() => setViewCards(false)}>
          <ModalOverlay />
          <StyledContentModal>
            <ModalHeader style={{ fontSize: 25 }}>Carti in joc</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Section>
                <CardsContainer>
                  {cardsInOrder.slice(0, players.length * 2).map(card =>
                    <PokerCard key={card} cardType={card} width={35} cardColor={CARD_COLORS.SPADES} />
                  )}
                </CardsContainer>
              </Section>
            </ModalBody>

            <ModalFooter>
              <CloseButton variant='outline' colorScheme='red' onClick={() => setViewCards(false)}>
                Inchide
              </CloseButton>
            </ModalFooter>
          </StyledContentModal>
        </Modal>
      }

      {viewRules &&
        <Modal isOpen={viewRules} onClose={() => setViewRules(false)}>
          <ModalOverlay />
          <StyledContentModal>
            <ModalHeader style={{ fontSize: 25 }}>Regulament Rentz</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Section>
                <p>
                  Rentz se joaca in 3-6 jucatori, cu un pachet standard de carti. Din pachet se vor folosi 8 carti pentru fiecare jucator de la masa (24 pentru 3 jucatori, 32 pentru 4 jucatori etc.), incepand de la cartile cele mai mari.
                </p>
                <p>
                  Jocul consta in 9 tipuri de jocuri diferite (5 negative si 4 pozitive), fiecare jucator avand dreptul, cand ii vine randul, sa aleaga unul dintre aceste subjocuri (atata timp cat nu le-a jucat deja). In concluzie se joaca "numar de jocuri" x "numar de jucatori" runde.
                </p>
                <p>
                  In nici unul dintre aceste subjocuri nu exista atu. Dealer-ul (cel care este primul) incepe runda, punand jos o carte. Apoi pe rand, in sensul acelor de ceasornic, fiecare jucator este obligat sa dea cate o carte cu acelasi simbol ca a primului (ca la Whist). Cartea cea mai mare cu acelasi simbol ia mana. Daca jucatorii nu au carte cu respectivul simbol, sunt liberi sa joace orice alta carte.
                </p>
              </Section>

              <Section>
                <h2>Subjocuri</h2>

                <h3>Jocuri negative</h3>

                <p>
                  <b>1. Regele de inima rosie ( {returnGame(RENTZ_GAMES.KING)} ):</b> nu trebuie luat regele de cupa.
                </p>
                <p>
                  <b>2. Dame ( {returnGame(RENTZ_GAMES.QUEENS)} ):</b> nu trebuie luate dame.
                </p>
                <p>
                  <b>3. Carouri ( {returnGame(RENTZ_GAMES.DIAMONDS)} ):</b> nu trebuie luate carouri.
                </p>
                <p>
                  <b>4. Levate minus ( {returnGame(RENTZ_GAMES.NEGATIVE_TRICKS)} ):</b> nu trebuie luate levate ("maini").
                </p>
                <p>
                  <b>5. Totale minus ( {returnGame(RENTZ_GAMES.NEGATIVE_TOTAL)} ):</b> nu trebuie luate Dame, Carouri, Levate, Regele de Cupa (cuprinde toate negativele). Punctaj: se obtine prin insumarea negativelor luate (atentie: dama de caro are valoare negativa insumata reprezentand si Dama si Caro).
                </p>

                <h3>Jocuri pozitive</h3>

                <p>
                  <b>6. Zece de trefla ( {returnGame(RENTZ_GAMES.TEN_OF_CLUBS)} ):</b> trebuie luat zecele de trefal (similar cu Regele de inima rosie).
                </p>
                <p>
                  <b>7. Levate plus ( {returnGame(RENTZ_GAMES.POSITIVE_TRICKS)} ):</b> trebuie luate levate ("maini").
                </p>
                <p>
                  <b>8. Totale plus ( {returnGame(RENTZ_GAMES.POSITIVE_TOTAL)} ):</b> este opusul subjocului de Totale Minus. Trebuie luate Dame, Carouri, Levate, Regele de Cupa. Punctaj: se obtine prin insumarea mainilor luate (atentie: dama de caro are valoare pozitiva insumata reprezentand si Dama si Caro).
                </p>
                <p>
                  <b>9. Rentz ( {returnGame(RENTZ_GAMES.RENTZ)} ):</b> obiectivul jocului este de a termina primul cartile din mana. Initial, pe masa de joc nu este nicio carte. Se va alege o carte de mijloc (cele 4 dame la 3 jucatori, cei 4 valeti la 4 jucatori, cei 4 de 10 la 5 jucatori, cei 4 de 9 la 6 jucatori). Cartile se vor pune pe masa de joc in ordine crescatoare, in 4 randuri (unul pentru fiecare culoare) pe orizontala.  Dealerul va incepe primul si va pune una dintre cartile de mijloc. In cazul in care nu are, spune "pass". Urmatorul jucator poate alege sa lipeasca o cartea adiacenta cartilor care sunt pe masa sau sa puna inca o carte de mijloc. In cazul in care jucatorul nu poate face nimic, spune "pass". Este interzis sa spui "pass" daca ai posibile mutari in mana. Jocul este gata cand toti jucatorii au terminat cartile din mana.
                </p>
                <p>
                  <b>Capetele ofera avantaje:</b>
                  <br />
                  - Asul iti permite sa asezi inca o carte
                  <br />
                  - Capatul inferior da "skip" la urmatorul jucator
                </p>
                <p>
                  Un jucator poate refuza jocul de Rentz daca are cel putin 4 capete in mana. Un joc de rentz se poate refuza de atatea ori, cati jucatori sunt la masa. Dupa refuzarea jocului, se refac cartile si se impart, iar dealerul poate alege din nou Rentz sau un alt subjoc. In cazul in care un jucator a ales Rentz pe "neve" (pe nevazute), acesta nu poate refuza jocul de Rentz daca are cel putin 4 capete.
                </p>
              </Section>
              <Section>
                <h3>Jocul pe "neve" (pe nevazute)</h3>
                <p>Un jucator poate alege sa joace un joc pe "neve" (pe nevazute) daca aceasta optiune este acceptata la inceputul jocului de toti jucatorii. Cand se alege un joc de "neve", dealerul alege jocul fara a se uita la cartile de joc. La un joc de "neve" scorurile sunt dublate. Nu se poate alege un joc pe "neve", daca este ultimul subjoc pentru acel jucator.</p>
              </Section>
            </ModalBody>

            <ModalFooter>
              <CloseButton variant='outline' colorScheme='red' onClick={() => setViewRules(false)}>
                Inchide
              </CloseButton>
            </ModalFooter>
          </StyledContentModal>
        </Modal>
      }

      {viewExit &&
        <Modal isOpen={viewExit} onClose={() => setViewExit(false)}>
          <ModalOverlay />
          <StyledContentModal>
            <ModalHeader style={{ fontSize: 25 }}>Iesi din joc</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Esti sigur ca vrei sa renunti la acest joc? Tot progresul va fi sters.
            </ModalBody>

            <ModalFooter>
              <CloseButtonExit variant='outline' colorScheme='red' onClick={() => setViewExit(false)}>
                Renunta
              </CloseButtonExit>
              <Exit onClick={() => {setViewExit(false); exit()}}>
                Da
              </Exit>
            </ModalFooter>
          </StyledContentModal>
        </Modal>
      }
    </>
  );
}

export default Header;