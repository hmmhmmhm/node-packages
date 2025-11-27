import { InventoryItem } from '../types'
import { BlockNames } from '../constants'
import { blockTextureImages } from '../utils/textures'

interface HudProps {
  hotbar: (InventoryItem | null)[]
  selectedSlot: number
}

export function Hud({ hotbar, selectedSlot }: HudProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-100 pointer-events-none">
      <div className="flex gap-0.5 p-2.5 bg-black/50 rounded-t">
        {hotbar.map((item, i) => (
          <div
            key={i}
            className={`w-[50px] h-[50px] bg-gray-500/80 border-2 rounded flex items-center justify-center relative ${i === selectedSlot
                ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                : 'border-gray-700'
              }`}
          >
            <span className="absolute top-0.5 left-1 text-gray-400 text-[10px] font-bold">
              {i + 1}
            </span>
            {item && item.count > 0 && (
              <>
                <img
                  src={blockTextureImages[item.type]}
                  alt={BlockNames[item.type]}
                  className="w-9 h-9"
                  style={{ imageRendering: 'pixelated' }}
                />
                {item.count > 1 && (
                  <span className="absolute bottom-0.5 right-1 text-white text-xs font-bold [text-shadow:1px_1px_1px_#000,-1px_-1px_1px_#000,1px_-1px_1px_#000,-1px_1px_1px_#000]">
                    {item.count}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
