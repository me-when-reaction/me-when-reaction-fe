'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTE } from '@/apis/api-routes';
import { GetImageResponse } from '@/models/response/image';
import { HTTPRequestClient } from '@/apis/api-client';
import { AgeRating, GetAllImagesRequest } from '@/models/request/image';
import { useGlobalState } from '@/utilities/store';
import FileSaver from 'file-saver';
import classNames from 'classnames';
import { PaginationResponse } from '@/models/response/base';
import { Button, Label, Select } from 'flowbite-react';
import { animated, useSpring } from '@react-spring/web';
import { useSearchParams } from 'next/navigation';
import { BsPencilSquare } from 'react-icons/bs';
import Link from 'next/link';
import Chip from '@/components/chip/Chip';
import DeleteImage from '../delete-image/DeleteImage';
import { QUERY_KEYS } from '@/constants/query-key';

interface HomeMasonryCardState {
  open: boolean,
  saving: boolean,
  blur: boolean
}

export interface HomeMasonryCardProps {
  isLogin: boolean
}


export default function HomeMasonry(props: HomeMasonryCardProps) {
  const [searchBar, setSearchBar] = useGlobalState(x => [x.search.query, x.search.setQuery, x.alert.setAlert]);
  const [rating, setRating] = useState<AgeRating>(AgeRating.GENERAL);
  const param = useSearchParams();

  useEffect(() => {
    setSearchBar(param.get('query') ?? "");
  }, [param, setSearchBar]);

  const { data, fetchNextPage, status, hasNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_IMAGES, searchBar, rating],
    initialPageParam: 1,
    getNextPageParam: (response) => response.isLast ? undefined : response.currentPage + 1,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      let response = await HTTPRequestClient<PaginationResponse<GetImageResponse[]>, GetAllImagesRequest>({
        url: API_ROUTE.IMAGE,
        method: "GET",
        data: {
          TagAND: searchBar === "" ? undefined : searchBar.split(" ").some(x => !x.startsWith('+')) ? searchBar.split(" ").filter(x => !x.startsWith('+')) : undefined,
          TagOR: searchBar === "" ? undefined : searchBar.split(" ").some(x => x.startsWith('+')) ? searchBar.split(" ").filter(x => x.startsWith('+')).map(x => x.replace('+', '')) : undefined,
          PageSize: 10,
          CurrentPage: pageParam,
          AgeRating: rating
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
    <div className='px-10'>
      <div className='flex items-center justify-end gap-3 mb-5'>
        <div>&nbsp;</div>
        <Label className='text-sm' htmlFor='ageRating'>Age Rating</Label>
        <Select id='ageRating' className='text-sm' value={rating} onChange={e => setRating(parseInt(e.target.value))}>
          {Object.keys(AgeRating).filter(k => !isNaN(Number(k))).map(k => (<option value={k} key={k}>{AgeRating[k as keyof typeof AgeRating]}</option>))}
        </Select>
      </div>
      {masonries}
      {hasNextPage &&
        <div className="text-center py-5">
          <Button className='w-full' onClick={(_: any) => fetchNextPage()}>Add more</Button>
        </div>
      }
    </div>
  )
}

function HomeMasonryCard({ data, isLogin }: { data: GetImageResponse, isLogin: boolean }) {
  const [state, setState] = useState<HomeMasonryCardState>({
    open: false,
    saving: false,
    blur: AgeRating[data.ageRating] === AgeRating.EXPLICIT
  });

  function handleOnClickExplicit() {
    if (AgeRating[data.ageRating] === AgeRating.EXPLICIT) setState({...state, blur: !state.blur})
  }

  function handleOnSteal() {
    setState({ ...state, saving: true });
    let n = data.image.split('/').at(-1);
    FileSaver.saveAs(data.image, n)
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
      <div className={classNames('flex flex-col bg-[#2370d3]/25 p-2 rounded-md', {
        'bg-[#2370d3]/25': AgeRating[data.ageRating] === AgeRating.GENERAL,
        'bg-[#d3c423]/40': AgeRating[data.ageRating] === AgeRating.MATURE,
        'bg-[#a80f0f]/70': AgeRating[data.ageRating] === AgeRating.EXPLICIT,
      })}>
        <div className='mb-2 overflow-hidden' onClick={handleOnClickExplicit}>
          <Image src={data.image} alt={data.name} width={0} height={0} sizes='100vw'
            className={classNames('w-[300px] h-auto rounded-md', {
              'blur-xl': state.blur,
              'cursor-pointer': AgeRating[data.ageRating] === AgeRating.EXPLICIT
            })} />
        </div>
        <div className='h-full flex flex-col gap-1'>
          <div className='text-xs break-words'>
            <p>🍅: {data.source}</p>
            <p>🗣: {data.description}</p>
          </div>
          <div className='flex gap-1 flex-wrap my-2'>
            {data.tags.map(t => (<Chip text={t} key={t} />))}
          </div>
          <div className='flex justify-between gap-3 h-full items-center'>
            <Button color='green' className='flex-1' size='xs' disabled={state.saving} onClick={(_: any) => handleOnSteal()}>Steal</Button>
            {(isLogin) && 
              <Link href={`image/update?id=${data.id}`} passHref className='h-full'>
                <BsPencilSquare className='flex items-center'/>
              </Link>
            }
            {(isLogin) && <DeleteImage id={data.id} image={data.image}/>}
          </div>
        </div>
      </div>
    </animated.div>
  )
}