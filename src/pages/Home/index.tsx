import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuthStore } from '../../store/auth'

import { Loading } from '../../components/Loading'
import Game from '../../components/Game';
import BetStatus from '../../components/BetStatus';

import { HistoryType } from '../../@types';

import { socket } from '../../socket';

const Home = () => {
    const [searchParams] = useSearchParams();

    const setUser = useAuthStore(state => state.setUser)
    const setBalance = useAuthStore(state => state.setBalance)
    const setLoading = useAuthStore(state => state.setLoading)
    const isLoading = useAuthStore((state) => state.isLoading);

    const [ history, setHistory ] = useState<Array<HistoryType>>([]);

    useEffect(() => {
        socket.on('connect', () => {
            const socketId = socket.io.engine.id as string;
            console.log(`socket id: ${socketId} connected`);

            const token = searchParams.get('cert') || 'test-user';
            socket.emit('enter-room', {
                token: token
            })

            setLoading(true);
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
            setLoading(false);
        });
        
        socket.on('history', (data: any) => {
            console.log('history = ', data)
            setHistory(prev => {
                if(prev.length > 19){
                    prev.pop();
                }
                return [data, ...prev]
            });
        })

        socket.on('refund', (data: any) => {
            if(data.status)
                setBalance(data.balance);
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('user-info');
            socket.off('history');
        };
    }, [])
    return (
        <>
            {
                isLoading ? <Loading /> :
                <div className="flex flex-col md:flex-row w-full justify-center items-start sm:items-center md:items-start xl:justify-between pt-[20px] pb-[30px] x-page">
                    <Game />
                    <BetStatus history = {history}/>
                </div>
            }
        </>
    )
}

export default Home;