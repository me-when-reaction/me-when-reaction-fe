'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useInfiniteQuery } from '@tanstack/react-query';
import { NewGetImageResponse } from '@/models/response/image';
import { HTTPRequestClient } from '@/utilities/api-client';
import { GetImageRequest } from '@/models/request/image';
import { useGlobalState } from '@/utilities/store';
import FileSaver from 'file-saver';
import classNames from 'classnames';
import { PaginationResponse } from '@/models/response/base';
import { Button, Label, Select } from 'flowbite-react';
import { animated, useSpring } from '@react-spring/web';
import { useSearchParams } from 'next/navigation';
import { BsPencilSquare } from 'react-icons/bs';
import Link from 'next/link';
import Chip from '@/components/common/chip/Chip';
import DeleteImage from '../delete-image/DeleteImage';
import { QUERY_KEYS } from '@/constants/query-key';
import { AgeRating, PAGE_SIZES } from '@/constants/image';
import { API_DETAIL } from '@/configuration/api';
import HTTPMethod from 'http-method-enum';

interface HomeMasonryCardState {
  open: boolean,
  saving: boolean,
  blur: boolean
}

export interface HomeMasonryCardProps {
  isLogin: boolean
}

interface HomeMasonryState {
  rating: AgeRating;
  pageSize: number
}

export default function HomeMasonry(props: HomeMasonryCardProps) {
  const finalQuery = useGlobalState(x => x.search.finalQuery);
  const [state, setState] = useState<HomeMasonryState>({
    pageSize: 10,
    rating: AgeRating.GENERAL
  })
  const param = useSearchParams();

  // useEffect(() => { setSearchBar(param.get('query') ?? ""); }, [param, setSearchBar]);

  const { data, fetchNextPage, status, hasNextPage } = useInfiniteQuery({
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
        <div className="text-center py-5">
          <Button className='w-full' onClick={(_: any) => fetchNextPage()}>Add more</Button>
        </div>
      }
    </div>
  )
}

function HomeMasonryCard({ data, isLogin }: { data: NewGetImageResponse, isLogin: boolean }) {
  const [state, setState] = useState<HomeMasonryCardState>({
    open: false,
    saving: false,
    blur: data.ageRating === AgeRating.EXPLICIT
  });

  function handleOnClickExplicit() {
    if (data.ageRating === AgeRating.EXPLICIT) setState({...state, blur: !state.blur})
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
        'bg-[#2370d3]/25': data.ageRating === AgeRating.GENERAL,
        'bg-[#d3c423]/40': data.ageRating === AgeRating.MATURE,
        'bg-[#a80f0f]/70': data.ageRating === AgeRating.EXPLICIT,
      })}>
        <div className='mb-2 overflow-hidden' onClick={handleOnClickExplicit}>
          <Image src={data.image} alt={data.name} width={0} height={0} sizes='100vw'
            className={classNames('w-[300px] h-auto rounded-md', {
              'blur-xl': state.blur,
              'cursor-pointer': data.ageRating === AgeRating.EXPLICIT
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