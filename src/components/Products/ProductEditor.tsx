import React, { useState, useRef } from 'react';
import { Package, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { apiRequest } from '../../lib/api';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ctaOptions = ['Buy Now', 'Learn More', 'Sign Up', 'Get Started'];

const ProductEditor: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [promoPrice, setPromoPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [cta, setCta] = useState(ctaOptions[0]);
  const [demoInput, setDemoInput] = useState('');
  const [demoLinks, setDemoLinks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{[k:string]: string}>({});
  const { showToast } = useAppContext();
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors: {[k:string]: string} = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    const p = parseFloat(price);
    if (!price.trim() || isNaN(p) || p <= 0) newErrors.price = 'Enter valid price';
    if (promoEnabled) {
      const promo = parseFloat(promoPrice);
      if (!promoPrice.trim() || isNaN(promo) || promo <= 0) {
        newErrors.promoPrice = 'Enter valid promo price';
      } else if (!isNaN(p) && promo >= p) {
        newErrors.promoPrice = 'Promo price should be less than price';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFiles = (files: FileList) => {
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    Array.from(files).forEach(f => {
      newFiles.push(f);
      newPreviews.push(URL.createObjectURL(f));
    });
    setImages(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(imgs => imgs.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights(prev => [...prev, highlightInput.trim()]);
    setHighlightInput('');
  };

  const removeHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index));
  };

  const addDemoLink = () => {
    if (!demoInput.trim()) return;
    try {
      const url = new URL(demoInput.trim());
      setDemoLinks(prev => [...prev, url.toString()]);
      setDemoInput('');
    } catch {
      setErrors(err => ({ ...err, demoInput: 'Invalid URL' }));
    }
  };

  const removeDemoLink = (index: number) => {
    setDemoLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const product = {
      name,
      description,
      price: parseFloat(price),
      promoPrice: promoEnabled ? parseFloat(promoPrice) : undefined,
      highlights,
      cta,
      demoLinks,
      imagesCount: images.length
    };

    setSubmitError('');
    try {
      await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(product)
      });
      showToast('Product saved successfully');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      setSubmitError(message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Package className="mr-2" />Product Editor
        </h2>
        <Button onClick={handleSubmit} variant="primary">
          Save
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {submitError && (
          <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded">
            {submitError}
          </div>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Product name" />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your product"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Images</label>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="p-6 border-2 border-dashed border-slate-700 rounded-lg text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-slate-400 flex items-center justify-center"><ImageIcon className="mr-2" size={18}/> Drop or click to upload</p>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
          </div>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img src={src} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-slate-800/80 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Price</label>
          <Input type="number" value={price} onChange={e => setPrice(e.target.value)} />
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
          <div className="flex items-center space-x-2 mt-2">
            <input type="checkbox" checked={promoEnabled} onChange={e => setPromoEnabled(e.target.checked)} />
            <span className="text-sm">Promo price</span>
          </div>
          {promoEnabled && (
            <div className="mt-2">
              <Input type="number" value={promoPrice} onChange={e => setPromoPrice(e.target.value)} placeholder="Promo price" />
              {errors.promoPrice && <p className="text-sm text-red-500">{errors.promoPrice}</p>}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Highlights</label>
          <div className="flex space-x-2">
            <Input value={highlightInput} onChange={e => setHighlightInput(e.target.value)} placeholder="Add highlight" className="flex-1" />
            <Button type="button" onClick={addHighlight} className="px-2"><Plus size={16}/></Button>
          </div>
          {highlights.length > 0 && (
            <ul className="list-disc list-inside space-y-1 mt-2">
              {highlights.map((h, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="flex-1">{h}</span>
                  <button type="button" onClick={() => removeHighlight(idx)} className="ml-2 text-slate-400 hover:text-white">
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">CTA Button</label>
          <select value={cta} onChange={e => setCta(e.target.value)} className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            {ctaOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Demo links</label>
          <div className="flex space-x-2">
            <Input value={demoInput} onChange={e => setDemoInput(e.target.value)} placeholder="https://example.com" className="flex-1" />
            <Button type="button" onClick={addDemoLink} className="px-2"><Plus size={16}/></Button>
          </div>
          {errors.demoInput && <p className="text-sm text-red-500">{errors.demoInput}</p>}
          {demoLinks.length > 0 && (
            <ul className="space-y-1 mt-2">
              {demoLinks.map((link, idx) => (
                <li key={idx} className="flex items-center text-cyan-400">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="underline flex-1 break-all">{link}</a>
                  <button type="button" onClick={() => removeDemoLink(idx)} className="ml-2 text-slate-400 hover:text-white">
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
