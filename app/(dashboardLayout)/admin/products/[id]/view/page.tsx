"use client"
import ViewProduct from '@/components/Products/ViewProduct';
import { useGetSingleProductQuery } from '@/redux/Api/productApi';
import { useParams } from 'next/navigation'
import React from 'react'

const ViewProdcutPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleProductQuery(id as string);
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <ViewProduct productData={data?.data} />
    </div>
  )
}

export default ViewProdcutPage
