"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  Tags,
  Search,
  ChevronDown,
  ChevronRight,
  Save,
  ImagePlus,
  LayoutDashboard,
  AlertTriangle,
  Loader2,
  RefreshCw,
  FileUp,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Categories are now hierarchical trees per brand
// Shape: [{ name: "Engines", children: [{ name: "Turbos", children: [] }] }]
// Product.category stores full path: "engines > turbos > twin-scroll"

// Flatten a category tree into an array of path strings
function flattenCategoryTree(nodes, prefix = "") {
  const result = [];
  for (const node of nodes || []) {
    const path = prefix ? `${prefix} > ${node.name}` : node.name;
    result.push(path);
    if (node.children?.length) {
      result.push(...flattenCategoryTree(node.children, path));
    }
  }
  return result;
}

// Get all leaf + branch paths from a category tree (for filter/selection)
function getAllCategoryPaths(brands) {
  const paths = new Set();
  for (const brand of brands) {
    const cats = (brand.categories || []).map((c) =>
      typeof c === "string" ? { name: c, children: [] } : c
    );
    for (const p of flattenCategoryTree(cats)) {
      if (p) paths.add(p.toLowerCase());
    }
  }
  return [...paths];
}

const safeImage = (src) => {
  if (!src || typeof src !== "string") return "/fp1.png";
  const s = src.trim().toLowerCase();
  if (!s || s === "n/a" || s === "na" || s === "none" || s === "null" || s === "undefined") return "/fp1.png";
  if (src.trim().startsWith("/") || src.trim().startsWith("data:")) return src.trim();
  try {
    new URL(src.trim());
    return src.trim();
  } catch {
    return "/fp1.png";
  }
};

const isExternal = (src) => {
  try {
    return src && (src.startsWith("http://") || src.startsWith("https://"));
  } catch {
    return false;
  }
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Build a tree structure from flat category path strings like "engines", "engines > turbos"
function buildTreeFromPaths(paths) {
  const root = [];
  for (const p of paths) {
    const segments = p.split(" > ").map((s) => s.trim());
    let currentLevel = root;
    for (const seg of segments) {
      let existing = currentLevel.find((n) => n.name.toLowerCase() === seg.toLowerCase());
      if (!existing) {
        existing = { name: seg, children: [] };
        currentLevel.push(existing);
      }
      currentLevel = existing.children;
    }
  }
  return root;
}

// ─── CATEGORY FILTER TREE NODE (recursive, expand/collapse) ────
function CategoryFilterNode({ node, path, selectedCategory, onSelect, depth = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const fullPath = path ? `${path} > ${node.name}` : node.name;
  const hasChildren = node.children?.length > 0;
  const isSelected = selectedCategory?.toLowerCase() === fullPath.toLowerCase();
  const isAncestor = selectedCategory?.toLowerCase().startsWith(fullPath.toLowerCase() + " > ");

  // Auto-expand if this node is an ancestor of the selected category
  useEffect(() => {
    if (isAncestor) setExpanded(true);
  }, [isAncestor]);

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded-md transition-all text-xs font-semibold hover:bg-amber-100/60 ${
          isSelected ? "bg-amber-200/70 text-amber-900" : isAncestor ? "text-amber-700" : "text-[#1a1a1a]"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(fullPath)}
      >
        {hasChildren ? (
          <button
            type="button"
            className="p-0 m-0 bg-transparent border-none cursor-pointer flex items-center text-gray-400 hover:text-amber-600 transition-colors"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-3.5" />
        )}
        <span className="truncate">{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</span>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <CategoryFilterNode
              key={child.name}
              node={child}
              path={fullPath}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CATEGORY FILTER DROPDOWN (expand/collapse tree) ───────────
function CategoryFilterDropdown({ categories, selectedCategory, onSelect }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const tree = buildTreeFromPaths(categories);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayLabel = selectedCategory
    ? selectedCategory.split(" > ").pop().charAt(0).toUpperCase() + selectedCategory.split(" > ").pop().slice(1)
    : "All Categories";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-white/60 border border-amber-900/15 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#1a1a1a] cursor-pointer focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all relative min-w-[140px] text-left"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 left-0 min-w-[220px] max-h-[320px] overflow-y-auto bg-white border border-amber-900/15 rounded-xl shadow-xl py-1 animate-in fade-in slide-in-from-top-1">
          {/* All Categories option */}
          <div
            className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-md text-xs font-semibold transition-all hover:bg-amber-100/60 ${
              !selectedCategory ? "bg-amber-200/70 text-amber-900" : "text-[#1a1a1a]"
            }`}
            onClick={() => { onSelect(""); setOpen(false); }}
          >
            All Categories
          </div>
          <div className="border-t border-amber-900/10 my-1" />
          {tree.map((node) => (
            <CategoryFilterNode
              key={node.name}
              node={node}
              path=""
              selectedCategory={selectedCategory}
              onSelect={(val) => { onSelect(val); setOpen(false); }}
              depth={0}
            />
          ))}
          {tree.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-400 italic">No categories available</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ADMIN PAGE ────────────────────────────────────────────
export default function AdminPage() {
  const containerRef = useRef(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productSearch, setProductSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  // Product tab filters
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(""); // "" | "yes" | "no"
  const [adminPage, setAdminPage] = useState(1);
  const ADMIN_PER_PAGE = 30;

  const [productModal, setProductModal] = useState(null);
  const [brandModal, setBrandModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [csvModal, setCsvModal] = useState(false);

  // ─── FETCH DATA FROM API ─────────────────
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) setProducts(json.data);
      else throw new Error(json.error);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products");
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/api/brands");
      const json = await res.json();
      if (json.success) setBrands(json.data);
      else throw new Error(json.error);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      setError("Failed to load brands");
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchProducts(), fetchBrands()]);
    setLoading(false);
    setMounted(true);
  }, [fetchProducts, fetchBrands]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // GSAP entrance
  useGSAP(
    () => {
      if (!mounted) return;
      gsap.from(".admin-header", {
        y: -40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.from(".admin-card", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { scope: containerRef, dependencies: [mounted, activeTab] }
  );

  // ─── CRUD: Products ─────────────
  const saveProduct = async (formData) => {
    try {
      if (formData._id) {
        const res = await fetch(`/api/products/${formData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setProducts((prev) =>
          prev.map((p) => (p._id === formData._id ? json.data : p))
        );
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setProducts((prev) => [json.data, ...prev]);
      }
      setProductModal(null);
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteModal(null);
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  // ─── CRUD: Brands ───────────────
  const saveBrand = async (formData) => {
    try {
      if (formData._id) {
        const res = await fetch(`/api/brands/${formData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setBrands((prev) =>
          prev.map((b) => (b._id === formData._id ? json.data : b))
        );
      } else {
        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setBrands((prev) => [json.data, ...prev]);
      }
      setBrandModal(null);
    } catch (err) {
      alert("Error saving brand: " + err.message);
    }
  };

  const deleteBrand = async (id) => {
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setBrands((prev) => prev.filter((b) => b._id !== id));
      setDeleteModal(null);
    } catch (err) {
      alert("Error deleting brand: " + err.message);
    }
  };

  // Filtered data
  const filteredProducts = products.filter((p) => {
    // Text search
    const matchSearch = !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(productSearch.toLowerCase());
    // Brand filter
    const matchBrand = !filterBrand || p.brand === filterBrand;
    // Category filter
    const matchCategory = !filterCategory || p.category?.toLowerCase() === filterCategory.toLowerCase() || p.category?.toLowerCase().startsWith(filterCategory.toLowerCase() + " > ");
    // Featured filter
    const matchFeatured = !filterFeatured ||
      (filterFeatured === "yes" && p.featured) ||
      (filterFeatured === "no" && !p.featured);
    return matchSearch && matchBrand && matchCategory && matchFeatured;
  });

  const adminTotalPages = Math.ceil(filteredProducts.length / ADMIN_PER_PAGE);
  const paginatedAdminProducts = filteredProducts.slice(
    (adminPage - 1) * ADMIN_PER_PAGE,
    adminPage * ADMIN_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setAdminPage(1);
  }, [productSearch, filterBrand, filterCategory, filterFeatured]);

  // Unique categories across all products (path strings)
  const allProductCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  // Brands for filter (filtered by selected brand if category filter active)
  const filterBrandCategories = filterBrand
    ? [...new Set(products.filter((p) => p.brand === filterBrand).map((p) => p.category).filter(Boolean))]
    : allProductCategories;
  // Also get category tree paths from brand definitions for richer filtering
  const filterBrandTreePaths = filterBrand
    ? flattenCategoryTree(brands.find((b) => b.name === filterBrand)?.categories?.map((c) => typeof c === "string" ? { name: c, children: [] } : c) || [])
    : getAllCategoryPaths(brands);
  // Merge: show all paths from both product data and brand tree definitions
  const mergedFilterCategories = [...new Set([...filterBrandCategories, ...filterBrandTreePaths.map((p) => p.toLowerCase())])].sort();
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Stats
  const totalProducts = products.length;
  const totalBrands = brands.length;
  const totalFeatured = products.filter((p) => p.featured).length;
  const categoryCount = [...new Set(products.map((p) => p.category))].length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1E6D2] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Loading inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F1E6D2]">
      {/* ── HEADER ──────────────────────────────────── */}
      <div className="admin-header w-full bg-[#1a1a1a] px-6 sm:px-12 lg:px-24 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-0.5 w-8 bg-amber-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 font-mono">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Inventory{" "}
                <span className="italic font-serif text-amber-400">Manager</span>
              </h1>
              <p className="text-gray-400 text-sm mt-3 max-w-xl">
                Manage your products, brands, and inventory from one place.
              </p>
            </div>
            <button
              onClick={fetchAll}
              className="hidden sm:flex items-center gap-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
              <button
                onClick={fetchAll}
                className="ml-auto text-xs text-red-300 hover:text-white underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mt-8 flex-wrap">
            {[
              { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { key: "products", label: "Products", icon: Package },
              { key: "brands", label: "Brands", icon: Tags },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-lg ${
                  activeTab === key
                    ? "bg-amber-400 text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-10 sm:py-16">
        {/* ── DASHBOARD ─────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard label="Total Products" value={totalProducts} icon={Package} />
              <StatCard label="Total Brands" value={totalBrands} icon={Tags} />
              <StatCard label="Featured" value={totalFeatured} icon={ImagePlus} />
              <StatCard label="Categories" value={categoryCount} icon={LayoutDashboard} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">Recent Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.slice(0, 6).map((p) => (
                  <div
                    key={p._id}
                    className="admin-card bg-white/60 border border-amber-900/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/80 transition-colors"
                  >
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-amber-400/20"
                    >
                      <Image
                        src={safeImage(p.image)}
                        alt={p.name}
                        width={48}
                        height={48}
                        unoptimized={isExternal(p.image)}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#1a1a1a] truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.subtitle} · {p.category}
                      </p>
                    </div>
                    {p.featured && (
                      <span className="ml-auto text-[9px] font-black uppercase tracking-widest bg-amber-400 text-black px-2 py-1 rounded shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">Brands</h3>
              <div className="flex flex-wrap gap-3">
                {brands.map((b) => (
                  <div
                    key={b._id}
                    className="admin-card flex items-center gap-3 bg-white/60 border border-amber-900/10 rounded-xl px-4 py-3 hover:bg-white/80 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 border border-black/10 bg-amber-400/30"
                    />
                    <span className="text-sm font-bold text-[#1a1a1a]">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ──────────────────────────── */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-amber-900/15 rounded-lg text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
              <button
                onClick={() => setProductModal("add")}
                className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-black transition-all duration-300 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
              <button
                onClick={() => setCsvModal(true)}
                className="flex items-center gap-2 bg-white/60 border border-amber-900/15 text-[#1a1a1a] px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300 shrink-0"
              >
                <FileUp className="w-4 h-4" /> Import CSV
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Brand filter */}
              <div className="relative">
                <select
                  value={filterBrand}
                  onChange={(e) => { setFilterBrand(e.target.value); setFilterCategory(""); }}
                  className="appearance-none bg-white/60 border border-amber-900/15 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#1a1a1a] cursor-pointer focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Category filter */}
              <CategoryFilterDropdown
                categories={mergedFilterCategories}
                selectedCategory={filterCategory}
                onSelect={setFilterCategory}
              />

              {/* Featured filter */}
              <div className="relative">
                <select
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value)}
                  className="appearance-none bg-white/60 border border-amber-900/15 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#1a1a1a] cursor-pointer focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="yes">Featured</option>
                  <option value="no">Standard</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Active filter count + clear */}
              {(filterBrand || filterCategory || filterFeatured) && (
                <button
                  onClick={() => { setFilterBrand(""); setFilterCategory(""); setFilterFeatured(""); }}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Filters
                </button>
              )}

              {/* Result count */}
              <span className="ml-auto text-[10px] font-mono text-gray-500">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No products found</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden lg:block bg-white/60 border border-amber-900/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-amber-900/10 bg-white/40">
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          Product
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          SKU
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          Category
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          Specs
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          Price
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          Status
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAdminProducts.map((p) => (
                        <tr
                          key={p._id}
                          className="admin-card border-b border-amber-900/5 hover:bg-white/40 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-amber-400/10"
                              >
                                <Image
                                  src={safeImage(p.image)}
                                  alt={p.name}
                                  width={40}
                                  height={40}
                                  unoptimized={isExternal(p.image)}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1a1a1a]">{p.name}</p>
                                <p className="text-xs text-gray-500">{p.subtitle}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                              {p.sku || "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                              {p.category?.split(" > ").pop() || p.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-xs text-gray-500 max-w-50 truncate">
                              {p.specs?.join(" · ")}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-[#1a1a1a]">
                              ₹{p.price ? Number(p.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {p.featured ? (
                              <span className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-black px-2 py-1 rounded">
                                Featured
                              </span>
                            ) : (
                              <span className="text-[9px] font-black uppercase tracking-widest bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                Standard
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setProductModal(p)}
                                className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteModal({ type: "product", item: p })
                                }
                                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {adminTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <span className="text-[10px] font-mono text-gray-500">
                      Page {adminPage} of {adminTotalPages}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAdminPage((p) => Math.max(1, p - 1))}
                        disabled={adminPage === 1}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-amber-900/15 rounded-lg text-gray-600 hover:bg-[#1a1a1a] hover:text-amber-400 hover:border-[#1a1a1a] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>
                      {Array.from({ length: adminTotalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          if (adminTotalPages <= 7) return true;
                          if (page === 1 || page === adminTotalPages) return true;
                          if (Math.abs(page - adminPage) <= 1) return true;
                          return false;
                        })
                        .reduce((acc, page, idx, arr) => {
                          if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
                          acc.push(page);
                          return acc;
                        }, [])
                        .map((page, idx) =>
                          page === "..." ? (
                            <span key={`dot-${idx}`} className="px-1 text-gray-400 text-xs">...</span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => setAdminPage(page)}
                              className={`w-8 h-8 text-[10px] font-bold rounded-lg transition-all ${
                                adminPage === page
                                  ? "bg-[#1a1a1a] text-amber-400"
                                  : "text-gray-600 hover:bg-white/60"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                      <button
                        onClick={() => setAdminPage((p) => Math.min(adminTotalPages, p + 1))}
                        disabled={adminPage === adminTotalPages}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-amber-900/15 rounded-lg text-gray-600 hover:bg-[#1a1a1a] hover:text-amber-400 hover:border-[#1a1a1a] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile cards */}
                <div className="lg:hidden space-y-3">
                  {paginatedAdminProducts.map((p) => (
                    <div
                      key={p._id}
                      className="admin-card bg-white/60 border border-amber-900/10 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-amber-400/10"
                        >
                          <Image
                            src={safeImage(p.image)}
                            alt={p.name}
                            width={48}
                            height={48}
                            unoptimized={isExternal(p.image)}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#1a1a1a] truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500">{p.subtitle}</p>
                        </div>
                        {p.featured && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-black px-2 py-1 rounded shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                            {p.sku ? `SKU: ${p.sku}` : p.category?.split(" > ").pop()}
                          </span>
                          <span className="text-xs font-bold text-[#1a1a1a]">
                            ₹{p.price ? Number(p.price).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setProductModal(p)}
                            className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ type: "product", item: p })
                            }
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── BRANDS TAB ────────────────────────────── */}
        {activeTab === "brands" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-amber-900/15 rounded-lg text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
              <button
                onClick={() => setBrandModal("add")}
                className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-black transition-all duration-300 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Brand
              </button>
            </div>

            {filteredBrands.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Tags className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No brands found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrands.map((b) => (
                  <div
                    key={b._id}
                    className="admin-card bg-white/60 border border-amber-900/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/80 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-black/5 bg-amber-400/20"
                      >
                        <span className="text-xs font-black text-amber-700 uppercase">
                          {b.name.slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-[#1a1a1a] truncate">
                          {b.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">
                          {b.number || '—'}
                        </p>
                        {b.categories?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {b.categories.map((cat, ci) => (
                              <span key={ci} className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-mono">
                                {typeof cat === "string" ? cat : cat.name}
                                {typeof cat !== "string" && cat.children?.length > 0 && (
                                  <span className="text-amber-500 ml-0.5">+{cat.children.length}</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setBrandModal(b)}
                        className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({ type: "brand", item: b })
                        }
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── PRODUCT MODAL ───────────────────────────── */}
      {productModal !== null && (
        <ProductModal
          initial={productModal === "add" ? null : productModal}
          onSave={saveProduct}
          onClose={() => setProductModal(null)}
          brands={brands}
        />
      )}

      {/* ── BRAND MODAL ─────────────────────────────── */}
      {brandModal !== null && (
        <BrandModal
          initial={brandModal === "add" ? null : brandModal}
          onSave={saveBrand}
          onClose={() => setBrandModal(null)}
        />
      )}

      {/* ── DELETE CONFIRMATION ──────────────────────── */}
      {deleteModal && (
        <DeleteModal
          type={deleteModal.type}
          item={deleteModal.item}
          onConfirm={() =>
            deleteModal.type === "product"
              ? deleteProduct(deleteModal.item._id)
              : deleteBrand(deleteModal.item._id)
          }
          onClose={() => setDeleteModal(null)}
        />
      )}

      {/* ── CSV UPLOAD MODAL ─────────────────────────── */}
      {csvModal && (
        <CSVUploadModal
          brands={brands}
          onClose={() => setCsvModal(false)}
          onDone={(newProducts) => {
            setProducts((prev) => [...newProducts, ...prev]);
            setCsvModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─── STAT CARD ──────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="admin-card bg-white/60 border border-amber-900/10 rounded-xl p-5 sm:p-6 flex flex-col gap-3 hover:bg-white/80 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-black text-[#1a1a1a] tracking-tight">
          {value}
        </p>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-500 font-mono mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}



// ─── PRODUCT MODAL ──────────────────────────────────────────────
function ProductModal({ initial, onSave, onClose, brands = [] }) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    _id: initial?._id || null,
    name: initial?.name || "",
    subtitle: initial?.subtitle || "",
    brand: initial?.brand || "",
    category: initial?.category || "",
    sku: initial?.sku || "",
    image: initial?.image || "/fp1.png",
    specs: initial?.specs?.join(", ") || "",
    featured: initial?.featured || false,
    slug: initial?.slug || "",
    description: initial?.description || "",
    moq: initial?.moq || 1,
    price: initial?.price || 0,
  });

  // Get categories for the selected brand (tree structure)
  const selectedBrand = brands.find((b) => b.name === form.brand);
  const brandCategoryTree = selectedBrand?.categories || [];

  // Migrate: if categories are flat strings, wrap them as tree nodes
  const categoryTree = brandCategoryTree.map((c) =>
    typeof c === "string" ? { name: c, children: [] } : c
  );

  // Parse current category path into segments: "engines > turbos > twin-scroll" -> ["engines", "turbos", "twin-scroll"]
  const categorySegments = form.category ? form.category.split(" > ").map((s) => s.trim()) : [];

  // Build cascading dropdown levels from the tree
  const getCascadeLevels = () => {
    const levels = []; // each level: { options: [{name, hasChildren}], selected: string }
    let currentNodes = categoryTree;
    for (let i = 0; i < categorySegments.length; i++) {
      const seg = categorySegments[i];
      const options = currentNodes.map((n) => ({ name: n.name, hasChildren: n.children?.length > 0 }));
      levels.push({ options, selected: seg });
      const match = currentNodes.find((n) => n.name.toLowerCase() === seg.toLowerCase());
      if (match?.children?.length > 0) {
        currentNodes = match.children;
      } else {
        break;
      }
    }
    // Add next level if the last selected node has children
    if (categorySegments.length > 0) {
      const lastSeg = categorySegments[categorySegments.length - 1];
      let nodes = categoryTree;
      for (let i = 0; i < categorySegments.length - 1; i++) {
        const m = nodes.find((n) => n.name.toLowerCase() === categorySegments[i].toLowerCase());
        nodes = m?.children || [];
      }
      const lastMatch = nodes.find((n) => n.name.toLowerCase() === lastSeg.toLowerCase());
      if (lastMatch?.children?.length > 0) {
        levels.push({ options: lastMatch.children.map((n) => ({ name: n.name, hasChildren: n.children?.length > 0 })), selected: "" });
      }
    }
    // Always show at least level 0
    if (levels.length === 0 && categoryTree.length > 0) {
      levels.push({ options: categoryTree.map((n) => ({ name: n.name, hasChildren: n.children?.length > 0 })), selected: "" });
    }
    return levels;
  };

  const cascadeLevels = getCascadeLevels();

  // Handle cascade selection change at a specific depth
  const handleCascadeChange = (depth, value) => {
    const newSegments = [...categorySegments.slice(0, depth), value].filter(Boolean);
    update("category", newSegments.join(" > "));
  };

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await onSave({
      ...form,
      specs: form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      slug: form.slug || "",
      moq: Number(form.moq) || 1,
      price: Number(form.price) || 0,
    });
    setSaving(false);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-[#1a1a1a]">
            {initial ? "Edit Product" : "Add Product"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image URL */}
        <Field label="Product Image">
          {form.image && safeImage(form.image) !== "/fp1.png" && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 border border-amber-900/10 mb-2">
              <Image
                src={safeImage(form.image)}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          )}
          <input
            type="text"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="Enter image URL / path"
            className="input-field"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Product Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Forged Steel Engine Block"
              required
              className="input-field"
            />
          </Field>
          <Field label="Subtitle">
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="e.g. V8 Series"
              className="input-field"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Brand" required>
            <div className="relative">
              <select
                value={form.brand}
                onChange={(e) => {
                  update("brand", e.target.value);
                  update("category", ""); // reset category when brand changes
                }}
                className="input-field appearance-none cursor-pointer pr-10"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </Field>
          <Field label="Category" required>
            <div className="space-y-2">
              {!form.brand ? (
                <p className="text-xs text-gray-400 italic py-2">Select a brand first</p>
              ) : categoryTree.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No categories for this brand</p>
              ) : (
                cascadeLevels.map((level, depth) => (
                  <div key={depth} className="relative">
                    <select
                      value={level.selected}
                      onChange={(e) => handleCascadeChange(depth, e.target.value)}
                      className="input-field appearance-none cursor-pointer pr-10"
                      required={depth === 0}
                    >
                      <option value="">
                        {depth === 0 ? "Select Category" : "Select Sub-category (optional)"}
                      </option>
                      {level.options.map((opt) => (
                        <option key={opt.name} value={opt.name.toLowerCase()}>
                          {opt.name}{opt.hasChildren ? " ›" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                ))
              )}
              {form.category && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 font-mono">Path:</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {form.category}
                  </span>
                </div>
              )}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Slug">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="auto-generated from name"
              className="input-field"
            />
          </Field>
          <Field label="SKU Number">
            <input
              type="text"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              placeholder="e.g. ENG-V8-4340-001"
              className="input-field"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="MOQ (Min Order Qty)">
            <input
              type="number"
              min="1"
              value={form.moq}
              onChange={(e) => update("moq", e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Price (INR \u20B9)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0.00"
              className="input-field"
            />
          </Field>
        </div>

        <Field label="Specs (comma-separated)">
          <input
            type="text"
            value={form.specs}
            onChange={(e) => update("specs", e.target.value)}
            placeholder="Forged 4340 Steel, Max RPM: 9500, Weight: 86kg"
            className="input-field"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Detailed product description..."
            rows={3}
            className="input-field resize-none"
          />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="w-4 h-4 rounded border-amber-900/15 text-amber-500 focus:ring-amber-500/30 cursor-pointer"
          />
          <span className="text-sm font-medium text-[#1a1a1a]">
            Mark as Featured
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {initial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// ─── CATEGORY TREE NODE (recursive) ─────────────────────────────
function CategoryTreeNode({ node, path, onAdd, onRemove, onRename, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);

  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 16;

  const handleAdd = () => {
    const name = newName.trim();
    if (name) {
      onAdd(path, name);
      setNewName("");
      setAdding(false);
    }
  };

  const handleRename = () => {
    const name = editName.trim();
    if (name && name !== node.name) {
      onRename(path, name);
    }
    setEditing(false);
  };

  return (
    <div style={{ marginLeft: indent }}>
      <div className="flex items-center gap-1 group py-1">
        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors ${!hasChildren ? "invisible" : ""}`}
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Name */}
        {editing ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setEditing(false); }}
              className="text-xs bg-white border border-amber-400 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
              autoFocus
            />
            <button type="button" onClick={handleRename} className="text-green-600 hover:text-green-700">
              <Save className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => { setEditing(false); setEditName(node.name); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span
            className="text-xs font-bold text-[#1a1a1a] cursor-pointer hover:text-amber-600 transition-colors"
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
          >
            {node.name}
          </span>
        )}

        {/* Actions (visible on hover) */}
        {!editing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
            <button
              type="button"
              onClick={() => setAdding(!adding)}
              className="p-1 rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Add sub-category"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1 rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Rename"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(path)}
              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Add sub-category input */}
      {adding && (
        <div className="flex items-center gap-1 ml-6 my-1" style={{ marginLeft: indent + 24 }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } if (e.key === "Escape") setAdding(false); }}
            placeholder="Sub-category name"
            className="text-xs bg-white border border-amber-900/15 rounded px-2 py-1 flex-1 focus:outline-none focus:border-amber-500"
            autoFocus
          />
          <button type="button" onClick={handleAdd} className="px-2 py-1 bg-[#1a1a1a] text-white rounded text-[10px] font-bold hover:bg-amber-500 hover:text-black transition-all">
            Add
          </button>
        </div>
      )}

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child, ci) => (
            <CategoryTreeNode
              key={ci}
              node={child}
              path={[...path, ci]}
              onAdd={onAdd}
              onRemove={onRemove}
              onRename={onRename}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BRAND MODAL ────────────────────────────────────────────────
function BrandModal({ initial, onSave, onClose }) {
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Migrate flat string categories to tree format if needed
  const migrateCategories = (cats) => {
    if (!cats || cats.length === 0) return [];
    if (typeof cats[0] === "string") {
      // Old flat format — convert to tree nodes
      return cats.map((c) => ({ name: c, children: [] }));
    }
    return cats.map((c) => ({ name: c.name || "", children: c.children || [] }));
  };

  const [form, setForm] = useState({
    _id: initial?._id || null,
    name: initial?.name || "",
    number: initial?.number || "",
    imgs: initial?.imgs?.join("\n") || "",
    categories: migrateCategories(initial?.categories),
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Add a top-level category
  const addTopCategory = () => {
    const cat = newCategory.trim();
    if (cat && !form.categories.some((c) => c.name.toLowerCase() === cat.toLowerCase())) {
      update("categories", [...form.categories, { name: cat, children: [] }]);
    }
    setNewCategory("");
  };

  // Deep clone helper
  const cloneTree = (tree) => JSON.parse(JSON.stringify(tree));

  // Navigate to a node by path indices (e.g. [0, 2, 1] = categories[0].children[2].children[1])
  const getNodeByPath = (tree, path) => {
    let node = tree[path[0]];
    for (let i = 1; i < path.length; i++) {
      node = node.children[path[i]];
    }
    return node;
  };

  // Add child at path
  const addChildAt = (path, name) => {
    const newTree = cloneTree(form.categories);
    const parent = getNodeByPath(newTree, path);
    if (!parent.children) parent.children = [];
    if (!parent.children.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      parent.children.push({ name, children: [] });
    }
    update("categories", newTree);
  };

  // Remove node at path
  const removeNodeAt = (path) => {
    const newTree = cloneTree(form.categories);
    if (path.length === 1) {
      newTree.splice(path[0], 1);
    } else {
      const parentPath = path.slice(0, -1);
      const parent = getNodeByPath(newTree, parentPath);
      parent.children.splice(path[path.length - 1], 1);
    }
    update("categories", newTree);
  };

  // Rename node at path
  const renameNodeAt = (path, newName) => {
    const newTree = cloneTree(form.categories);
    const node = getNodeByPath(newTree, path);
    node.name = newName;
    update("categories", newTree);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      imgs: form.imgs
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-[#1a1a1a]">
            {initial ? "Edit Brand" : "Add Brand"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Brand Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. DeWALT"
              required
              className="input-field"
            />
          </Field>
          <Field label="Number Label">
            <input
              type="text"
              value={form.number}
              onChange={(e) => update("number", e.target.value)}
              placeholder="e.g. 01"
              className="input-field"
            />
          </Field>
        </div>

        <Field label="Categories (hierarchical tree)">
          <div className="space-y-2">
            {/* Add top-level category */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTopCategory(); } }}
                placeholder="Add top-level category"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addTopCategory}
                className="px-3 py-2 bg-[#1a1a1a] text-white rounded-lg text-xs font-bold uppercase hover:bg-amber-500 hover:text-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Category tree */}
            {form.categories.length > 0 ? (
              <div className="bg-white/40 border border-amber-900/10 rounded-lg p-3 max-h-60 overflow-y-auto">
                {form.categories.map((cat, ci) => (
                  <CategoryTreeNode
                    key={ci}
                    node={cat}
                    path={[ci]}
                    onAdd={addChildAt}
                    onRemove={removeNodeAt}
                    onRename={renameNodeAt}
                    depth={0}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-2">No categories added yet. Add one above, then hover to add sub-categories.</p>
            )}

            <p className="text-[10px] text-gray-400">
              Hover a category to add sub-categories, rename, or remove. Double-click a name to edit it.
            </p>
          </div>
        </Field>

        <Field label="Brand Images (one URL per line)">
          <textarea
            value={form.imgs}
            onChange={(e) => update("imgs", e.target.value)}
            placeholder={`https://images.unsplash.com/photo-xxx\nhttps://images.unsplash.com/photo-yyy\nhttps://images.unsplash.com/photo-zzz`}
            rows={4}
            className="input-field resize-none font-mono text-xs"
          />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {initial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// ─── DELETE MODAL ───────────────────────────────────────────────
function DeleteModal({ type, item, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-black text-[#1a1a1a]">
          Delete {type === "product" ? "Product" : "Brand"}
        </h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{item.name}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── SHARED COMPONENTS ──────────────────────────────────────────
function ModalOverlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#F1E6D2] border border-amber-900/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-2">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── CSV UPLOAD MODAL ───────────────────────────────────────────
function CSVUploadModal({ brands, onClose, onDone }) {
  const fileRef = useRef(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null); // { success: [], errors: [] }

  // Parse CSV text into array of objects
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];

    // Parse header — handle quoted fields
    const parseRow = (row) => {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseRow(lines[0]).map((h) =>
      h.toLowerCase().replace(/[^a-z0-9]/g, "")
    );

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseRow(lines[i]);
      if (values.every((v) => !v)) continue; // skip empty rows
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || "";
      });
      rows.push(obj);
    }
    return rows;
  };

  // Map parsed CSV row to product data
  const mapRowToProduct = (row) => {
    // Normalize category path: "Engines > Turbos" -> "engines > turbos"
    const rawCategory = (row.category || row.cat || "").trim();
    const categoryPath = rawCategory
      .split(">")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .join(" > ");

    return {
      name: row.name || row.productname || row.title || "",
      subtitle: row.subtitle || row.sub || "",
      brand: row.brand || row.brandname || "",
      category: categoryPath,
      sku: row.sku || row.skuno || row.sku_no || row.partnumber || "",
      image: row.image || row.img || row.imageurl || "/fp1.png",
      specs: (row.specs || row.specifications || "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: ["true", "yes", "1"].includes(
        (row.featured || row.feat || "").toLowerCase()
      ),
      description: row.description || row.desc || "",
      moq: parseInt(row.moq || row.minorder || "1") || 1,
      price: parseFloat(row.price || row.unitprice || row.cost || "0") || 0,
      details: parseDetails(row.details || row.det || ""),
    };
  };

  // Parse details from "Key:Value|Key:Value" format
  const parseDetails = (str) => {
    if (!str) return {};
    const obj = {};
    str.split("|").forEach((pair) => {
      const idx = pair.indexOf(":");
      if (idx > -1) {
        const key = pair.slice(0, idx).trim();
        const val = pair.slice(idx + 1).trim();
        if (key) obj[key] = val;
      }
    });
    return obj;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResults(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      const mapped = rows.map(mapRowToProduct);
      setParsedRows(mapped);
    };
    reader.readAsText(file);
  };

  const handleUploadAll = async () => {
    setUploading(true);
    const success = [];
    const errors = [];

    // --- Step 1: Auto-create missing brands & categories (tree) ---
    // Fetch latest brands from DB
    let existingBrands = [];
    try {
      const bRes = await fetch("/api/brands");
      const bJson = await bRes.json();
      if (bJson.success) existingBrands = bJson.data;
    } catch (_) {}

    // Helper: insert a category path into a tree
    const insertCategoryPath = (tree, pathSegments) => {
      if (!pathSegments.length) return tree;
      const [first, ...rest] = pathSegments;
      let node = tree.find((n) => (typeof n === "string" ? n : n.name).toLowerCase() === first.toLowerCase());
      if (!node) {
        node = { name: first, children: [] };
        tree.push(node);
      } else if (typeof node === "string") {
        // Migrate old flat string to tree node
        const idx = tree.indexOf(node);
        node = { name: node, children: [] };
        tree[idx] = node;
      }
      if (rest.length > 0) {
        if (!node.children) node.children = [];
        insertCategoryPath(node.children, rest);
      }
      return tree;
    };

    // Collect unique brand→category paths from CSV rows
    const brandCategoryPaths = {}; // { brandName: ["engines > turbos", ...] }
    for (const row of parsedRows) {
      const bName = (row.brand || "").trim();
      if (!bName) continue;
      if (!brandCategoryPaths[bName]) brandCategoryPaths[bName] = new Set();
      const cat = (row.category || "").trim();
      if (cat) brandCategoryPaths[bName].add(cat);
    }

    // Create missing brands & update category trees on existing brands
    for (const [brandName, catPaths] of Object.entries(brandCategoryPaths)) {
      const existing = existingBrands.find(
        (b) => b.name.toLowerCase() === brandName.toLowerCase()
      );

      if (!existing) {
        // Brand doesn't exist — create it with category tree from paths
        const tree = [];
        for (const path of catPaths) {
          const segments = path.split(" > ").map((s) => s.trim()).filter(Boolean);
          insertCategoryPath(tree, segments);
        }
        try {
          const res = await fetch("/api/brands", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: brandName, categories: tree }),
          });
          const json = await res.json();
          if (json.success) existingBrands.push(json.data);
        } catch (_) {}
      } else {
        // Brand exists — merge new category paths into existing tree
        let tree = JSON.parse(JSON.stringify(existing.categories || []));
        // Migrate flat strings if needed
        tree = tree.map((c) => (typeof c === "string" ? { name: c, children: [] } : c));
        let changed = false;
        for (const path of catPaths) {
          const segments = path.split(" > ").map((s) => s.trim()).filter(Boolean);
          const before = JSON.stringify(tree);
          insertCategoryPath(tree, segments);
          if (JSON.stringify(tree) !== before) changed = true;
        }
        if (changed) {
          try {
            await fetch(`/api/brands/${existing._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ categories: tree }),
            });
          } catch (_) {}
        }
      }
    }

    // --- Step 2: Upload all products in a single bulk request ---
    // Client-side validation first
    const validRows = [];
    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      if (!row.name) {
        errors.push({ index: i + 1, name: "(empty)", error: "Name is required" });
        continue;
      }
      if (!row.category) {
        errors.push({ index: i + 1, name: row.name, error: "Category is required" });
        continue;
      }
      validRows.push({ ...row, _csvIndex: i });
    }

    if (validRows.length > 0) {
      try {
        const res = await fetch("/api/products/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: validRows }),
        });
        const json = await res.json();
        if (json.success) {
          success.push(...(json.created || []));
          if (json.errors) {
            errors.push(...json.errors);
          }
        } else {
          errors.push({ index: 0, name: "Bulk", error: json.error });
        }
      } catch (err) {
        errors.push({ index: 0, name: "Bulk", error: err.message });
      }
    }

    setResults({ success, errors });
    setUploading(false);

    if (success.length > 0) {
      // Delay so user can see results, then close
      setTimeout(() => onDone(success), 2000);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-[#1a1a1a] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-500" />
            Import CSV
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CSV Format Guide */}
        <div className="bg-white/40 border border-amber-900/10 rounded-lg p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            CSV Format
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your CSV should have headers matching these columns:
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              "name*",
              "brand*",
              "category*",
              "sku",
              "subtitle",
              "image",
              "specs",
              "featured",
              "description",
              "moq",
              "price",
            ].map((col) => (
              <span
                key={col}
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  col.includes("*")
                    ? "bg-red-50 text-red-600 font-bold"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {col}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Use <code className="bg-gray-100 px-1 rounded">|</code> to separate
            multiple specs.
            Use <code className="bg-gray-100 px-1 rounded">&gt;</code> for nested categories
            (e.g. <code className="bg-gray-100 px-1 rounded">Engines &gt; Turbos &gt; Twin-Scroll</code>).{" "}
            <span className="text-red-500">* = required</span>
          </p>
        </div>

        {/* File Input */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-amber-900/20 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/30 transition-all group"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <FileUp className="w-8 h-8 text-gray-400 group-hover:text-amber-500 mx-auto mb-2 transition-colors" />
          {fileName ? (
            <p className="text-sm font-bold text-[#1a1a1a]">{fileName}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Click to select a <span className="font-bold">.csv</span> file
            </p>
          )}
        </div>

        {/* Preview */}
        {parsedRows.length > 0 && !results && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#1a1a1a]">
              Preview:{" "}
              <span className="text-amber-600">{parsedRows.length} products</span>{" "}
              found
            </p>
            <div className="max-h-48 overflow-y-auto bg-white/40 border border-amber-900/10 rounded-lg divide-y divide-amber-900/5">
              {parsedRows.map((row, i) => (
                <div key={i} className="px-3 py-2 flex items-center gap-3">
                  <span className="text-[9px] text-gray-400 font-mono w-5">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1a1a1a] truncate">
                      {row.name || "(no name)"}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {row.brand || "—"} / {row.category || "—"}
                    </p>
                  </div>
                  {row.featured && (
                    <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleUploadAll}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import {parsedRows.length} Products
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-3">
            {results.success.length > 0 && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-xs font-bold text-green-700">
                  {results.success.length} product
                  {results.success.length > 1 ? "s" : ""} imported successfully!
                </p>
              </div>
            )}
            {results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs font-bold text-red-700">
                    {results.errors.length} error
                    {results.errors.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {results.errors.map((err, i) => (
                    <p key={i} className="text-[10px] text-red-600 font-mono">
                      Row {err.index}: {err.name} — {err.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}
