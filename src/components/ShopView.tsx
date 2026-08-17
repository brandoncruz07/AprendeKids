import React from 'react'
import { SHOP_ITEMS, ShopItem, UnlockedItems } from '../data/gameData'
import { ShoppingBag, Coins, Check, Lock, Sparkles } from 'lucide-react'

interface ShopViewProps {
  coins: number
  unlockedItems: UnlockedItems
  onBuyItem: (item: ShopItem) => void
  onEquipItem: (item: ShopItem) => void
}

export const ShopView: React.FC<ShopViewProps> = ({
  coins,
  unlockedItems,
  onBuyItem,
  onEquipItem
}) => {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-4 border-amber-300 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-4xl shadow-md border-2 border-white">
              🛍️
            </div>
            <div>
              <h1 className="text-3xl font-black text-amber-950 font-fredoka">
                Tienda de Accesorios
              </h1>
              <p className="text-sm font-bold text-slate-600">
                Usa tus monedas de oro para personalizar a tus amigos animados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-yellow-100 border-2 border-yellow-400 px-5 py-2.5 rounded-2xl shadow-inner">
            <Coins className="w-7 h-7 text-yellow-600 fill-yellow-400" />
            <div>
              <p className="text-xs font-extrabold text-amber-800">Tus Monedas</p>
              <p className="text-2xl font-black font-fredoka text-amber-950">{coins}</p>
            </div>
          </div>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOP_ITEMS.map((item) => {
            const isOwned = unlockedItems.accessories.includes(item.id) || unlockedItems.backgrounds.includes(item.id)
            const canAfford = coins >= item.price

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border-4 border-amber-200 shadow-lg flex flex-col justify-between hover:scale-102 transition-all"
              >
                <div>
                  <div className="h-28 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-6xl shadow-inner mb-4 border-2 border-amber-200">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 font-fredoka">{item.name}</h3>
                  <p className="text-xs font-semibold text-slate-600 mt-1 mb-4">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-5 h-5 text-yellow-600 fill-yellow-400" />
                    <span className="font-black text-lg font-fredoka text-amber-950">{item.price}</span>
                  </div>

                  {isOwned ? (
                    <button
                      onClick={() => onEquipItem(item)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Equipado</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => canAfford && onBuyItem(item)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1 shadow transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-white border-b-2 border-amber-700 cursor-pointer active:translate-y-0.5'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {!canAfford && <Lock className="w-3.5 h-3.5" />}
                      <span>Comprar</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
