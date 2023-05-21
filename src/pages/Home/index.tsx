import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuthStore } from '../../store/auth'

import Game from '../../components/Game';
import BetStatus from '../../components/BetStatus';

import { HistoryType } from '../../@types';

import { socket } from '../../socket';

const Home = () => {
    const [searchParams] = useSearchParams();

    const setUser = useAuthStore(state => state.setUser)
    const setBalance = useAuthStore(state => state.setBalance)

    const [ history, setHistory ] = useState<Array<HistoryType>>([]);

    useEffect(() => {
        socket.on('connect', () => {
            const socketId = socket.io.engine.id as string;
            console.log(`socket id: ${socketId} connected`);

            const token = searchParams.get('cert') || 'test-user';
            console.log('enter-room = ', token)
            socket.emit('enter-room', {
                token: token
            })
        });

        socket.on('disconnect', () => {
            console.log('socket disconnected')
        });

        socket.on('user-info', (data: any) => {
            console.log('user-info = ', data)
            setUser({
                id: data.userId,
                name: data.username
            });
            setBalance(Number(data.balance));
        });
        
        socket.on('history', (data) => {
            console.log('history = ', data)
            setHistory(prev => {
                if(prev.length > 19){
                    prev.pop();
                }
                return [data, ...prev]
            });
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('user-info');
            socket.off('update-info')
        };
    }, [])
    return (
        <>
            <div className="flex pt-[20px]">
                <Game />
                <BetStatus history = {history}/>
            </div>
        </>
    )
}

export default Home;