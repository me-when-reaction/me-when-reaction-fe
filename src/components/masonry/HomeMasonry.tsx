'use client'

import Image from 'next/image';
import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTE } from '@/apis/api-routes';
import { BaseResponse } from '@/models/response/base';
import { GetAllImagesResponse } from '@/models/response/image';
import { FetchClient } from '@/apis/api-client';

export default function HomeMasonry() {

  const query = useQuery({
    queryKey: ["image"],
    queryFn: async () => {
      let response = await FetchClient<BaseResponse<GetAllImagesResponse[]>, never>({ url: API_ROUTE.IMAGE, method: "GET" })
      return response.data.data;
    },
    initialData: []
  })

  if (query.isLoading) return (<p>Please wait...</p>)
  else console.log(query.data);
  console.log(query.error);
  console.log(query);

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={
        {
          640: 2,
          768: 3,
          1024: 4,
          1280: 5,
          1536: 7
        }
      }
    >
      <Masonry gutter='1rem'>
        {
          query.data.map((x, idx) => (<HomeMasonryCard data={x} key={idx}/>))
        }
      </Masonry>
    </ResponsiveMasonry>
  )
}

function HomeMasonryCard({ data } : { data: GetAllImagesResponse }) {
  return (
    <div className='flex flex-col bg-[#387496]/35 p-2'>
      <div className=''>
        <Image src={data.link} alt={data.name} width={300} height={300}/>
      </div>
      <div>
        <p>{data.name}</p>
      </div>
    </div>
  )
}