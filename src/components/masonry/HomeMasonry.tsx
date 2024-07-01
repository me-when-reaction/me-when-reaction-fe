'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTE } from '@/apis/api-routes';
import { GetAllImagesResponse } from '@/models/response/image';
import { HTTPRequestClient } from '@/apis/api-client';
import { GetAllImagesRequest } from '@/models/request/image';
import { useGlobalState } from '@/utilities/store';
import FileSaver from 'file-saver';
import Chip from '../chip/Chip';
import classNames from 'classnames';
import { PaginationResponse } from '@/models/response/base';
import { Button } from 'flowbite-react';
import { animated, useSpring, useTransition } from '@react-spring/web';

interface HomeMasonryCardState {
  open: boolean;
  saving: boolean
}

export interface HomeMasonryCardProps {
  query: string
}


export default function HomeMasonry(props: HomeMasonryCardProps) {
  const [searchBar, setSearchBar, setAlert] = useGlobalState(x => [x.search.query, x.search.setQuery, x.alert.setAlert]);
  useEffect(() => { setSearchBar(props.query ?? ""); }, [props.query, setSearchBar]);
  const { data, fetchNextPage, status, hasNextPage } = useInfiniteQuery({
    queryKey: ["image", searchBar],
    initialPageParam: 1,
    getNextPageParam: (response) => response.isLast ? undefined : response.currentPage + 1,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      let response = await HTTPRequestClient<PaginationResponse<GetAllImagesResponse[]>, GetAllImagesRequest>({
        url: API_ROUTE.IMAGE,
        method: "GET",
        data: {
          TagAND: searchBar === "" ? undefined : searchBar.split(" ").some(x => !x.startsWith('+')) ? searchBar.split(" ").filter(x => !x.startsWith('+')) : undefined,
          TagOR: searchBar === "" ? undefined : searchBar.split(" ").some(x => x.startsWith('+')) ? searchBar.split(" ").filter(x => x.startsWith('+')).map(x => x.replace('+', '')) : undefined,
          PageSize: 10,
          CurrentPage: pageParam
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
            (data?.pages?.flatMap(x => x.data) ?? []).map((x, idx) => (<HomeMasonryCard data={x} key={idx} />))
          }
        </Masonry>
      </ResponsiveMasonry>
      {hasNextPage &&
        <div className="text-center py-5">
          <Button className='w-full' onClick={(_: any) => fetchNextPage()}>Add more</Button>
        </div>
      }
    </div>
  )
}


function HomeMasonryCard({ data }: { data: GetAllImagesResponse }) {
  const [state, setState] = useState<HomeMasonryCardState>({
    open: false,
    saving: false
  });

  function handleOnSteal() {
    setState({ ...state, saving: true });
    let n = data.link.split('/').at(-1);
    FileSaver.saveAs(data.link, n)
    setState({ ...state, saving: false });
  }

  const [springs, api] = useSpring(() => ({
    from: {
      opacity: 0,
      y: -50
    },
    to: {
      opacity: 1,
      y: 0
    },
    reset: true
  }));

  useEffect(() => {
    api.start({
      to: {
        opacity: 1,
        y: 0
      },
    });
  })

  return (
    <animated.div style={springs}>
      <div className='flex flex-col bg-[#2370d3]/35 p-4 rounded-md'>
        <div className='mb-2'>
          <Image src={data.link} alt={data.name} width={450} height={400} />
        </div>
        <div className='h-full flex flex-col gap-1'>
          <div
            className='text-center italic text-sm hover:text-blue-300 cursor-pointer hover:underline'
            onClick={() => { setState({ ...state, open: !state.open }) }}
          >{data.name}</div>
          <div className={classNames(
            'text-xs',
            { 'hidden': !state.open }
          )}>
            {data.link}
          </div>
          <div className='flex gap-2 flex-wrap'>
            {data.tags.map(t => (<Chip text={t} key={t} />))}
          </div>
          <div>
            <Button color='green' className='w-full' disabled={state.saving} onClick={(_: any) => handleOnSteal()}>Steal</Button>
          </div>
        </div>
      </div>
    </animated.div>
  )
}