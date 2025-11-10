import './sidenav.css'

const menuItems = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

interface SidenavProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export default function Sidenav({ selectedLetter, onSelectLetter }: SidenavProps) {
  return (
    <aside className="sidebar">
      {menuItems.map((letter) => {
        return (
          <div key={letter} className="letter-block">
            <button
              className={`letter-button ${selectedLetter === letter ? 'active' : ''}`}
              onClick={() => {
                onSelectLetter(letter)
              }}
            >
              {letter}
            </button>
          </div>
        )
      })}
    </aside>
  )
}
