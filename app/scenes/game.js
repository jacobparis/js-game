import React from "react";
import useWebSocket from 'react-use-websocket';

import { Button } from "../components/button";
import { Header } from "../components/header";
import { Container, Section, SectionTitle, Game, Hand, Card } from "../components/containers";
import { Messages, MessageList, MessageInput } from "../components/messages";

import Deck from "../components/deck"

const READY_STATES = [
    "Connecting to chat...",
    "Connected to chat",
    "Closing chat",
    "Chat disconnected. Refresh the page to reconnect."
];

const HTTP_URL = process.env.IS_OFFLINE ? (
    "http://localhost:3000"
) : (
    "https://3pxe3ksj6h.execute-api.us-west-2.amazonaws.com/dev"
);

const SOCKET_URL = process.env.IS_OFFLINE ? (
    "ws://localhost:3001"
) : (
    "wss://hkwdhszrwk.execute-api.us-west-2.amazonaws.com/dev"
);

export default function () {
    const channelId = document.location.pathname.split('/').pop();
    const username = new URLSearchParams(document.location.search).get('username');

    const [game, setGame] = React.useState([2, -4, 8, -4, 2])
    const [deck, setDeck] = React.useState(shuffle(Deck.concat(Deck)))
    const [hand, setHand] = React.useState([])
    const [points, setPoints] = React.useState(0)

    if (hand.length === 0) {
        drawHand()
    }

    const [messageHistory, setMessageHistory] = React.useState([]);
    React.useEffect(() => {
        let isSubscribed = true;

        // Load messages from server
        getMessageHistory(channelId).then(history => {
            const filteredHistory = history.filter(message => {
                if (!message.Body) return false

                return true
            })

            if (isSubscribed) setMessageHistory(filteredHistory);
        });

        return () => isSubscribed = false;
        // isSubscribed maneuver lets us cancel the promise
        // if the component unmounts before the results come in
    }, [channelId]);


    // Connect to socket server
    const [socketUrl, setSocketUrl] = React.useState(SOCKET_URL);
    const [sendMessage, lastMessage, readyState] = useWebSocket(socketUrl);
    // Add incoming messages to chatbox
    React.useEffect(() => {
        if(lastMessage && lastMessage.data) {
            const message = JSON.parse(lastMessage.data);

            if(message.ChannelId !== channelId) return

            if (message.Card) {
                const result = actions()[message.Card.title](game)

                if (result.game) {
                    setGame(result.game)
                }

                if (message.MessageAuthor === username) {
                    if (result.points) {
                        setPoints(points => points + result.points)
                    }
                }

                const points = result.points
                    ? `and collected ${result.points} points`
                    : ''

                setMessageHistory(prev => prev.concat({
                    ...message,
                    MessageBody: `Played ${message.Card.title} ${points}`
                }))
            }

            if (message.MessageBody) {
                setMessageHistory(prev => prev.concat(message));
            }
        }
    }, [lastMessage]);
    

    const onSend = body => sendMessage(buildMessage({ username, body, channelId }));

    const connectionStatus = READY_STATES[readyState];
    const isDisconnected = readyState === 3;
    const triggerRefresh = React.useCallback(() => location.reload(), []);
    
    const onPlay = (card, i) => {
        sendMessage(buildMessage({ username, card, channelId }))

        setHand(hand.filter((_, j) => i !== j))

        if (hand.length === 0) {
            drawHand()
        }
    }

    return (
        <div>
            <Header />
            <p>Username: {username} </p> 
            <p> Score: {points} </p>
            <Container>
                <Game>[{game.toString()}]</Game>
            </Container>
            <Hand>
                {hand.map((card, i) => {
                    return (
                        <Card onClick={() => onPlay(card, i)}>{card.title}</Card>
                    )
                })}
            </Hand>
            <Container>
                <Section>
                    <SectionTitle>
                        {connectionStatus}
                        {isDisconnected 
                            ? <Button primary onClick={triggerRefresh}>REFRESH</Button> 
                            : null
                        }
                    </SectionTitle>
                    <MessageList>
                        <Messages messages={messageHistory} />
                    </MessageList>
                    <MessageInput onSend={onSend} />
                </Section>
            </Container>
        </div>
    )

    function drawHand() {
        const newDeck = [...deck]
        const cards = newDeck.splice(0, 5)
        setHand(cards)
        setDeck(newDeck)
    }
}

function buildMessage({ username, body, channelId, card, deck }) {
    const message = JSON.stringify({
        MessageAuthor: username,
        MessageBody: body,
        ChannelId: channelId,
        MessageId: new Date().getTime(),
        Card: card,
        Deck: deck
    });

    return message;
}

function getMessageHistory(channelId) {
    return fetch(`${HTTP_URL}/api/messages/${channelId}`)
    .then(response => response.json())
    .then(results => results.Items);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function actions() {
    return {
        "push(0)"(game) {
            return {
                game: game.concat(0)
            }
        },
        "push(1)"(game) {
            return {
                game: game.concat(1)
            }
        },
        "push(2)"(game) {
            return {
                game: game.concat(2)
            }
        },
        "push(4)"(game) {
            return {
                game: game.concat(4)
            }
        },
        "push(8)"(game) {
            return {
                game: game.concat(8)
            }
        },
        "push(-1)"(game) {
            return {
                game: game.concat(-1)
            }
        },
        "push(-2)"(game) {
            return {
                game: game.concat(-2)
            }
        },
        "push(-4)"(game) {
            return {
                game: game.concat(-4)
            }
        },
        "push(-8)"(game) {
            return {
                game: game.concat(-8)
            }
        },
        "pop()"(game) {
            return {
                game: game.slice(0, game.length - 1),
                points: game[game.length - 1]
            }
        },
        "shift()"(game) {
            return {
                game: game.slice(1, game.length),
                points: game[0]
            }
        },
        "unshift(0)"(game) {
            return {
                game: [0].concat(game)
            }
        },
        "unshift(0)"(game) {
            return {
                game: [0].concat(game)
            }
        },
        "unshift(1)"(game) {
            return {
                game: [1].concat(game)
            }
        },
        "unshift(2)"(game) {
            return {
                game: [2].concat(game)
            }
        },
        "unshift(4)"(game) {
            return {
                game: [4].concat(game)
            }
        },
        "unshift(8)"(game) {
            return {
                game: [8].concat(game)
            }
        },
        "unshift(-1)"(game) {
            return {
                game: [-1].concat(game)
            }
        }
        ,
        "unshift(-2)"(game) {
            return {
                game: [-2].concat(game)
            }
        }
        ,
        "unshift(-4)"(game) {
            return {
                game: [-4].concat(game)
            }
        }
        ,
        "unshift(-8)"(game) {
            return {
                game: [-8].concat(game)
            }
        }
        ,
        "map(x => -x)"(game) {
            return {
                game: game.map(x => -x)
            }
        },
        "filter(x => x <= 0)"(game) {
            return {
                game: game.filter(x => x <= 0),
                points: game
                    .filter(x => x > 0)
                    .reduce((sum, i) => sum + i, 0)
            }
        },
        "filter(x => x >= 0)"(game) {
            return {
                game: game.filter(x => x >= 0),
                points: game
                    .filter(x => x < 0)
                    .reduce((sum, i) => sum + i, 0)
            }
        },
        "filter(x => x == 0)"(game) {
            return {
                game: game.filter(x => x === 0),
                points: game.reduce((sum, i) => sum + i, 0)
            }
        },
        "filter(x => x != 0)"(game) {
            return {
                game: game.filter(x => x !== 0),
            }
        },
        "reduce(sum)"(game) {
            return {
                game: [ game.reduce((sum, i) => sum + i, 0) ],
            }
        },
        "continue"(game) {
            return { game }
        }
    }
}
