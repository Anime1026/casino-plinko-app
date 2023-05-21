import React from 'react';
import { HistoryType } from '../../@types';
import classNames from 'classnames';

interface PropsType{
    history: HistoryType[]
}

const BetStatus = ({ history } : PropsType) => {
    return (
        <div className="w-full max-w-[550px] max-h-[800px] overflow-auto pl-[100px] pt-[12px]">
            <div className="flex flex-row flex-start w-full max-w-[400px] gap-[15px] text-gray-500 text-[20px] ">
                <div className="w-[40%] max-w-[150px]">Player</div>
                <div className="w-[30%] max-w-[120px]">Odds</div>
                <div className="w-[30%] max-w-[120px] text-right">Bet&nbsp;Amount</div>
            </div>
            {
                history.map((ele: HistoryType, ind: number) => (
                    <div key={ind} className="flex flex-row flex-start w-full max-w-[400px] gap-[15px] mt-[15px] text-[18px] text-text border-b-[1px] border-b-slate-700 ">
                        <div className="w-[40%] max-w-[150px]">{ele.username}</div>
                        <div className="w-[30%] max-w-[120px]"><span className={classNames("bg-oddbg w-[50px] block text-center rounded-md px-[10px] font-bold text-[16px]", {"text-oddText": ele.odds >= 1, "text-red": ele.odds < 1})}>{ele.odds}</span></div>
                        <div className="w-[30%] max-w-[120px] text-right">$<span className="text-oddText font-medium pl-[2px]">{ele.betAmount}</span></div>
                    </div>
                ))
            }
        </div>
    )
}

export default BetStatus;