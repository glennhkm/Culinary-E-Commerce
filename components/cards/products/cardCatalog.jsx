"use client";

import { useState, useEffect } from "react";
import { CardDetailProduct } from "./cardDetailProduct";
import { useAdminSidebarContext } from "@/context/adminSidebarContext";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
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

export const CardCatalog = ({ updateTrigger = false, isShowSidebar }) => {
  const [editingData, SetEditingData] = useState(null);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Terbaru");
  const [filterBy, setFilterBy] = useState("Semua");
  const [dataCatalog, setDataCatalog] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  const sortItems = [
    {
      icon: <ArrowUpWideNarrow size={18} />,
      sortName: "Terbaru",
      sortFunc: (data) => {
        const dataSorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setDataFiltered(dataSorted);
      },
    },
    {
      icon: <ArrowDownWideNarrow size={18} />,
      sortName: "Paling Awal",
      sortFunc: (data) => {
        const dataSorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        setDataFiltered(dataSorted);
      },
    },
    {
      icon: <ArrowUp10 size={18} />,
      sortName: "Termurah",
      sortFunc: (data) => {
        const dataSorted = data.sort((a, b) => new Date(a.price) - new Date(b.price))
        setDataFiltered(dataSorted);
      },
    },
    {
      icon: <ArrowDown10 size={18} />,
      sortName: "Termahal",
      sortFunc: (data) => {
        const dataSorted = data.sort((a, b) => new Date(b.price) - new Date(a.price))
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

  // Fetch initial data (products, categories, media assets)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await axios.get("/api/category");
        if (categoriesResponse.status === 200) {
          setCategories(categoriesResponse.data);
        }
        
        // Fetch products
        const productsResponse = await axios.get("/api/product");
        if (productsResponse.status === 200) {
          const products = productsResponse.data;
          setDataCatalog(products);
          // Apply default sort
          const sort = sortItems.find((item) => item.sortName === "Terbaru");
          sort.sortFunc(products);
        }
        
      } catch (error) {
        console.error("ERROR fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateTrigger]);

  // Fetch media assets when data is available
  useEffect(() => {
    const fetchMediaAssets = async () => {
      setLoadingMedia(true);
      try {
        const endpoint = pathname.includes("/admin") 
          ? "/api/mediaAsset" 
          : "/api/mediaAsset/featured";
        
        const response = await axios.get(endpoint);
        if (response.status === 200) {
          setMediaAssets(response.data);
        }
      } catch (error) {
        console.error("Error fetching media assets:", error);
      } finally {
        setLoadingMedia(false);
      }
    };

    if (dataCatalog && dataCatalog.length > 0) {
      fetchMediaAssets();
    }
  }, [dataCatalog, pathname]);

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

  const handleProductClick = (item) => {
    if (pathname.includes("/admin")) {
      SetEditingData(item);
    } else {
      router.push(`/menu/${item.id}`)
    }
  }

  // If both main data and media are loading, show loading state
  const isLoading = loading || loadingMedia;

  const renderControls = () => {    
    return (
      <div className={`flex w-full justify-between items-center text-main_bg mb-6 ${isShowSidebar ? 'col-span-3' : 'col-span-4'}`}>
        <Input
          isClearable
          className="w-1/3 sm:max-w-[44%] bg-[#929090] rounded-xl shadow-lg shadow-black/60 py-1"
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
          placeholder="Cari nama produk..."
          startContent={<Search className="mr-1 text-black" />}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => handleSearch("")}
        />
        <div>
          <Dropdown className="rounded-xl border-[0.3px] border-main_bg/20 shadow-lg shadow-black/60 bg-[#151515]">
            <DropdownTrigger>
              <div className="flex gap-2 cursor-pointer hover:text-main_bg/70 duration-100 items-center">
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
              <div className="flex gap-2 cursor-pointer hover:text-main_bg/70 duration-100 items-center">
                <Filter size={20} />
                <p className="font-normal">
                  Filter by category{" "}
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
    );
  };

  return (
    <>
      {renderControls()}
      {isLoading && (
        <p
          className={`${pathname.includes("/admin") ? 'text-main_bg/85 text-shadow-default' : 'text-primary text-shadow-none'} animate-blink font-bold w-full text-center text-xl pt-10 tracking-wide ${
            isShowSidebar && pathname.includes("/admin") ? "col-span-3" : "col-span-4"
          }`}
        >
          Memuat produk...
        </p>
      )}
      {(dataFiltered.length <= 0 && !isLoading) ? (
        <p
          className={`${pathname.includes("/admin") ? 'text-main_bg/85 text-shadow-default' : 'text-primary text-shadow-none'} font-bold w-full text-center text-xl pt-10 tracking-wide ${
            isShowSidebar && pathname.includes("/admin") ? "col-span-3" : "col-span-4"
          }`}
        >
          Produk tidak tersedia atau tidak cocok!
        </p>
      ) : (
        !isLoading && dataFiltered.map((item) => {
          let priceAfterDiscount;
          const mediaFeatured = mediaAssets?.find(
            (media) =>
              media.idProduct === item.id && (pathname.includes("/admin") ? media.imageProductType === "FEATURED" : true)
          );
          const mediaURL = mediaFeatured?.mediaURL;
          const formattedPrice = item.price
            .toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })
            .replace("IDR", "Rp.")
            .trim();
          if (item.discount && item.discount > 0) {
            priceAfterDiscount = (item.price) - (item.price * (item.discount / 100));
            priceAfterDiscount = priceAfterDiscount
              .toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })
              .replace("IDR", "Rp.")
              .trim();
          }
          return (
            <div
              key={item.id}
              onClick={() => handleProductClick(item)}
              className={`cursor-pointer active:scale-100 rounded-xl h-[40vh] relative w-full p-4 flex flex-col gap-3 shadow-xl drop-shadow-2xl shadow-black/50 duration-200 hover:scale-[1.04] group ${
                (item.stock < 1 && !pathname.includes("/admin")) && "pointer-events-none"
              }`}
            >
              <div className="h-full w-full absolute top-0 left-0 duration-200 bg-gradient-to-t from-primary/95 to-black/20 via-black/20 group-hover:bg-black/40 rounded-xl -z-[5]"></div>
              {item.stock < 1 && (
                <div className="absolute flex justify-center items-center top-0 left-0 h-full w-full z-10 bg-black/75 rounded-xl">
                  <p className="font-bold text-main_bg text-[2.6rem]">
                    HABIS!
                  </p>
                </div>
              )}
              <div className="absolute top-0 left-0 -z-10 w-full h-full rounded-xl">
                {mediaURL ? (
                  <Image
                    src={mediaURL}
                    fill
                    className="rounded-xl object-cover"
                    loading="lazy"
                    alt="Product Image"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center">
                    <p className="text-white/50 text-sm">No image</p>
                  </div>
                )}
              </div>
              <div
                className={`flex flex-col text-main_bg font-bold h-full justify-end`}
              >
                {item.discount > 0 && (
                  <p className="font-bold w-full bg-main_bg/95 text-2xl text-primary p-4 absolute top-0 left-0 rounded-t-xl">
                    DISKON {item.discount}%
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <p className="capitalize">{item.productName}</p>
                  <div className="flex gap-2">              
                    {item.discount > 0 && (
                      <p>{priceAfterDiscount}</p>
                      )}
                    <p className={`${item.discount > 0 && 'line-through font-normal opacity-60'}`}>{formattedPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      {editingData && (
        <CardDetailProduct
          data={editingData}
          categories={categories}
          closeModal={() => SetEditingData(null)}
          updateTrigger={() => setUpdateTrigger((prev) => !prev)}
        />) 
      }
    </>
  );
};