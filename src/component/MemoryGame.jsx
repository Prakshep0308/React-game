import React, { useEffect } from "react";
import { useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [wonGame, setWonGame] = useState(false);

  const handleGridSize = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const suffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));
    setCards(suffledCards);
    setFlipped([]);
    setSolved([]);
    setWonGame(false);
  };

  const handleClick = (id) => {
    if (disabled || wonGame) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);
  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWonGame(true);
    }
  }, [solved, cards]);
  return (
    <div className="flex flex-col gap-10  items-center justify-center">
      <h2 className="text-4xl font-bold mt-11">Memory Game</h2>

      <div>
        <label htmlFor="gridSize" className="font-bold text-red-500 mr-2 ">
          Grid Size:(maximum:10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSize}
          className="border-2 w-10"
        />
      </div>
      <div
        className={`grid gap-2`}
        style={{
          gridTemplateColumns: `repeat(${gridSize},minmax(0,1fr))`,
          width: `min(100%,${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300  ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "text-gray-400 bg-gray-200"
              } `}
              key={card.id}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {wonGame && (
        <div className="text-4xl font-bold text-green-500 animate-bounce">
          You Won!
        </div>
      )}

      <button
        onClick={initializeGame}
        className="border-2 p-2 hover:bg-green-500 hover:text-white "
      >
        {wonGame ? "Play Again" : "Reset Game"}
      </button>
    </div>
  );
};

export default MemoryGame;
