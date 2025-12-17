"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tag, DollarSign, Package, Flame, Star, TrendingUp, Eye, EyeOff, Trash2, Edit, Calendar } from "lucide-react"

interface Category {
    id: string
    name: string
    slug: string
    description: string
    order: number
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

interface ProductData {
    id: string
    name: string
    description: string
    price: number
    discount: number
    ingredients: string[]
    spicyLevel: string[]
    featured: boolean
    popular: boolean
    isActive: boolean
    isDeleted: boolean
    mainImages: string[]
    available: boolean
    createdAt: string
    updatedAt: string
    slug: string
    categories: Category[]
}

const ViewProduct = ({ productData }: { productData: ProductData }) => {
    console.log("View Product Data", productData)

    const finalPrice = productData.price - (productData.price * productData.discount) / 100

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{productData.name}</h1>
                        <p className="text-sm text-muted-foreground">ID: {productData.id}</p>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                    {productData.isActive ? (
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                            <Eye className="mr-1 h-3 w-3" />
                            Active
                        </Badge>
                    ) : (
                        <Badge variant="secondary">
                            <EyeOff className="mr-1 h-3 w-3" />
                            Inactive
                        </Badge>
                    )}
                    {productData.available ? (
                        <Badge variant="default" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                            <Package className="mr-1 h-3 w-3" />
                            Available
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Out of Stock</Badge>
                    )}
                    {productData.featured && (
                        <Badge variant="default" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                        </Badge>
                    )}
                    {productData.popular && (
                        <Badge variant="default" className="bg-purple-500/10 text-purple-700 dark:text-purple-400">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Popular
                        </Badge>
                    )}
                    {productData.isDeleted && (
                        <Badge variant="destructive">
                            <Trash2 className="mr-1 h-3 w-3" />
                            Deleted
                        </Badge>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                                <CardDescription>
                                    {productData.mainImages.length} {productData.mainImages.length === 1 ? "image" : "images"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {productData.mainImages.map((image, index) => (
                                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                                        <img
                                            src={image || "/placeholder.svg"}
                                            alt={`${productData.name} - Image ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Pricing Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Pricing Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Original Price</p>
                                        <p className="text-2xl font-bold">${productData.price.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Discount</p>
                                        <p className="text-2xl font-bold text-destructive">{productData.discount}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Final Price</p>
                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            ${finalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{productData.description}</p>
                            </CardContent>
                        </Card>

                        {/* Categories Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {productData.categories.map((category) => (
                                        <Badge key={category.id} variant="outline" className="text-sm">
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                                {productData.categories.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {productData.categories.map((category) => (
                                            <div key={category.id} className="rounded-lg border bg-muted/50 p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{category.name}</p>
                                                        <p className="text-sm text-muted-foreground">{category.description}</p>
                                                    </div>
                                                    <Badge variant={category.isActive ? "default" : "secondary"}>
                                                        {category.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Ingredients & Spicy Level */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ingredients</CardTitle>
                                    <CardDescription>{productData.ingredients.length} ingredients</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {productData.ingredients.map((ingredient, index) => (
                                            <Badge key={index} variant="secondary">
                                                {ingredient}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Flame className="h-5 w-5" />
                                        Spicy Level
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {productData.spicyLevel.map((level, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="border-orange-500 text-orange-700 dark:text-orange-400"
                                            >
                                                {level}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Metadata Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Slug</p>
                                        <p className="font-mono text-sm">{productData.slug}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Product ID</p>
                                        <p className="font-mono text-sm">{productData.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created At</p>
                                        <p className="text-sm">{formatDate(productData.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Last Updated</p>
                                        <p className="text-sm">{formatDate(productData.updatedAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewProduct
