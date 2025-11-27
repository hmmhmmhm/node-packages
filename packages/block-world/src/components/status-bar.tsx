import { Player, InventoryItem } from '../types'
import { BlockNames } from '../constants'

interface StatusBarProps {
  player: Player
  selectedItem: InventoryItem | null
  fps: number
  chunkCount: number
}

export function StatusBar({ player, selectedItem, fps }: StatusBarProps) {
  return (
    <div className="fixed top-2.5 left-2.5 text-white text-sm [text-shadow:2px_2px_2px_rgba(0,0,0,0.8)] z-[100] bg-black/30 p-2.5 px-4 rounded">
      <div className="my-1">Mode: {player.isFlying ? 'Flying' : 'Survival'}</div>
      <div className="my-1">
        Position: {Math.floor(player.position.x)}, {Math.floor(player.position.y)},{' '}
        {Math.floor(player.position.z)}
      </div>
      <div className="my-1">
        Selected: {selectedItem ? BlockNames[selectedItem.type] : 'None'}
      </div>
      <div className="my-1">FPS: {fps}</div>
    </div>
  )
}

interface DebugInfoProps {
  chunkCount: number
  faceCount: number
}

export function DebugInfo({ chunkCount, faceCount }: DebugInfoProps) {
  return (
    <div className="fixed top-2.5 right-2.5 text-white text-xs font-mono [text-shadow:1px_1px_1px_rgba(0,0,0,0.8)] z-[100] bg-black/50 p-2.5 rounded">
      <div>Chunks: {chunkCount}</div>
      <div>Faces: {faceCount}</div>
    </div>
  )
}
