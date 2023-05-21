import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { CurrencyDollarSimple } from 'phosphor-react'

import { useAuthStore } from '../../store/auth'
import { useGameStore } from '../../store/game'

import logo from '../../assets/img/logo.svg';

export function Navbar() {
  const inGameBallsCount = useGameStore((state: any) => state.gamesRunning)
  const currentBalance = useAuthStore((state: any) => state.wallet.balance)

  return (
    <nav className="sticky top-0 z-50 bg-primary px-[16px] shadow-lg min-h-[60px]">
      <div
        className={classNames(
          'mx-auto flex h-16 w-full max-w-[1400px] items-center','justify-between'
        )}
      >
        <Link to={inGameBallsCount ? '#!' : '/'} className='text-white text-[32px]'>
          <img src={logo} alt="logo" style={{height: '60px'}} />
        </Link>
        <div className="flex items-center justify-center gap-[4px] font-bold uppercase text-white md:text-lg">
          <span className="w-[30px] h-[30px] rounded-full bg-purpleDark p-[4px] text-[24px] flex items-center justify-center">
            <CurrencyDollarSimple weight="bold" />
          </span>
          <span className="text-[24px]">{currentBalance.toFixed(2)}</span>
        </div>
      </div>
    </nav>
  )
}
