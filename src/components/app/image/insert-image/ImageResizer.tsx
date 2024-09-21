'use client'

import SingleFileInput from '@/components/common/single-file-input/SingleFileInput';
import { Button, Label, RangeSlider, TextInput } from 'flowbite-react';
import Image from 'next/image';
import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { readAndCompressImage } from 'browser-image-resizer';
import {imageDimensionsFromStream} from 'image-dimensions';


interface ImageResizerProps {
  value?: File,
  onChange: (value: File) => void,

}

interface ImageResizerState {
  rawFile? : File,
  editedFile?: File,
  previewFile?: string,
  editedPreviewFile?: string,
}

export default function ImageResizer(props: ImageResizerProps) {
  const [state, setState] = useState<ImageResizerState>();
  const [disabled, setDisabled] = useState(false);
  const [maxRatio, setMaxRatio] = useState(100);
  const [maxSizeKB, setMaxSizeKB] = useState(10);
  const [maxIteration, setMaxIteration] = useState(10);

  function handleOnConvertImage() {
    if (!!state?.rawFile) {
      setDisabled(true);

      imageDimensionsFromStream(state.rawFile.stream()).then(resolution => {
        if (!resolution || !state?.rawFile || maxSizeKB > 10) return;
        const maxF = resolution.width > resolution.height ? resolution.width : resolution.height;
        imageCompression(state.rawFile, {
          maxSizeMB: 0.0001,
          fileType: state.rawFile.type === "image/png" ? "image/jpeg" : state.rawFile.type,
          maxWidthOrHeight: resolution.width * maxRatio / 100,
          maxIteration: maxIteration,
          // alwaysKeepResolution: true,
        }).then(newFile => {
          const nf = new File([newFile], `revised-${state.rawFile?.name}`);
          setState({
            ...state,
            editedFile: nf,
            editedPreviewFile: URL.createObjectURL(newFile)
          });
          console.log(`Old: ${state.rawFile?.size ?? 0} || New: ${nf.size}`)
          setDisabled(false);
        });
        // readAndCompressImage(state.rawFile, {
        //   maxWidth: resolution.width * maxRatio / 100,
        //   maxHeight: resolution.height * maxRatio / 100,
        // }).then(resizedFile => {
        //   imageCompression(new File([resizedFile], `revised1-${state.rawFile?.name}`), {
        //     maxSizeMB: maxSizeKB / 1024,
        //     alwaysKeepResolution: true,
        //   }).then(newFile => {
        //     setState({
        //       ...state,
        //       editedFile: new File([newFile], `revised-${state.rawFile?.name}`),
        //       editedPreviewFile: URL.createObjectURL(newFile)
        //     });
        //     setDisabled(false);
        //   });
        // });
      });
    }
  }

  function handleOnInsertImage(file?: File) {
    if (!file || !['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type ?? '')) {
      setState({});
      return;
    }
    else {
      setState({
        rawFile: file,
        previewFile: URL.createObjectURL(file)
      });
    }
    // else setState({
    //   rawFile: file,
    //   previewFile: URL.createObjectURL(file)
    // });
  }

  return (
    <div>
      {/* Image Editor */}
      <div className='grid grid-cols-[7fr_3fr] min-h-40'>
        <div className='p-1 text-center flex justify-center border-2 border-slate-600 bg-slate-800/50 flex-col gap-2'>
          <div className='flex justify-center w-full'>
            {state?.previewFile ?
              <Image src={state.previewFile} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt="" /> : <span>No Image</span>
            }
          </div>
          <div className='flex justify-center w-full'>
            {state?.editedPreviewFile &&
              <Image src={state.editedPreviewFile} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt="" />
            }
          </div>
        </div>
        <div className='p-2 bg-slate-800/90 border-2 border-slate-600 border-l-0 rounded-r-md flex gap-2 flex-col text-sm'>
          <div>
            <Label className='text-sm'>Max Aspect Ratio</Label>
            <div className='flex gap-2 items-center w-full'>
              <RangeSlider className='flex-grow' min={1} max={100} value={maxRatio} onInput={e => setMaxRatio(e.currentTarget.valueAsNumber)}/>
              <span className='text-sm'>{maxRatio}%</span>
            </div>
          </div>
          <div>
            <Label className='text-sm'>Max Iteration</Label>
            <div className='flex gap-2 items-center w-full'>
              <RangeSlider className='flex-grow' min={3} max={10} value={maxIteration} onInput={e => setMaxIteration(e.currentTarget.valueAsNumber)}/>
              <span className='text-sm'>{maxIteration}</span>
            </div>
          </div>
          <div>
            <Label className='text-sm'>Max Size in KB</Label>
            <TextInput type='number' step=".01" sizing='sm' value={maxSizeKB} onChange={e => setMaxSizeKB(e.currentTarget.valueAsNumber)}/>
          </div>
          <div>
            <Button className='w-full'
              size='sm'
              color={(!state?.rawFile || maxSizeKB > 10 || disabled) ? 'gray' : 'success'}
              disabled={(!state?.rawFile || maxSizeKB > 10 || disabled)}
              onClick={handleOnConvertImage}
            >Convert</Button>
          </div>
        </div>
      </div>

      {/* {state?.previewFile &&
        <div className='p-1 text-center flex justify-center border-2 border-slate-500/30 bg-slate-800/50'>
          <Image src={state.previewFile} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt="" />
        </div>
      }
      {state?.editedPreviewFile &&
        <div className='p-1 text-center flex justify-center border-2 border-slate-500/30 bg-slate-800/50'>
          <Image src={state.editedPreviewFile} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt="" />
        </div>
      } */}
      <div>
        <Label htmlFor='image' value='Image' className='font' />
        <SingleFileInput disabled={disabled} onChange={handleOnInsertImage} />
      </div>
    </div>
  )
}
