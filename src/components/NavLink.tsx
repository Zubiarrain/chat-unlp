"use client"

import { LinkUrl } from '@/definitions/LinkUrl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type NavLink = {
    link:LinkUrl
}

const NavLink = ({link}:NavLink) => {

    const pathName = usePathname()

    return (
        <Link 
        className={`rounded p-1 ${
            pathName === link.url && "bg-black text-white"}`}
        href={link.url}
        prefetch
        >
            {link.title}
        </Link>
    )
    }

export default NavLink
