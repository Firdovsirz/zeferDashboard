"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Swal from "sweetalert2";
import Image from "next/image";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import apiClient from "@/utils/apiClient";
import { RootState } from "@/redux/store";
import { useModal } from "@/hooks/useModal";
import Input from "../form/input/InputField";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from "react-redux";
import { ChangeEvent, ChangeEventHandler } from "preact/compat";
import FealiyyetDropdown from "@/components/header/FealiyyetDropdown";

interface userDetails {
    ad: string,
    soyad: string,
    ata_adi: string,
    vezife_adi: string,
    fakulte_adi: string,
    kafedra_adi: string,
    fakulte_kodu: string | number,
    fin_kod: string
}

interface allUsers {
    ad: string,
    soyad: string,
    ata_adi: string,
    vezife_adi: string,
    kafedra_adi: string,
    fakulte_adi: string
}

interface isPlani {
    icraya_mesul_shexs: string,
    bolme_novu: string,
    isin_sira_sayi: number | string,
    gorulecek_isin_qisa_mezmunu: string,
    hesabat_ili: number | string,
    icra_muddeti: string,
    fealiyyet_novu: string
}
export default function BasicTableOne() {
    const [userDetails, setUserDetails] = useState<userDetails | null>(null);
    const username = useSelector((state: RootState) => state.auth.username);
    const token = useSelector((state: RootState) => state.auth.token);
    const facCode = userDetails?.fakulte_kodu;
    const [allUsers, setAllUsers] = useState<allUsers[]>([]);
    const { isOpen, openModal, closeModal } = useModal();
    const [siraSayi, setSiraSayi] = useState<number | null>();
    const [isinQisaMezmunu, setIsinQisaMezmunu] = useState<string | undefined>("");
    // const [icraMuddeti, sertIcraMuddeti] = useState<string | undefined>("");
    const icraMuddeti = '01.01.2026';
    const hesabat_ili = 2025;
    const bolmeNovu = userDetails?.fakulte_adi;

    const [formData, setFormData] = useState({
        icraya_mesul_sexs: `${userDetails?.ad} ${userDetails?.soyad}`,
        isin_qisa_mezmunu: `${isinQisaMezmunu}`,
        icra_muddeti: icraMuddeti,
        hesabat_ili: hesabat_ili,
    });
    const [isPlani, setIsPlani] = useState<isPlani[]>([]);
    useEffect(() => {
    const fetchIsPlani = async () => {
        try {
            const response = await apiClient.post('/get_is_plani', {
                fin_kod: userDetails?.fin_kod,
            });
            console.log(response);


            if (response.status >= 200 && response.status < 300) {
                setIsPlani(response.data.data);
            } else {
                console.error(`Error: Received status code ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching work plan:', error);
        }
    };

    if (userDetails?.fin_kod) {
        fetchIsPlani();
    }
    }, [userDetails?.fin_kod]);
    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIsinQisaMezmunu(e.target.value);

        // You may want to validate or send data whenever the value changes
        if (!e.target.value || !formData.icra_muddeti) {
            alert("Please fill all required fields!");
            return;
        }

        try {
            const response = await apiClient.post("/update_fealiyyet", {
                isin_sira_sayi: siraSayi,
                icraya_mesul_sexs: `${userDetails?.ad} ${userDetails?.soyad}`,
                isin_qisa_mezmunu: e.target.value,  // Send updated value of textarea
                icra_muddeti: formData.icra_muddeti,
                hesabat_ili: formData.hesabat_ili,
                fin_kod: userDetails?.fin_kod,
            });

            if (response.status === 200) {
                // alert("Plan updated successfully!");
                // fetchIsPlani();
            } else {
                alert("Error updating plan.");
            }
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Error occurred while submitting the form.");
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await apiClient.get(`/fetch_user_details/${username}`);
                if (response.status >= 200 && response.status < 300) {
                    setUserDetails(response.data[0]);
                } else {
                    console.error(`Error: Received status code ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, [username]);  // Runs only when username changes

    // useEffect(() => {
    const getMaxAge = async () => {
        if (!userDetails?.fin_kod) {
            console.log("Please enter a FIN KOD");
            return;
        }
        try {
            const response = await apiClient.post('/max-is-plani', { fin_kod: userDetails.fin_kod });
            if (response.data.max_age >= 1) {
                setSiraSayi(response.data.max_age + 1);
            } else {
                setSiraSayi(1);
            }
        } catch (err) {
            console.log("Failed to fetch");
        }
        setIsinQisaMezmunu('');
    };

    const handleDelete = async (id: string) => {
        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
          title: 'İş planını silməyə əminsiniz?',
          text: "",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Bəli',
          cancelButtonText: 'Xeyr'
        });
    
        if (result.isConfirmed) {
          try {
            // Make DELETE request to the Flask API
            const response = await apiClient.delete(`/delete/${id}`);
            if (response.status === 200) {
              Swal.fire('İş planı uğurla silindi!', '', 'success');
            }
          } catch (error) {
            Swal.fire('Xəta!', 'Yenidən cəhd edin!.', 'error');
          }
        }
      };

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mb-10">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        İcraya məsul şəxs
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Bölmə növü
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        İşin sıra sayı
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        İşin qısa məzmunu
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Hesabat İli
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        İcra müddəti
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Fəaliyyətin nəticəsi
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        İşin görülmə faizi
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Qiymətləndirilmə balı
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Təqdiim etmə tarixi
                                    </TableCell>
                                    {/* <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Vaxt təhlili
                                    </TableCell> */}
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Qeyd
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Fəaliyyət növü
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Redaktə et
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Sil
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Təsdiq et
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {isPlani.map((order, index) => (
                                    <TableRow key={index}>

                                        {/* ad, soyad */}

                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {order.icraya_mesul_shexs}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* bolme novu => kafedra, fakilte */}

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {'afdafds'}
                                        </TableCell>

                                        {/* isin sira sayi */}

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                {order.isin_sira_sayi}
                                            </div>
                                        </TableCell>

                                        {/* isin qisa mezmunu */}

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.gorulecek_isin_qisa_mezmunu}
                                        </TableCell>

                                        {/* hesabat ili */}

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.hesabat_ili}
                                        </TableCell>

                                        {/* deadline date */}

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.icra_muddeti}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.icra_muddeti}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.icra_muddeti}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.icra_muddeti}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.icra_muddeti}
                                        </TableCell>

                                        {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.icra_muddeti}
                                        </TableCell> */}


                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.icra_muddeti}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.fealiyyet_novu}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div onClick={openModal} className="flex justify-center items-center bg-blue-500 rounded-md w-10 h-10 cursor-pointer">
                                                <EditIcon style={{ color: "#fff" }} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div onClick={() => handleDelete(`${order?.isin_sira_sayi}`)} className="flex justify-center items-center bg-red-500 rounded-md w-10 h-10 cursor-pointer">
                                                <DeleteIcon style={{ color: "#fff" }} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex justify-center items-center bg-green-500 rounded-md w-10 h-10 cursor-pointer">
                                                <DoneIcon style={{ color: "#fff" }} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            {/* <div className="flex justify-end">
                <button
                    onMouseOver={getMaxAge}
                    onClick={openModal}
                    className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                    <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill=""
                        />
                    </svg>
                    Yeni Plan
                </button>
            </div> */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Yeni iş planı əlavə edin
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Yeni iş planı üçün xanaları doldurun.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Social Links
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>İcraya məsul şəxs</Label>
                                        <Input
                                            type="text"
                                            defaultValue="https://www.facebook.com/PimjoHQ"
                                            value={`${userDetails?.ad} ${userDetails?.soyad}`}
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <Label>Bölmə növü</Label>
                                        <Input type="text" defaultValue="https://x.com/PimjoHQ" value={bolmeNovu} disabled />
                                    </div>

                                    <div>
                                        <Label>İşin sıra sayı</Label>
                                        <Input
                                            type="text"
                                            defaultValue="https://www.linkedin.com/company/pimjo"
                                            value={`${siraSayi}`}
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <Label>Hesabat ili</Label>
                                        <Input
                                            type="text"
                                            defaultValue="https://instagram.com/PimjoHQ"
                                            value={hesabat_ili}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <Label>İcra müddəti</Label>
                                        <Input
                                            type="text"
                                            defaultValue="https://instagram.com/PimjoHQ"
                                            value={icraMuddeti}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <FealiyyetDropdown />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-7">
                                {/* <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Personal Information
                                </h5> */}
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-2">
                                        <Label className="mb-5">İşin qısa məzmunu</Label>
                                        {/* <Input type="text" defaultValue="Musharof" value={""} /> */}
                                        <textarea
                                            onChange={handleChange}
                                            value={isinQisaMezmunu}
                                            name="qisa_mezmun"
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Bağla
                            </Button>
                            {/* <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button> */}
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}