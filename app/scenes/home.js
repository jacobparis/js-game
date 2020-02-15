import React from "react";

export default function () {
    const [username, setUsername] = React.useState('')
    const [roomName, setRoomName] = React.useState('')

    return (
        <div>
            <h1> Home Scene </h1>
            <label>
                <span> user name </span>
                <input type="text" onInput={e => setUsername(e.currentTarget.value)} />
            </label>   

            <label>
                <span> room name </span>
                <input type="text" onInput={e => setRoomName(e.currentTarget.value)} />
            </label>
            
            { username.length > 3 && roomName.length > 3
            ? <a href={`/game/${roomName}?username=${username}`}>
                Join Game
              </a>
            : null
            }
            
        </div>
    );
}