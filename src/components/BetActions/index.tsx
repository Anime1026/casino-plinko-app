import { ChangeEvent, useState, useRef, useEffect } from 'react'
import { CurrencyDollarSimple } from 'phosphor-react'
import classNames from 'classnames'

import { useAuthStore } from '../../store/auth'

import { BetType } from '../../@types'

interface PlinkoBetActions {
  onRunBet: (key: BetType, betValue: number) => void
  inGameBallsCount: number
}

export function BetActions({
  onRunBet,
  inGameBallsCount
}: PlinkoBetActions) {
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const autoIntervalRef = useRef<any>(null);

  const [betValue, setBetValue] = useState({
    easy: '0.00',
    medium: '0.00',
    diff: '0.00'
  })
  const [auto, setAuto] = useState<{ [key: string]: boolean }>({
    easy: false,
    medium: false,
    diff: false
  })
  const [autoBet, setAutoBet] = useState<{betType: BetType, auto: boolean}>({
    betType: 'easy',
    auto: false
  })

  const updateBetValue = (key: BetType, value: string) => {
    setBetValue({ ...betValue, [key]: value })
  }

  const updateAuto = (key: BetType) => {
    if(!autoBet.auto){
      setAuto({ ...auto, [key]: !auto[key] });
    }
  }

  const updateAutoBet = (key: BetType) => {
    setAutoBet({ betType: key, auto: !autoBet.auto });
  }

  function handleChangeBetValue(key: BetType, e: ChangeEvent<HTMLInputElement>) {
    if(!autoBet.auto){
      e.preventDefault()
      const newBetValue = +e.target.value >= currentBalance ? currentBalance : +e.target.value
      updateBetValue(key, newBetValue.toString());
    }
  }

  function handleDoubleBet(key: BetType) {
    if(!autoBet.auto){
      const value = Number(betValue[key]) * 2

      if (value >= currentBalance) {
        updateBetValue(key, currentBalance.toString())
        return
      }

      const newBetvalue = value <= 0 ? 0 : value.toFixed(2)
      updateBetValue(key, newBetvalue.toString())
    }
  }

  function handleHalfBet(key: BetType) {
    if(!autoBet.auto){
      const value = Number(betValue[key]) / 2
      const newBetvalue = value <= 0 ? 0 : value.toFixed(2)
      updateBetValue(key, newBetvalue.toString())
    }
  }

  async function handleRunBet(key: BetType, isAuto: boolean) {
    if(autoBet.auto && autoBet.betType !== key) return

    if(isAuto){
      updateAutoBet(key);
    }

    if (inGameBallsCount >= 15 || Number(betValue[key]) < 0) return

    if (Number(betValue[autoBet.betType]) > currentBalance) {
      updateBetValue(autoBet.betType, currentBalance.toString())
      return
    }

    onRunBet(key, Number(betValue[key]))
  }

  useEffect(() => {
    console.log(autoBet.auto)
    if(autoBet.auto){
      autoIntervalRef.current = setInterval(() => {
        if (inGameBallsCount >= 15) return
        if (Number(betValue[autoBet.betType]) > currentBalance) {
          updateBetValue(autoBet.betType, currentBalance.toString())
          return
        }

        onRunBet(autoBet.betType, Number(betValue[autoBet.betType]))
      }, 3000)
    } else{
      if(autoIntervalRef.current){
        setAuto({
          easy: false,
          medium: false,
          diff: false
        })
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    }

    return () => {
      clearInterval(autoIntervalRef.current);
    }
  }, [autoBet])

  return (
    <div className="relative h-1/2 w-full flex-1 pb-[32px] px-[38px]">
      <div className="flex flex-row justify-between gap-[8px]" >
        <div className="flex flex-col basis-1/3 gap-[5px]">
          <div className={classNames("flex h-full flex-col items-stretch w-full rounded-md bg-primary p-[10px] text-sm font-bold md:text-base", {"text-text": !autoBet.auto, "text-whiteDisable": autoBet.auto})} >
            <div className="relative flex justify-start items-center pl-[40%]">
              <div className="absolute left-[50%] translate-x-[-45px] flex items-center justify-center rounded-full bg-purpleDark w-[25px] h-[25px] p-[2px] text-[24px]">
                <CurrencyDollarSimple weight="bold" />
              </div>
              <input className="bg-transparent w-[100px] text-[22px] focus:outline-none" type="number" value={betValue['easy']} onChange={(e: any) => handleChangeBetValue('easy', e)} />
            </div>
            <div className="flex flex-1 justify-center items-center gap-[4px]">
              <div className="flex items-center justify-center rounded-full bg-purpleDisable w-[20px] h-[20px] p-[2px]">
                <CurrencyDollarSimple weight="bold" />
              </div>
              <span>0.00</span>
            </div>
            <div className="flex flex-1 justify-center items-center gap-[4px] text-[18px]">
              <span className="mr-[12px] text-sm font-medium text-text">auto</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" checked={auto['easy']} onChange={() => updateAuto('easy')} className="sr-only peer" />
                <div className={ classNames("w-[44px] h-[24px] bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-blue", 
                    { "after:bg-white after:border-gray-300": !autoBet.auto, "after:bg-whiteDisable after:border-gray-700 ": autoBet.auto}
                  )}
                >
                </div>
              </label>
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center gap-[4px] text-[18px]">
            <button className="rounded-md bg-primary text-text font-bold px-[20px] py-[3px]" onClick={() => handleHalfBet('easy')}>1/2</button>
            <button className="rounded-md bg-primary text-text font-bold px-[25px] py-[3px]" onClick={() => handleDoubleBet('easy')}>2<span>x</span></button>
          </div>
          <button
            onClick={() => handleRunBet('easy', auto.easy)}
            disabled={false}
            className="relative block h-[50px] mt-[10px] rounded-md bg-blueGrey px-[8px] py-[16px] text-sm font-bold leading-none text-background transition-colors "
          >
            <span className={classNames("w-full h-[50px] bg-blue absolute text-text px-[8px] py-[16px] top-[-10px] left-0 rounded-md active:top-[-5px] focus:top-0", {"text-text": !autoBet.auto, "text-whiteDisable": autoBet.auto && autoBet.betType !== 'easy'})}>
              {autoBet.betType === 'easy' && autoBet.auto ? "Stop" : "Bet"}
            </span>
          </button>
        </div>
        <div className="flex flex-col basis-1/3 gap-[5px]">
          <div className={classNames("flex h-full flex-col items-stretch w-full rounded-md bg-primary p-[10px] text-sm font-bold md:text-base", {"text-text": !autoBet.auto, "text-whiteDisable": autoBet.auto})}>
            <div className="relative flex justify-start items-center pl-[40%]">
              <div className="absolute left-[50%] translate-x-[-45px] flex items-center justify-center rounded-full bg-purpleDark w-[25px] h-[25px] p-[2px] text-[24px]">
                <CurrencyDollarSimple weight="bold" />
              </div>
              <input className="bg-transparent w-[100px] text-[22px] focus:outline-none" type="number" value={betValue['medium']} onChange={(e: any) => handleChangeBetValue('medium', e)} />
            </div>
            <div className="flex flex-1 justify-center items-center gap-[4px]">
              <div className="flex items-center justify-center rounded-full bg-purpleDisable w-[20px] h-[20px] p-[2px]">
                <CurrencyDollarSimple weight="bold" />
              </div>
              <span>0.00</span>
            </div>
            <div className="flex flex-1 justify-center items-center gap-[4px] text-[18px]">
              <span className="mr-[12px] text-sm font-medium text-text">auto</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" checked={auto['medium']} onChange={() => updateAuto('medium')} className="sr-only peer" />
                <div className={ classNames("w-[44px] h-[24px] bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-green", 
                    { "after:bg-white after:border-gray-300": !autoBet.auto, "after:bg-whiteDisable after:border-gray-700 ": autoBet.auto}
                  )}></div>
              </label>
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center gap-[4px] text-[18px]">
            <button className="rounded-md bg-primary text-text font-bold px-[20px] py-[3px]" onClick={() => handleHalfBet('medium')}>1/2</button>
            <button className="rounded-md bg-primary text-text font-bold px-[25px] py-[3px]" onClick={() => handleDoubleBet('medium')}>2<span>x</span></button>
          </div>
          <button
            onClick={() => handleRunBet('medium', auto.medium)}
            disabled={false}
            className="relative block h-[50px] mt-[10px] rounded-md bg-greenGrey px-[8px] py-[16px] text-sm font-bold leading-none text-background transition-colors "
          >
            <span className={classNames("w-full h-[50px] bg-green absolute text-text px-[8px] py-[16px] top-[-10px] left-0 rounded-md active:top-[-5px] focus:top-0", {"text-text": !autoBet.auto, "text-whiteDisable": autoBet.auto && autoBet.betType !== 'medium'} )}>
              {autoBet.betType === 'medium' && autoBet.auto ? "Stop" : "Bet"}
            </span>
          </button>
        </div>
        <div className="flex flex-col basis-1/3 gap-[5px]">
          <div className={classNames("flex h-full flex-col items-stretch w-full rounded-md bg-primary p-[10px] text-sm font-bold md:text-base", {"text-text": !autoBet.auto, "text-whiteDisable": autoBet.auto})}>
            <div className="relative flex justify-start items-center pl-[40%]">
              <div className="absolute left-[50%] translate-x-[-45px] flex items-center justify-center rounded-full bg-purpleDark w-[25px] h-[25px] p-[2px] text-[24px]">
                <CurrencyDollarSimple weight="bold" />
              </div>
              <input className="bg-transparent w-[100px] text-[22px] focus:outline-none" type="number" value={betValue['diff']} onChange={(e: any) => handleChangeBetValue('diff', e)} />
            </div>
            <div className="flex flex-1 justify-center items-center gap-[4px]">
              <div className="flex items-center justify-center rounded-full bg-purpleDisable w-[20px] h-[20px] p-[2px]">
                <CurrencyDollarSimple weight="bold" />
              </div>
              <span>0.00</span>
            </div>
            <div className="flex flex-1 justify-center items-center gap-[4px] text-[18px]">
              <span className="mr-[12px] text-sm font-medium text-text">auto</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" checked={auto['diff']} onChange={() => updateAuto('diff')} className="sr-only peer" />
                <div className={ classNames("w-[44px] h-[24px] bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-red", 
                    { "after:bg-white after:border-gray-300": !autoBet.auto, "after:bg-whiteDisable after:border-gray-700 ": autoBet.auto}
                  )}></div>
              </label>
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center gap-[4px] text-[18px]">
            <button className="rounded-md bg-primary text-text font-bold px-[20px] py-[3px]" onClick={() => handleHalfBet('diff')}>1/2</button>
            <button className="rounded-md bg-primary text-text font-bold px-[25px] py-[3px]" onClick={() => handleDoubleBet('diff')}>2<span>x</span></button>
          </div>
          <button
            onClick={() => handleRunBet('diff', auto.diff)}
            disabled={false}
            className="relative block h-[50px] mt-[10px] rounded-md bg-redGrey px-[8px] py-[16px] text-sm font-bold leading-none text-background transition-colors "
          >
            <span className={classNames("w-full h-[50px] bg-red absolute px-[8px] py-[16px] top-[-10px] left-0 rounded-md active:top-[-5px] focus:top-0", {"text-text": !autoBet.auto, "text-whiteDisable": autoBet.auto && autoBet.betType !== 'easy'})}>
              {autoBet.betType === 'diff' && autoBet.auto ? "Stop" : "Bet"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
