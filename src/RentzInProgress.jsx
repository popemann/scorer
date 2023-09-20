import { useContext, useState } from "react";
import { RentzContext } from "./context/RentzContext";
import { styled } from "styled-components";
import { colors } from "./style/colors";
import RentzChooseGame from "./RentzChooseGame";
import { RENTZ_GAMES_DETAILED } from "./helpers/constants";
import RentzInputResult from "./RentzInputResult";
import RentzPreview from "./RentzPreview";
import { useMediaQuery } from "@chakra-ui/react";
import RentzGameFinished from "./RentzGameFinished";

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;
  padding-left: 5vw;
  padding-right: 5vw;
  padding-bottom: 15px;
  height: 100vh;
`

const TableContainer = styled.div`
  max-height: calc(100vh - 120px);
  position: relative;
  overflow: scroll;
  border-radius: 10px;
  border-bottom: 1px solid darkgray;
  max-width: calc(100vw - 10vw);
`

const Table = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  border-spacing: 0px;
  border-left: 1px solid darkgray;

  & > tfoot {
    background: ${colors.blue}dd;
    position: sticky;
    bottom: 0;
    box-shadow: 0px -1px 0px 0px darkgray;

    & td {
      color: white;
      text-align: center;
      font-weight: 600;
    }
  }

  & > thead {
    background: ${colors.blue}dd;
    position: sticky;
    top: 0;
    box-shadow: 0px -1px 0px 0px darkgray;
  }

  & td, th {
    border-bottom: 1px solid darkgray;
    border-right: 1px solid darkgray;
  }

  & th {
    color: white;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-top: 1px solid darkgray;
  }

  & > thead > tr > th:first-child {
    width: 180px;
  }

  & > thead > tr > th:not(:first-child) {
    width: ${props => props.$fixedWidth ? "65px" : `calc((100% - 180px) / ${props.$numberOfPlayers})`};
    min-width: 100px;
  }

  & > tbody > tr:nth-child(odd) {
    background: #d3d3d390;
  }
`

const Cell = styled.div`
  display: flex;
  justify-content: space-between;
`

const Index = styled.div`
  background: ${colors.blue}30;
  width: 30px;
  text-align: center;
  margin-right: 5px;
`

const GameIcon = styled.div`
  background: ${colors.blue}30;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RentzInProgress = () => {
  const { players, gameSettings, gameHistory, setGameHistory, exit, reset } = useContext(RentzContext);
  const [preview, setPreview] = useState(null);
  const [isVertical] = useMediaQuery('(max-width: 800px)');

  if (!players || !gameSettings) {
    return;
  }

  const lastRound = gameHistory && gameHistory[gameHistory.length - 1];
  const total = {};

  if (gameHistory) {
    // eslint-disable-next-line
    gameHistory.map(gh => {
      if (gh.scores) {
        // eslint-disable-next-line
        Object.keys(gh.scores).map(key => {
          if (!total[key]) {
            total[key] = 0;
          }
          total[key] += gh.scores[key].totalRound;
        })
      }
    })
  };

  const gameFinished = lastRound && lastRound.finished && gameHistory.length === players.length * gameSettings.games.length;

  return (
    <Container>
      <TableContainer>
        <Table $numberOfPlayers={players.length} $fixedWidth={isVertical && players.length > 3}>
          <thead style={{ zIndex: 9 }}>
            <tr>
              <th>Runda</th>
              {players.map(p => <th key={'header-' + p.name}>{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {[...new Array(players.length * gameSettings.games.length)].map((row, index) => {
              const playedGame = gameHistory[index];
              let rowBackground = null;
              let GameIconDetails = null;

              if (playedGame) {
                const Icon = RENTZ_GAMES_DETAILED[playedGame.chosenGame].icon;
                rowBackground = playedGame.bonusRound ? '#ffad007a' : null;

                GameIconDetails = (
                  <>
                    {RENTZ_GAMES_DETAILED[playedGame.chosenGame].initial &&
                      <span style={{ marginRight: 2 }}>{RENTZ_GAMES_DETAILED[playedGame.chosenGame].initial}</span>}
                    {RENTZ_GAMES_DETAILED[playedGame.chosenGame].miniIcon || <Icon />}
                    {playedGame.bonusRound && <span style={{ marginLeft: 2 }}>x2</span>}
                  </>
                )
              }

              return (
                <tr
                  key={'round-' + index}
                  style={{
                    borderTop: (index % players.length) === 0 && index > 0 ? '2px solid black' : '',
                    background: rowBackground,
                  }}
                  onClick={() => { if (playedGame) setPreview({ ...playedGame, roundNumber: index + 1 }) }}
                >
                  <td style={{ padding: 0 }}>
                    <Cell>
                      <Index>{index + 1}.</Index>
                      <div style={{ flexGrow: 1 }}>{players[index % players.length].name}</div>
                      <GameIcon>
                        {GameIconDetails}
                      </GameIcon>
                    </Cell>
                  </td>
                  {players.map(p =>
                    <td
                      key={'round-player-' + p.name}
                      style={{ textAlign: 'center' }}
                    >
                      {playedGame && playedGame.scores ? playedGame.scores[p.name].totalRound : null}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              {players.map(p => <td key={'footer-' + p.name}>{total[p.name]}</td>)}
            </tr>
          </tfoot>
        </Table>
      </TableContainer>
      {gameFinished
        ? <RentzGameFinished total={total} exit={exit} reset={reset}/>
        : !lastRound || lastRound.finished
          ?
          <RentzChooseGame
            player={players[gameHistory.length % players.length]}
            gameSettings={gameSettings}
            setGameHistory={setGameHistory}
          />
          :
          players &&
          <RentzInputResult
            chosenGame={lastRound.chosenGame}
            bonusRound={lastRound.bonusRound}
            players={players}
            gameSettings={gameSettings}
            setGameHistory={setGameHistory}
          />
      }
      {preview &&
        <RentzPreview
          onClose={() => setPreview(null)}
          round={preview}
          points={gameSettings.points}
        />
      }

    </Container>
  );
}

export default RentzInProgress;