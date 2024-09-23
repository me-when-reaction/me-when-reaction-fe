'use client'

import SingleFileInput from '@/components/common/single-file-input/SingleFileInput';
import { Button, Label, RangeSlider, TextInput } from 'flowbite-react';
import Image from 'next/image';
import React, { useState } from 'react';
import {compressAccurately, EImageType} from 'image-conversion';
import { MdUpload } from "react-icons/md";
import classNames from 'classnames';
import { MAX_SIZE } from '@/constants/image';

interface ImageResizerProps {
  value?: File,
  onChange: (value?: File) => void,
}

interface ImageResizerState {
  rawFile? : File,
  editedFile?: File,
  previewFile?: string,
  editedPreviewFile?: string,

  finalFile?: File
}

export default function ImageResizer(props: ImageResizerProps) {
  const [state, setState] = useState<ImageResizerState>({
    finalFile: props.value,
    rawFile: props.value,
    previewFile: props.value ? URL.createObjectURL(props.value) : undefined,
  });
  const [disabled, setDisabled] = useState(false);
  const [maxRatio, setMaxRatio] = useState(100);
  const [maxSizeKB, setMaxSizeKB] = useState(10);

  const sizeOriginal = Math.round((state?.rawFile?.size ?? 0) / 1024 * 100) / 100;
  const sizeEdited = Math.round((state?.editedFile?.size ?? 0) / 1024 * 100) / 100;

  function handleOnSaveImage(file: File) {
    setState({ ...state, finalFile: file });
    props.onChange(file);
  }

  function handleOnConvertImage() {
    if (!!state?.rawFile) {
      setDisabled(true);

      // Sementara pakai punya orang. Nanti mau bikin sendiri algonya pakai binser-like algorithm
      compressAccurately(state.rawFile, {
        size: maxSizeKB > state.rawFile.size ? 10 : maxSizeKB,
        type: EImageType.JPEG,
        scale: maxRatio / 100
      }).then(newFile => {
        const nf = new File([newFile], `edited-image.jpeg`, {
          type: 'image/jpeg'
        });
        setState({
          ...state,
          editedFile: nf,
          editedPreviewFile: URL.createObjectURL(newFile)
        });
        setDisabled(false);
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
  }

  function handleOnDropFile(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();

    let file: File | null = null;
    if (e.dataTransfer.items && e.dataTransfer.items.length >= 1 && e.dataTransfer.items[0] && e.dataTransfer.items[0].kind === 'file') {
      file = e.dataTransfer.items[0].getAsFile();
    }
    else if (e.dataTransfer.files && e.dataTransfer.files.length >= 1 && e.dataTransfer.files[0]) {
      file = e.dataTransfer.files[0];
    }

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
  }

  return (
    <div>
      {/* Image Editor */}
      <div className='grid grid-cols-[7fr_3fr]'>
        <div className='p-1 text-center flex justify-center border-2 border-slate-600 bg-slate-800/50 flex-col gap-2'>
          {/* Dropzone */}
          <Label
            htmlFor='dropzone-file'
            onDrop={handleOnDropFile}
            onDragOver={e => { e.preventDefault(); e.stopPropagation()}}
            className={classNames('flex cursor-pointer min-h-64 bg-slate-500/30 w-full rounded border-dashed border-slate-300/30 border-2', {
              'hover:bg-slate-500/50 hover:border-slate-300/50' : !state?.previewFile
            })}
          >
              {
                !state?.previewFile ? (
                  <div className='flex justify-center items-center text-white/50 w-full flex-col'>
                    <MdUpload className='text-7xl'/>
                    <span>Upload your image here</span>
                    <span>Should be png, jpeg, jpg, or webp</span>
                  </div>
                ) : (
                  <div className='flex flex-col justify-center items-center p-2 w-full gap-2'>
                    <span className='text-xs text-white/50'>This is your image. Drag another image to change your input</span>
                    <Image src={state.previewFile} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt="" />
                  </div>
                )
            }
            <SingleFileInput id='dropzone-file' disabled={disabled} className='hidden' onChange={handleOnInsertImage} />
          </Label>
          {state?.editedPreviewFile &&
            <div className='flex justify-center w-full'>
              <Image src={state.editedPreviewFile} width="0" height="0" sizes='100%' className='w-auto h-auto max-h-[300px]' alt="" />
            </div>
          }
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
            <Label className='text-sm'>Max Size in KB</Label>
            <TextInput type='number' step=".1" sizing='sm' value={maxSizeKB} onChange={e => setMaxSizeKB(e.currentTarget.valueAsNumber)}/>
          </div>
          <div>
            <span className='text-red-600 text-xs'>All conversions will result in .jpg file (for now)</span>
          </div>
          <div>
            <Button className='w-full'
              size='sm'
              color={(!state?.rawFile || maxSizeKB > 10 || disabled) ? 'gray' : 'success'}
              disabled={(!state?.rawFile || maxSizeKB > 10 || disabled)}
              onClick={handleOnConvertImage}
            >Convert</Button>
          </div>
          { !!state?.rawFile && <hr className='border-slate-400/50'/> }
          <div className='flex flex-col gap-1'>
            { state?.rawFile && <span className={classNames({ 'text-red-700': state.rawFile.size > MAX_SIZE, 'text-green-400': state.rawFile.size <= MAX_SIZE })}>Original: {sizeOriginal} KB</span> }
            { state?.editedFile && <span className={classNames({ 'text-red-700': state.editedFile.size > MAX_SIZE, 'text-green-400': state.editedFile.size <= MAX_SIZE })}>Edited: {sizeEdited} KB</span> }
          </div>
          <div className='flex gap-2'>
            { (state?.rawFile && state.rawFile.size <= MAX_SIZE) && <Button className='flex-grow-1 w-full' onClick={_ => { handleOnSaveImage(state.rawFile!) }}>Use Original</Button> }
            { (state?.editedFile && state.editedFile.size <= MAX_SIZE) && <Button className='flex-grow-1 w-full' onClick={_ => { handleOnSaveImage(state.editedFile!) }}>Use Edited</Button> }
          </div>
        </div>
      </div>
    </div>
  )
}
