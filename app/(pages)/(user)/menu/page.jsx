"use client";

import { CardCatalog } from "@/components/cards/products/cardCatalog";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import {
  Filter,
  ChevronDown,
  ArrowUpDown,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  ArrowDown10,
  ArrowUp10,
  Search,
  TicketPercent,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Terbaru");
  const [filterBy, setFilterBy] = useState("Semua");
  const [dataCatalog, setDataCatalog] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sortItems = [
    {
      icon: <ArrowUpWideNarrow size={18} />,
      sortName: "Terbaru",
      sortFunc: (data) => {
        const dataSorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataFiltered(dataSorted);
      },
    },
    {
      icon: <ArrowDownWideNarrow size={18} />,
      sortName: "Paling Awal",
      sortFunc: (data) => {
        const dataSorted = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setDataFiltered(dataSorted);
      },
    },
    {
      icon: <ArrowUp10 size={18} />,
      sortName: "Termurah",
      sortFunc: (data) => {
        const dataSorted = data.sort(
          (a, b) => new Date(a.price) - new Date(b.price)
        );
        setDataFiltered(dataSorted);
      },
    },
    {
      icon: <ArrowDown10 size={18} />,
      sortName: "Termahal",
      sortFunc: (data) => {
        const dataSorted = data.sort(
          (a, b) => new Date(b.price) - new Date(a.price)
        );
        setDataFiltered(dataSorted);
      },
    },
    {
      icon: <TicketPercent size={18} />,
      sortName: "Diskon",
      sortFunc: (data) => {
        const dataSorted = data.sort(
          (a, b) => new Date(b.discount) - new Date(a.discount)
        );
        setDataFiltered(dataSorted);
      },
    },
  ];

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get("/api/category");
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.log("ERROR CATEGORIES: ", error);
      }
    };
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/product");
        if (response.status === 200) {
          const products = response.data;
          setLoading(false);
          setDataCatalog(products);
          const sort = sortItems.find((item) => item.sortName === "Terbaru");
          sort.sortFunc(products);
        }
      } catch (error) {
        setLoading(false);
        console.log("ERROR PRODUCTS: ", error);
      }
    };
    const getMediaAssets = async () => {
      try {
        const response = await axios.get("/api/mediaAsset/featured");
        if (response.status === 200) {
          setMediaAssets(response.data);
        }
      } catch (error) {
        console.log("ERROR MEDIA ASSETS: ", error);
      }
    };

    getMediaAssets();
    getCategories();
    getProducts();
  }, []);

  const handleSearch = (inputValue) => {
    let dataToFilter = dataCatalog;
    const sort = sortItems.find((item) => item.sortName === sortBy);
    setSearchInput(inputValue.toLowerCase());
    if (filterBy !== "Semua") {
      const filterObject = categories.find(
        (item) => item.categoryName.toLowerCase() === filterBy.toLowerCase()
      );
      dataToFilter = dataCatalog.filter((item) => {
        return item.idProductCategory === filterObject.id;
      });
    }
    const data = dataToFilter.filter((item) =>
      item.productName.toLowerCase().includes(inputValue.toLowerCase())
    );
    sort.sortFunc(data);
  };

  const handleFilter = (filterObject) => {
    const data = dataCatalog.filter((item) =>
      item.productName.toLowerCase().includes(searchInput)
    );
    if (filterObject === "Semua") {
      setFilterBy(filterObject);
      setDataFiltered(data);
    } else {
      const dataFiltered = data.filter((item) => {
        return item.idProductCategory === filterObject.id;
      });
      setFilterBy(filterObject.categoryName);
      setDataFiltered(dataFiltered);
    }
  };

  const handleSort = (sortObject) => {
    setSortBy(sortObject.sortName);
    sortObject.sortFunc(dataFiltered);
  };

  return (
    <div className="flex flex-col gap-6 chrome-md:gap-8 w-full">
      <h1 className="text-5xl chrome-md:text-7xl tracking-wide font-extrabold text-main_bg opacity-100 -mt-3">
        MENU
      </h1>
      <div className="flex w-full justify-between items-center text-main_bg">
        <Input
          isClearable
          className="w-full sm:max-w-[60%] bg-[#929090] rounded-xl shadow-lg shadow-black/60 py-1 text-white"
          classNames={{
            input: [
              "bg-[#929090]",
              "group-data-[focus=false]:text-white",
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
          placeholder="Cari nama produk..."
          startContent={<Search className="mr-1 text-black" />}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => handleSearch("")}
        />
        <div className="flex gap-12">
          <div>
            <Dropdown className="rounded-xl border-[0.3px] border-main_bg/20 shadow-lg shadow-black/60 bg-[#151515]">
              <DropdownTrigger>
                <div className="flex gap-2 cursor-pointer hover:text-main_bg/70 duration-100 items-center text-main_bg">
                  <ArrowUpDown size={20} />
                  <p className="font-normal">
                    Sort by <span className="font-bold">{sortBy}</span>
                  </p>
                  <ChevronDown size={20} />
                </div>
              </DropdownTrigger>
              <DropdownMenu className="bg-[#151515] text-main_bg">
                {sortItems.map((item) => (
                  <DropdownItem
                    onClick={() => handleSort(item)}
                    key={item.sortName}
                    className="hover:bg-main_bg duration-100 hover:text-[#151515]"
                  >
                    <div className="flex gap-2 items-center">
                      {item.icon}
                      <p>{item.sortName}</p>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div>
            <Dropdown className="rounded-xl border-[0.3px] border-main_bg/20 shadow-lg shadow-black/60 bg-[#151515]">
              <DropdownTrigger>
                <div className="flex gap-2 cursor-pointer hover:text-main_bg/70 duration-100 items-center text-main_bg">
                  <Filter size={20} />
                  <p className="font-normal">
                    Filter Kategori{" "}
                    <span className="font-bold">{filterBy}</span>
                  </p>
                  <ChevronDown size={20} />
                </div>
              </DropdownTrigger>
              <DropdownMenu className="bg-[#151515] text-main_bg">
                <DropdownItem
                  key={"Semua"}
                  onClick={() => handleFilter("Semua")}
                  className="hover:bg-main_bg duration-100 hover:text-[#151515]"
                >
                  <div className="flex gap-2 items-center">
                    <p>Semua</p>
                  </div>
                </DropdownItem>
                {categories.map((category) => (
                  <DropdownItem
                    key={category.id}
                    onClick={() => handleFilter(category)}
                    className="hover:bg-main_bg duration-100 hover:text-[#151515]"
                  >
                    <div className="flex gap-2 items-center">
                      <p>{category.categoryName}</p>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-4 transition-all gap-6 ${
          loading && "h-screen"
        }`}
      >
        {loading && (
          <p className="animate-blink col-span-4 w-full text-xl text-center text-primary font-semibold pt-32">
            Memuat Produk...
          </p>
        )}
        {!loading && (
          <CardCatalog data={dataFiltered} mediaAssets={mediaAssets} />
        )}
      </div>
    </div>
  );
};

export default Menu;
