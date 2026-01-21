import { Product } from '@/data/products';
import productService, { Category } from '@/services/product.service';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface ProductDataContextType {
  categories: Category[];
  allProducts: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  lastLoadTime: number | null;
  loadCategoriesAndProducts: () => Promise<void>;
  loadFeaturedProducts: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const ProductDataContext = createContext<ProductDataContextType | undefined>(undefined);

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const ProductDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadTime, setLastLoadTime] = useState<number | null>(null);

  const loadCategoriesAndProducts = useCallback(async () => {
    // Nếu dữ liệu còn fresh, không cần load lại
    if (lastLoadTime && Date.now() - lastLoadTime < CACHE_DURATION && allProducts.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [categoriesData, productsResponse] = await Promise.all([
        productService.getCategories(),
        productService.getAllProducts({ limit: 100 })
      ]);

      console.log('Categories loaded:', categoriesData.length);
      console.log('Products loaded:', Array.isArray(productsResponse) ? productsResponse.length : 0);

      const productsList = Array.isArray(productsResponse) ? productsResponse : [];
      setCategories(categoriesData);
      setAllProducts(productsList);
      setLastLoadTime(Date.now());
    } catch (err: any) {
      console.error('Load products error:', err);
      setError(err.message);
      // Fallback to local data
      try {
        const { categories: localCats, products: localProds } = await import('@/data/products');
        console.log('Using fallback data - Categories:', localCats.length, 'Products:', localProds.length);
        setCategories(localCats);
        setAllProducts(localProds);
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, [lastLoadTime, allProducts.length]);

  const loadFeaturedProducts = useCallback(async () => {
    if (featuredProducts.length > 0) {
      return;
    }

    try {
      const featured = await productService.getFeaturedProducts(4);
      setFeaturedProducts(featured);
    } catch (err: any) {
      console.error('Load featured products error:', err);
      try {
        const { products: localProds } = await import('@/data/products');
        setFeaturedProducts(localProds.slice(0, 4));
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
    }
  }, [featuredProducts.length]);

  const refreshData = useCallback(async () => {
    setLastLoadTime(null);
    setFeaturedProducts([]);
    await Promise.all([loadCategoriesAndProducts(), loadFeaturedProducts()]);
  }, [loadCategoriesAndProducts, loadFeaturedProducts]);

  // Load dữ liệu khi provider mount lần đầu
  useEffect(() => {
    loadCategoriesAndProducts();
    loadFeaturedProducts();
  }, []);

  const value: ProductDataContextType = {
    categories,
    allProducts,
    featuredProducts,
    loading,
    error,
    lastLoadTime,
    loadCategoriesAndProducts,
    loadFeaturedProducts,
    refreshData,
  };

  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
};

export const useProductData = () => {
  const context = useContext(ProductDataContext);
  if (!context) {
    throw new Error('useProductData must be used within ProductDataProvider');
  }
  return context;
};
