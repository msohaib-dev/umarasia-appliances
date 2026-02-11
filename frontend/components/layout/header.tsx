"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { API_ROUTES } from "../../lib/api";
import { categories as fallbackCategories } from "../../lib/data";
import { useCartStore } from "../../lib/store/cart-store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

type SearchSuggestion = {
  label: string;
  slug: string;
};

type SearchCategory = {
  name: string;
  slug: string;
};

export function Header() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const [isSticky, setIsSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [categoryMatches, setCategoryMatches] = useState<SearchCategory[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [navCategories, setNavCategories] = useState(fallbackCategories);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const openSolutions = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setSolutionsOpen(true);
  };

  const closeSolutionsWithDelay = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false);
    }, 150);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(API_ROUTES.categories);
        if (!response.ok) return;

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : [];
        if (!data.length) return;

        const mapped = data
          .map((item: { slug?: string; name?: string; title?: string }) => ({
            slug: String(item?.slug || "").trim(),
            title: String(item?.name || item?.title || "").trim()
          }))
          .filter((item: { slug: string; title: string }) => item.slug && item.title)
          .map((item: { slug: string; title: string }) => ({
            slug: item.slug,
            title: item.title,
            shortDescription: "",
            description: "",
            image: ""
          }));

        if (mapped.length > 0) {
          setNavCategories(mapped);
        }
      } catch {
        // keep fallback categories
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSuggestions([]);
      setCategoryMatches([]);
      setSearchOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`${API_ROUTES.search}?q=${encodeURIComponent(query)}`);
        const payload = await response.json();
        const nextSuggestions = payload?.data?.suggestions ?? [];
        const nextCategories = payload?.data?.categories ?? [];
        setSuggestions(nextSuggestions);
        setCategoryMatches(nextCategories);
        setSearchOpen(true);
      } catch {
        setSuggestions([]);
        setCategoryMatches([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!searchBoxRef.current) return;
      if (event.target instanceof Node && !searchBoxRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const onSuggestionSelect = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const renderSearchBox = () => (
    <div ref={searchBoxRef} className="relative flex h-11 w-full max-w-sm items-center rounded-xl border border-slate-300 px-3.5 transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
      <Search size={20} strokeWidth={1.5} className="mr-2.5 text-slate-500/75" />
      <input
        className="w-full bg-transparent text-sm outline-none"
        placeholder="Search products"
        type="text"
        value={searchQuery}
        onFocus={() => searchQuery.trim() && setSearchOpen(true)}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {searchOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute left-0 top-full z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-[0_16px_34px_rgba(15,36,64,0.14)]"
        >
          {searchLoading ? (
            <p className="px-3 py-2 text-xs text-slate-500">Searching...</p>
          ) : suggestions.length > 0 || categoryMatches.length > 0 ? (
            <>
              {suggestions.length > 0 ? (
                <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Products
                </div>
              ) : null}
              {suggestions.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => onSuggestionSelect(`/product/${item.slug}`)}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </button>
              ))}

              {categoryMatches.length > 0 ? (
                <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Categories
                </div>
              ) : null}
              {categoryMatches.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => onSuggestionSelect(`/category/${category.slug}`)}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {category.name}
                </button>
              ))}
            </>
          ) : (
            <p className="px-3 py-2 text-xs text-slate-500">No results found</p>
          )}
        </motion.div>
      ) : null}
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur transition duration-300 ${
        isSticky ? "shadow-[0_8px_22px_rgba(15,36,64,0.08)]" : ""
      }`}
    >
      <div className="ui-container flex h-20 items-center justify-between gap-5">
        <Link href="/" className="group relative inline-flex flex-col leading-none">
          <span className="font-heading text-[1.15rem] font-extrabold tracking-[0.06em] text-brand-900">UmarAsia</span>
          <span className="mt-0.5 text-[0.67rem] font-light tracking-[0.28em] text-slate-500">APPLIANCES</span>
          <span className="mt-1 h-[2px] w-full origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link className="text-sm font-medium text-slate-700 transition hover:text-brand-700" href="/">
            Home
          </Link>
          <div
            className="relative"
            onMouseEnter={openSolutions}
            onMouseLeave={closeSolutionsWithDelay}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-brand-700"
              type="button"
              onClick={() => (solutionsOpen ? closeSolutionsWithDelay() : openSolutions())}
            >
              Solutions <ChevronDown size={18} strokeWidth={1.5} className="opacity-70" />
            </button>
            <AnimatePresence>
              {solutionsOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 top-full w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_42px_rgba(15,36,64,0.14)]"
                >
                  {navCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block rounded-xl px-3.5 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      {category.title}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              className="text-sm font-medium text-slate-700 transition hover:text-brand-700"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          {renderSearchBox()}
          <Link
            href="/cart"
            className="group relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700"
          >
            <ShoppingCart size={21} strokeWidth={1.5} className="opacity-75 transition group-hover:opacity-100" />
            <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold leading-none text-white">
              {cartCount}
            </span>
          </Link>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:border-brand-500 hover:text-brand-700 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          type="button"
        >
          {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mb-3">{renderSearchBox()}</div>
          <div className="grid gap-2">
            <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700">
              Home
            </Link>
            <button
              className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700"
              type="button"
              onClick={() => setSolutionsOpen((prev) => !prev)}
            >
              Solutions â–¾
            </button>
            {solutionsOpen ? (
              <div className="ml-3 grid gap-1 border-l border-slate-200 pl-3">
                {navCategories.map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`} className="py-1 text-sm text-slate-600">
                    {category.title}
                  </Link>
                ))}
              </div>
            ) : null}
            {navLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700">
                {link.label}
              </Link>
            ))}
            <Link href="/cart" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700">
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}


