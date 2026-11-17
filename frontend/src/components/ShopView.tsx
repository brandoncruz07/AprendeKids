import { Check, Coins } from 'lucide-react'
import { useI18n } from '../i18n'
import { Kid } from '../store'
import { SHOP_ITEMS, ShopItem } from '../data/gameData'

export function ShopView({ kid, onBuy, onEquip }: { kid: Kid; onBuy: (item: ShopItem) => void; onEquip: (item: ShopItem) => void }) {
  const { t } = useI18n()
  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl pb-32">
        <h1 className="mb-6 text-center font-fredoka text-3xl font-black text-amber-950 sm:text-4xl">
          🛍️ {t('shop')} · 🪙 {kid.coins}
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SHOP_ITEMS.map((item) => {
            const owned = item.kind === 'acc' ? kid.acc.includes(item.id) : kid.bgs.includes(item.id)
            const equipped = item.kind === 'acc' ? kid.eqAcc === item.id : kid.bg === item.id
            const canAfford = kid.coins >= item.price
            return (
              <article
                key={item.id}
                className={`rounded-3xl border-4 bg-white p-4 text-center shadow-lg ${equipped ? 'border-emerald-400' : 'border-amber-200'}`}
              >
                <div className={`mb-3 flex h-24 items-center justify-center rounded-2xl text-6xl ${item.bg ? `bg-gradient-to-br ${item.bg}` : 'bg-amber-100'}`}>
                  {item.icon}
                </div>
                <button
                  type="button"
                  disabled={!owned && !canAfford}
                  onClick={() => owned ? onEquip(item) : onBuy(item)}
                  className={`flex w-full items-center justify-center gap-1 rounded-xl py-2 font-black text-white ${
                    owned
                      ? equipped ? 'bg-emerald-500' : 'bg-sky-500'
                      : 'bg-amber-500 disabled:bg-slate-200 disabled:text-slate-400'
                  }`}
                >
                  {owned ? (
                    <>{equipped && <Check className="h-4 w-4" />}{t(equipped ? 'on' : 'equip')}</>
                  ) : (
                    <><Coins className="h-4 w-4" />{item.price}</>
                  )}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
