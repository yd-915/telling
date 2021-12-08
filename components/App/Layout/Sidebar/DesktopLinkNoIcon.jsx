import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DesktopLinkNoIcon({ item, currentPage }) {
  return (
    <Link href={item.href}>
      <a
        className={classNames(
          item.href === currentPage
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          'group rounded-md py-2 px-2 pl-11 flex items-center text-sm transition duration-500 ease-in-out'
        )}
      >
        {item.name}
      </a>
    </Link>
  )
}