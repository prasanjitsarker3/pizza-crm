"use client"
import { ProductEdit } from '@/components/Products/ProductEdit';
import { useGetSingleProductQuery } from '@/redux/Api/productApi';
import { useParams } from 'next/navigation';
import React from 'react'

const EditProdcut = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleProductQuery(id as string);
  if (isLoading) {
    return <h1>Loading...</h1>
  }
  return (
    <div className=' bg-white p-3'>
      <ProductEdit productData={data?.data} />
    </div>
  )
}

export default EditProdcut
