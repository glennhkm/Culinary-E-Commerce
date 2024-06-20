"use client";

import axios from "axios";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { Plus, Search, Ellipsis, Trash2 } from "lucide-react";
import { CardRegistAdmin } from "@/components/cards/users/cardRegistAdmin";
import { CardDetailUser } from "@/components/cards/users/cardDetailUser";
import toast from "react-hot-toast";
import { poppins } from "@/lib/fonts/font";

const INITIAL_VISIBLE_COLUMNS = ["fullname", "email", "phonenumber"];

export default function UserAdmin() {
  const [filterValue, setFilterValue] = React.useState("");
  const [users, setUsers] = React.useState("");
  const [isAddingUsers, setIsAddingUsers] = React.useState(false);
  const [ShowDetailUser, setShowDetailUser] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [newUsersDataTrigger, setNewUsersDataTrigger] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const columns = [
    { name: "NAMA LENGKAP", uid: "fullname" },
    { name: "EMAIL", uid: "email" },
    { name: "NOMOR TELEPON", uid: "phonenumber" },
    { name: "ALAMAT", uid: "address" },
    { name: "ACTION", uid: "action" },
  ];

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/api/user");
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
  }, [ShowDetailUser, isAddingUsers, newUsersDataTrigger]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const objectIdList = selectedKeys === "all" ? { ids: {} } : { ids: [...selectedKeys] };
      const response = await axios.delete("/api/user", { data: objectIdList });
      if (response.status === 200) {
        toast.success("Pengguna berhaasil dihapus");
        setNewUsersDataTrigger(!newUsersDataTrigger);
        setSelectedKeys(new Set());
      }
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
      console.log("ERROR: ", error);
    }
  };

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.email.toLowerCase().includes(filterValue.toLowerCase()) || 
          user.phoneNumber.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "fullname":
        return <p className="capitalize 2xl:text-base py-1">{user.fullName}</p>;
      case "email":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm text-default-400 group-hover:text-black">
              {user.email}
            </p>
          </div>
        );
      case "phonenumber":
        return (
          <div className="flex gap-6 w-full justify-between relative items-center">
            <p className="2xl:text-base">{user.phoneNumber}</p>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="rounded-xl"
              onClick={() => setShowDetailUser(user.id)}
            >
              <Ellipsis className="text-default-300 group-hover:text-black" />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 text-white">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] bg-[#929090] rounded-xl shadow-lg shadow-black/60 py-1"
            classNames={{
              input: [
                "bg-[#929090]",
                "group-data-[focus=true]:text-white",
                "placeholder:text-black/60",
              ],
              clearButton: ["text-black"],
              inputWrapper: [
                "bg-[#929090]",
                "group-data-[focus=true]:bg-[#929090]",
                "group-data-[hover=true]:bg-[#929090]",
                "!cursor-text",
              ],
            }}
            placeholder="Cari nama, no hp atau email..."
            startContent={<Search className="mr-1 text-black" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              className="rounded-xl shadow-lg shadow-black/60"
              onClick={() => setIsAddingUsers(true)}
              endContent={<Plus />}
            >
              Tambah Baru
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} pengguna
          </span>
          <div className="flex gap-3">
            <Dropdown className="bg-transparent shadow-none">
              <DropdownTrigger>
                <button
                  className="bg-secondary hover:bg-opacity-70 px-4 py-2 duration-200 rounded-xl shadow-lg shadow-black/60 flex gap-2 justify-center items-center text-sm disabled:text-white/40 disabled:bg-opacity-20"
                  disabled={selectedKeys.size <= 0}
                >
                  <Trash2 size={20} />
                  <p>
                    {selectedKeys.size > 1 || selectedKeys === "all"
                      ? "Hapus massal"
                      : "Hapus"}
                  </p>
                </button>
              </DropdownTrigger>
              <DropdownMenu className="bg-[#151515] hover:bg-[#151515] hover:text-main_bg rounded-xl p-3 border-[0.3px] border-main_bg/20 shadow-lg shadow-black/60">
                <DropdownItem
                  className={`flex flex-col ${poppins.className} hover:bg-[#151515] hover:text-main_bg text-main_bg`}
                >
                  <p>Are you sure want to delete?</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <button
                      type="submit"
                      className="relative z-50 rounded-lg px-3 py-1 bg-secondary hover:bg-opacity-60 duration-150 text-main_bg"
                      onClick={handleDelete}
                    >
                      <p>Delete</p>
                    </button>
                    <button className="relative z-50 rounded-lg px-3 py-1 bg-main_bg text-secondary hover:bg-opacity-60 duration-150">
                      <p>Cancel</p>
                    </button>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <label className="flex items-center text-white text-small bg-[#151515] rounded-xl px-5 py-[0.35rem] shadow-lg shadow-black/30">
              Baris per halaman
              <select
                className="ml-1 hover:ml-2 cursor-pointer rounded-xl px-1 py-[2px] outline-none text-white text-small bg-transparent hover:bg-white/10 duration-200"
                onChange={onRowsPerPageChange}
              >
                <option className="text-white bg-[#151515]" value="10">
                  10
                </option>
                <option className="text-white bg-[#151515]" value="20">
                  20
                </option>
                <option className="text-white bg-[#151515]" value="50">
                  50
                </option>
                <option
                  className="text-white bg-[#151515]"
                  value={users.length}
                >
                  All
                </option>
              </select>
            </label>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    selectedKeys,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center text-white">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Semua item terpilih"
            : `${selectedKeys.size} dari ${filteredItems.length} terpilih`}
        </span>
        <Pagination
          radius="lg"
          showControls
          contr
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            wrapper: "bg-[#929090] shadow-md shadow-black/60",
            item: "bg-transparent",
            prev: "bg-transparent",
            next: "bg-transparent",
          }}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="flex flex-col gap-6 chrome-md:gap-8">
      <h1 className="text-5xl chrome-md:text-7xl tracking-wide font-extrabold text-main_bg -mt-3">
        PENGGUNA
      </h1>
      {users && (
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper:
              "h-[50vh] chrome-md:h-[56vh] w-auto bg-[#151515]/80 shadow-xl shadow-black/60 text-white overflow-y-auto scrollbar-thin scrollbar-thumb-black/40 scrollbar-track-[#151515]/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full",
            th: ["bg-[#929090]", "text-black"],
            tr: ["custom-row-hover", "2xl:text-base", "py-2"],
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                className="font-extrabold tracking-normal xl:text-base py-3"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No users found"} items={sortedItems}>
            {(item) => (
              <TableRow key={item.id} className="group-hover:bg-black">
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {isAddingUsers && (
        <CardRegistAdmin closeModal={() => setIsAddingUsers(false)} />
      )}
      {ShowDetailUser && (
        <CardDetailUser
          closeModal={() => setShowDetailUser("")}
          userId={ShowDetailUser}
        />
      )}
    </div>
  );
}
