import { useState } from 'react'
import { WelcomeScreen } from './components/WelcomeScreen'
import { TopBar } from './components/TopBar'
import { MapView } from './components/MapView'
import { WorldActivities } from './components/WorldActivities'
import { ShopView } from './components/ShopView'
import { AchievementsView } from './components/AchievementsView'
import { CHARACTERS, Character, SHOP_ITEMS, INITIAL_ACHIEVEMENTS, Achievement, ShopItem, UnlockedItems } from './data/gameData'

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [activeTab, setActiveTab] = useState<'map' | 'shop' | 'achievements'>('map')
  const [activeWorldId, setActiveWorldId] = useState<string | null>(null)

  // Game stats
  const [stars, setStars] = useState<number>(12)
  const [coins, setCoins] = useState<number>(50)
  const [completedCount, setCompletedCount] = useState<number>(3)

  // Unlocked items
  const [unlockedItems, setUnlockedItems] = useState<UnlockedItems>({
    characters: ['dino', 'luna', 'pico', 'pandi', 'leo'],
    accessories: [],
    backgrounds: [],
    equippedAccessory: {},
    activeBackground: 'default'
  })

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character)
  }

  const handleRewardEarned = (earnedStars: number, earnedCoins: number) => {
    setStars((prev) => prev + earnedStars)
    setCoins((prev) => prev + earnedCoins)
    setCompletedCount((prev) => prev + 1)

    // Update achievement progress
    setAchievements((prev) =>
      prev.map((ach) => {
        const newProgress = Math.min(ach.progress + 1, ach.maxProgress)
        return {
          ...ach,
          progress: newProgress,
          unlocked: newProgress >= ach.maxProgress
        }
      })
    )
  }

  const handleBuyItem = (item: ShopItem) => {
    if (coins >= item.price) {
      setCoins((prev) => prev - item.price)
      setUnlockedItems((prev) => ({
        ...prev,
        accessories: item.category === 'accessory' ? [...prev.accessories, item.id] : prev.accessories,
        backgrounds: item.category === 'background' ? [...prev.backgrounds, item.id] : prev.backgrounds
      }))
    }
  }

  const handleEquipItem = (item: ShopItem) => {
    // Visual feedback for equipping
  }

  // 1. If no character selected yet -> Welcome Screen
  if (!selectedCharacter) {
    return <WelcomeScreen onSelectCharacter={handleSelectCharacter} />
  }

  // 2. Main Game Interface
  return (
    <div className="min-h-screen bg-slate-100 font-sans select-none">
      <TopBar
        character={selectedCharacter}
        stars={stars}
        coins={coins}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setActiveWorldId(null)
        }}
        onChangeCharacter={() => setSelectedCharacter(null)}
      />

      <main className="w-full">
        {activeWorldId ? (
          <WorldActivities
            worldId={activeWorldId}
            character={selectedCharacter}
            onBackToMap={() => setActiveWorldId(null)}
            onRewardEarned={handleRewardEarned}
          />
        ) : (
          <>
            {activeTab === 'map' && (
              <MapView
                character={selectedCharacter}
                completedCount={completedCount}
                onSelectWorld={(worldId) => setActiveWorldId(worldId)}
              />
            )}

            {activeTab === 'shop' && (
              <ShopView
                coins={coins}
                unlockedItems={unlockedItems}
                onBuyItem={handleBuyItem}
                onEquipItem={handleEquipItem}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsView achievements={achievements} stars={stars} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
