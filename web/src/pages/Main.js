import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

import './Main.css';
import api from '../services/api';

function Main({ match }) {
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(false);

    useEffect(() => {
        api.get('/devs', { headers: { user: match.params.id } })
        .then( response => {

            setUsers(response.data);
        });
        
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });

    }, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/like`, null, { headers: { user: match.params.id } });

        // retiro o usuario que foi dado o dislike
        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislike`, null, { headers: { user: match.params.id } });

        // retiro o usuario que foi dado o dislike
        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>

            { users.length > 0 ? (
                <ul>
                    { users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt="" />

                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>

                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="like" />
                                </button>
                            </div>
                        </li>
                    )) }
                </ul>
            ) : (
                <div className="empty">Nada a ser mostrado</div>
            ) }

            { matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="its a match" />
                    <img className="avatar" src={matchDev.avatar} alt="" />
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>

                    <button type="button" onClick={() => setMatchDev(false)}>Fechar</button>
                </div>
            ) }
        </div>
    );
}

export default Main;