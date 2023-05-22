import React from 'react';
import { HistoryType } from '../../@types';
import classNames from 'classnames';

interface PropsType{
    history: HistoryType[]
}

const BetStatus = ({ history } : PropsType) => {
    return (
        <div className="w-full md:w-[45%] max-w-[350px] md:max-w-[550px] lg:max-w-[450px] xl:max-w-[550px] justify-start sm:justify-center md:justify-start lg:justify-end pl-[10px] pr-[10px] xl:pl-[100px] pt-[12px] x-betStatus">
            <div className="flex flex-row justify-center w-full max-w-[400px] gap-[20px] md:gap-0 text-gray-500 text-[20px] overflow-hidden">
                <div className="w-[40%] max-w-[150px] lg:max-w-[150px]">Player</div>
                <div className="w-[20%] lg:w-[30%] max-w-[120px] lg:max-w-[120px]">Odds</div>
                <div className="w-[30%] max-w-[120px] lg:max-w-[120px] text-right">Bet&nbsp;Amount</div>
            </div>
            <div className="overflow-auto w-full max-h-[500px] max-w-[400px] sm:max-h-[700px] lg:max-h-[800px] mr-[-20px] pr-[10px]">
                {

                    history.length > 0 ? history.map((ele: HistoryType, ind: number) => (
                        <div key={ind} className="flex flex-row justify-start gap-[20px] md:gap-0 sm:justify-center md:justify-start w-full mt-[15px] text-[18px] text-text border-b-[1px] border-b-slate-700 lg:justify-end ">
                            <div className="w-[40%] max-w-[150px] lg:max-w-[150px]">{ele.username}</div>
                            <div className="w-[20%] lg:w-[30%] max-w-[120px] lg:max-w-[120px]"><span className={classNames("bg-oddbg w-[50px] block text-center rounded-md px-[10px] font-bold text-[16px]", {"text-oddText": ele.odds >= 1, "text-red": ele.odds < 1})}>{ele.odds}</span></div>
                            <div className="w-[25%] lg:w-[30%] max-w-[120px] lg:max-w-[120px] text-right">$<span className="text-oddText font-medium pl-[2px]">{ele.betAmount}</span></div>
                        </div>
                    )) :
                    <div className="flex w-full justify-center max-w-[400px] mt-[10px] text-text">No data</div>
                }
            </div>
        </div>
    )
}

export default BetStatus;