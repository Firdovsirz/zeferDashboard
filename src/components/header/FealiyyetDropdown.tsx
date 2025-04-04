"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import apiClient from "@/utils/apiClient";
import { logout } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useDispatch, UseDispatch } from "react-redux";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { RootState } from "@/redux/store";

interface userDetails {
    ad: string,
    soyad: string,
    ata_adi: string,
    vezife_adi: string,
    fakulte_adi: string,
    kafedra_adi: string
}

export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const [userDetails, setUserDetails] = useState<userDetails | null>(null);
    const username = useSelector((state: RootState) => state.auth.username);
    const [fealiyyet, setFealiyyet] = useState<string>('');

    function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    function closeDropdown(fealiyyet: string | undefined) {
        if (fealiyyet !== undefined) {
            setFealiyyet(fealiyyet);
            localStorage.setItem('fealiyyet', fealiyyet);
        } else {
            setFealiyyet("");
        }
        setIsOpen(false);
    }
    return (
        <div className="relative p-3 rounded-[10px]" style={{ border: "1px solid #efefef" }}>
            <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
            >

                <span className="block mr-1 font-medium text-theme-sm">
                    {fealiyyet && fealiyyet.length !== 0 ? fealiyyet : 'Fəaliyyən Növləri'}
                </span>

                <svg
                    className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={() => closeDropdown}
                className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
            >

                <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                    <li>
                        <DropdownItem
                            onItemClick={() => closeDropdown('Tədrisin təşkili və akademik göstəricilər')}
                            // tag="a"
                            // href="/hesabat"
                            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            1. Tədrisin təşkili və akademik göstəricilər
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={() => closeDropdown('Kafedranın elmi fəaliyyətinin təşkili')}
                            // tag="a"
                            // href="/hesabat"
                            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            2. Kafedranın elmi fəaliyyətinin təşkili
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={() => closeDropdown('Tələbələrlə işin təşkili')}

                            // href="/hesabat"
                            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            3. Tələbələrlə işin təşkili
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={() => closeDropdown('Kafedranın beynəlmilləşmə siyasəti')}

                            // href="/hesabat"
                            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            4. Kafedranın beynəlmilləşmə siyasəti
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem
                            onItemClick={() => closeDropdown('İnfrastrukturdan istifadə')}

                            // href="/hesabat"
                            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            5. İnfrastrukturdan istifadə
                        </DropdownItem>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
}
