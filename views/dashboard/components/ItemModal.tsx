import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { Button } from '../../../components/Button';
import { MenuItem } from '../../../types';
import { MenuItemFormData } from '../types';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  existingCategories: string[];
  onSave: (data: MenuItemFormData) => Promise<void>;
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, item, existingCategories, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Availability Flags
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [hasDateLimit, setHasDateLimit] = useState(false);
  
  // Availability Values (Standardizing Formats)
  const [availableFrom, setAvailableFrom] = useState('09:00');
  const [availableTo, setAvailableTo] = useState('21:00');
  const [availableDate, setAvailableDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isManualCategory, setIsManualCategory] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price.toString());
        setCategory(item.category);
        setIsAvailable(item.isAvailable);
        setHasTimeLimit(!!(item.availableFrom || item.availableTo));
        setHasDateLimit(!!item.availableDate);
        setAvailableFrom(item.availableFrom || '09:00');
        setAvailableTo(item.availableTo || '21:00');
        setAvailableDate(item.availableDate || new Date().toISOString().split('T')[0]);
        setIsManualCategory(false);
      } else {
        setName('');
        setDescription('');
        setPrice('');
        setIsAvailable(true);
        setHasTimeLimit(false);
        setHasDateLimit(false);
        setAvailableFrom('09:00');
        setAvailableTo('21:00');
        setAvailableDate(new Date().toISOString().split('T')[0]);
        if (existingCategories.length > 0) {
          setCategory(existingCategories[0]);
          setIsManualCategory(false);
        } else {
          setCategory('');
          setIsManualCategory(true);
        }
      }
    }
  }, [isOpen, item, existingCategories]);

  const handleSave = async () => {
    // Basic validation: Name and Price are required. Price must be a valid number.
    const parsedPrice = parseFloat(price);
    if (!name || isNaN(parsedPrice) || !category) {
        alert("Please fill in Name, Category and a valid Price.");
        return;
    }
    
    setLoading(true);
    
    const formData: MenuItemFormData = { 
        name, 
        description, 
        price: parsedPrice, 
        category,
        isAvailable,
        availableFrom: hasTimeLimit ? availableFrom : null,
        availableTo: hasTimeLimit ? availableTo : null,
        availableDate: hasDateLimit ? availableDate : null
    };

    try {
        await onSave(formData);
        onClose();
    } catch (err) {
        console.error("Modal Save Error:", err);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0F1012] border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-5 fade-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors">
          <X size={20} />
        </button>
        <h2 className="text-lg font-light text-white mb-6">{item ? 'Edit Item' : 'New Item'}</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
              placeholder="e.g. Truffle Fries"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-[#E0E0E0] focus:outline-none focus:border-[#5E6AD2]/50 transition-colors h-24 resize-none font-light leading-relaxed"
              placeholder="Describe the dish..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">Price ($)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] uppercase tracking-widest text-[#555] font-medium">Category</label>
                {existingCategories.length > 0 && isManualCategory && (
                    <button 
                        type="button"
                        onClick={() => {
                            setIsManualCategory(false);
                            setCategory(existingCategories[0] || '');
                        }}
                        className="text-[10px] text-[#5E6AD2] hover:text-[#4e5ac0] transition-colors uppercase tracking-wider font-medium"
                    >
                        Select Existing
                    </button>
                )}
              </div>
              
              {isManualCategory ? (
                  <input 
                    type="text" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
                    placeholder="e.g. Starters"
                  />
              ) : (
                  <select 
                    value={category} 
                    onChange={(e) => {
                        if (e.target.value === '___NEW___') {
                            setIsManualCategory(true);
                            setCategory('');
                        } else {
                            setCategory(e.target.value);
                        }
                    }}
                    className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors appearance-none"
                  >
                    {existingCategories.map(c => <option key={c} value={c} className="bg-[#15171B]">{c}</option>)}
                    <option value="___NEW___" className="bg-[#15171B] text-[#5E6AD2] font-semibold">+ Create New Category</option>
                  </select>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-4 border-t border-white/5">
            <div className="flex items-center justify-between">
                <label className="text-[12px] text-[#E0E0E0] font-medium">Visible to Customers</label>
                <button
                type="button"
                role="switch"
                aria-checked={isAvailable}
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-11 h-6 rounded-full transition-colors relative ${isAvailable ? 'bg-[#5E6AD2]' : 'bg-[#333]'}`}
                >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* Hours Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#555]" />
                    <label className="text-[12px] text-[#E0E0E0] font-medium">Limited Serving Hours</label>
                </div>
                <button
                type="button"
                role="switch"
                aria-checked={hasTimeLimit}
                onClick={() => setHasTimeLimit(!hasTimeLimit)}
                className={`w-11 h-6 rounded-full transition-colors relative ${hasTimeLimit ? 'bg-[#5E6AD2]' : 'bg-[#333]'}`}
                >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${hasTimeLimit ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            {hasTimeLimit && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">From</label>
                        <input 
                            type="time" 
                            value={availableFrom} 
                            onChange={(e) => setAvailableFrom(e.target.value)}
                            className="w-full bg-[#15171B] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">To</label>
                        <input 
                            type="time" 
                            value={availableTo} 
                            onChange={(e) => setAvailableTo(e.target.value)}
                            className="w-full bg-[#15171B] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
                        />
                    </div>
                </div>
            )}

            {/* Date Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#555]" />
                    <label className="text-[12px] text-[#E0E0E0] font-medium">Specific Available Date</label>
                </div>
                <button
                type="button"
                role="switch"
                aria-checked={hasDateLimit}
                onClick={() => setHasDateLimit(!hasDateLimit)}
                className={`w-11 h-6 rounded-full transition-colors relative ${hasDateLimit ? 'bg-[#5E6AD2]' : 'bg-[#333]'}`}
                >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${hasDateLimit ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            {hasDateLimit && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5 font-medium">Select Date</label>
                    <input 
                        type="date" 
                        value={availableDate} 
                        onChange={(e) => setAvailableDate(e.target.value)}
                        className="w-full bg-[#15171B] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
                    />
                </div>
            )}
          </div>

          <Button onClick={handleSave} className="w-full mt-4" isLoading={loading}>
            {item ? 'Save Changes' : 'Create Item'}
          </Button>
        </div>
      </div>
    </div>
  );
};