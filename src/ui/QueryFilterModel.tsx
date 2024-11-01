import { ChangeEvent, useEffect, useRef } from 'react'
import { MdClose } from 'react-icons/md'

interface QueryFilterModelProps {
  isActive: boolean
  toggleFunction: () => void
  filters: SelectMenuProps[]
}

export default function QueryFilterModel({
  isActive,
  toggleFunction,
  filters,
}: QueryFilterModelProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (!event.target) return

    const target = event.target as Node; // Assert event.target as Node
    if (modalRef.current && !modalRef.current.contains(target)) {
      toggleFunction();
    }
  }

  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousedown', handleClickOutside)
    } else {
      window.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isActive])

  return (
    <>
      <div aria-hidden="true"
        className={`${isActive ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-1/2 left-0 z-50 flex justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/*<!-- Modal content --> */}
          <div ref={modalRef}
            className="relative text-white bg-zinc-950 rounded-lg shadow">
            {/*<!-- Modal header -->*/}
            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                Filter Menu
              </h3>
              <button
                type="button"
                className="text-inherit bg-transparent hover:bg-gradient-to-r from-indigo-500 to-purple-500 hover:text-zinc-950 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center duration-200 transition-all ease-linear"
                onClick={toggleFunction}
              >
                <MdClose className="h-full w-auto" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className='w-full max-w-xl h-1 mx-auto bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full' />
            {/*<!-- Modal body -->*/}
            <div className="p-4 md:p-5 space-y-4">
              {filters.map((filter, idx) => (
                <SelectMenu key={idx} {...filter} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export interface SelectMenuProps {
  name: string
  title: string
  options: { value: string; text: string }[]
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

function SelectMenu({ title, name, options, onChange }: SelectMenuProps) {
  return (
    <form className="max-w-sm mx-auto">
      <label
        htmlFor="countries"
        className="block mb-2 text-sm font-medium text-white"
      >
        {title}
      </label>
      <select
        name={name}
        className="text-white bg-zinc-950 border border-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-purple-500 block w-full p-2.5"
        onChange={onChange}
      >
        {options.map((opt, idx) => (
          <option key={idx} selected={idx === 0} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
    </form>
  )
}
