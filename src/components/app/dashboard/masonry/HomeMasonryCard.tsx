import { AgeRating } from '@/constants/image';
import { NewGetImageResponse } from '@/models/response/image';
import { isURL } from '@/utilities/url';
import { animated, useSpring } from '@react-spring/web';
import classNames from 'classnames';
import FileSaver from 'file-saver';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import DeleteImage from '../delete-image/DeleteImage';
import { Button } from 'flowbite-react';
import Chip from '@/components/common/chip/Chip';
import { useGlobalState } from '@/utilities/store';

interface HomeMasonryCardState {
  open: boolean,
  saving: boolean,
  blur: boolean,
  expandTags: boolean
}

export function HomeMasonryCard({ data, isLogin }: { data: NewGetImageResponse, isLogin: boolean }) {
  const appendQuery = useGlobalState(x => x.search.appendQuery);
  const [state, setState] = useState<HomeMasonryCardState>({
    open: false,
    saving: false,
    blur: data.ageRating === AgeRating.EXPLICIT,
    expandTags: false
  });

  function handleOnClickExplicit() {
    if (data.ageRating === AgeRating.EXPLICIT) setState({ ...state, blur: !state.blur })
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
          {/* <Image src={data.image} alt={data.name} width={0} height={0} sizes='100vw'
              className={classNames('w-[300px] h-auto rounded-md', {
                'blur-xl': state.blur,
                'cursor-pointer': data.ageRating === AgeRating.EXPLICIT
              })} /> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt={data.name} width={0} height={0} sizes='100vw'
            className={classNames('h-auto w-full rounded-md', {
              'blur-xl': state.blur,
              'cursor-pointer': data.ageRating === AgeRating.EXPLICIT
            })} />
        </div>
        <div className='h-full flex flex-col gap-1'>
          <div className='text-xs break-words'>
            <p><span title='Sauce'>🍅: </span>{isURL(data.source) ? (<a className='underline text-blue-100 hover:text-blue-300 line-clamp-3 text-ellipsis' rel='noopener noreferrer' target='_blank' href={data.source} title={data.source}>{data.source}</a>) : data.source}</p>
            <p><span title='Description'>🗣: </span>{data.description}</p>
          </div>
          <div className='flex gap-1 flex-wrap my-2 items-center'>
            {data.tags.slice(0, state.expandTags ? data.tags.length : 3).map(t => (<Chip text={t} key={t} onClick={() => appendQuery(t)} />))}
            {
              (!state.expandTags && data.tags.length > 3) && <Chip text='...' key={'More Key'} className='bg-blue-500 hover:bg-blue-400' onClick={() => setState({ ...state, expandTags: true })}/>
            }
          </div>
          <div className='flex justify-between gap-3 h-full items-center max-md:flex-col'>
            <Button color='green' className='flex-1 max-md:w-full' size='xs' disabled={state.saving} onClick={(_: any) => handleOnSteal()}>Steal</Button>
            <div className='flex gap-3 max-md:w-full max-md:justify-between'>
              {(isLogin) &&
                <Link href={`image/update?id=${data.id}`} passHref className='h-full'>
                  <BsPencilSquare className='flex items-center' />
                </Link>
              }
              {(isLogin) && <DeleteImage id={data.id} image={data.image} />}
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}