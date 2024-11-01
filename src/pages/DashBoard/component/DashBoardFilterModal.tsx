import { ChangeEvent, useState } from "react"
import { useSearchParams } from "react-router-dom"
import QueryFilterModel, { SelectMenuProps } from "../../../ui/QueryFilterModel"
import { MdMenu } from "react-icons/md"

export default function DashBoardFilterModal() {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()


  const toggleMenu = () => setIsMenuActive(prev => !prev)

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    searchParams.set(event.target.name, event.target.value)
    setSearchParams(searchParams)
  }

  const filters: SelectMenuProps[] = [
    {
      title: 'Sort alphabetically',
      onChange: handleChange,
      name: 'order',
      options: [
        { text: 'A-z', value: 'a-z' },
        { text: 'Z-a', value: 'z-a' },
        { text: 'newest', value: 'dsc' },
        { text: 'oldest', value: 'asc' },
      ],
    },
  ]

  return (
    <div className='flex flex-start w-full'>
      <button
        className="w-10 h-10 border-2 rounded-full border-transparent bg-zinc-950 hover:scale-90 duration-200 transition-all ease-linear overflow-hidden"
        onClick={toggleMenu}
        aria-label="Go back to previous page"
        type="button"
      >
        <MdMenu className={`w-full h-full p-0.5 ${isMenuActive ? "text-indigo-500 bg-zinc-950" : "text-zinc-950 bg-indigo-500"} duration-200 transition-all ease-linear overflow-hidden`} />
      </button>
      <QueryFilterModel isActive={isMenuActive} toggleFunction={toggleMenu} filters={filters} />
    </div>

  )
}
