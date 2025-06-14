"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { CardAddProduct } from "./cardAddProduct";

// Utility functions moved outside component to prevent recreation
const formatPrice = (price) => {
  return price
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
    .replace("IDR", "Rp.")
    .trim();
};

const calculateDiscountedPrice = (price, discount) => {
  if (!discount || discount <= 0) return null;
  return price - price * (discount / 100);
};

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = ({
  item,
  mediaURL,
  isAdmin,
  isOutOfStock,
  onProductClick,
}) => {
  const formattedPrice = useMemo(() => formatPrice(item.price), [item.price]);

  const priceAfterDiscount = useMemo(() => {
    const discounted = calculateDiscountedPrice(item.price, item.discount);
    return discounted ? formatPrice(discounted) : null;
  }, [item.price, item.discount]);

  const handleClick = useCallback(() => {
    onProductClick(item);
  }, [item, onProductClick]);

  return (
    <div
      key={item.id}
      onClick={handleClick}
      className={`cursor-pointer active:scale-100 rounded-xl h-[40vh] relative w-full p-4 flex flex-col gap-3 shadow-xl drop-shadow-2xl shadow-black/50 duration-200 hover:scale-[1.04] group ${
        isOutOfStock && "pointer-events-none"
      }`}
    >
      <div className="h-full w-full absolute top-0 left-0 duration-200 bg-gradient-to-t from-primary/95 to-black/20 via-black/20 group-hover:bg-black/40 rounded-xl -z-[5]"></div>

      {isOutOfStock && (
        <div className="absolute flex justify-center items-center top-0 left-0 h-full w-full z-10 bg-black/75 rounded-xl">
          <p className="font-bold text-main_bg text-[2.6rem]">HABIS!</p>
        </div>
      )}

      <div className="absolute top-0 left-0 -z-10 w-full h-full rounded-xl">
        {mediaURL ? (
          <Image
            src={mediaURL}
            fill
            className="rounded-xl object-cover"
            loading="lazy"
            alt={`${item.productName} image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyydyvWl3BPNHbWBwSM5/CDjPT5Hn9MBnUYWoSa3nw7h2L3LhE6V2j6fPFy8RqWXxc3S0YKqGrJnOUGOOFd7lGEPNOJTjbL0fPw4Y0Zx/c2F0=SBbRSSXYoAcxkZGMhWlIhb"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center">
            <p className="text-white/50 text-sm">No image</p>
          </div>
        )}
      </div>

      <div className="flex flex-col text-main_bg font-bold h-full justify-end">
        {item.discount > 0 && (
          <p className="font-bold w-full bg-main_bg/95 text-2xl text-primary p-4 absolute top-0 left-0 rounded-t-xl">
            DISKON {item.discount}%
          </p>
        )}
        <div className="flex flex-col gap-2">
          <p className="capitalize">{item.productName}</p>
          <div className="flex gap-2">
            {priceAfterDiscount && <p>{priceAfterDiscount}</p>}
            <p
              className={`${
                item.discount > 0 && "line-through font-normal opacity-60"
              }`}
            >
              {formattedPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardCatalog = ({
  updateTrigger = false,
  isShowSidebar,
  isAdding = false,
  setIsAdding,
  setUpdateTrigger,
}) => {
  const [editingData, setEditingData] = useState(null);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Terbaru");
  const [filterBy, setFilterBy] = useState("Semua");
  const [dataCatalog, setDataCatalog] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  const sortItems = useMemo(
    () => [
      {
        icon: <ArrowUpWideNarrow size={18} />,
        sortName: "Terbaru",
        sortFunc: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      },
      {
        icon: <ArrowDownWideNarrow size={18} />,
        sortName: "Paling Awal",
        sortFunc: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
      {
        icon: <ArrowUp10 size={18} />,
        sortName: "Termurah",
        sortFunc: (a, b) => a.price - b.price,
      },
      {
        icon: <ArrowDown10 size={18} />,
        sortName: "Termahal",
        sortFunc: (a, b) => b.price - a.price,
      },
      {
        icon: <TicketPercent size={18} />,
        sortName: "Diskon",
        sortFunc: (a, b) => b.discount - a.discount,
      },
    ],
    []
  );

  // Create media assets map for O(1) lookup
  const mediaAssetsMap = useMemo(() => {
    const map = new Map();
    mediaAssets.forEach((media) => {
      if (isAdmin ? media.imageProductType === "FEATURED" : true) {
        map.set(media.idProduct, media.mediaURL);
      }
    });
    return map;
  }, [mediaAssets, isAdmin]);

  // Filter and sort data with useMemo for performance
  const filteredAndSortedData = useMemo(() => {
    let filtered = dataCatalog;

    // Apply search filter
    if (searchInput.trim()) {
      filtered = filtered.filter((item) =>
        item.productName.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== "Semua") {
      const filterCategory = categories.find(
        (item) => item.categoryName.toLowerCase() === filterBy.toLowerCase()
      );
      if (filterCategory) {
        filtered = filtered.filter(
          (item) => item.idProductCategory === filterCategory.id
        );
      }
    }

    // Apply sorting
    const sortItem = sortItems.find((item) => item.sortName === sortBy);
    if (sortItem) {
      filtered = [...filtered].sort(sortItem.sortFunc);
    }

    return filtered;
  }, [dataCatalog, searchInput, filterBy, sortBy, categories, sortItems]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get("/api/category"),
          axios.get("/api/product"),
        ]);

        if (categoriesResponse.status === 200) {
          setCategories(categoriesResponse.data);
        }

        if (productsResponse.status === 200) {
          setDataCatalog(productsResponse.data);
        }
      } catch (error) {
        console.error("ERROR fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateTrigger]);

  // Fetch media assets
  useEffect(() => {
    const fetchMediaAssets = async () => {
      if (!dataCatalog.length) return;

      setLoadingMedia(true);
      try {
        const endpoint = isAdmin
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

    fetchMediaAssets();
  }, [dataCatalog, isAdmin]);

  const handleSearch = useCallback((inputValue) => {
    setSearchInput(inputValue);
  }, []);

  const handleFilter = useCallback((filterObject) => {
    if (filterObject === "Semua") {
      setFilterBy("Semua");
    } else {
      setFilterBy(filterObject.categoryName);
    }
  }, []);

  const handleSort = useCallback((sortObject) => {
    setSortBy(sortObject.sortName);
  }, []);

  const handleProductClick = useCallback(
    (item) => {
      if (isAdmin) {
        setEditingData(item);
      } else {
        router.push(`/menu/${item.id}`);
      }
    },
    [isAdmin, router]
  );

  const isLoading = loading || loadingMedia;

  const renderControls = () => (
    <div
      className={`flex w-full justify-between items-center text-main_bg mb-6 ${
        isShowSidebar ? "col-span-3" : "col-span-4"
      }`}
    >
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
        value={searchInput}
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
                Filter by category <span className="font-bold">{filterBy}</span>
              </p>
              <ChevronDown size={20} />
            </div>
          </DropdownTrigger>
          <DropdownMenu className="bg-[#151515] text-main_bg">
            <DropdownItem
              key="Semua"
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

  return (
    <>
      {renderControls()}

      {isLoading && (
        <p
          className={`${
            isAdmin
              ? "text-main_bg/85 text-shadow-default"
              : "text-primary text-shadow-none"
          } animate-blink font-bold w-full text-center text-xl pt-10 tracking-wide ${
            isShowSidebar && isAdmin ? "col-span-3" : "col-span-4"
          }`}
        >
          Memuat produk...
        </p>
      )}

      {filteredAndSortedData.length <= 0 && !isLoading ? (
        <p
          className={`${
            isAdmin
              ? "text-main_bg/85 text-shadow-default"
              : "text-primary text-shadow-none"
          } font-bold w-full text-center text-xl pt-10 tracking-wide ${
            isShowSidebar && isAdmin ? "col-span-3" : "col-span-4"
          }`}
        >
          Produk tidak tersedia atau tidak cocok!
        </p>
      ) : (
        !isLoading &&
        filteredAndSortedData.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            mediaURL={mediaAssetsMap.get(item.id)}
            isAdmin={isAdmin}
            isOutOfStock={item.stock < 1 && !isAdmin}
            onProductClick={handleProductClick}
          />
        ))
      )}

      {editingData && (
        <CardDetailProduct
          data={editingData}
          categories={categories}
          closeModal={() => setEditingData(null)}
          updateTrigger={() => setUpdateTrigger((prev) => !prev)}
        />
      )}

      {isAdding && (
        <CardAddProduct
          closeModal={() => setIsAdding(false)}
          categories={categories}
          updateTrigger={() => setUpdateTrigger((prev) => !prev)}
        />
      )}
    </>
  );
};
