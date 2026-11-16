import { Check, Coins } from 'lucide-react'
import { useI18n } from '../i18n'
import { Kid } from '../store'
import { SHOP_ITEMS, ShopItem } from '../data/gameData'

export function ShopView({ kid, onBuy, onEquip }: { kid: Kid; onBuy: (i: ShopItem) => void; onEquip: (i: ShopItem) => void }) {
  const { t } = useI18n()
  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto pb-32">
        <h1 className="text-3xl sm:text-4xl font-black font-fredoka text-amber-950 text-center mb-6">🛍️ {t('shop')} · 🪙 {kid.coins}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SHOP_ITEMS.map((it) => {
            const owned = kid.acc.includes(it.id) || kid.bgs.includes(it.id)
            const worn = kid.eqAcc === it.id || kid.bg === it.id
            const can = kid.coins >= it.price
            return (
              <div key={it.id} className={`bg-white rounded-3xl p-4 border-4 shadow-lg text-center ${worn ? 'border-emerald-400' : 'border-amber-200'}`}>
                <div className={`h-24 rounded-2xl flex items-center justify-center text-6xl mb-3 ${it.bg ? `bg-gradient-to-br ${it.bg}` : 'bg-amber-100'}`}>{it.icon}</div>
                {owned ? (
                  <button onClick={() => onEquip(it)} className={`w-full py-2 rounded-xl font-black text-white flex items-center justify-center gap-1 cursor-pointer ${worn ? 'bg-emerald-500' : 'bg-sky-500'}`}>
                    {worn && <Check className="w-4 h-4" />}{t(worn ? 'on' : 'equip')}
                  </button>
                ) : (
                  <button disabled={!can} onClick={() => onBuy(it)} className="w-full py-2 rounded-xl font-black bg-amber-500 text-white disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed">
                    <Coins className="w-4 h-4" />{it.price}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
