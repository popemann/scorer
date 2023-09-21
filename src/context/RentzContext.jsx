import { createContext, useEffect, useState } from "react";
import { onClickLink } from "../utils/redirect";

const RentzContext = createContext({});

const RentzContextProvider = ({ children }) => {
  const [players, setPlayers] = useState(null);
  const [gameSettings, setGameSettings] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  const persistPlayers = (players) => {
    localStorage.setItem('rentzPlayers', JSON.stringify(players));
    setPlayers(players);
  };

  const persistGameSettings = (settings) => {
    localStorage.setItem('rentzGameSettings', JSON.stringify(settings));
    setGameSettings(settings);
  };

  const persistGameHistory = (round) => {
    let history;
    if (round.finished) {
      const copyHistory = JSON.parse(JSON.stringify(gameHistory));
      const lastRound = copyHistory.pop();
      const newLastRound = {
        ...lastRound,
        scores: round.scores,
        finished: true,
      };

      history = [...copyHistory, newLastRound];
    } else {
      history = [...gameHistory, round];
      const newPlayers = players.map(p => {
        if (p.name === round.initiator) {
          return ({
            ...p,
            gamesPlayed: [...p.gamesPlayed, round.chosenGame],
            remainingGames: p.remainingGames.filter(g => g !== round.chosenGame),
          });
        } else {
          return p;
        }
      });

      persistPlayers(newPlayers);
    }

    localStorage.setItem('rentzGameHistory', JSON.stringify(history));
    setGameHistory(history);
  }

  const undoRound = () => {
    const copyHistory= JSON.parse(JSON.stringify(gameHistory));
    const lastRound = copyHistory.pop();

    if (lastRound.finished) {
      lastRound.finished = false;
      delete lastRound.scores;

      copyHistory.push(lastRound);
    } else {
      const newPlayers = players.map(p => {
        if (p.name === lastRound.initiator) {
          return ({
            ...p,
            gamesPlayed: p.gamesPlayed.filter(g => g !== lastRound.chosenGame),
            remainingGames: [...p.remainingGames, lastRound.chosenGame],
          });
        } else {
          return p;
        }
      });

      persistPlayers(newPlayers);
    }

    localStorage.setItem('rentzGameHistory', JSON.stringify(copyHistory));
    setGameHistory(copyHistory);
  }

  const exit = () => {
    persistPlayers(null);
    persistGameSettings(null);
    localStorage.setItem('rentzGameHistory', JSON.stringify([]));
    setGameHistory([]);

    onClickLink('/scorer/rentz')
  }

  const reset = () => {
    localStorage.setItem('rentzGameHistory', JSON.stringify([]));
    setGameHistory([]);

    const newPlayers = players.map(p => {
      return ({
        ...p,
        remainingGames: p.gamesPlayed,
        gamesPlayed: [],
      });
    });

    persistPlayers(newPlayers);
  }

  useEffect(() => {
    const rentzGames = JSON.parse(localStorage.getItem('rentzGameSettings'));
    const rentzPlayers = JSON.parse(localStorage.getItem('rentzPlayers'));
    const rentzHistory = JSON.parse(localStorage.getItem('rentzGameHistory'));

    if (rentzGames) {
      setGameSettings(rentzGames);
    }

    if (rentzPlayers) {
      setPlayers(rentzPlayers);
    }

    if (rentzHistory) {
      setGameHistory(rentzHistory);
    }
  }, []);

  return (
    <RentzContext.Provider
      value={{
        gameHistory,
        setGameHistory: persistGameHistory,
        gameSettings,
        setGameSettings: persistGameSettings,
        players,
        setPlayers: persistPlayers,
        undoRound: undoRound,
        exit,
        reset,
      }}
    >
      {children}
    </RentzContext.Provider>
  );
}

export {
  RentzContextProvider,
  RentzContext,
};