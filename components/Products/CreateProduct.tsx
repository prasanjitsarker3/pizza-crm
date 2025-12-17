"use client";

import { useGetCategoryQuery } from "@/redux/Api/categroyApi";
import { useCreateProductMutation } from "@/redux/Api/productApi";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X, Upload, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { fileUpload } from "@/actions/file";

// Type definitions
interface ICategory {
    id: string;
    name: string;
    slug: string;
    description: string;
}

type SpicyLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";



const CreateProduct = () => {
    const router = useRouter();
    const { data, isLoading } = useGetCategoryQuery({});
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        discount: "",
        featured: false,
        popular: false,
        isActive: true,
        available: true,
    });

    const [ingredients, setIngredients] = useState<string[]>([]);
    const [ingredientInput, setIngredientInput] = useState("");

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const [spicyLevels, setSpicyLevels] = useState<SpicyLevel[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h1 className="text-xl">Loading...</h1>
                </div>
            </div>
        );
    }

    const categoryData: ICategory[] = data?.data || [];

    // Input handlers
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "name") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    // Ingredients handlers
    const addIngredient = () => {
        const value = ingredientInput.trim();
        if (!value) return;
        if (ingredients.includes(value)) {
            toast.error("Ingredient already added");
            return;
        }
        setIngredients((prev) => [...prev, value]);
        setIngredientInput("");
    };

    const removeIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    // File upload handlers
    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;

        const validFiles = Array.from(files).filter((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not an image`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 10MB`);
                return false;
            }
            return true;
        });

        if (!validFiles.length) return;

        setSelectedFiles((prev) => [...prev, ...validFiles]);
        setPreviewImages((prev) => [
            ...prev,
            ...validFiles.map((file) => URL.createObjectURL(file)),
        ]);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e.target.files);
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileUpload(e.dataTransfer.files);
    };

    // Spicy level handlers
    const toggleSpicyLevel = (level: SpicyLevel) => {
        setSpicyLevels((prev) =>
            prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
        );
    };

    // Category handlers
    const toggleCategory = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) return toast.error("Product name is required");
        if (!formData.price || parseFloat(formData.price) <= 0)
            return toast.error("Valid price is required");
        if (ingredients.length === 0) return toast.error("At least one ingredient is required");
        if (spicyLevels.length === 0) return toast.error("At least one spicy level is required");
        if (!selectedFiles.length) return toast.error("At least one image is required");
        if (selectedCategories.length === 0) return toast.error("At least one category is required");

        const toastId = toast.loading("Creating product...");
        try {
            setUploadingImages(true);
            const uploadedUrls = await fileUpload(selectedFiles, "products");
            const productData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : undefined,
                ingredients,
                spicyLevel: spicyLevels,
                featured: formData.featured,
                popular: formData.popular,
                isActive: formData.isActive,
                available: formData.available,
                mainImages: uploadedUrls,
                categoryIds: selectedCategories,
            };

            const response = await createProduct(productData).unwrap();
            if (response?.statusCode === 201) {
                toast.success("Product created successfully! 🎉", { id: toastId });
                router.push("/admin/products");
            }
            else {
                toast.error(response?.message || response?.data?.message, { id: toastId })
            }

        } catch (error: any) {
            toast.error(error?.message || error?.data?.message || "Something went wrong", { id: toastId });
            console.error(error);
        } finally {
            setUploadingImages(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-5xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold">
                        Create New Product
                    </CardTitle>
                </CardHeader>
                <CardContent className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Spicy Chicken Burger"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="spicy-chicken-burger"
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Pricing</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discount">Discount ($)</Label>
                                    <Input
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Ingredients <span className="text-red-500">*</span></h3>
                            <div className="flex gap-2">
                                <Input
                                    value={ingredientInput}
                                    onChange={(e) => setIngredientInput(e.target.value)}
                                    placeholder="Type an ingredient"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addIngredient();
                                        }
                                    }}
                                    className="h-11"
                                />
                                <Button type="button" onClick={addIngredient} className="px-6">Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 border rounded-md bg-gray-50">
                                {ingredients.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No ingredients added yet</p>
                                ) : (
                                    ingredients.map((ingredient, index) => (
                                        <Badge key={`${ingredient}-${index}`} variant="secondary" className="flex items-center px-3 py-1.5 text-sm">
                                            {ingredient}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeIngredient(index); }}
                                                className="ml-2 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Product Images <span className="text-red-500">*</span></h3>
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"} ${uploadingImages ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <input
                                    type="file"
                                    id="fileUpload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                    disabled={uploadingImages}
                                />
                                <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="text-base font-medium text-gray-700 mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </label>
                            </div>

                            {/* Preview */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {previewImages.map((img, index) => (
                                        <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary">
                                            <div className="relative w-full h-40">
                                                <Image src={img} alt={`preview ${index}`} fill className="object-cover rounded-lg" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Spicy Levels */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Spicy Level <span className="text-red-500">*</span></h3>
                            <div className="flex flex-wrap gap-4">
                                {(["NONE", "LOW", "MEDIUM", "HIGH"] as SpicyLevel[]).map((level) => (
                                    <div key={level} className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                                        <Checkbox
                                            id={level}
                                            checked={spicyLevels.includes(level)}
                                            onCheckedChange={() => toggleSpicyLevel(level)}
                                        />
                                        <Label htmlFor={level} className="cursor-pointer">{level}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Categories <span className="text-red-500">*</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                {categoryData.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100">
                                        <Checkbox
                                            id={category.id}
                                            checked={selectedCategories.includes(category.id)}
                                            onCheckedChange={() => toggleCategory(category.id)}
                                        />
                                        <Label htmlFor={category.id} className="cursor-pointer flex-1">{category.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Options */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Product Options</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {["featured", "popular", "isActive", "available"].map((opt) => (
                                    <div key={opt} className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg">
                                        <Checkbox
                                            id={opt}
                                            checked={formData[opt as keyof typeof formData] as boolean}
                                            onCheckedChange={(checked) => handleCheckboxChange(opt, checked as boolean)}
                                        />
                                        <Label htmlFor={opt} className="cursor-pointer">{opt.charAt(0).toUpperCase() + opt.slice(1)}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                            <Button type="submit" className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90" disabled={isCreating || uploadingImages}>
                                {isCreating ? <> <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Creating Product... </> : "Create Product"}
                            </Button>
                            <Button type="button" variant="outline" className="h-12 flex-1" onClick={() => router.push("/admin/products")}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateProduct;
