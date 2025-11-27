import ReactDOM from 'react-dom/client'
import './index.css'
import { BlockWorld } from './components/block-world'

export default function App() {
  return <BlockWorld />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
