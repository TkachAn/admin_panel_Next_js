// src/components/tables/OwnerTable.jsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TextInput } from "@/elem/inputs/inputs";
import { NormButton } from "@/elem/buttons/buttons";
import styles from "./CounterTable.module.css";
import Pagination from "../pagination/Pagination";
import Modal from "../Modal/Modal";
import ChangeOwnerForm from "../forms/AddOwner";
import EditOwner from "../forms/EditOwner"; // Імпорт компонента EditOwner
import LoadingSpinner from "../spiner/LoadingSpinner";

export const OwnerTable = () => {
    const [allOwners, setAllOwners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOwner, setEditingOwner] = useState(null); // Стан для вибраного власника для редагування
    const [editFormData, setEditFormData] = useState({ // Стан для даних форми редагування
        phone_number: "",
        email: "",
        owner_note: "",
        id: null,
    });

    const fetchOwners = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/ownersData`);
            if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
            const data = await res.json();
            setAllOwners(data.data);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    const filteredOwners = useMemo(() => {
        if (!searchTerm) {
            return allOwners;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return allOwners.filter((owner) =>
            owner.owner_name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [allOwners, searchTerm]);

    const totalOwnersCount = filteredOwners.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOwners = filteredOwners.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const handleOpenEditForm = (owner) => {
        setEditingOwner(owner);
        setEditFormData({
            phone_number: owner.phone_number || "",
            email: owner.email || "",
            owner_note: owner.owner_note || "",
            id: owner.o_id,
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingOwner(null);
        setEditFormData({ phone_number: "", email: "", owner_note: "", id: null });
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        if (!editFormData.id) return;

        try {
            const response = await fetch(`/api/owner_redo/${editFormData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone_number: editFormData.phone_number,
                    email: editFormData.email,
                    note: editFormData.owner_note,
                }),
            });

            if (response.ok) {
                const updatedOwners = allOwners.map((owner) =>
                    owner.o_id === editFormData.id ? { ...owner, ...editFormData } : owner
                );
                setAllOwners(updatedOwners);
                setIsEditModalOpen(false);
                setEditingOwner(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Ошибка при обновлении владельца");
            }
        } catch (error) {
            console.error("Ошибка при обновлении владельца:", error);
            setError("Произошла ошибка при связи с сервером");
        } finally {
            setLoading(false);
        }

    };

    const refreshOwnerList = async () => {
        await fetchOwners();
    };

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <TextInput
                    className={styles.searchInput}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    placeholder="Поиск по имени"
                />
                <NormButton
                    children={"Добавить нового владельца"}
                    onClick={() => setIsAddModalOpen(true)}
                />
            </div>
            <div className={styles.tableContainer}>
                {loading && <LoadingSpinner/>}
                {error && <p>Ошибка: {error.message}</p>}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Имя владельца</th>
                            <th className={styles.u}>Участок</th>
                            <th>SN счётчика</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>О владельце</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOwners.length > 0 ? (
                            currentOwners.map((owner) => (
                                <tr
                                    key={owner.h_id}
                                    onClick={() => handleOpenEditForm(owner)}
                                    className={styles.row}
                                >
                                    <td>{owner.owner_name}</td>
                                    <td className={styles.u}>{owner.plot_number}</td>
                                    <td>{owner.serial_number}</td>
                                    <td>{owner.phone_number}</td>
                                    <td>{owner.email}</td>
                                    <td>{owner.owner_note}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Нет данных</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {isEditModalOpen && editingOwner && ( // Используем editingOwner для условия
                    <Modal onClose={handleCloseEditModal}>
                        <EditOwner
                            isOpen={isEditModalOpen}
                            onClose={handleCloseEditModal}
                            onSave={handleSaveEdit}
                            editingOwner={editingOwner}
                            editFormData={editFormData}
                            onInputChange={handleEditInputChange}
                        />
                    </Modal>
                )}
                {isAddModalOpen && (
                    <Modal onClose={handleCloseAddModal}>
                        <ChangeOwnerForm
                            isEdit={false}
                            onOwnerAdded={refreshOwnerList}
                        />
                    </Modal>
                )}
            </div>
            <div className={styles.pag}>
                <Pagination
                    currentPage={currentPage}
                    totalCount={totalOwnersCount}
                    pageSize={itemsPerPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
};

