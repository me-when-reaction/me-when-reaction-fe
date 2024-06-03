'use client'

import Image from 'next/image';
import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTE } from '@/apis/api-routes';
import { GetAllImagesResponse } from '@/models/response/image';
import { FetchClient } from '@/apis/api-client';
import { GetAllImagesRequest } from '@/models/request/image';
import { useGlobalState } from '@/utilities/store';
import Button from '../button/Button';
import FileSaver from 'file-saver';

export default function HomeMasonry() {

  const searchBar = useGlobalState(x => x.search);
  const { data, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ["image", searchBar],
    initialPageParam: 1,
    getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1,
    queryFn: async ({pageParam} : {pageParam: number}) => {
      let response = await FetchClient<GetAllImagesResponse[], GetAllImagesRequest>({
        url: API_ROUTE.IMAGE,
        method: "GET",
        data: {
          TagAND: searchBar === "" ? undefined : searchBar.split(" ").some(x => !x.startsWith('+')) ? searchBar.split(" ").filter(x => !x.startsWith('+')) : undefined,
          TagOR: searchBar === "" ? undefined : searchBar.split(" ").some(x => x.startsWith('+')) ? searchBar.split(" ").filter(x => x.startsWith('+')).map(x => x.replace('+', '')) : undefined,
          PageSize: 10,
          PageNumber: pageParam
        }
      });
      return response.data;
    }
  });

  if (status === 'pending') return (<p>Please wait...</p>)
  return (
    <div className='px-10'>
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
            (data?.pages?.flatMap(x => x) ?? []).map((x, idx) => (<HomeMasonryCard data={x} key={idx}/>))
          }
        </Masonry>
    </ResponsiveMasonry>
      <Button buttonType='primary' onClick={_ => fetchNextPage()}>Add more</Button>
    </div>
  )
}

function HomeMasonryCard({ data } : { data: GetAllImagesResponse }) {

  function handleOnSteal(){
    let n = data.link.split('/').at(-1);
    FileSaver.saveAs(data.link, n)
  }

  return (
    <div className='flex flex-col bg-[#387496]/35 p-4 rounded-md'>
      <div className='mb-2'>
        <Image src={data.link} alt={data.name} width={300} height={300}/>
      </div>
      <div>
        <div className='text-center italic text-sm'>{data.name}</div>
        <div>
          <Button buttonType='success' className='w-full' onClick={_ => handleOnSteal()}>Steal</Button>
        </div>
      </div>
    </div>
  )
}