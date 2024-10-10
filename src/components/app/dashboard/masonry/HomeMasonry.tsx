'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useInfiniteQuery } from '@tanstack/react-query';
import { NewGetImageResponse } from '@/models/response/image';
import { HTTPRequestClient } from '@/utilities/api-client';
import { GetImageRequest } from '@/models/request/image';
import { useGlobalState } from '@/utilities/store';
import { PaginationResponse } from '@/models/response/base';
import { Button, Label, Select } from 'flowbite-react';
import { QUERY_KEYS } from '@/constants/query-key';
import { AgeRating, PAGE_SIZES } from '@/constants/image';
import { API_DETAIL } from '@/configuration/api';
import HTTPMethod from 'http-method-enum';
import { useSearchParams } from 'next/navigation';
import { HomeMasonryCard } from './HomeMasonryCard';

interface HomeMasonryState {
  rating: AgeRating;
  pageSize: number
}

export interface HomeMasonryProps {
  isLogin: boolean
}


export default function HomeMasonry(props: HomeMasonryProps) {
  const [finalQuery, initQuery] = useGlobalState(x => [x.search.finalQuery, x.search.initQueryFromURL]);
  const [state, setState] = useState<HomeMasonryState>({
    pageSize: 10,
    rating: AgeRating.GENERAL
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("Executed");
    let sp = searchParams.get("query");
    if (sp) initQuery(sp);
  }, [initQuery, searchParams]);

  // useEffect(() => { setSearchBar(param.get('query') ?? ""); }, [param, setSearchBar]);

  const { data, fetchNextPage, status, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_IMAGES, finalQuery, state],
    initialPageParam: 1,
    getNextPageParam: (response) => response.isLast ? undefined : response.currentPage + 1,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      let response = await HTTPRequestClient<PaginationResponse<NewGetImageResponse[]>, GetImageRequest>({
        url: API_DETAIL.IMAGE.route,
        method: HTTPMethod.GET,
        data: {
          tagAND: finalQuery[0],
          tagOR: finalQuery[1],
          pageSize: state.pageSize,
          currentPage: pageParam,
          ageRating: state.rating
        }
      });
      return response.data;
    }
  });

  if (status === 'pending') return (
    <div className="px-10 text-center">
      
      <p>Please wait...</p>
    </div>
  )

  let masonries = ((data?.pages?.flatMap(x => x.data).length ?? 0) > 0) ? (
    <ResponsiveMasonry
      columnsCountBreakPoints={
        {
          640: 2,
          768: 3,
          940: 4,
          1100: 5,
          1350: 6
        }
      }
      className='py-5'
    >
      <Masonry gutter='1rem'>
        {
          (data?.pages?.flatMap(x => x.data) ?? []).map(x => (<HomeMasonryCard data={x} key={x.id} isLogin={props.isLogin} />))
        }
      </Masonry>
    </ResponsiveMasonry>
  ) : (
    <div className='text-center flex justify-center'>
      <Image src="https://http.cat/404" alt='404' width={400} height={400} className='lg:w-[600px] sm:w-[300px] md:w-[400px]'></Image>
    </div>
  )

  return (
    <div className='px-10 relative'>
      <div className='flex items-center justify-end gap-3 mb-5 sticky top-0'>
        <div>&nbsp;</div>
        <div>
          <Label className='text-sm' htmlFor='ageRating'>Page Size</Label>
          <Select id='ageRating' className='text-sm' value={state.pageSize} onChange={e => setState({ ...state, pageSize: parseInt(e.target.value) })}>
            {PAGE_SIZES.map(k => (<option value={k} key={k}>{k}</option>))}
          </Select>
        </div>
        <div>
          <Label className='text-sm' htmlFor='ageRating'>Age Rating</Label>
          <Select id='ageRating' className='text-sm' value={state.rating} onChange={e => setState({ ...state, rating: parseInt(e.target.value) })}>
            {Object.keys(AgeRating).filter(k => !isNaN(Number(k))).map(k => (<option value={k} key={k}>{AgeRating[k as keyof typeof AgeRating]}</option>))}
          </Select>
        </div>
      </div>
      {masonries}
      {hasNextPage &&
        <div className="text-center pb-5">
          <Button className='w-full' disabled={isFetching} onClick={(_: any) => fetchNextPage()}>Add more</Button>
        </div>
      }
    </div>
  )
}