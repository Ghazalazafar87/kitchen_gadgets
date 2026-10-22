import React from 'react';
import { CategoryType } from '../types';
import { CATEGORIES } from '../data/products';
import { Cpu, Flame, Sparkles, Layers, Scissors, Sparkle, LayoutGrid } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: CategoryType | 'All';
  onSelectCategory: (cat: CategoryType | 'All') => void;
  totalProductsCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  totalProductsCount,
}) => {
  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Kitchen Appliances':
        return <Cpu className="w-4 h-4" />;
      case 'Cooking Essentials':
        return <Flame className="w-4 h-4" />;
      case 'Modern Kitchen Gadgets':
        return <Sparkles className="w-4 h-4" />;
      case 'Food Storage and Organization':
        return <Layers className="w-4 h-4" />;
      case 'Kitchen Tools and Accessories':
        return <Scissors className="w-4 h-4" />;
      case 'Cleaning and Dishwashing':
        return <Sparkle className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div id="categories" className="py-6 border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Explore Kitchen Departments
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Select a specialized category or view our complete curated inventory
            </p>
          </div>
        </div>

        {/* Scrollable Category Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => onSelectCategory('All')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all border cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-[#2D5A46] text-white border-[#2D5A46] shadow-xs'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>All Departments</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                activeCategory === 'All' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              {totalProductsCount}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D5A46] text-white border-[#2D5A46] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                {getCategoryIcon(cat.name)}
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
