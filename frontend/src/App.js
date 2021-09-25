import "./App.css";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [songs, setSongs] = useState([]);
  const [gameSongs, setGameSongs] = useState([]);
  const [songAndArtist, setSongAndArtist] = useState([]);
  const [count, setCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [view, setView] = useState(false);
  const [answer, setAnswers] = useState([]);

  const getRandomSongs = () => {
    let arr = [];
    let paragraphArr = [];
    const num1 = Math.floor(Math.random() * 100);
    let num2 = Math.floor(Math.random() * 100);
    let num3 = Math.floor(Math.random() * 100);
    //This keeps looping to ensure that we will have 3 different random numbers for the index of the song
    while (num1 === num2) {
      num2 = Math.floor(Math.random() * 100);
    }
    while (num2 === num3 || num1 === num3) {
      num3 = Math.floor(Math.random() * 100);
    }
    //have two different arrays from gameSong and songAndArtist
    //react-beautiful-dnd needs a paragraph as an input so we will store the string beforehand
    arr.push(songs[num1]);
    arr.push(songs[num2]);
    arr.push(songs[num3]);
    setGameSongs(arr);
    paragraphArr.push(songs[num1].song + " by " + songs[num1].artist);
    paragraphArr.push(songs[num2].song + " by " + songs[num2].artist);
    paragraphArr.push(songs[num3].song + " by " + songs[num3].artist);
    setSongAndArtist(paragraphArr);
  };

  /**
   * Updates and renders the values of the order of the cards when users drop it into a different order.
   * @param {*} result
   * @returns
   */
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(songAndArtist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSongAndArtist(items);
  };
  const viewList = () => {
    setView(true);
  };

  const playGame = () => {
    setCount(count + 1);
    getRandomSongs();
  };

  const playAgain = () => {
    setCount(1);
    setPoints(0);
    setAnswers([]);
    getRandomSongs();
  };

  const GetSortOrder = (prop) => {
    return (a, b) => {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  };

  const submit = () => {
    let arr = gameSongs;

    try {
      arr.sort(GetSortOrder("rank"));
      for (let i = 0; i < 3; ++i) {
        console.log(arr.rank);
      }
      const expected1 = arr[0].song + " by " + arr[0].artist;
      const expected2 = arr[1].song + " by " + arr[1].artist;
      const expected3 = arr[2].song + " by " + arr[2].artist;
      setAnswers([
        ...answer,
        {
          expected: {
            rank1: expected1,
            rank2: expected2,
            rank3: expected3,
          },
          actual: {
            rank1: songAndArtist[0],
            rank2: songAndArtist[1],
            rank3: songAndArtist[2],
          },
        },
      ]);
      //Award a point if each song is in the right order
      if (
        expected1 === songAndArtist[0] &&
        expected2 === songAndArtist[1] &&
        expected3 === songAndArtist[2]
      ) {
        setPoints(points + 1);
      }
      setCount(count + 1);
    } catch (error) {
      console.log("@submit: ", error);
    }

    getRandomSongs();
  };
  useEffect(() => {
    fetch("http://localhost:9000/scrape")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setSongs(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* boolean view is set to true when users click the button to view the list */}
        {view === true ? (
          <div>
            <h1>Top 100 Songs on Billboard</h1>
            <Button
              onClick={() => {
                setView(false);
                setGameSongs([]);
                setSongAndArtist([]);
                setPoints(0);
                setCount(0);
              }}
            >
              Home Page
            </Button>
            <Button
              onClick={() => {
                setView(false);
                playAgain();
              }}
            >
              Play
            </Button>

            <ol>
              {songs.map(({ song, artist }) => (
                <div className="card">
                  <li key={songs}>
                    {song} by {artist}
                  </li>
                </div>
              ))}
            </ol>
          </div>
        ) : (
          <div>
            {/* When the game is over*/}
            {count === 11 ? (
              <div>
                <ol>
                  <p1>You got {points} / 10 correct</p1>
                  <div style={{ flexDirection: "column" }}>
                    {answer.map(({ actual, expected }, index) => {
                      return (
                        <div>
                          <li>
                            <ul>
                              <li>
                                <div>
                                  <p2>Expected First Song: {expected.rank1}</p2>
                                  <br />
                                  <p2>Actual First Song: {actual.rank1}</p2>
                                </div>
                              </li>
                              <li>
                                <p2>Expected Second Song: {expected.rank2}</p2>
                                <br />
                                <p2>Actual Second Song: {actual.rank2}</p2>
                              </li>
                              <li>
                                <p2>
                                  Expected Third Song: {expected.rank3}
                                  <br />
                                  Actual Third Song: {actual.rank3}
                                </p2>
                              </li>
                              <br />
                              <br />
                            </ul>
                          </li>
                        </div>
                      );
                    })}
                  </div>
                  <Button onClick={playAgain}> Play Again</Button>
                  <Button onClick={viewList}> View List</Button>
                </ol>
              </div>
            ) : (
              <div>
                {/* Home screen is rendered when the count is set to 0. */}
                {count === 0 ? (
                  <div>
                    <h1>Top 100 Billboards Game</h1>
                    <h1>
                      Guess the rank of the relative rank of each song by
                      dragging and dropping them to the right order. You will
                      answer 10 questions before you get your results for the
                      game.
                    </h1>
                  </div>
                ) : (
                  <h1>
                    {/* When count is greater than 1(game is playing), it will render which question the person is on.*/}
                    {count} / 10
                  </h1>
                )}

                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="characters">
                    {(provided) => (
                      <ol
                        className="characters"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {songAndArtist.map((SongAndArtist, index) => {
                          return (
                            <Draggable
                              key={SongAndArtist}
                              draggableId={SongAndArtist}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  style={{ justifyContent: "center" }}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <p1>{SongAndArtist}</p1>
                                </li>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </ol>
                    )}
                  </Droppable>
                </DragDropContext>
                <div>
                  {/* It will render the buttons accordingly based on which page it is on.*/}
                  {count === 0 ? (
                    <div>
                      <Button onClick={playGame}>Play</Button>
                      <Button onClick={viewList}> View List</Button>
                    </div>
                  ) : (
                    <Button onClick={submit}>Submit Answer</Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
const Button = styled.button`
  background-color: #318ce7;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

export default App;
